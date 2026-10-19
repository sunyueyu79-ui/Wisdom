const progress=document.querySelector('#progress');
const links=[...document.querySelectorAll('nav a')];
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}}},{rootMargin:'-10% 0px -70% 0px'});
document.querySelectorAll('.transcript-page').forEach(s=>observer.observe(s));
document.querySelector('#share').addEventListener('click',async()=>{const url=new URL(location.href);url.hash='';try{await navigator.clipboard.writeText(url.href);const s=document.querySelector('#status');s.textContent='链接已复制，可以分享给朋友';s.style.display='block';setTimeout(()=>s.style.display='none',2600)}catch{prompt('复制此链接分享',url.href)}});
