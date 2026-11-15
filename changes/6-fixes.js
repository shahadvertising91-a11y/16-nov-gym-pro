<style id="v19">
/* ---- smoother splash: no blur/drop-shadow filters, no layout-animating props ---- */
#splash .sp-t em{filter:none!important;will-change:transform,opacity}
#splash .sp-l{filter:none!important}
#splash .sp-s{letter-spacing:.32em;transform:translateY(8px);will-change:transform,opacity}
@keyframes spt{to{opacity:1;transform:none}}
@keyframes spl{to{opacity:1;transform:none}}
#splash .sp-g,#splash .sp-r{will-change:transform,opacity}
#splash::after{box-shadow:none!important;will-change:transform}
/* ---- smoother welcome screen ---- */
.obfx .rg{width:430px;height:430px;animation-name:obpulse2!important;will-change:transform,opacity}
@keyframes obpulse2{0%{transform:translate(-50%,-50%) scale(.28);opacity:.9}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}
.obfx svg{filter:none!important;will-change:transform;transform:translateZ(0)}
.obfx .bz.on{filter:none!important}
.obfx .scan{top:6%;height:90%;box-shadow:none;background:linear-gradient(90deg,transparent,var(--ac),transparent) 0 100%/100% 2px no-repeat;animation-name:obscan2!important;will-change:transform,opacity}
@keyframes obscan2{0%{transform:translateY(-100%);opacity:0}15%,85%{opacity:.9}100%{transform:translateY(0);opacity:0}}
/* ---- rest screen ---- */
.rsv{padding-top:6px;text-align:center}
.rsv-c{display:flex;flex-direction:column;align-items:center;gap:20px;margin-top:5vh}
.rsv-k{letter-spacing:.32em;font-weight:800;color:var(--mu);font-size:12px}
.rsv-r{position:relative;width:240px;height:240px}
.rsv-r svg{width:100%;height:100%;transform:rotate(-90deg)}
.rsv-r circle{fill:none;stroke-width:9;stroke-linecap:round}
.rsv-t{stroke:var(--s2)}.rsv-p{stroke:var(--ac);stroke-dasharray:326.7}
.rsv-r b{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--fd);font-size:84px;font-weight:800;padding-bottom:16px;font-variant-numeric:tabular-nums}
.rsv-r span{position:absolute;left:0;right:0;bottom:58px;font-size:11px;color:var(--mu);letter-spacing:.18em;text-transform:uppercase;font-weight:700}
.rsv-btns{display:flex;gap:12px;width:100%;max-width:340px}.rsv-btns .btn{flex:1;text-align:center;justify-content:center}
.rsv-n{width:100%;text-align:left;display:block}.rsv-n small{display:block;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mu);font-weight:700}
.rsv-n b{display:block;font-size:16px;margin-top:4px}.rsv-n em{font-style:normal;color:var(--mu);font-size:13px;font-weight:600}
.dmb2{display:flex;justify-content:center;gap:26px;margin-top:10px}.dmb2 .lnk{display:block}
/* ---- strength records ---- */
.srx{padding:6px 16px 14px}
.srr{padding:12px 0;border-top:1px solid var(--bd)}.srr:first-child{border-top:0}
.srh{display:flex;align-items:center;gap:10px;min-width:0}
.srk{flex:none;width:26px;height:26px;border-radius:9px;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:800;background:var(--s2);color:var(--mu)}
.srr:nth-child(-n+3) .srk{background:var(--ac);color:var(--on,#10130a)}
.srn{flex:1;min-width:0;font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.srv{flex:none;font-family:var(--fd);font-size:19px;font-weight:800}
.srv small{font-family:inherit;font-size:11px;color:var(--mu);margin-left:3px;font-weight:700}
.srt{height:7px;border-radius:4px;background:var(--s2);margin-top:9px;overflow:hidden}
.srt i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,var(--ac),var(--ac2));transform-origin:left;animation:gx .9s .1s both}
.srf{margin:8px 0 0;font-size:12px;color:var(--mu)}
</style>
<script>
/* ===== 6) fixes: live steps, Android back button, first-exercise demo, rest screen, smooth start ===== */
(function(){
  /* --- smooth start: on first launch the setup overlay covers the splash, so stop animating it --- */
  try{if(!S.ob){const s=document.getElementById("splash");if(s)s.remove()}}catch(e){}

  /* --- live steps on the steps screen / home tile (called on every native step event) --- */
  window.__liveSteps=function(){
    try{
      const k=TK(),h24=S.stH[k]||[],mh=Math.max(10,...h24),hb=document.querySelector(".stc .hb");
      if(hb)[...hb.children].forEach((el,i)=>{el.style.height=Math.max(3,(h24[i]||0)/mh*100)+"%"});
      const wb=document.querySelector(".stc .wb");
      if(wb){const g=S.sg||8000,vals=[...Array(7)].map((_,i)=>S.steps[dkey(new Date(Date.now()-(6-i)*864e5))]||0),mw=Math.max(g,...vals);
        [...wb.children].forEach((d,i)=>{const b=d.firstElementChild;if(b){b.style.height=Math.max(4,vals[i]/mw*70)+"px";b.classList.toggle("hit",vals[i]>=g)}})}
      const t=document.querySelector(".tg small");
      if(t&&/steps today/.test(t.textContent))t.textContent=t.textContent.replace(/[\d,.\s]+steps today/,stp().toLocaleString()+" steps today");
    }catch(e){}
  };
  /* when the app comes back to the front, pull the real count from the native service */
  document.addEventListener("visibilitychange",()=>{
    try{
      if(document.hidden||!window.NativeBar||!NativeBar.isNative()||!NativeBar.active||!NativeBar._on)return;
      const C=window.Capacitor,P=(C.Plugins&&C.Plugins.ForgeBar)||C.registerPlugin("ForgeBar");
      P.getSteps().then(r=>{if(r&&r.steps!=null)NativeBar._on({steps:r.steps})}).catch(()=>{});
    }catch(e){}
  });

  /* --- first exercise shows its demo too (same screen as the other exercises) --- */
  const _sw=window.startW;
  window.startW=function(wk){
    _sw.apply(this,arguments);
    const P=V.P;
    if(P&&S.dm!==0&&P.wk&&P.wk.ex.length&&V.view==="play"){P.demo=0;P.dt=20;render()}
  };

  /* --- rest = full screen with the same buttons (+15s / Skip), not a bar at the bottom --- */
  const _pv=playV;
  playV=function(){
    const P=V.P;
    if(P&&P.demo!=null){
      let h=_pv.apply(this,arguments);
      if(P.demo===0&&!P.log.length)h=h.replace("Up next · Exercise","First up · Exercise");
      h=h.replace('<button class="lnk" style="display:block;margin:10px auto 0" data-a="skip">Skip rest</button>',
        '<div class="dmb2"><button class="lnk" data-a="more">+15s</button><button class="lnk" data-a="skip">Skip rest</button></div>');
      return h;
    }
    if(P&&P.rest>0){
      const n=nextSet(),x=n?P.wk.ex[n[0]]:null,e=x?XK[x.k]:null,el=Math.floor((Date.now()-P.t0)/1000);
      P.rtot=Math.max(P.rtot||0,P.rest);
      return `<div class="rsv"><div class="ph"><button class="bb ib" data-a="back" aria-label="Back">${ico("back")}</button><div class="tt"><small>${P.wk.day?"Day "+P.wk.day+" · ":""}${P.wk.name}</small><b id="tm">${pad(el/60|0)}:${pad(el%60)}</b></div><button class="lnk" data-a="fin2">Finish</button></div>
      <div class="rsv-c"><small class="rsv-k">REST</small>
      <div class="rsv-r"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="rsv-t" cx="60" cy="60" r="52"/><circle id="rsvc" class="rsv-p" cx="60" cy="60" r="52" stroke-dashoffset="${(326.7*(1-P.rest/P.rtot)).toFixed(1)}"/></svg><b id="rest">${Math.ceil(P.rest)}</b><span>seconds</span></div>
      <div class="rsv-btns"><button class="btn gh" data-a="more">+15s</button><button class="btn" data-a="skip">Skip</button></div>
      ${e?`<div class="card rsv-n"><small>Up next</small><b>${e.n}</b><em>Set ${n[1]+1} of ${P.sets[n[0]].length} · ${x.t?x.r+" sec":x.r+" reps"}</em></div>`:""}
      </div></div>`;
    }
    return _pv.apply(this,arguments);
  };
  (function lp(){const P=V.P;
    if(V.view==="play"&&P&&P.rest>0&&P.demo==null){P.rtot=Math.max(P.rtot||0,P.rest);const c=document.getElementById("rsvc");if(c)c.setAttribute("stroke-dashoffset",(326.7*(1-P.rest/P.rtot)).toFixed(1))}
    else if(P&&!(P.rest>0))P.rtot=0;
    requestAnimationFrame(lp)})();


  /* --- back button: native MainActivity calls window.__hwBack(); it returns true when it went back one screen --- */
  const NAT=(()=>{try{return !!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())}catch(e){return false}})();
  const depth=()=>{
    if(!S.ob){const o=window.__forgeOB;return o&&o.idx?o.idx():0}
    return (V.pk?1:0)+(V.view?1:0)+(V.cbo?1:0)+(V.tab!=="home"?1:0);
  };
  function stepBack(){
    const ss=document.querySelector(".shsheet");if(ss){ss.click();if(ss.isConnected)ss.remove();return}
    if(!S.ob){
      const sh=document.querySelector(".obx .obsh");if(sh){sh.remove();return}
      const k=document.querySelector(".obx .obk");if(k)k.click();return}
    if(V.pk){V.pk=0;render();return}
    if(V.view){ACT.back();return}
    if(V.cbo){V.cbo=0;render();return}
    if(V.tab!=="home"){V.tab="home";window.scrollTo(0,0);render()}
  }
  window.__hwBack=function(){
    if(document.querySelector(".shsheet")||depth()>0){try{stepBack()}catch(e){}return true}
    return false;
  };
  if(!NAT){ /* plain browser / PWA: use the history stack */
    let hd=0,ign=0;
    const sync=()=>{const d=depth();
      if(d>hd){while(hd<d){hd++;try{history.pushState({fd:hd},"")}catch(e){}}}
      else if(d<hd){const n=hd-d;hd=d;ign++;try{history.go(-n)}catch(e){ign=0}}};
    window.addEventListener("popstate",()=>{if(ign){ign=0;return}hd=Math.max(0,hd-1);try{stepBack()}catch(e){}sync()});
    const _rr=render;render=function(){const r=_rr.apply(this,arguments);try{sync()}catch(e){}return r};
    setInterval(()=>{try{sync()}catch(e){}},200);
  }
})();
</script>
