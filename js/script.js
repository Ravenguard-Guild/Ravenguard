var midnight = [
    { raid:"The Voidspire", bosses:[
      {name:"Imperator Averzian",cleared:"heroic"},{name:"Vorasius",cleared:"heroic"},
      {name:"Fallen-King Salhadaar",cleared:"heroic"},{name:"Vaelgor & Ezzorak",cleared:"heroic"},
      {name:"Lightblinded Vanguard",cleared:"heroic"},{name:"Crown of the Cosmos",cleared:"heroic"} ]},
    { raid:"The Dreamrift", bosses:[ {name:"Chimaerus, the Undreamt God",cleared:"heroic"} ]},
    { raid:"March on Quel'Danas", bosses:[ {name:"Belo'ren",cleared:"heroic"},{name:"L'ura, Midnight Falls",cleared:"heroic"} ]},
    { raid:"Sporefall", bosses:[ {name:"Rotmire",cleared:"none"} ]}
  ];
  var pastTiers = [
    { id:"sl1", label:"Shadowlands S1", xpac:"Shadowlands — Season 1", raid:"Castle Nathria" },
    { id:"sl2", label:"Shadowlands S2", xpac:"Shadowlands — Season 2", raid:"Sanctum of Domination" },
    { id:"tww1", label:"War Within S1", xpac:"The War Within — Season 1", raid:"Nerub-ar Palace", img:"images/screenshots/aotc-tww.jpg" }
  ];
  function summarise(b){ var t=b.length, nH=b.filter(function(x){return x.cleared==="heroic";}).length, nA=b.filter(function(x){return x.cleared!=="none";}).length;
    if(nH===t) return {cls:"done",diff:"Heroic",count:t+"/"+t,pct:100};
    if(nA>0) return {cls:"prog",diff:"Normal",count:nA+"/"+t,pct:Math.round(nA/t*100)};
    return {cls:"pending",diff:"Not started",count:"0/"+t,pct:0}; }
  function renderMidnight(){ var h=document.getElementById("midnight-raids"),f=[];
    midnight.forEach(function(rd){ var s=summarise(rd.bosses),c=document.createElement("div"); c.className="raid-card reveal "+s.cls;
      c.innerHTML='<div class="raid-head"><span class="raid-name">'+rd.raid+'</span><span class="raid-count">'+s.count+'</span></div>'+
        '<div class="bar"><div class="bar-fill'+(s.cls==="prog"?" prog":"")+'"></div></div><div class="raid-diff">'+s.diff+'</div>';
      h.appendChild(c); f.push({el:c.querySelector(".bar-fill"),pct:s.pct}); });
    setTimeout(function(){ f.forEach(function(x){ x.el.style.width=x.pct+"%"; }); },120); }
  function renderPast(){ var chips=document.getElementById("tierChips"),detail=document.getElementById("tierDetail"),panel=document.getElementById("pastPanel");
    function adjust(){ if(panel.classList.contains("open")){ panel.style.maxHeight = panel.scrollHeight + "px"; } }
    function show(t){ detail.innerHTML='<div class="t-xpac">'+t.xpac+'</div><div class="t-raid">'+t.raid+'</div><span class="t-badge">Ahead of the Curve</span>'+(t.img?'<img class="t-shot" src="'+t.img+'" alt="'+t.raid+' kill" />':'');
      Array.prototype.forEach.call(chips.children,function(c){ c.classList.toggle("active",c.dataset.id===t.id); });
      var im=detail.querySelector(".t-shot"); if(im){ im.addEventListener("load",adjust); }
      adjust(); }
    pastTiers.forEach(function(t){ var c=document.createElement("button"); c.className="chip"; c.dataset.id=t.id; c.textContent=t.label; c.addEventListener("click",function(){show(t);}); chips.appendChild(c); });
    if(pastTiers.length) show(pastTiers[0]);
    return adjust; }
  (function(){ renderMidnight(); var adjustPast=renderPast();
    var btn=document.getElementById("pastBtn"),panel=document.getElementById("pastPanel");
    btn.addEventListener("click",function(){ var o=panel.classList.toggle("open"); btn.setAttribute("aria-expanded",o?"true":"false"); panel.style.maxHeight = o ? panel.scrollHeight + "px" : "0"; });
    window.addEventListener("resize", adjustPast); })();

  /* ---- click-to-zoom lightbox for the kill shots ---- */
  (function(){
    var lb=document.createElement("div"); lb.className="lightbox";
    lb.innerHTML='<button class="lb-close" aria-label="Close">&times;</button><div class="lb-stage"><img alt=""></div><div class="lb-hint">Click image to zoom \u00B7 scroll to zoom more \u00B7 Esc to close</div>';
    document.body.appendChild(lb);
    var img=lb.querySelector("img"), stage=lb.querySelector(".lb-stage"), closeBtn=lb.querySelector(".lb-close");
    var scale=1, DEF=2.4;
    function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
    function apply(){ img.style.transform="scale("+scale+")"; img.classList.toggle("zoomed",scale>1.02); }
    function setOrigin(e){ var r=img.getBoundingClientRect(), p=e.touches?e.touches[0]:e;
      img.style.transformOrigin=clamp(((p.clientX-r.left)/r.width)*100,0,100)+"% "+clamp(((p.clientY-r.top)/r.height)*100,0,100)+"%"; }
    function open(src,alt){ img.src=src; img.alt=alt||""; scale=1; img.style.transformOrigin="center center"; apply(); lb.classList.add("open"); document.body.style.overflow="hidden"; }
    function close(){ lb.classList.remove("open"); document.body.style.overflow=""; scale=1; apply(); }
    img.addEventListener("click",function(e){ e.stopPropagation(); if(scale>1.02){ scale=1; } else { scale=DEF; setOrigin(e); } apply(); });
    img.addEventListener("mousemove",function(e){ if(scale>1.02) setOrigin(e); });
    img.addEventListener("touchmove",function(e){ if(scale>1.02){ e.preventDefault(); setOrigin(e); } },{passive:false});
    img.addEventListener("wheel",function(e){ e.preventDefault(); if(scale<=1.02) setOrigin(e); scale=clamp(scale+(e.deltaY<0?0.35:-0.35),1,5); apply(); },{passive:false});
    closeBtn.addEventListener("click",close);
    lb.addEventListener("click",function(e){ if(e.target===lb||e.target===stage) close(); });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"||e.keyCode===27) close(); });
    document.addEventListener("click",function(e){ var t=e.target;
      if(t.tagName==="IMG" && (t.closest(".killshot")||t.classList.contains("t-shot"))){ open(t.getAttribute("src"), t.getAttribute("alt")); } });
  })();
