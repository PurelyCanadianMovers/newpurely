const entityMap = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"'],
]);

export function normalizeFaqText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_match, entity) => {
      if (entity[0] !== "#") return entityMap.get(entity.toLowerCase()) ?? _match;
      const radix = entity[1].toLowerCase() === "x" ? 16 : 10;
      const digits = entity.slice(radix === 16 ? 2 : 1);
      return String.fromCodePoint(Number.parseInt(digits, radix));
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function extractVisibleFaqs(html) {
  const visibleHtml = html.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const headingPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings = [...visibleHtml.matchAll(headingPattern)].filter((match) =>
    /Frequently Asked Questions|Frequently asked questions|\bFAQ\b/i.test(normalizeFaqText(match[1]))
  );
  if (headings.length !== 1) throw new Error(`Expected one visible FAQ heading, found ${headings.length}`);

  const headingIndex = headings[0].index;
  const sectionStart = visibleHtml.lastIndexOf("<section", headingIndex);
  const sectionEnd = visibleHtml.indexOf("</section>", headingIndex);
  if (sectionStart < 0 || sectionEnd < 0) throw new Error("FAQ heading is not inside a section");
  // Ignore supporting cards that may appear earlier in the same broad section.
  // Only question/answer pairs after the FAQ heading belong to the FAQ list.
  const section = visibleHtml.slice(headingIndex + headings[0][0].length, sectionEnd + "</section>".length);
  const entries = [];
  const cardPattern = /<(h3|h4|summary)\b[^>]*>([\s\S]*?)<\/\1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  for (const match of section.matchAll(cardPattern)) {
    entries.push({ question: normalizeFaqText(match[2]), answer: normalizeFaqText(match[3]) });
  }
  if (!entries.length) throw new Error("Visible FAQ section contains no question/answer pairs");
  return entries;
}

function faqNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"] === "FAQPage") nodes.push(value);
  if (Array.isArray(value)) value.forEach((item) => faqNodes(item, nodes));
  else Object.values(value).forEach((item) => faqNodes(item, nodes));
  return nodes;
}

export function extractSchemaFaqs(html) {
  const found = [];
  const scriptPattern = /<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(scriptPattern)) {
    let data;
    try { data = JSON.parse(match[2]); } catch { continue; }
    for (const node of faqNodes(data)) {
      found.push({
        node,
        data,
        script: match[0],
        attributes: match[1],
        entries: (node.mainEntity ?? []).map((entry) => ({
          question: normalizeFaqText(entry?.name),
          answer: normalizeFaqText(entry?.acceptedAnswer?.text),
        })),
      });
    }
  }
  if (found.length !== 1) throw new Error(`Expected one FAQPage entity, found ${found.length}`);
  return found[0];
}

export function faqParityDifferences(html) {
  const visible = extractVisibleFaqs(html);
  const schema = extractSchemaFaqs(html).entries;
  const differences = [];
  for (let index = 0; index < Math.max(visible.length, schema.length); index += 1) {
    const visibleEntry = visible[index];
    const schemaEntry = schema[index];
    if (visibleEntry?.question !== schemaEntry?.question || visibleEntry?.answer !== schemaEntry?.answer) {
      differences.push({ index, visible: visibleEntry, schema: schemaEntry });
    }
  }
  return { visible, schema, differences };
}

export function alignFaqSchemaToVisible(html) {
  const visible = extractVisibleFaqs(html);
  const schema = extractSchemaFaqs(html);
  schema.node.mainEntity = visible.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  }));
  const replacement = `<script${schema.attributes}>${JSON.stringify(schema.data)}</script>`;
  const aligned = html.replace(schema.script, replacement);
  const result = faqParityDifferences(aligned);
  if (result.differences.length) throw new Error("FAQ schema alignment did not produce exact parity");
  return aligned;
}
