(function () {
  "use strict";
  if (window.__pcmChatbotInitialized) return;
  window.__pcmChatbotInitialized = true;

  var botIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>';
  var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  var chatIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>';
  var sendIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>';
  var welcome = "Hi! I'm the Purely Canadian Movers virtual assistant. How can I help you today? Whether you have questions about our services, pricing, or service areas — I'm here to help! 🍁";

  function addMessage(list, role, content) {
    var row = document.createElement("div"); row.className = "flex gap-2 " + (role === "user" ? "flex-row-reverse" : "flex-row");
    var avatar = document.createElement("div"); avatar.className = "w-7 h-7 rounded-full flex items-center justify-center shrink-0 " + (role === "user" ? "bg-gray-200" : "bg-[#CC1A1A]"); avatar.innerHTML = role === "user" ? "" : botIcon;
    if (role !== "user") avatar.classList.add("text-white");
    var bubble = document.createElement("div"); bubble.className = "max-w-[75%] rounded-2xl px-3 py-2 text-sm font-body leading-relaxed " + (role === "user" ? "bg-[#CC1A1A] text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"); bubble.textContent = content;
    row.appendChild(avatar); row.appendChild(bubble); list.appendChild(row); list.scrollTop = list.scrollHeight;
  }

  function send(messages, input, list, send) {
    var value = input.value.trim(); if (!value || send.disabled) return;
    messages.push({ role: "user", content: value }); addMessage(list, "user", value); input.value = ""; send.disabled = true;
    fetch("/api/trpc/chat.message", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ json: { messages: messages } }) })
      .then(function (response) { if (!response.ok) throw new Error("chat request failed"); return response.json(); })
      .then(function (data) { var reply = data && data.result && data.result.data && data.result.data.json && data.result.data.json.reply; if (typeof reply !== "string") throw new Error("missing reply"); messages.push({ role: "assistant", content: reply }); addMessage(list, "assistant", reply); })
      .catch(function () { var reply = "I'm sorry, I'm having trouble responding right now. Please call us at 1-877-485-6683 for immediate assistance."; messages.push({ role: "assistant", content: reply }); addMessage(list, "assistant", reply); })
      .finally(function () { send.disabled = false; input.focus(); });
  }

  function init() {
    var old = document.querySelector('button[aria-label="Open chat assistant"], button[aria-label="Close chat"]');
    if (!old || document.querySelector(".pcm-chatbot-panel")) return !!old;
    old.remove();
    var button = document.createElement("button"); button.className = "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#CC1A1A] text-white shadow-lg hover:bg-[#A31515] transition-all duration-200 flex items-center justify-center"; button.setAttribute("aria-label", "Open chat assistant"); button.innerHTML = chatIcon; document.body.appendChild(button);
    var messages = [{ role: "assistant", content: welcome }];
    button.addEventListener("click", function () {
      var panel = document.querySelector(".pcm-chatbot-panel"); if (panel) { panel.remove(); button.setAttribute("aria-label", "Open chat assistant"); return; }
      panel = document.createElement("div"); panel.className = "pcm-chatbot-panel fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"; panel.style.maxHeight = "480px";
      panel.innerHTML = '<div class="bg-[#CC1A1A] text-white px-4 py-3 flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">'+botIcon+'</div><div><div class="font-body font-semibold text-sm">PCM Assistant</div><div class="font-body text-xs text-red-200">Purely Canadian Movers</div></div><button class="ml-auto hover:text-red-200 transition-colors" aria-label="Close">'+closeIcon+'</button></div><div class="flex-1 overflow-y-auto p-4 space-y-3" style="min-height:0"></div><div class="border-t border-gray-200 p-3 flex gap-2"><input type="text" placeholder="Ask about our services..." class="flex-1 text-sm font-body border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC1A1A] focus:border-transparent"><button class="w-9 h-9 rounded-full bg-[#CC1A1A] text-white flex items-center justify-center hover:bg-[#A31515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">'+sendIcon+'</button></div>';
      document.body.appendChild(panel); button.setAttribute("aria-label", "Close chat"); var list=panel.querySelector(".space-y-3"), input=panel.querySelector("input"), sendButton=panel.querySelector('[aria-label="Send message"]'); addMessage(list,"assistant",welcome); panel.querySelector('[aria-label="Close"]').addEventListener("click",function(){panel.remove();button.setAttribute("aria-label","Open chat assistant")}); sendButton.addEventListener("click",function(){send(messages,input,list,sendButton)}); input.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(messages,input,list,sendButton)}}); input.focus();
    });
    return true;
  }
  var attempts=0, timer=setInterval(function(){if(init()||++attempts>40)clearInterval(timer)},250);
}());
