(function(){
  const key='wisdom-reading-preferences-v1',sizes=[16,18,20,22];
  let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
  let size=sizes.includes(Number(saved.size))?Number(saved.size):16;
  let theme=['light','dark','system'].includes(saved.theme)?saved.theme:'light';
  const media=window.matchMedia?.('(prefers-color-scheme: dark)');
  function apply(){const dark=theme==='dark'||theme==='system'&&media?.matches;document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.setProperty('--reading-size',size+'px');document.documentElement.style.colorScheme=dark?'dark':'light'}
  function persist(){try{localStorage.setItem(key,JSON.stringify({size,theme}))}catch{}}
  apply();media?.addEventListener?.('change',apply);
  document.addEventListener('DOMContentLoaded',()=>{
    if(!document.querySelector('.transcript-page'))return;
    const dialog=document.createElement('dialog');dialog.className='reading-dialog';dialog.setAttribute('aria-labelledby','reading-settings-title');
    dialog.innerHTML='<div class="reading-dialog-heading"><h2 id="reading-settings-title">读得更舒服</h2><button class="reading-settings-close" aria-label="关闭阅读设置">×</button></div><fieldset><legend>正文字号</legend><div class="reading-size-options"></div></fieldset><label class="reading-theme-label" for="reading-theme">页面外观</label><select id="reading-theme"><option value="light">浅色 · 暖白纸张</option><option value="dark">夜间 · 柔和深色</option><option value="system">跟随系统</option></select><p class="reading-settings-note">设置自动保存在当前浏览器。分享卡片继续使用适合分享的浅色版式。</p><button class="reading-reset">恢复默认设置</button>';
    document.body.append(dialog);
    const group=dialog.querySelector('.reading-size-options');
    sizes.forEach((value,i)=>{const button=document.createElement('button');button.textContent=['标准','舒适','大字','特大'][i]+' '+value;button.type='button';button.dataset.size=value;button.addEventListener('click',()=>{size=value;apply();persist();refresh()});group.append(button)});
    const select=dialog.querySelector('#reading-theme');
    function refresh(){group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.size)===size)));select.value=theme}
    select.addEventListener('change',()=>{theme=select.value;apply();persist()});
    dialog.querySelector('.reading-reset').addEventListener('click',()=>{size=16;theme='light';apply();persist();refresh()});
    dialog.querySelector('.reading-settings-close').addEventListener('click',()=>dialog.close());
    function open(){refresh();dialog.showModal()}
    const trigger=document.createElement('button');trigger.className='reading-settings-trigger';trigger.textContent='Aa';trigger.setAttribute('aria-label','阅读设置');trigger.title='阅读设置';trigger.addEventListener('click',open);document.body.append(trigger);
    const inline=document.createElement('button');inline.className='reading-settings-inline';inline.textContent='阅读设置 Aa';inline.addEventListener('click',open);document.querySelector('.reading-intro')?.prepend(inline);
    refresh();
  },{once:true});
})();
