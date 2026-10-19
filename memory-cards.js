// Only this browser stores progress. No account or remote storage is used.
const memoryKey='wisdom-li-lu-v1';
let memory={};let storageWorks=true;
try{memory=JSON.parse(localStorage.getItem(memoryKey)||'{}')||{};localStorage.setItem(memoryKey,JSON.stringify(memory))}catch{memory={};storageWorks=false}
function saveMemory(patch){memory={...memory,...patch};try{localStorage.setItem(memoryKey,JSON.stringify(memory))}catch{storageWorks=false}}
window.WisdomMemory={get:()=>memory,save:saveMemory};
const readingSections=[...document.querySelectorAll('.transcript-page')];
let speaker='塔诺';
readingSections.forEach((section,c)=>section.querySelectorAll('p').forEach((p,j)=>{p.id=`text-${c+1}-${j}`;const text=p.textContent.trim();const label=p.querySelector('.speaker');if(label)speaker=label.textContent.replace(/[：:]/g,'').trim();else if(/^观众提问者|^[A-Z][a-zA-Z .-]+,\s*[^：:]{1,65}[：:]/.test(text))speaker='观众';p.dataset.speaker=speaker}));

document.addEventListener('DOMContentLoaded',()=>{
  const intro=document.querySelector('.reading-intro');
  const resume=document.createElement('div');resume.className='resume-panel';
  const savedRead=memory.read,savedAudio=memory.audio;
  resume.innerHTML='<div><strong>继续上次的旅程</strong><p>进度仅保存在此浏览器，清除浏览器数据后会重置。</p></div><div class="resume-actions"></div>';
  const actions=resume.querySelector('.resume-actions');
  if(savedRead&&document.getElementById(savedRead.id)){const button=document.createElement('button');button.textContent=`继续阅读 · 第 ${savedRead.page} 页`;button.addEventListener('click',()=>{trackRead=true;const el=document.getElementById(savedRead.id);el.scrollIntoView({behavior:'instant',block:'start'});scrollBy(0,Math.min(Math.max(0,Number(savedRead.offset)||0),Math.max(0,el.offsetHeight-30)))});actions.append(button)}
  if(savedAudio&&!savedAudio.done){const button=document.createElement('button');button.textContent=`继续听读 · 第 ${savedAudio.chapter+1} 页`;button.addEventListener('click',()=>document.dispatchEvent(new Event('wisdom-resume-audio')));actions.append(button)}
  if(actions.children.length)document.querySelector('.hero').append(resume);
  const tools=document.createElement('div');tools.className='article-tools';tools.innerHTML='<button class="make-quote">制作金句分享卡片 ↗</button><span class="memory-hint"></span>';intro.append(tools);
  tools.querySelector('.memory-hint').textContent=storageWorks?'阅读与听读进度自动保存 · 仅此浏览器':'此浏览器暂不能保存进度';
  let trackRead=false,timer;
  ['wheel','touchstart','pointerdown','keydown'].forEach(type=>addEventListener(type,()=>{trackRead=true},{passive:true}));
  function rememberReading(){if(!trackRead)return;const paragraphs=[...document.querySelectorAll('.transcript-page p')];const el=paragraphs.find(p=>p.getBoundingClientRect().bottom>110);if(!el||el.getBoundingClientRect().top>innerHeight)return;saveMemory({read:{id:el.id,page:Number(el.closest('section').id.slice(1)),offset:Math.max(0,-el.getBoundingClientRect().top),at:Date.now()}})}
  addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(rememberReading,350)},{passive:true});addEventListener('pagehide',rememberReading);

  const presets=[
    '如果你的知识能够持续实现复利增长，那么最终，你的资本也能够实现复利增长。',
    '认识能力圈的边界，与认识能力圈内部的东西同样重要。',
    '你付出的是价格，得到的是价值。',
    '找到你自然倾向、真正适合自己的事情，然后随着时间推移，以不断积累、实现复利的方式在其基础上发展，这是一种更好的、富有建设性的人生方式。'
  ].map(text=>{const p=[...document.querySelectorAll('.transcript-page p')].find(p=>p.textContent.includes(text));return p?{text,page:p.closest('section').id}:null}).filter(Boolean);
  const dialog=document.createElement('dialog');dialog.className='quote-dialog';dialog.setAttribute('aria-labelledby','quote-title');dialog.innerHTML='<div class="quote-dialog-head"><h2 id="quote-title">把一句好话，分享出去。</h2><button class="quote-close" aria-label="关闭金句卡片">×</button></div><p class="quote-instruction">选择金句，或关闭后在李录的正文中选中一段文字（最多 280 字）。</p><label class="quote-choice-label">金句<select class="quote-choice" aria-label="选择金句"></select></label><img class="quote-preview" alt="金句分享卡片预览"><div class="quote-buttons"><a class="quote-download" download="Wisdom-李录金句.png">保存图片 ↓</a><button class="quote-system-share" disabled>分享图片 ↗</button></div><p class="quote-result" role="status" aria-live="polite">也可长按图片保存，再发到微信。</p>';
  document.body.append(dialog);const choice=dialog.querySelector('.quote-choice');presets.forEach((p,i)=>choice.add(new Option(p.text.length>28?p.text.slice(0,28)+'…':p.text,String(i))));
  let chosen=null,shareFile=null,cardGeneration=0;
  function linesFor(ctx,text,width){const total=ctx.measureText(text).width,count=Math.ceil(total/width);if(count>1&&text.length<100)width=Math.min(width,Math.ceil(total/count)+ctx.measureText('字').width/2);const lines=[];let line='';for(const char of text){if(char==='\n'){lines.push(line);line='';continue}if(ctx.measureText(line+char).width>width&&line){if(/[，。！？；：、”’）]/.test(char)){line+=char;continue}lines.push(line);line=char}else line+=char}if(line)lines.push(line);return lines}
  async function drawCard(quote){const generation=++cardGeneration;shareFile=null;dialog.querySelector('.quote-system-share').disabled=true;const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1200;const ctx=canvas.getContext('2d');ctx.fillStyle='#f7f5ef';ctx.fillRect(0,0,900,1200);ctx.fillStyle='#a27c3e';ctx.fillRect(65,65,3,55);ctx.font='32px Georgia,serif';ctx.fillText('W  Wisdom',90,104);ctx.font='17px sans-serif';ctx.fillText('值得反复阅读的思想',90,141);ctx.font='100px Georgia,serif';ctx.fillText('“',70,260);ctx.fillStyle='#253029';ctx.font=`${quote.text.length>180?32:quote.text.length>100?36:42}px "Songti SC",SimSun,serif`;let font=quote.text.length>180?32:quote.text.length>100?36:42;let lines,step;do{ctx.font=font+'px Songti SC,SimSun,serif';lines=linesFor(ctx,quote.text,744);step=Math.round(font*1.6);if(lines.length*step<=420)break;font-=2}while(font>=20);lines.forEach((line,i)=>ctx.fillText(line,78,306+i*step));const bottom=306+lines.length*step;ctx.font='24px sans-serif';ctx.fillText('李录',78,Math.max(660,bottom+28));ctx.fillStyle='#68716a';ctx.font='18px sans-serif';ctx.fillText(`中文访谈摘录 · 原文第 ${quote.page.slice(1)} 页`,78,Math.max(697,bottom+65));ctx.strokeStyle='#d4d8ce';ctx.beginPath();ctx.moveTo(78,900);ctx.lineTo(822,900);ctx.stroke();ctx.font='19px sans-serif';ctx.fillText('第 36 届格雷厄姆—多德年度午餐会',78,953);ctx.font='17px sans-serif';ctx.fillText('2026.10.05 · 哥伦比亚商学院',78,989);ctx.fillText('据中文 PDF 整理 · 译者未注明',78,1025);ctx.fillStyle='#a27c3e';ctx.fillText('扫码阅读全文与出处 ↗',78,1091);
    const matrix=window.WisdomQR[quote.page],scale=4,size=matrix.length*scale;const x=822-size,y=934;ctx.fillStyle='#fff';ctx.fillRect(x,y,size,size);ctx.fillStyle='#253029';matrix.forEach((row,r)=>[...row].forEach((cell,c)=>{if(cell==='1')ctx.fillRect(x+c*scale,y+r*scale,scale,scale)}));
    const url=canvas.toDataURL('image/png');dialog.querySelector('.quote-preview').src=url;dialog.querySelector('.quote-download').href=url;dialog.querySelector('.quote-download').download=`Wisdom-李录-第${quote.page.slice(1)}页.png`;canvas.toBlob(blob=>{if(!blob||generation!==cardGeneration)return;shareFile=new File([blob],'Wisdom-李录金句.png',{type:'image/png'});const supported=!!navigator.canShare&&navigator.canShare({files:[shareFile]});dialog.querySelector('.quote-system-share').disabled=!supported;dialog.querySelector('.quote-result').textContent=supported?'保存图片或直接分享；也可长按图片保存。':'可保存图片或长按图片，再发到微信。'},'image/png');}
  function openCard(quote=presets[0]){chosen=quote;dialog.querySelector('.quote-result').textContent='正在生成卡片…';if(quote.custom){let opt=choice.querySelector('[value="custom"]');if(!opt){opt=new Option('当前选中的原文','custom');choice.add(opt)}choice.value='custom'}else choice.value=String(presets.indexOf(quote));dialog.showModal();drawCard(quote).catch(()=>{dialog.querySelector('.quote-result').textContent='生成失败，请关闭后重试。'})}
  tools.querySelector('.make-quote').addEventListener('click',()=>openCard());
  dialog.querySelector('.quote-close').addEventListener('click',()=>dialog.close());
  choice.addEventListener('change',()=>{if(choice.value==='custom')drawCard(chosen);else drawCard(presets[Number(choice.value)])});
  dialog.querySelector('.quote-system-share').addEventListener('click',async()=>{if(!shareFile)return;try{await navigator.share({files:[shareFile],title:'Wisdom · 李录金句'})}catch(e){if(e.name!=='AbortError')dialog.querySelector('.quote-result').textContent='暂时无法直接分享，请保存图片后分享。'}});
  const selectionButton=document.createElement('button');selectionButton.className='selection-quote';selectionButton.textContent='把选中文字制成卡片 ↗';selectionButton.hidden=true;document.body.append(selectionButton);let selectedQuote=null;
  document.addEventListener('selectionchange',()=>{if(dialog.open)return;const selection=getSelection();const text=selection.toString().replace(/\s+/g,' ').trim();const start=selection.anchorNode?.parentElement?.closest('.transcript-page p'),end=selection.focusNode?.parentElement?.closest('.transcript-page p');if(text.length>=8&&text.length<=280&&start&&start===end&&start.dataset.speaker==='李录'){selectedQuote={text,page:start.closest('section').id,custom:true};selectionButton.hidden=false}else selectionButton.hidden=true});
  selectionButton.addEventListener('pointerdown',e=>e.preventDefault());selectionButton.addEventListener('click',()=>{if(selectedQuote){openCard(selectedQuote);selectionButton.hidden=true}});
});
