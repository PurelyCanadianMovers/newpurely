(function () {
  "use strict";

  if (window.__pcmStaticChatInitialized) return;
  window.__pcmStaticChatInitialized = true;

  var assistantMessage = "Hi! I'm the Purely Canadian Movers virtual assistant. How can I help you today? Whether you have questions about our services, pricing, or service areas — I'm here to help! 🍁";
  var messages = [{ role: "assistant", content: assistantMessage }];
  var isOpen = false;
  var isPending = false;
  var panel;
  var launcher;
  var messagesEl;
  var input;
  var send;

  function icon(name, size) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("height", String(size));
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", String(size));
    var paths = name === "close" ? ["M18 6 6 18", "m6 6 12 12"] : name === "send" ? ["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"] : name === "user" ? ["M20 21a8 8 0 0 0-16 0", "M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8"] : ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"];
    paths.forEach(function (d) { var path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", d); svg.appendChild(path); });
    return svg;
  }

  function appendRichText(parent, text) {
    var pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    var cursor = 0;
    var match;
    while ((match = pattern.exec(text))) {
      if (match.index > cursor) parent.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      var link = document.createElement("a");
      link.href = match[2];
      link.textContent = match[1];
      parent.appendChild(link);
      cursor = pattern.lastIndex;
    }
    if (cursor < text.length) parent.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function renderMessages() {
    messagesEl.textContent = "";
    messages.forEach(function (message) {
      var row = document.createElement("div");
      row.className = "pcm-static-chat-message" + (message.role === "user" ? " is-user" : "");
      var avatar = document.createElement("div");
      avatar.className = "pcm-static-chat-message-avatar";
      avatar.appendChild(icon(message.role === "user" ? "user" : "chat", 14));
      var bubble = document.createElement("div");
      bubble.className = "pcm-static-chat-bubble";
      appendRichText(bubble, message.content);
      row.appendChild(avatar);
      row.appendChild(bubble);
      messagesEl.appendChild(row);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setOpen(next) {
    isOpen = next;
    panel.hidden = !isOpen;
    launcher.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat assistant");
    launcher.textContent = "";
    launcher.appendChild(icon(isOpen ? "close" : "chat", 22));
    if (isOpen) window.setTimeout(function () { input.focus(); }, 100);
  }

  function requestReply() {
    var value = input.value.trim();
    if (!value || isPending) return;
    messages.push({ role: "user", content: value });
    input.value = "";
    isPending = true;
    send.disabled = true;
    renderMessages();
    fetch("/api/trpc/chat.message?batch=1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 0: { json: { messages: messages } } })
    }).then(function (response) {
      if (!response.ok) throw new Error("Chat request failed");
      return response.json();
    }).then(function (payload) {
      var reply = payload && payload[0] && payload[0].result && payload[0].result.data && payload[0].result.data.json && payload[0].result.data.json.reply;
      messages.push({ role: "assistant", content: typeof reply === "string" && reply ? reply : "I'm sorry, I'm having trouble responding right now. Please call us at 1-877-485-6683 for immediate assistance." });
    }).catch(function () {
      messages.push({ role: "assistant", content: "I'm sorry, I'm having trouble responding right now. Please call us at 1-877-485-6683 for immediate assistance." });
    }).finally(function () {
      isPending = false;
      send.disabled = !input.value.trim();
      renderMessages();
    });
  }

  function init() {
    launcher = document.querySelector('button[data-loc="client/src/components/AIChatWidget.tsx:97"], button[aria-label="Open chat assistant"]');
    if (!launcher) {
      launcher = document.createElement("button");
      launcher.type = "button";
      launcher.className = "pcm-static-chat-button";
      launcher.setAttribute("aria-label", "Open chat assistant");
      document.body.appendChild(launcher);
    }
    launcher.addEventListener("click", function () { setOpen(!isOpen); });

    panel = document.createElement("div");
    panel.className = "pcm-static-chat-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "PCM Assistant");

    var header = document.createElement("div");
    header.className = "pcm-static-chat-header";
    var headerAvatar = document.createElement("div");
    headerAvatar.className = "pcm-static-chat-avatar";
    headerAvatar.appendChild(icon("chat", 16));
    var heading = document.createElement("div");
    heading.innerHTML = '<div class="pcm-static-chat-title">PCM Assistant</div><div class="pcm-static-chat-subtitle">Purely Canadian Movers</div>';
    var close = document.createElement("button");
    close.type = "button";
    close.className = "pcm-static-chat-close";
    close.setAttribute("aria-label", "Close");
    close.appendChild(icon("close", 18));
    close.addEventListener("click", function () { setOpen(false); });
    header.appendChild(headerAvatar); header.appendChild(heading); header.appendChild(close);

    messagesEl = document.createElement("div");
    messagesEl.className = "pcm-static-chat-messages";
    var form = document.createElement("form");
    form.className = "pcm-static-chat-form";
    form.addEventListener("submit", function (event) { event.preventDefault(); requestReply(); });
    input = document.createElement("input");
    input.className = "pcm-static-chat-input";
    input.type = "text";
    input.placeholder = "Ask about our services...";
    input.autocomplete = "off";
    input.addEventListener("input", function () { send.disabled = isPending || !input.value.trim(); });
    send = document.createElement("button");
    send.type = "submit";
    send.className = "pcm-static-chat-send";
    send.setAttribute("aria-label", "Send message");
    send.disabled = true;
    send.appendChild(icon("send", 15));
    form.appendChild(input); form.appendChild(send);
    panel.appendChild(header); panel.appendChild(messagesEl); panel.appendChild(form);
    document.body.appendChild(panel);
    renderMessages(); setOpen(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
