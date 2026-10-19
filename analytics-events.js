/* Event properties intentionally exclude search text, selected quotations and
   personal identifiers. Tracking failures never block reading or sharing. */
(function(){
  const pending=[];
  function send(name,data){try{const result=window.umami.track(name,data);result?.catch?.(()=>{})}catch{}}
  function track(name,data={}){
    const payload={article:document.documentElement.dataset.articleId||'library',...data};
    if(window.umami?.track){send(name,payload);return}
    if(pending.length<40)pending.push([name,payload]);
  }
  const timer=setInterval(()=>{if(window.umami?.track){clearInterval(timer);pending.splice(0).forEach(([name,data])=>send(name,data))}},500);
  setTimeout(()=>{clearInterval(timer);pending.length=0},15000);
  window.WisdomAnalytics={track};
})();
