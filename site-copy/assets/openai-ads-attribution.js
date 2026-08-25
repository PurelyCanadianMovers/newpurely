(function () {
  var storageKey = "pcmOpenAiOppref";

  function currentOppref() {
    try {
      var value = new URLSearchParams(window.location.search).get("oppref");
      if (value) sessionStorage.setItem(storageKey, value);
      return value || sessionStorage.getItem(storageKey) || "";
    } catch {
      return "";
    }
  }

  function addOppref(url) {
    var oppref = currentOppref();
    if (!oppref) return url;
    if (url.origin !== window.location.origin || url.searchParams.has("oppref")) return url;
    url.searchParams.set("oppref", oppref);
    return url;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || event.defaultPrevented || link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || /^(?:#|mailto:|tel:|javascript:)/i.test(href)) return;

    try {
      link.href = addOppref(new URL(link.href, window.location.href)).toString();
    } catch {
      // Ignore malformed links and allow their existing behavior to continue.
    }
  }, true);

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.action) return;

    try {
      var action = addOppref(new URL(form.action, window.location.href));
      if (action.origin !== window.location.origin) return;

      var field = form.querySelector('input[name="oppref"]');
      if (!field && action.searchParams.has("oppref")) {
        field = document.createElement("input");
        field.type = "hidden";
        field.name = "oppref";
        form.appendChild(field);
      }
      if (field) field.value = action.searchParams.get("oppref") || "";
    } catch {
      // Do not interfere with existing form behavior if the action is malformed.
    }
  }, true);
}());
