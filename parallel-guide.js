(() => {
  const reading=document.querySelector('.parallel-reading');
  document.querySelectorAll('[data-parallel-view]').forEach(button=>button.addEventListener('click',()=>{
    reading.dataset.view=button.dataset.parallelView;
    document.querySelectorAll('[data-parallel-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  }));
  const form=document.querySelector('#transcript-search'),input=document.querySelector('#transcript-query'),status=document.querySelector('#transcript-results');
  if(!form)return;
  const pairs=[...reading.querySelectorAll('.parallel-pair')];
  function filter(){const query=input.value.trim().toLocaleLowerCase();let count=0;pairs.forEach(pair=>{const match=!query||pair.textContent.toLocaleLowerCase().includes(query);pair.hidden=!match;if(match)count++;});status.textContent=query?`找到 ${count} 段`:`共 ${pairs.length} 段`;}
  input.addEventListener('input',filter);
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('reset',()=>{input.value='';filter();});
})();
