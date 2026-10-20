/* Keep one visible choice per voice name and language, even if a device
   exposes several services for it. Retain the selected service when possible. */
(function(root){
  function language(voice){return String(voice.lang||'').replace(/_/g,'-').toLowerCase()}
  function name(voice){return String(voice.name||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase()}
  function key(voice){return name(voice)+'|'+language(voice)}
  function prepare(available,preferred,target='zh'){
    const groups=new Map();
    for(const voice of available){
      if(!(target==='en'?/^en(-|$)/:/^(zh|cmn)(-|$)/).test(language(voice)))continue;
      const id=key(voice),existing=groups.get(id);
      if(!existing||voice.voiceURI===preferred?.voiceURI||
        (existing.voiceURI!==preferred?.voiceURI&&voice.default&&!existing.default))groups.set(id,voice);
    }
    const voices=[...groups.values()];
    const selectedIndex=preferred?voices.findIndex(voice=>
      voice.voiceURI===preferred.voiceURI||(preferred.key&&key(voice)===preferred.key)):-1;
    const names=new Map();voices.forEach(voice=>names.set(name(voice),(names.get(name(voice))||0)+1));
    const labels=voices.map(voice=>String(voice.name).trim()+(names.get(name(voice))>1?'（'+language(voice)+'）':''));
    return {voices,labels,selectedIndex};
  }
  const api={key,prepare};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.WisdomVoices=api;
})(typeof window!=='undefined'?window:globalThis);
