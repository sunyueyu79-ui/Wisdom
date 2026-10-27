(() => {
  const reading=document.querySelector('.parallel-reading');
  document.querySelectorAll('[data-parallel-view]').forEach(button=>button.addEventListener('click',()=>{
    reading.dataset.view=button.dataset.parallelView;
    document.querySelectorAll('[data-parallel-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  }));
})();
