export const OPENAI_ADS_PIXEL_MARKER = "data-pcm-openai-ads-pixel";

export const OPENAI_ADS_PIXEL_SNIPPET = `<!-- OpenAI Ads Pixel -->
    <script ${OPENAI_ADS_PIXEL_MARKER}>
      window.oaiq = window.oaiq || function () {
        (window.oaiq.q = window.oaiq.q || []).push(arguments);
      };
      oaiq("init", { pixelId: "VoQRj1i5cYmiok3DbhBcb5" });
    </script>
    <script async src="https://bzrcdn.openai.com/sdk/oaiq.min.js"></script>
    <script defer src="/assets/openai-ads-attribution.js"></script>`;

export function injectOpenAiAdsPixel(html) {
  if (html.includes(OPENAI_ADS_PIXEL_MARKER)) return html;
  return html.replace(/<head\b[^>]*>/i, (head) => `${head}\n    ${OPENAI_ADS_PIXEL_SNIPPET}`);
}
