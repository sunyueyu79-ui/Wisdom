(() => {
  const key='wisdom-study-v1',ids=['circle-of-competence','margin-of-safety','compounding','lifelong-learning'];
  let completed=[];
  try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(value))completed=value.filter(id=>ids.includes(id));}catch{}
  function render(){
    document.querySelectorAll('[data-study-count]').forEach(el=>el.textContent=String(new Set(completed).size));
    document.querySelectorAll('[data-lesson-card]').forEach(el=>{el.querySelector('[data-lesson-status]').textContent=completed.includes(el.dataset.lessonCard)?'已学 · 再读一遍':'开始学习';});
    document.querySelectorAll('[data-complete]').forEach(button=>{const done=completed.includes(button.dataset.complete);button.setAttribute('aria-pressed',String(done));button.textContent=done?'本节已学 ✓ · 点击取消':'标记本节已学 ✓';});
  }
  document.querySelectorAll('[data-complete]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.complete;completed=completed.includes(id)?completed.filter(x=>x!==id):[...completed,id];try{localStorage.setItem(key,JSON.stringify(completed));document.querySelector('[data-study-message]').textContent=completed.includes(id)?'已记下本节进度。可以继续下一节，也欢迎稍后回来复习。':'已取消本节学习标记。';}catch{document.querySelector('[data-study-message]').textContent='本次已标记，此浏览器暂时无法保存进度。';}render();}));
  document.querySelector('#study-share')?.addEventListener('click',async event=>{const button=event.currentTarget,url=document.querySelector('link[rel=canonical]').href;try{await navigator.clipboard.writeText(url);button.textContent='链接已复制 ✓';}catch{prompt('复制此链接分享',url);}});
  render();
})();
