(function(){try{var s=localStorage.getItem('toolnest-theme');var t=s||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('themeToggle');if(!b)return;function u(){var c=document.documentElement.getAttribute('data-theme');b.textContent=c==='dark'?'☀️':'🌙';}u();b.addEventListener('click',function(){var c=document.documentElement.getAttribute('data-theme');var n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('toolnest-theme',n);}catch(e){}u();});});})();
(function(){
function slugify(s){return (s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
function copyText(text,onDone){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(onDone).catch(function(){legacyCopy(text,onDone);});
  }else{legacyCopy(text,onDone);}
}
function legacyCopy(text,onDone){
  try{var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');document.body.removeChild(ta);onDone&&onDone();}catch(e){alert('Could not copy link.');}
}
window.toolnestCopyText=copyText;
function resetCard(card){
  card.querySelectorAll('input,textarea,select').forEach(function(el){
    if(el.type==='checkbox'||el.type==='radio'){el.checked=el.defaultChecked;}
    else{el.value=el.defaultValue;}
  });
  card.querySelectorAll('canvas').forEach(function(c){c.style.display='none';});
  card.querySelectorAll('svg[id]').forEach(function(s){s.innerHTML='';});
  card.querySelectorAll('.stat').forEach(function(p){if(!p.closest('label'))p.textContent='';});
  card.querySelectorAll('ul[id]').forEach(function(l){l.innerHTML='';});
  card.querySelectorAll('div[id$="Result"],div[id$="Preview"],div[id$="Swatch"]').forEach(function(d){
    d.innerHTML='';d.style.background='';d.style.display=(d.id.endsWith('Preview')&&d.id!=='contrastPreview')?'none':d.style.display;
  });
  var contentEditables=card.querySelectorAll('[contenteditable="true"]');
  contentEditables.forEach(function(ce){ce.textContent='';});
  card.querySelectorAll('input,textarea,select').forEach(function(el){
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  });
}
document.addEventListener('DOMContentLoaded',function(){
  if(document.body.classList.contains('info-page'))return;
  var cards=document.querySelectorAll('main .card');
  cards.forEach(function(card,idx){
    var h2=card.querySelector('h2');
    var title=h2?h2.textContent.trim():('Tool '+(idx+1));
    if(!card.id){card.id=slugify(title)||('tool-'+idx);}
    var bar=document.createElement('div');
    bar.className='tool-actions';
    bar.innerHTML='<button type="button" class="ta-btn ta-copy" title="Copy Link">🔗</button>'+
                  '<button type="button" class="ta-btn ta-share" title="Share on WhatsApp">📱</button>'+
                  '<button type="button" class="ta-btn ta-reset" title="Reset">↺</button>';
    card.insertBefore(bar,card.firstChild);
    var copyBtn=bar.querySelector('.ta-copy');
    var shareBtn=bar.querySelector('.ta-share');
    var resetBtn=bar.querySelector('.ta-reset');
    copyBtn.addEventListener('click',function(){
      var url=location.origin+location.pathname+'#'+card.id;
      copyText(url,function(){
        var old=copyBtn.textContent;copyBtn.textContent='✅';
        setTimeout(function(){copyBtn.textContent=old;},1200);
      });
    });
    shareBtn.addEventListener('click',function(){
      var url=location.origin+location.pathname+'#'+card.id;
      var text='Check out this free tool — '+title+' on ToolNest: '+url;
      window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
    });
    resetBtn.addEventListener('click',function(){resetCard(card);});
  });
  if(location.hash){
    var target=document.getElementById(location.hash.slice(1));
    if(target){setTimeout(function(){target.scrollIntoView({behavior:'smooth',block:'start'});},50);}
  }
});
})();
