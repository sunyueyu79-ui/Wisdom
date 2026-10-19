(function(){
  const params=new URLSearchParams(location.search),version=params.get('v');
  const oldVersion=version!==null&&/^\d+$/.test(version)&&Number(version)<=9;
  const oldAnchor=/^#(?:p\d+|text-\d+-\d+|reading|guide|sources|search-paragraph-\d+)$/.test(location.hash);
  if(oldVersion||oldAnchor){
    const article=new URL('articles/li-lu-2026/',location.href);
    params.delete('v');article.search=params.toString();article.hash=location.hash;
    location.replace(article.href);
  }
})();
