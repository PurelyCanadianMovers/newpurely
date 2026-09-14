(function(){
  "use strict";
  var allowed={"/halifax-to-toronto-movers/":true,"/toronto-to-halifax-movers/":true};
  var path=window.location.pathname.replace(/\/+$/,"") + "/";
  if(!allowed[path])return;
  function init(){
    var trigger=document.querySelector('header button[aria-label="Open menu"]');
    var panel=document.querySelector(".pcm-static-mobile");
    var close=panel&&panel.querySelector('button[aria-label="Close menu"]');
    if(trigger&&panel&&close){
      trigger.setAttribute("aria-expanded",String(panel.classList.contains("is-open")));
      trigger.addEventListener("click",function(){window.setTimeout(function(){trigger.setAttribute("aria-expanded",String(panel.classList.contains("is-open")))},0)});
      close.addEventListener("click",function(){trigger.setAttribute("aria-expanded","false")});
    }
    document.addEventListener("keydown",function(event){
      if(event.key!=="Escape")return;
      document.querySelectorAll(".pcm-static-dropdown").forEach(function(menu){menu.hidden=true;if(menu._button)menu._button.setAttribute("aria-expanded","false")});
      if(panel&&panel.classList.contains("is-open")){panel.classList.remove("is-open");if(trigger){trigger.setAttribute("aria-expanded","false");trigger.focus()}}
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());
