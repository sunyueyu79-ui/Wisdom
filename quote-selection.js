(function(root){
  function fromSelection(selection,document){
    if(!selection||selection.isCollapsed||!selection.rangeCount)return null;
    const range=selection.getRangeAt(0);
    const paragraph=node=>(node.nodeType===1?node:node.parentElement)?.closest('.transcript-page p');
    const first=paragraph(range.startContainer),last=paragraph(range.endContainer);
    if(!first||!last)return null;
    const parts=[];
    for(const p of document.querySelectorAll('.transcript-page p')){
      if(!range.intersectsNode(p))continue;
      const piece=document.createRange();piece.selectNodeContents(p);
      if(p.contains(range.startContainer))piece.setStart(range.startContainer,range.startOffset);
      if(p.contains(range.endContainer))piece.setEnd(range.endContainer,range.endOffset);
      const text=piece.toString().replace(/\s+/g,' ').trim();
      if(text)parts.push({text,speaker:p.dataset.speaker,page:p.closest('section').id});
    }
    const text=parts.map(p=>p.text).join(' ');
    if(text.length<8)return null;
    if(text.length>280)return {error:'已选 '+text.length+' 字，请缩短至 280 字以内'};
    if(parts.some(p=>p.speaker!=='李录'))return {error:'请仅选取李录的发言，避免跨入其他人的话'};
    return {text,page:parts[0].page,endPage:parts[parts.length-1].page,custom:true};
  }
  root.WisdomQuoteSelection={fromSelection};
})(window);
