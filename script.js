const progress=document.querySelector('#progress');
const links=[...document.querySelectorAll('nav a')];
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}}},{rootMargin:'-10% 0px -70% 0px'});
document.querySelectorAll('.transcript-page').forEach(s=>observer.observe(s));
document.querySelector('#share').addEventListener('click',async()=>{const url=new URL(location.href);url.hash='';try{await navigator.clipboard.writeText(url.href);const s=document.querySelector('#status');s.textContent='链接已复制，可以分享给朋友';s.style.display='block';setTimeout(()=>s.style.display='none',2600)}catch{prompt('复制此链接分享',url.href)}});

// Read short sentences in sequence so long articles do not exceed engine limits.
const player=document.createElement('section');
player.className='speech-player';player.setAttribute('aria-label','语音朗读');
player.innerHTML=`<div class="speech-heading"><strong>听见 Wisdom</strong><span id="speech-state" role="status" aria-live="polite">选择章节，开始听读</span></div><div class="speech-controls"><label class="speech-chapter">朗读章节<select id="speech-chapter" aria-label="朗读章节"></select></label><label>声音<select id="speech-voice" aria-label="朗读声音"><option value="">系统默认中文声音</option></select></label><label>语速<select id="speech-rate" aria-label="朗读语速"><option value="0.8">0.8 倍</option><option value="1" selected>1.0 倍</option><option value="1.2">1.2 倍</option><option value="1.5">1.5 倍</option></select></label><button id="speech-toggle" class="speech-play">▶ 开始朗读</button><button id="speech-stop" disabled>停止</button></div><p class="speech-help">使用设备提供的语音；暂停后继续会从当前短句开头朗读。</p>`;
document.querySelector('.reading-intro').append(player);
const chapter=document.querySelector('#speech-chapter'),voiceSelect=document.querySelector('#speech-voice'),rateSelect=document.querySelector('#speech-rate'),toggle=document.querySelector('#speech-toggle'),stop=document.querySelector('#speech-stop'),state=document.querySelector('#speech-state');
const chapters=[...document.querySelectorAll('.transcript-page')];
chapters.forEach((s,i)=>chapter.add(new Option(`${String(i+1).padStart(2,'0')} ${s.querySelector('h2').textContent}`,String(i))));
if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
  state.textContent='当前浏览器不支持语音朗读，请使用系统浏览器打开。';
  player.querySelectorAll('button,select').forEach(el=>el.disabled=true);
}else{
  const synth=window.speechSynthesis;let voices=[],queue=[],index=0,mode='idle',generation=0,current=null;
  const dock=document.createElement('div');dock.className='speech-dock';dock.hidden=true;dock.setAttribute('aria-label','正在朗读控制');dock.innerHTML='<span class="speech-dock-title">Wisdom 朗读</span><button class="dock-toggle">暂停</button><button class="dock-stop">停止</button>';document.body.append(dock);
  dock.querySelector('.dock-toggle').addEventListener('click',()=>toggle.click());dock.querySelector('.dock-stop').addEventListener('click',()=>stop.click());
  function loadVoices(){const selected=voiceSelect.value;voices=synth.getVoices();voiceSelect.replaceChildren(new Option('系统默认中文声音',''));voices.forEach((v,i)=>{if(/^zh|cmn/i.test(v.lang))voiceSelect.add(new Option(v.name,String(i)))});if([...voiceSelect.options].some(o=>o.value===selected))voiceSelect.value=selected;}
  loadVoices();synth.addEventListener('voiceschanged',loadVoices);
  function clearHighlight(){document.querySelectorAll('.speech-current').forEach(p=>p.classList.remove('speech-current'));}
  function cancel(){generation++;synth.cancel();current=null;clearHighlight();}
  function render(){toggle.textContent=mode==='playing'?'Ⅱ 暂停':mode==='paused'?'▶ 继续朗读':'▶ 开始朗读';stop.disabled=mode==='idle';toggle.setAttribute('aria-pressed',String(mode==='playing'));dock.hidden=mode==='idle';dock.querySelector('.dock-toggle').textContent=mode==='playing'?'Ⅱ 暂停':'▶ 继续';}
  function buildQueue(){queue=[];for(let c=Number(chapter.value);c<chapters.length;c++){const s=chapters[c];[s.querySelector('h2'),...s.querySelectorAll('p')].forEach(el=>{const sentences=el.textContent.match(/[^。！？；\n]+[。！？；]?/g)||[];sentences.forEach(sentence=>{for(let k=0;k<sentence.length;k+=90)queue.push({text:sentence.slice(k,k+90),el,chapter:c})})})}index=0;}
  function speakNext(){if(mode!=='playing')return;if(index>=queue.length){mode='idle';cancel();state.textContent='全文朗读完毕';render();return}const item=queue[index],token=generation;chapter.value=String(item.chapter);clearHighlight();item.el.classList.add('speech-current');state.textContent=`正在朗读 · 第 ${item.chapter+1} 页`;const utterance=new SpeechSynthesisUtterance(item.text);current=utterance;utterance.lang='zh-CN';utterance.rate=Number(rateSelect.value);const chosen=voiceSelect.value!==''?voices[Number(voiceSelect.value)]:voices.find(v=>/^zh-CN$/i.test(v.lang))||voices.find(v=>/^zh|cmn/i.test(v.lang));if(chosen)utterance.voice=chosen;utterance.onend=()=>{if(token!==generation||mode!=='playing')return;index++;speakNext()};utterance.onerror=e=>{if(token!==generation)return;mode='paused';clearHighlight();state.textContent=e.error==='not-allowed'?'浏览器阻止了朗读，请再次点击继续或用系统浏览器打开。':'朗读中断，请点击继续重试。';render()};synth.speak(utterance);}
  toggle.addEventListener('click',()=>{if(mode==='playing'){mode='paused';cancel();state.textContent='已暂停';render();return}if(mode==='idle')buildQueue();mode='playing';render();speakNext()});
  stop.addEventListener('click',()=>{mode='idle';cancel();index=0;state.textContent='已停止，可重新选择章节';render()});
  chapter.addEventListener('change',()=>{const wasPlaying=mode==='playing';cancel();buildQueue();mode=wasPlaying?'playing':'idle';state.textContent='已选择章节';render();if(wasPlaying)speakNext()});
  [voiceSelect,rateSelect].forEach(select=>select.addEventListener('change',()=>{if(mode==='playing'){cancel();speakNext()}}));
  chapters.forEach((s,i)=>{const button=document.createElement('button');button.className='speech-section';button.textContent='从此节朗读 ▶';button.setAttribute('aria-label',`朗读：${s.querySelector('h2').textContent}`);s.querySelector('h2').after(button);button.addEventListener('click',()=>{cancel();chapter.value=String(i);buildQueue();mode='playing';render();speakNext()})});
  addEventListener('pagehide',()=>{mode='idle';cancel()});
}
