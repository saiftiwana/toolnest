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
                  '<span class="ta-share-wrap">'+
                    '<button type="button" class="ta-btn ta-share-toggle" title="Share">📤</button>'+
                    '<span class="ta-share-menu">'+
                      '<button type="button" class="ta-share-item ta-share-wa" title="Share on WhatsApp">📱 WhatsApp</button>'+
                      '<button type="button" class="ta-share-item ta-share-fb" title="Share on Facebook">📘 Facebook</button>'+
                      '<button type="button" class="ta-share-item ta-share-x" title="Share on X">𝕏 X (Twitter)</button>'+
                      '<button type="button" class="ta-share-item ta-share-li" title="Share on LinkedIn">💼 LinkedIn</button>'+
                    '</span>'+
                  '</span>'+
                  '<button type="button" class="ta-btn ta-embed" title="Embed This Tool">&lt;/&gt;</button>'+
                  '<button type="button" class="ta-btn ta-reset" title="Reset">↺</button>';
    card.insertBefore(bar,card.firstChild);
    var copyBtn=bar.querySelector('.ta-copy');
    var resetBtn=bar.querySelector('.ta-reset');
    var shareToggle=bar.querySelector('.ta-share-toggle');
    var shareMenu=bar.querySelector('.ta-share-menu');
    var embedBtn=bar.querySelector('.ta-embed');

    function cardUrl(){return location.origin+location.pathname+'#'+card.id;}

    copyBtn.addEventListener('click',function(){
      copyText(cardUrl(),function(){
        var old=copyBtn.textContent;copyBtn.textContent='✅';
        setTimeout(function(){copyBtn.textContent=old;},1200);
      });
    });

    shareToggle.addEventListener('click',function(e){
      e.stopPropagation();
      document.querySelectorAll('.ta-share-menu.open').forEach(function(m){if(m!==shareMenu)m.classList.remove('open');});
      shareMenu.classList.toggle('open');
    });
    document.addEventListener('click',function(){shareMenu.classList.remove('open');});
    shareMenu.addEventListener('click',function(e){e.stopPropagation();});

    bar.querySelector('.ta-share-wa').addEventListener('click',function(){
      var text='Check out this free tool — '+title+' on ToolNest: '+cardUrl();
      window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
      shareMenu.classList.remove('open');
    });
    bar.querySelector('.ta-share-fb').addEventListener('click',function(){
      window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(cardUrl()),'_blank');
      shareMenu.classList.remove('open');
    });
    bar.querySelector('.ta-share-x').addEventListener('click',function(){
      var text='Check out this free tool — '+title+' on ToolNest';
      window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(cardUrl()),'_blank');
      shareMenu.classList.remove('open');
    });
    bar.querySelector('.ta-share-li').addEventListener('click',function(){
      window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(cardUrl()),'_blank');
      shareMenu.classList.remove('open');
    });

    embedBtn.addEventListener('click',function(){openEmbedModal(title,cardUrl());});
    resetBtn.addEventListener('click',function(){resetCard(card);});
  });
  if(location.hash){
    var target=document.getElementById(location.hash.slice(1));
    if(target){setTimeout(function(){target.scrollIntoView({behavior:'smooth',block:'start'});},50);}
  }
});

