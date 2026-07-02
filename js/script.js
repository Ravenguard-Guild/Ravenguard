/* ---- Raider.IO auto-tracking config ----
   region/realm/name identify the guild for the RIO API.
   Each raid below may carry a `rioKey` = Raider.IO's raid slug. When RIO has
   live data for that slug, it auto-fills the count / bar / difficulty; otherwise
   the manual `bosses` list is used as a fallback.

   Note: RIO aggregates the whole first Midnight tier (Voidspire + Dreamrift +
   March on Quel'Danas = 9 bosses) under a single key `tier-mn-1`, so those three
   raids can't be tracked individually — they stay manual. Keys verified live
   against the API on 2026-07-01. */
  var RIO = { region:"eu", realm:"tarren-mill", name:"Ravenguard" };

  var midnight = [
    { raid:"The Voidspire", bosses:[
      {name:"Imperator Averzian",cleared:"heroic"},{name:"Vorasius",cleared:"heroic"},
      {name:"Fallen-King Salhadaar",cleared:"heroic"},{name:"Vaelgor & Ezzorak",cleared:"heroic"},
      {name:"Lightblinded Vanguard",cleared:"heroic"},{name:"Crown of the Cosmos",cleared:"heroic"} ]},
    { raid:"The Dreamrift", bosses:[ {name:"Chimaerus, the Undreamt God",cleared:"heroic"} ]},
    { raid:"March on Quel'Danas", bosses:[ {name:"Belo'ren",cleared:"heroic"},{name:"L'ura, Midnight Falls",cleared:"heroic"} ]},
    { raid:"Sporefall", rioKey:"sporefall", bosses:[ {name:"Rotmire",cleared:"none"} ]},
    /* Next season's tier — RIO drives the count/bar automatically; the 8 boss
       entries below are placeholders for the manual fallback (names not shown on
       the card, so fill them in whenever the tier details are known). */
    { raid:"The Venomous Abyss", rioKey:"the-venomous-abyss", bosses:[
      {name:"Boss 1",cleared:"none"},{name:"Boss 2",cleared:"none"},
      {name:"Boss 3",cleared:"none"},{name:"Boss 4",cleared:"none"},
      {name:"Boss 5",cleared:"none"},{name:"Boss 6",cleared:"none"},
      {name:"Boss 7",cleared:"none"},{name:"Boss 8",cleared:"none"} ]}
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
  /* Build a summary from a Raider.IO raid_progression entry (aggregate counts). */
  function summariseRio(p){ var t=p.total_bosses||0; if(!t) return null;
    var m=p.mythic_bosses_killed||0, hi=Math.max(p.heroic_bosses_killed||0,m), any=Math.max(p.normal_bosses_killed||0,hi);
    var diff = m>0?"Mythic":(hi>0?"Heroic":"Normal");
    if(m===t) return {cls:"done",diff:"Mythic",count:t+"/"+t,pct:100};
    if(hi===t) return {cls:"done",diff:"Heroic",count:t+"/"+t,pct:100};
    if(any>0) return {cls:"prog",diff:diff,count:any+"/"+t,pct:Math.round(any/t*100)};
    return {cls:"pending",diff:"Not started",count:"0/"+t,pct:0}; }
  /* Prefer live RIO data for a raid when available; otherwise use the manual list. */
  function summariseFor(rd,rioMap){ if(rioMap && rd.rioKey && rioMap[rd.rioKey]){ var s=summariseRio(rioMap[rd.rioKey]); if(s) return s; }
    return summarise(rd.bosses); }
  function renderMidnight(rioMap){ var h=document.getElementById("midnight-raids"),f=[]; h.innerHTML="";
    midnight.forEach(function(rd){ var s=summariseFor(rd,rioMap),c=document.createElement("div"); c.className="raid-card reveal "+s.cls;
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
  /* Fetch live progression from Raider.IO (free, CORS-enabled). Falls back
     silently to the manual data on any error or missing tier. */
  function fetchRio(){
    var url="https://raider.io/api/v1/guilds/profile?region="+RIO.region+"&realm="+RIO.realm+"&name="+encodeURIComponent(RIO.name)+"&fields=raid_progression";
    return fetch(url).then(function(r){ return r.ok?r.json():null; })
      .then(function(d){ return d&&d.raid_progression?d.raid_progression:null; })
      .catch(function(){ return null; }); }

  (function(){ renderMidnight(); var adjustPast=renderPast();
    fetchRio().then(function(rioMap){ if(rioMap) renderMidnight(rioMap); });
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