function openEmbedModal(title,url){
  var pageUrl=location.origin+location.pathname;
  var code='<iframe src="'+pageUrl+'" width="100%" height="600" style="border:1px solid #ddd;border-radius:8px;" title="'+title.replace(/"/g,'&quot;')+' - ToolNest"></iframe>\n'+
           '<p style="font-size:12px;text-align:center;margin-top:6px;">Powered by <a href="https://toolnest.link" target="_blank" rel="noopener">ToolNest Free Online Tools</a></p>';
  var overlay=document.createElement('div');
  overlay.className='share-card-overlay';
  overlay.innerHTML='<div class="share-card-modal embed-modal">'+
    '<button type="button" class="share-card-close" aria-label="Close">✕</button>'+
    '<h3>Embed This Tool</h3>'+
    '<p class="embed-hint">Paste this code into your website or blog to embed "'+title+'". A backlink to ToolNest is included automatically.</p>'+
    '<textarea class="embed-code" readonly rows="5"></textarea>'+
    '<button type="button" class="ta-btn embed-copy-btn">📋 Copy Embed Code</button>'+
  '</div>';
  document.body.appendChild(overlay);
  var ta=overlay.querySelector('.embed-code');
  ta.value=code;
  overlay.querySelector('.share-card-close').addEventListener('click',function(){overlay.remove();});
  overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.remove();});
  overlay.querySelector('.embed-copy-btn').addEventListener('click',function(btnE){
    var btn=btnE.currentTarget;
    copyText(code,function(){
      var old=btn.textContent;btn.textContent='✅ Copied';
      setTimeout(function(){btn.textContent=old;},1200);
    });
  });
}
})();

/* ---------- ToolNest Share Result Card Engine (Phase 8, Batch 8.2) ---------- */
(function(){
  var BRAND_BG='#1f3d2b', BRAND_CREAM='#f2ecd8', BRAND_ORANGE='#e07a2c';

  function autoHighlight(){
    var nodes=document.querySelectorAll('[id*="esult" i],[class*="result" i],[id*="utput" i],[class*="output" i]');
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i];
      var style=window.getComputedStyle(el);
      if(style.display==='none'||style.visibility==='hidden')continue;
      var text=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(text.length>3&&text.length<160)return text;
    }
    return '';
  }

  function buildModal(){
    var overlay=document.createElement('div');
    overlay.className='share-card-overlay';
    overlay.innerHTML=
      '<div class="share-card-modal">'+
        '<button type="button" class="share-card-close" aria-label="Close">✕</button>'+
        '<h3>Share Your Result</h3>'+
        '<div class="share-card-preview"><canvas id="tnShareCanvas" width="1200" height="630"></canvas></div>'+
        '<div class="share-card-sizes">'+
          '<button type="button" class="scs-btn active" data-size="landscape">Landscape (1200×630)</button>'+
          '<button type="button" class="scs-btn" data-size="square">Square (1080×1080)</button>'+
        '</div>'+
        '<div class="share-card-actions">'+
          '<button type="button" class="ta-btn share-card-download">⬇ Download PNG</button>'+
          '<button type="button" class="ta-btn share-card-webshare">📤 Share</button>'+
        '</div>'+
        '<div id="tnQrHolder" style="display:none;"></div>'+
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function drawCard(canvas,size,title,highlight,qrImg){
    var W=size==='square'?1080:1200, H=size==='square'?1080:630;
    canvas.width=W;canvas.height=H;
    var ctx=canvas.getContext('2d');
    ctx.fillStyle=BRAND_BG;ctx.fillRect(0,0,W,H);

    var cx=size==='square'?W/2:150, cy=size==='square'?140:130, r=size==='square'?80:70;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=BRAND_ORANGE;ctx.fill();
    ctx.fillStyle=BRAND_BG;ctx.font='bold '+(r*0.75)+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('99',cx,cy+2);

    var textX=size==='square'?W/2:280, align=size==='square'?'center':'left';
    ctx.textAlign=align;

    ctx.fillStyle=BRAND_CREAM;
    ctx.font='bold 64px Arial';
    ctx.fillText('ToolNest',textX,size==='square'?cy+140:cy);

    ctx.font='28px Arial';
    ctx.fillStyle=BRAND_CREAM;
    var titleY=(size==='square'?cy+200:cy+70);
    wrapText(ctx,title,textX,titleY,W-(size==='square'?120:textX+80),36);

    if(highlight){
      ctx.font='bold 34px Arial';
      ctx.fillStyle=BRAND_ORANGE;
      var hY=titleY+90;
      wrapText(ctx,highlight,textX,hY,W-(size==='square'?120:textX+80),44);
    }

    ctx.fillStyle='#182e20';ctx.fillRect(0,H-70,W,70);
    ctx.fillStyle=BRAND_ORANGE;ctx.font='bold 28px Arial';ctx.textAlign='left';
    ctx.fillText('toolnest.link',40,H-28);

    if(qrImg){
      var qrSize=size==='square'?150:120;
      ctx.drawImage(qrImg,W-qrSize-40,H-qrSize-100,qrSize,qrSize);
    }
  }

  function wrapText(ctx,text,x,y,maxWidth,lineHeight){
    var words=text.split(' '),line='',lines=[];
    for(var n=0;n<words.length;n++){
      var test=line+words[n]+' ';
      if(ctx.measureText(test).width>maxWidth&&n>0){lines.push(line);line=words[n]+' ';}
      else{line=test;}
    }
    lines.push(line);
    lines=lines.slice(0,3);
    for(var i=0;i<lines.length;i++){ctx.fillText(lines[i].trim(),x,y+i*lineHeight);}
  }

  function openShareCard(){
    var title=(document.querySelector('h1')||{}).textContent||document.title;
    title=title.trim();
    var highlight=autoHighlight();
    var overlay=buildModal();
    var canvas=overlay.querySelector('#tnShareCanvas');
    var qrHolder=overlay.querySelector('#tnQrHolder');
    var currentSize='landscape';
    var qrImg=new Image();
    var pageUrl=location.origin+location.pathname;

    function renderQrThenDraw(){
      qrHolder.innerHTML='';
      if(window.QRCode){
        new QRCode(qrHolder,{text:pageUrl,width:150,height:150,colorDark:'#1f3d2b',colorLight:'#f2ecd8'});
        setTimeout(function(){
          var qrCanvas=qrHolder.querySelector('canvas');
          var qrImgEl=qrHolder.querySelector('img');
          if(qrCanvas){qrImg.src=qrCanvas.toDataURL();}
          else if(qrImgEl){qrImg.src=qrImgEl.src;}
          qrImg.onload=function(){drawCard(canvas,currentSize,title,highlight,qrImg);};
          if(qrImg.complete)drawCard(canvas,currentSize,title,highlight,qrImg);
        },80);
      }else{
        drawCard(canvas,currentSize,title,highlight,null);
      }
    }
    renderQrThenDraw();

    overlay.querySelectorAll('.scs-btn').forEach(function(btn){
      btn.addEventListener('click',function(){
        overlay.querySelectorAll('.scs-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        currentSize=btn.getAttribute('data-size');
        drawCard(canvas,currentSize,title,highlight,qrImg.complete&&qrImg.src?qrImg:null);
      });
    });

    overlay.querySelector('.share-card-close').addEventListener('click',function(){overlay.remove();});
    overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.remove();});

    overlay.querySelector('.share-card-download').addEventListener('click',function(){
      canvas.toBlob(function(blob){
        var a=document.createElement('a');
        a.href=URL.createObjectURL(blob);
        a.download='toolnest-'+(title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+'.png';
        a.click();
      });
    });

    overlay.querySelector('.share-card-webshare').addEventListener('click',function(){
      canvas.toBlob(function(blob){
        var file=new File([blob],'toolnest-share.png',{type:'image/png'});
        if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
          navigator.share({files:[file],title:title,text:'Check out '+title+' on ToolNest — free, private, no sign up.',url:pageUrl}).catch(function(){});
        }else if(navigator.share){
          navigator.share({title:title,text:'Check out '+title+' on ToolNest — free, private, no sign up.',url:pageUrl}).catch(function(){});
        }else{
          var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='toolnest-share.png';a.click();
        }
      });
    });
  }

  window.ToolNestShare={open:openShareCard};

  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('tnShareCardBtn');
    if(btn)btn.addEventListener('click',openShareCard);
  });
})();
