<script>
/* ===== ForgeBody: vector anatomy figure (front/back), zones selectable ===== */
const ForgeBody=(function(){
  /* zone paths for the LEFT half of the figure (x<100); the right half is mirrored */
  const F={ /* front */
    delt:["M72 80C60 79 49 85 45 98C43 108 44 118 48 126L62 119C66 109 70 97 75 89Z","shoulder"],
    pec:["M77 88L98 94L98 133C88 143 71 141 61 131C57 117 62 102 77 88Z","chest"],
    abs1:["M84 140L98 140L98 158L84 158Z","abs"],abs2:["M84 161L98 161L98 179L84 179Z","abs"],abs3:["M85 182L98 182L98 200L86 200Z","abs"],
    obl:["M75 146L82 142L83 202L73 208C69 190 69 163 75 146Z","abs"],
    bic:["M44 122C40 136 38 152 38 169L54 171C56 153 58 138 62 124Z","arm"],
    fore:["M37 174C33 192 30 212 28 231L41 235C46 215 52 193 54 174Z","arm"],
    quad:["M62 220L98 220L96 262C94 290 90 312 84 324L68 322C62 300 58 262 62 220Z","leg"],
    calf:["M68 331L84 331C87 353 85 381 79 405L72 405C66 381 64 353 68 331Z","leg"]
  };
  const Fn={ /* neutral parts */
    neck:"M90 54L110 54L111 70L120 80L100 86L80 80L89 70Z".replace("L120 80","L124 80"),
    hand:"M26 234C22 246 24 258 30 262C38 260 42 248 42 238Z",
    hip:"M84 216L116 216L112 234L88 234Z",
    knee:"M69 324L85 324L84 331L68 331Z",
    foot:"M71 407L84 407L89 425L63 425Z"
  };
  const B={ /* back */
    trap:["M100 58L100 112L76 100L66 84L86 74Z","back"],
    rdelt:["M72 80C60 79 49 85 45 98C43 108 44 118 48 126L62 119C66 109 70 97 75 89Z","shoulder"],
    lat:["M76 104L98 114L98 170L84 176C72 160 66 134 66 112Z","back"],
    low:["M86 176L98 172L98 214L84 214C82 200 82 188 86 176Z","back"],
    tri:["M44 122C40 136 38 152 38 169L54 171C56 153 58 138 62 124Z","arm"],
    fore:["M37 174C33 192 30 212 28 231L41 235C46 215 52 193 54 174Z","arm"],
    glute:["M62 216L98 216L98 258C84 268 66 262 60 244C58 232 59 224 62 216Z","butt"],
    ham:["M62 262C70 270 88 270 98 262L96 296C94 310 90 320 84 326L68 324C62 306 58 282 62 262Z","leg"],
    calf:["M68 331L84 331C87 353 85 381 79 405L72 405C66 381 64 353 68 331Z","leg"]
  };
  const lines={ /* subtle anatomy strokes (left half) */
    front:["M98 96L98 134","M64 118C74 126 88 130 98 128","M84 140L84 202","M98 140L98 214","M76 160C80 160 82 160 84 160","M76 182C80 182 82 182 84 182","M80 232L82 300","M70 232L72 306","M52 130L58 160","M44 190L40 226"],
    back:["M98 62L98 214","M70 90L90 110","M72 150C80 156 90 160 98 160","M62 238C76 248 90 246 98 240","M80 270L80 318","M44 130L50 162"]
  };
  const NEU="#2a303d",OFF="#3a4254",LN="#566075";
  function side(zones,neutral,view,sel,sexScale){
    let o="";
    for(const k in zones){const[d,g]=zones[k];const on=sel&&(sel.has(g)||sel.has("full"));
      o+=`<path class="bz${on?" on":""}" data-g="${g}" d="${d}" fill="${on?"url(#bzon)":OFF}"/>`}
    if(neutral)for(const k in neutral)o+=`<path d="${neutral[k]}" fill="${NEU}"/>`;
    o+=`<g stroke="${LN}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".55">${lines[view].map(d=>`<path d="${d}"/>`).join("")}</g>`;
    return o}
  /* sex: "m"|"f";  view: "front"|"back"|"both";  sel: Set of groups to highlight */
  function fig(view,sex,sel){
    const z=view==="front"?F:B, neu=view==="front"?Fn:{neck:"M90 54L110 54L112 66L124 76L100 82L76 76L88 66Z",hand:Fn.hand,foot:Fn.foot};
    const half=side(z,neu,view,sel);
    const f=sex==="f";
    const up=f?"translate(100 0) scale(.88 1) translate(-100 0)":"",lo=f?"translate(100 0) scale(1.07 1) translate(-100 0)":"";
    const head=`<ellipse cx="100" cy="32" rx="${f?16:17.5}" ry="22" fill="${NEU}"/>`+
      (f?`<path d="M82 30C80 8 120 8 118 30C116 18 106 14 100 14C94 14 84 18 82 30Z M82 28C74 44 76 70 84 84C80 66 82 46 86 34Z M118 28C126 44 124 70 116 84C120 66 118 46 114 34Z" fill="#171b24"/>`:
         `<path d="M82.5 28C80 8 120 8 117.5 28C115 18 106 15 100 15C94 15 85 18 82.5 28Z" fill="#171b24"/>`);
    const half2=`<g>${half}</g>`;
    const body=`<g transform="${up}"><g>${half2}</g><g transform="matrix(-1 0 0 1 200 0)">${half2}</g></g>`;
    return {head,body,f,lo}
  }
  function svg(view,sex,sel,opts){
    opts=opts||{};
    const mk=(v)=>{
      const z=v==="front"?F:B;
      const neu=v==="front"?Fn:{neck:"M90 54L110 54L112 66L124 76L100 82L76 76L88 66Z",hand:Fn.hand,foot:Fn.foot};
      const half=`<g>${side(z,neu,v,sel)}</g>`,f=sex==="f";
      const upT=f?"translate(100 0) scale(.88 1) translate(-100 0)":"";
      const loT=f?"translate(100 0) scale(1.06 1) translate(-100 0)":"";
      /* upper body (y<214) and legs (y>=214) get different transforms for a believable female silhouette */
      const clipU=`<clipPath id="cu${v}"><rect x="0" y="0" width="200" height="214"/></clipPath>`,clipL=`<clipPath id="cl${v}"><rect x="0" y="214" width="200" height="230"/></clipPath>`;
      const pair=`${half}<g transform="matrix(-1 0 0 1 200 0)">${half}</g>`;
      const head=`<ellipse cx="100" cy="32" rx="${f?16:17.5}" ry="22" fill="${NEU}"/>`+(v==="back"
        ?`<path d="M82 30C80 8 120 8 118 30C118 38 112 44 100 44C88 44 82 38 82 30Z" fill="#171b24"/>`
        :(f?`<path d="M82 30C80 8 120 8 118 30C116 18 106 14 100 14C94 14 84 18 82 30Z M82 28C74 44 76 66 84 80C80 64 82 46 86 34Z M118 28C126 44 124 66 116 80C120 64 118 46 114 34Z" fill="#171b24"/>`
            :`<path d="M82.5 28C80 8 120 8 117.5 28C115 18 106 15 100 15C94 15 85 18 82.5 28Z" fill="#171b24"/>`));
      return `<g>${clipU}${clipL}<g clip-path="url(#cu${v})"><g transform="${upT}">${pair}</g></g><g clip-path="url(#cl${v})"><g transform="${loT}">${pair}</g></g>${head}</g>`};
    const defs=`<defs><linearGradient id="bzon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${opts.ac||"#C8F13A"}"/><stop offset="1" stop-color="${opts.ac2||"#8FBF1A"}"/></linearGradient></defs>`;
    const st=`<style>.bz{stroke:#0c0e13;stroke-width:2.4;stroke-linejoin:round;transition:fill .25s}.bz.on{filter:drop-shadow(0 0 5px rgba(200,241,58,.45))}</style>`;
    if(view==="both")return `<svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Body map">${defs}${st}<g transform="translate(0 0)">${mk("front")}</g><g transform="translate(240 0)">${mk("back")}</g></svg>`;
    return `<svg viewBox="0 0 200 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Body">${defs}${st}${mk(view)}</svg>`}
  return{svg}
})();

/* ===== ForgeOB: full setup flow (replaces the old onboarding) ===== */
(function(){
if(window.__forgeOB)return;
const isNat=()=>{try{return !!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())}catch(e){return false}};
const buzz=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
const KG=2.20462262,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const A={name:"",sex:null,goal:null,focus:[],h:175,hu:"cm",age:25,w:70,tw:null,unit:"kg",level:null,rm:{lift:"bench",w:30,reps:5,skip:true},days:null,start:null,equip:[],place:null,chal:null};

/* ---------- styles ---------- */
const css=`
.obx{position:fixed;inset:0;z-index:3000;background:var(--bg,#07080B);color:var(--tx,#F4F5F8);overflow:hidden;font-family:Manrope,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-tap-highlight-color:transparent;user-select:none}
.obw{position:relative;height:100%;max-width:480px;margin:0 auto;display:flex;flex-direction:column}
.obh{display:flex;align-items:center;gap:14px;padding:calc(env(safe-area-inset-top,0px) + 14px) 18px 6px;min-height:34px}
.obk{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:var(--tx);flex:none;transition:.2s}.obk:active{background:var(--s2,#181B24);transform:scale(.92)}
.obk svg{width:22px;height:22px}.obk[hidden]{visibility:hidden;display:grid}
.obp{flex:1;height:6px;border-radius:6px;background:var(--s2,#181B24);overflow:hidden}.obp i{display:block;height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,var(--ac,#C8F13A),#9BD61F);transition:width .55s cubic-bezier(.22,1,.36,1)}
.obsp{width:38px;flex:none}
.obm{flex:1;min-height:0;position:relative;overflow:hidden}
.obs{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding:12px 22px 18px;display:flex;flex-direction:column;scrollbar-width:none}.obs::-webkit-scrollbar{display:none}
.obs.f{animation:obf .42s cubic-bezier(.22,1,.36,1) both}.obs.b{animation:obb .42s cubic-bezier(.22,1,.36,1) both}
@keyframes obf{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}@keyframes obb{from{opacity:0;transform:translateX(-34px)}to{opacity:1;transform:none}}
.obt{font-family:ForgeCard,Manrope,system-ui,sans-serif;font-weight:800;font-size:29px;line-height:1.12;letter-spacing:-.015em;text-align:center;margin:10px 0 8px}
.obsub{text-align:center;color:var(--mu,#8A90A2);font-size:14.5px;line-height:1.45;margin:0 8px 18px;font-weight:600}
.obf{padding:12px 22px calc(env(safe-area-inset-bottom,0px) + 18px);display:flex;flex-direction:column;gap:6px;align-items:stretch}
.obn{height:58px;border-radius:18px;background:linear-gradient(135deg,var(--ac,#C8F13A),#A6DD22);color:var(--on,#07080B);font-weight:800;font-size:17px;letter-spacing:.01em;box-shadow:0 14px 30px -12px rgba(200,241,58,.55);transition:transform .15s,opacity .25s,filter .25s;width:100%;display:block;text-align:center}
.obn:active{transform:scale(.975)}.obn:disabled{opacity:.3;box-shadow:none;filter:saturate(.4)}
.obl{width:100%;height:40px;color:var(--mu,#8A90A2);font-weight:700;font-size:14px}.obl:active{color:var(--tx)}.obl[hidden]{display:none}
.obo{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:16px 16px;margin-bottom:11px;border-radius:20px;background:var(--s1,#101218);border:1.5px solid var(--bd,#232734);position:relative;transition:transform .15s,border-color .2s,background .2s}
.obo:active{transform:scale(.985)}.obo b{display:block;font-size:16.5px;font-weight:800;letter-spacing:-.005em}.obo small{display:block;color:var(--mu,#8A90A2);font-size:13px;margin-top:3px;font-weight:600;line-height:1.35}
.obo.on{border-color:var(--ac,#C8F13A);background:linear-gradient(135deg,rgba(200,241,58,.13),rgba(200,241,58,.03))}
.obo .obck{margin-left:auto;width:26px;height:26px;border-radius:50%;border:2px solid var(--bd,#232734);flex:none;display:grid;place-items:center;transition:.2s}
.obo.on .obck{background:var(--ac,#C8F13A);border-color:var(--ac,#C8F13A)}.obo .obck svg{width:15px;height:15px;stroke:var(--on,#07080B);stroke-width:3.2;fill:none;opacity:0;transform:scale(.4);transition:.25s var(--spring,cubic-bezier(.34,1.56,.64,1))}.obo.on .obck svg{opacity:1;transform:none}
.obi{width:46px;height:46px;border-radius:14px;background:var(--s2,#181B24);display:grid;place-items:center;flex:none;color:var(--ac,#C8F13A)}.obi svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.obo.on .obi{background:var(--ac,#C8F13A);color:var(--on,#07080B)}
.obi.lv{width:56px}.obi.lv svg{width:36px;height:24px;stroke:none}.obth{width:58px;height:58px;border-radius:16px;flex:none;background:var(--art) center/cover no-repeat,var(--s2)}
.obseg{display:inline-flex;padding:4px;border-radius:999px;background:var(--s2,#181B24);margin:4px auto 6px;position:relative}
.obseg button,.obchip,.obstep button,.obl,.obsel{text-align:center}.obseg button{position:relative;z-index:1;min-width:84px;height:40px;border-radius:999px;font-weight:800;font-size:15px;color:var(--mu);transition:color .25s}.obseg button.on{color:var(--on,#07080B)}
.obseg i{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:999px;background:var(--ac,#C8F13A);transition:transform .3s cubic-bezier(.22,1,.36,1)}
.obchips{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:2px 0 6px}
.obchip{padding:12px 20px;border-radius:999px;background:var(--s2,#181B24);font-weight:800;font-size:15px;border:1.5px solid transparent;transition:.2s}.obchip:active{transform:scale(.95)}
.obchip.on{background:var(--ac,#C8F13A);color:var(--on,#07080B);box-shadow:0 8px 20px -8px rgba(200,241,58,.6)}
.obmap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:6px 0}.obmap svg{height:100%;max-height:360px;width:auto;max-width:100%}
.obmap .bz{cursor:pointer}
.obcard{border-radius:20px;background:var(--s1,#101218);border:1.5px solid var(--bd,#232734);padding:16px 18px}
.obnote{display:flex;gap:12px;align-items:flex-start;padding:15px 16px;border-radius:18px;background:var(--s1,#101218);border:1px solid var(--bd,#232734);margin-bottom:16px;color:var(--mu);font-size:14px;line-height:1.45;font-weight:600}
.obnote .obi{width:38px;height:38px;border-radius:12px}.obnote .obi svg{width:20px;height:20px}
/* gender */
.obg{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px;flex:1;min-height:0}
.obgc{position:relative;border-radius:26px;background:linear-gradient(180deg,var(--s1,#101218),var(--s2,#181B24));border:1.5px solid var(--bd,#232734);overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:0 8px 16px;transition:.25s;max-height:430px}
.obgc svg{width:86%;flex:1;min-height:0;margin-top:14px}.obgc b{font-family:ForgeCard,Manrope,sans-serif;font-size:24px;letter-spacing:-.01em;margin-top:10px}
.obgc:active{transform:scale(.98)}.obgc.on{border-color:var(--ac,#C8F13A);box-shadow:0 0 0 1px var(--ac,#C8F13A),0 18px 40px -18px rgba(200,241,58,.5)}
.obgc::before{content:"";position:absolute;left:50%;top:18%;width:150%;aspect-ratio:1;transform:translateX(-50%);background:radial-gradient(circle,rgba(200,241,58,.16),transparent 62%);opacity:0;transition:.4s}.obgc.on::before{opacity:1}
/* rulers */
.obru{position:relative;overflow:hidden}.obrs{position:absolute;inset:0;overflow:auto;scrollbar-width:none;overscroll-behavior:contain}.obrs::-webkit-scrollbar{display:none}.obri{position:relative}
.obrh .obrs{overflow-y:hidden}.obrh .obri{height:100%}.obrv .obri{width:100%}.obrv .obrs{overflow-x:hidden}
.obru .t{position:absolute;background:var(--mu,#8A90A2);opacity:.45;scroll-snap-align:center}
.obrh .t{bottom:14px;width:1.6px;height:22px;border-radius:2px}.obrh .t.m{height:34px;opacity:.6}.obrh .t.M{height:52px;opacity:.9}
.obrv .t{right:6px;height:1.6px;width:22px;border-radius:2px}.obrv .t.m{width:34px;opacity:.6}.obrv .t.M{width:52px;opacity:.9}
.obru em{position:absolute;font-style:normal;font-weight:700;font-size:15px;color:var(--mu,#8A90A2);font-variant-numeric:tabular-nums}
.obrh em{bottom:74px;transform:translateX(-50%)}.obrv em{right:68px;transform:translateY(-50%)}
.obrh{height:112px;scroll-snap-type:x proximity}.obrh .obrs{scroll-snap-type:x proximity}.obrv .obrs{scroll-snap-type:y proximity}
.obrh::after{content:"";position:absolute;left:50%;bottom:8px;width:3px;height:74px;margin-left:-1.5px;background:var(--ac,#C8F13A);border-radius:3px;box-shadow:0 0 12px rgba(200,241,58,.6);pointer-events:none}
.obnum{display:flex;align-items:baseline;justify-content:center;gap:8px;font-family:ForgeCard,Manrope,sans-serif;line-height:1;margin:6px 0 4px}
.obnum b{font-size:78px;letter-spacing:-.03em;font-weight:800;font-variant-numeric:tabular-nums}.obnum small{font-size:22px;color:var(--mu);font-weight:800}
.obbmi{align-self:center;display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;background:var(--s2);font-weight:800;font-size:13.5px;margin-top:6px}.obbmi i{width:9px;height:9px;border-radius:50%;background:currentColor}
/* height screen */
.obht{position:relative;flex:1;min-height:360px;margin:0 -22px}
.obht .obseg{position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:3}
.obht .obnum{position:absolute;left:0;right:96px;top:84px;margin:0;z-index:2}.obht .obnum b{font-size:84px}
.obht .obfg{position:absolute;left:0;right:96px;bottom:0;top:178px;display:flex;align-items:flex-end;justify-content:center;pointer-events:none}
.obht .obfg svg{height:100%;width:auto;transform-origin:50% 100%;transition:transform .12s linear;filter:drop-shadow(0 20px 28px rgba(0,0,0,.5))}
.obht .obvr{position:absolute;right:0;top:56px;bottom:0;width:100px}
.obht .obln{position:absolute;left:24px;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--ac,#C8F13A) 30%);z-index:2;pointer-events:none;box-shadow:0 0 12px rgba(200,241,58,.5)}
/* feedback */
.obfb{border-radius:20px;padding:16px 18px;background:var(--s1);border:1.5px solid var(--bd);margin-top:16px;animation:obf .4s both}
.obfb h4{margin:0 0 4px;font-size:13px;letter-spacing:.09em;font-weight:900;display:flex;align-items:center;gap:8px}.obfb h4 i{width:9px;height:9px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor}
.obfb strong{display:block;font-size:17px;font-weight:800;margin-bottom:8px}.obfb p{margin:3px 0;color:var(--mu);font-size:14px;font-weight:600;line-height:1.4;display:flex;gap:8px}.obfb p::before{content:"•";color:var(--tx)}
.obfb.ok h4{color:#4ADE80}.obfb.warn h4{color:#FBBF24}.obfb.bad h4{color:#F87171}.obfb.info h4{color:#60A5FA}
.obcur{align-self:center;display:inline-flex;gap:8px;align-items:center;color:var(--mu);font-weight:700;font-size:13.5px;padding:7px 14px;border-radius:999px;background:var(--s2);margin-bottom:2px}
/* 1RM */
.obrm{margin:2px 0 8px;display:grid;place-items:center;height:168px}.obrm svg{height:100%;width:auto;max-width:100%}
.obrow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;font-weight:700;font-size:16.5px}
.obsel{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;padding:8px 4px 8px 12px;border-radius:12px}.obsel:active{background:var(--s2)}.obsel svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.4}
.obstep{display:flex;align-items:center;gap:8px}.obstep button{width:38px;height:38px;border-radius:12px;background:var(--s2);font-size:22px;font-weight:700;display:grid;place-items:center;line-height:1}.obstep button:active{transform:scale(.9);background:var(--bd)}
.obstep input{width:76px;height:50px;border-radius:14px;background:var(--s2);text-align:center;font-weight:800;font-size:24px;color:var(--tx);border:1.5px solid transparent;outline:none;font-family:inherit;-moz-appearance:textfield}.obstep input:focus{border-color:var(--ac)}
.obstep input::-webkit-outer-spin-button,.obstep input::-webkit-inner-spin-button{-webkit-appearance:none}
.obstep u{text-decoration:none;color:var(--mu);font-weight:700;font-size:15px;min-width:34px}
.obhr{height:1px;background:var(--bd);margin:6px 0}.obrmv{display:flex;align-items:baseline;justify-content:space-between;padding:6px 0 0}.obrmv b{font-family:ForgeCard,Manrope,sans-serif;font-size:42px;letter-spacing:-.02em}.obrmv small{font-size:18px;color:var(--mu);font-weight:800;margin-left:4px}.obrmv span{font-weight:800;font-size:19px}.obrmv span small{display:block;font-size:13px;margin:2px 0 0;font-weight:700}
/* days */
.obgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.obgrid.d7{grid-template-columns:repeat(4,1fr);gap:8px}
.obbox{padding:20px 16px;border-radius:18px;background:var(--s1);border:1.5px solid var(--bd);font-weight:800;font-size:16px;text-align:left;transition:.2s;position:relative}.obbox:active{transform:scale(.97)}.obbox.on{border-color:var(--ac);background:linear-gradient(135deg,rgba(200,241,58,.14),rgba(200,241,58,.03))}
.obbox small{display:block;color:var(--mu);font-size:12px;font-weight:700;margin-top:2px}.obbox .rec{position:absolute;top:-9px;right:10px;font-size:10px;letter-spacing:.08em;font-weight:900;background:var(--ac);color:var(--on);padding:3px 8px;border-radius:99px}
.obgrid.d7 .obbox{padding:14px 4px;text-align:center;font-size:14px}
.obh3{margin:20px 0 12px;text-align:center;color:var(--mu);font-size:15px;font-weight:700}
/* sheet */
.obsh{position:absolute;inset:0;z-index:20;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;animation:obfd .25s both}@keyframes obfd{from{opacity:0}to{opacity:1}}
.obsh>div{width:100%;background:var(--s1);border-radius:26px 26px 0 0;padding:18px 18px calc(env(safe-area-inset-bottom,0px) + 18px);border-top:1px solid var(--bd);animation:obup .35s cubic-bezier(.22,1,.36,1) both}@keyframes obup{from{transform:translateY(40px)}to{transform:none}}
.obsh h5{margin:0 0 12px;font-size:17px;text-align:center}.obsh textarea{width:100%;height:150px;border-radius:14px;background:var(--s2);color:var(--tx);border:1.5px solid var(--bd);padding:12px;font-size:13px;outline:none;resize:none;font-family:ui-monospace,monospace;user-select:text}
/* welcome */
.obwel{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
.obfx{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 34px);bottom:49%;display:flex;justify-content:center;align-items:flex-end;overflow:hidden}
.obfx::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 62% 60% at 50% 46%,rgba(200,241,58,.22),transparent 70%),linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px) 0 0/34px 34px,linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px) 0 0/34px 34px;-webkit-mask-image:radial-gradient(ellipse 80% 75% at 50% 50%,#000 30%,transparent 78%);mask-image:radial-gradient(ellipse 80% 75% at 50% 50%,#000 30%,transparent 78%)}
.obfx .rg{position:absolute;left:50%;top:48%;border-radius:50%;border:1.5px solid rgba(200,241,58,.28);transform:translate(-50%,-50%);animation:obpulse 3.6s ease-out infinite}.obfx .rg.b{animation-delay:1.8s}
@keyframes obpulse{0%{width:120px;height:120px;opacity:.9}100%{width:430px;height:430px;opacity:0}}
.obfx svg{position:relative;height:100%;width:auto;max-height:400px;filter:drop-shadow(0 24px 40px rgba(0,0,0,.6));animation:obfl 6s ease-in-out infinite}@keyframes obfl{50%{transform:translateY(-8px)}}
.obfx .scan{position:absolute;left:18%;right:18%;height:2px;background:linear-gradient(90deg,transparent,var(--ac),transparent);box-shadow:0 0 16px var(--ac);animation:obscan 3.2s ease-in-out infinite}@keyframes obscan{0%{top:6%;opacity:0}15%,85%{opacity:.9}100%{top:96%;opacity:0}}
.obshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,8,11,0) 40%,rgba(7,8,11,.82) 64%,#07080B 84%);pointer-events:none}
.obwc{position:relative;padding:0 24px calc(env(safe-area-inset-bottom,0px) + 22px);display:flex;flex-direction:column;gap:14px}
.obwc>*{animation:obup2 .8s cubic-bezier(.22,1,.36,1) both}.obwc>*:nth-child(2){animation-delay:.08s}.obwc>*:nth-child(3){animation-delay:.16s}.obwc>*:nth-child(4){animation-delay:.24s}.obwc>*:nth-child(5){animation-delay:.32s}@keyframes obup2{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.oblogo{display:flex;align-items:center;gap:10px;font-family:ForgeCard,Manrope,sans-serif;font-size:20px;letter-spacing:.14em;font-weight:800}.oblogo svg{width:34px;height:34px}
.obwc h1{margin:2px 0 0;font-family:ForgeCard,Manrope,sans-serif;font-weight:800;font-size:46px;line-height:.98;letter-spacing:-.025em}.obwc h1 span{color:var(--ac,#C8F13A)}
.obwc p{margin:0;color:#c3c7d2;font-size:15px;line-height:1.45;font-weight:600;max-width:330px}
.obre{display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--mu);font-size:13.5px;font-weight:600;margin-top:4px}.obre button{color:var(--tx);font-weight:800;font-size:15px;height:36px}
/* coach */
.obcoach{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding-bottom:30px}
.obav{width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#2d3340,#12151c);border:2px solid var(--bd);display:grid;place-items:center;box-shadow:0 20px 40px -18px rgba(200,241,58,.4)}.obav svg{width:54px;height:54px}
.obring{position:relative;width:236px;height:236px}.obring svg{width:100%;height:100%;transform:rotate(-90deg)}.obring circle{fill:none;stroke-width:14;stroke-linecap:round}
.obring b{position:absolute;inset:0;display:grid;place-items:center;font-family:ForgeCard,Manrope,sans-serif;font-size:58px;letter-spacing:-.02em}
.obph{min-height:48px;text-align:center;color:var(--mu);font-weight:700;font-size:16px;padding:0 20px;line-height:1.4}.obph b{color:var(--ac)}
/* plan */
.obplanh{display:flex;align-items:center;gap:14px;margin:6px 0 14px}.obplanh h2{margin:0;flex:1;font-family:ForgeCard,Manrope,sans-serif;font-weight:800;font-size:30px;line-height:1.08;letter-spacing:-.015em}.obplanh h2 span{color:var(--ac)}.obplanh .obav{width:68px;height:68px}.obplanh .obav svg{width:36px;height:36px}
.obchart{padding:16px 16px 12px;margin-bottom:14px}.obchart h6{margin:0 0 6px;font-size:14px;font-weight:700;color:var(--mu)}.obchart svg{width:100%;height:auto;display:block;overflow:visible}
.obchart .ln{stroke-dasharray:420;stroke-dashoffset:420;animation:obdraw 1.6s .2s cubic-bezier(.22,1,.36,1) forwards}@keyframes obdraw{to{stroke-dashoffset:0}}
.obchart .ar{opacity:0;animation:obfd 1s .9s forwards}.obchart .mk{opacity:0;animation:obfd .5s 1.3s forwards}
.obsum{display:flex;gap:6px;padding:8px 16px 8px 18px}.obsum ul{list-style:none;margin:0;padding:0;flex:1}.obsum li{display:flex;gap:13px;align-items:center;padding:11px 0}.obsum li .obi{width:40px;height:40px;border-radius:12px}.obsum li small{display:block;color:var(--mu);font-size:12.5px;font-weight:700}.obsum li b{display:block;font-size:16.5px;font-weight:800;margin-top:1px;line-height:1.15}
.obsum .mp{width:112px;flex:none;display:flex;align-items:center}.obsum .mp svg{width:100%;height:auto;max-height:230px}
.obtip{display:flex;gap:12px;align-items:center;padding:13px 16px;border-radius:16px;background:rgba(200,241,58,.08);border:1px solid rgba(200,241,58,.25);margin:12px 0 0;font-size:13.5px;font-weight:700;line-height:1.4}
`;
const st=document.createElement("style");st.id="obcss";st.textContent=css;document.head.appendChild(st);

/* ---------- icons ---------- */
const I=(d,extra)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}${extra||""}</svg>`;
const IC={
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 chk:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 chev:'<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></svg>',
 bolt1:I('<path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="currentColor" stroke="none"/><path d="M15 3L11 9M14 12l-3 5" stroke="none"/>'),
 spark:I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'),
 goal:I('<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>'),
 flag:I('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
 target:I('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
 cal:I('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
 barbell:I('<path d="M2.5 9.5v5M5.5 7v10M18.5 7v10M21.5 9.5v5M5.5 12h13"/>'),
 dumbbell:I('<path d="M4.5 9v6M7.5 6.5v11M16.5 6.5v11M19.5 9v6M7.5 12h9"/>'),
 kettle:I('<path d="M8.5 8.5C8.5 3.5 15.5 3.5 15.5 8.5"/><path d="M7.5 20.5a6.5 6.5 0 1 1 9 0z"/>'),
 machine:I('<path d="M4 21h16M7 21V10a5 5 0 0 1 10 0v11M12 5v5M8 14h8"/>'),
 all:I('<path d="M4 6.5l2 2 3.5-3.5M4 14l2 2 3.5-3.5M13 7.5h7M13 15.5h7"/>'),
 none:I('<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>'),
 coach:'<svg viewBox="0 0 48 48"><path d="M5 5h22L5 27z" fill="#C8F13A"/><path d="M43 43H21l22-22z" fill="#C8F13A"/></svg>',
 pin:I('<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
 large:I('<path d="M3 21V8l9-5 9 5v13M3 21h18M8 21v-6h8v6M7 11h2M11 11h2M15 11h2"/>'),
 small:I('<path d="M4 21V9l8-5 8 5v12M4 21h16M9 21v-7h6v7"/>'),
 garage:I('<path d="M3 21V9l9-5 9 5v12M7 21v-8h10v8M7 15h10M7 18h10"/>'),
 home:I('<path d="M3 11l9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6"/>'),
 motivation:I('<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-3 2-4 5-4 7-1-1-2-2-2-4-2 2-4 4-4 7a7 7 0 0 0 7 7z"/>'),
 guidance:I('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
 bored:I('<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/>'),
 flame:I('<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-3 2-4 5-4 7-1-1-2-2-2-4-2 2-4 4-4 7a7 7 0 0 0 7 7z"/>')
};
const LOGOMARK='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 3h18L3 19z" fill="#C8F13A"/><path d="M29 29H11l18-16z" fill="#C8F13A"/></svg>';

/* ---------- rulers ---------- */
function ruler(host,o){
  const horiz=o.orient==="h",step=o.step||1,T=o.tick||12,min=o.min,max=o.max,n=Math.round((max-min)/step);
  host.classList.add("obru",horiz?"obrh":"obrv");host.innerHTML="";
  const sc=document.createElement("div");sc.className="obrs";const inn=document.createElement("div");inn.className="obri";sc.appendChild(inn);host.appendChild(sc);
  const size=horiz?host.clientWidth:host.clientHeight,off=size*(o.anchor==null?.5:o.anchor);
  inn.style[horiz?"width":"height"]=(n*T+size)+"px";
  const idxOf=v=>horiz?(v-min)/step:(max-v)/step,valOf=i=>horiz?min+i*step:max-i*step;
  let h="";
  for(let i=0;i<=n;i++){const v=valOf(i),pos=off+i*T,mj=(Math.round(v/step)%(o.major||10))===0,md=(Math.round(v/step)%(o.mid||5))===0;
    h+=`<i class="t${mj?" M":md?" m":""}" style="${horiz?"left":"top"}:${pos}px"></i>`;
    if(mj)h+=`<em style="${horiz?"left":"top"}:${pos}px">${esc(o.label?o.label(v):v)}</em>`}
  inn.innerHTML=h;
  let last=null,raf=0;
  const read=()=>{raf=0;const s=horiz?sc.scrollLeft:sc.scrollTop,i=cl(Math.round(s/T),0,n),v=valOf(i);if(v!==last){last=v;o.onChange&&o.onChange(v);buzz(3)}};
  sc.addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(read)},{passive:true});
  const set=v=>{last=v;sc[horiz?"scrollLeft":"scrollTop"]=cl(idxOf(v),0,n)*T};
  requestAnimationFrame(()=>{set(o.value);requestAnimationFrame(()=>set(o.value))});
  return{set}
}

/* ---------- helpers ---------- */
const el=(h)=>{const d=document.createElement("div");d.innerHTML=h.trim();return d.firstElementChild};
const lbl=(w)=>A.unit==="kg"?w:w*KG;
const fmtW=(kg)=>A.unit==="kg"?Math.round(kg):Math.round(kg*KG);
const ft=(cm)=>{const t=Math.round(cm/2.54);return`${Math.floor(t/12)}′ ${t%12}″`};
const GOALS={strength:["Get Stronger","Lift heavier and build raw power"],muscle:["Build Muscle Mass","Size and shape with progressive volume"],lean:["Get Lean & Defined","Cut fat while keeping your muscle"],weight:["Reduce Bodyweight","Burn fat and drop the weight"],health:["Improve Health & Wellness","Move better and feel better every day"],sport:["Boost Sports Performance","Speed, power and endurance"]};
const GPLAN={strength:"strength",muscle:"muscle-building",lean:"lean & defined",weight:"fat-loss",health:"healthy-living",sport:"sports-performance"};
const FOCUS=[["back","Back"],["shoulder","Shoulder"],["arm","Arm"],["chest","Chest"],["abs","Abs"],["butt","Butt"],["leg","Leg"],["full","Full Body"]];
const LEVELS=[["Beginner","Less than 6 months of experience",1],["Intermediate","6 months to 2 years of experience",2],["Advanced","More than 2 years of experience",3]];
const EQUIP=[["all","All Equipment","bolt1"],["barbell","Barbells","barbell"],["dumbbell","Dumbbells","dumbbell"],["kettlebell","Kettlebells","kettle"],["machine","Weight Machines","machine"],["none","None of the Above","none"]];
const PLACES=[["large","Large Gym","A large facility with extensive equipment"],["small","Small Gym","A small facility with limited equipment"],["garage","Garage Gym","A tailored setup with weightlifting equipment"],["home","At Home","A personal setup with portable equipment"]];
const CHAL=[["motivation","Struggle with staying motivated"],["guidance","Lack clear workout guidance"],["bored","Get bored with workouts easily"]];
const DAYN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const LIFTS={bench:"Bench Press",squat:"Back Squat",deadlift:"Deadlift",ohp:"Overhead Press"};
const body=(view,set)=>ForgeBody.svg(view,A.sex==="f"?"f":"m",set||new Set());

/* lift pictograms (accent strokes) */
const LIFTSVG={
 bench:'<svg viewBox="0 0 260 170"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="46" y="112" width="150" height="14" rx="7" fill="#2a303d" stroke="none"/><path d="M66 126v28M178 126v28M30 154h200" stroke="#3a4254" stroke-width="6"/><circle cx="56" cy="98" r="11" stroke="#C8F13A" stroke-width="7"/><path d="M70 106h66" stroke="#C8F13A" stroke-width="16"/><path d="M136 106l34-8 6 36" stroke="#C8F13A" stroke-width="12"/><path d="M96 98V52" stroke="#C8F13A" stroke-width="9"/><path d="M52 50h86" stroke="#e8ebf2" stroke-width="7"/><path d="M52 34v32M62 28v44M128 28v44M138 34v32" stroke="#e8ebf2" stroke-width="9"/></g></svg>',
 squat:'<svg viewBox="0 0 260 170"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M30 156h200" stroke="#3a4254" stroke-width="6"/><circle cx="128" cy="44" r="12" stroke="#C8F13A" stroke-width="8"/><path d="M128 60L124 98" stroke="#C8F13A" stroke-width="18"/><path d="M124 98L158 112L150 150" stroke="#C8F13A" stroke-width="14"/><path d="M124 98L94 116L104 150" stroke="#C8F13A" stroke-width="14"/><path d="M128 66L108 84" stroke="#C8F13A" stroke-width="9"/><path d="M40 62h176" stroke="#e8ebf2" stroke-width="7"/><path d="M40 40v44M52 32v60M204 32v60M216 40v44" stroke="#e8ebf2" stroke-width="9"/></g></svg>',
 deadlift:'<svg viewBox="0 0 260 170"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M30 156h200" stroke="#3a4254" stroke-width="6"/><circle cx="82" cy="64" r="12" stroke="#C8F13A" stroke-width="8"/><path d="M96 74L150 100" stroke="#C8F13A" stroke-width="18"/><path d="M150 100L156 128L150 150" stroke="#C8F13A" stroke-width="14"/><path d="M150 100L126 124L134 150" stroke="#C8F13A" stroke-width="14"/><path d="M104 82L106 134" stroke="#C8F13A" stroke-width="9"/><path d="M36 138h140" stroke="#e8ebf2" stroke-width="7"/><circle cx="52" cy="138" r="18" stroke="#e8ebf2" stroke-width="8"/><circle cx="160" cy="138" r="18" stroke="#e8ebf2" stroke-width="8"/></g></svg>',
 ohp:'<svg viewBox="0 0 260 170"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M30 156h200" stroke="#3a4254" stroke-width="6"/><circle cx="130" cy="64" r="12" stroke="#C8F13A" stroke-width="8"/><path d="M130 80L130 112" stroke="#C8F13A" stroke-width="18"/><path d="M130 112L144 152M130 112L116 152" stroke="#C8F13A" stroke-width="14"/><path d="M130 88L104 66L100 38M130 88L156 66L160 38" stroke="#C8F13A" stroke-width="9"/><path d="M44 34h172" stroke="#e8ebf2" stroke-width="7"/><path d="M44 14v40M56 6v56M204 6v56M216 14v40" stroke="#e8ebf2" stroke-width="9"/></g></svg>'
};

/* ---------- engine ---------- */
let root,hostM,bk,nx,lk,bar,idx=0,dir="f",tm=0,stack=[];
const Q=["name","sex","goal","focus","height","age","weight","target","level","days","equip","place","chal"];
const STEPS={};
const order=["welcome",...Q,"coach","plan"];

function open(){
  if(root)return;
  A.name=(window.S&&S.name)||A.name;
  root=el(`<div class="obx" id="obx"><div class="obw"><header class="obh"><button class="obk" aria-label="Back">${IC.back}</button><div class="obp"><i></i></div><span class="obsp"></span></header><main class="obm"></main><footer class="obf"><button class="obn" disabled>Next</button><button class="obl" hidden></button></footer></div></div>`);
  document.body.appendChild(root);
  hostM=root.querySelector(".obm");bk=root.querySelector(".obk");nx=root.querySelector(".obn");lk=root.querySelector(".obl");bar=root.querySelector(".obp i");
  bk.addEventListener("click",()=>back());nx.addEventListener("click",()=>{const s=STEPS[order[idx]];if(!nx.disabled)(s.onNext?s.onNext():go(1))});
  lk.addEventListener("click",()=>{const s=STEPS[order[idx]];s.link&&s.link.fn()});
  idx=0;stack=[];show(0,"f");
}
function close(){if(!root)return;clearInterval(tm);root.remove();root=null}
function setOk(v){if(nx)nx.disabled=!v}
function go(d){const n=cl(idx+d,0,order.length-1);if(n===idx)return;if(d>0)stack.push(idx);idx=n;show(idx,d>0?"f":"b");buzz(8)}
function back(){if(idx<=0)return;const p=stack.length?stack.pop():idx-1;idx=p;show(idx,"b")}
function show(i,d){
  clearInterval(tm);const id=order[i],s=STEPS[id],qi=Q.indexOf(id);
  const sec=document.createElement("section");sec.className="obs "+d;hostM.innerHTML="";hostM.appendChild(sec);
  const full=s.full;root.querySelector(".obh").style.display=full||qi<0?"none":"";root.querySelector(".obf").style.display=full?"none":"";
  bk.hidden=i<=1;bar.style.width=(qi<0?100:((qi+1)/Q.length*100))+"%";
  nx.textContent=s.btn||"Next";nx.style.display=s.noNext?"none":"";nx.disabled=true;lk.hidden=!s.link;if(s.link)lk.textContent=s.link.t;
  s.render(sec);if(s.ok)setOk(s.ok());
}
const card=(items,o)=>items.map(it=>`<button class="obo" data-k="${it[0]}">${o.pre?o.pre(it):""}<span><b>${esc(it[1])}</b>${it[2]&&!o.noDesc?`<small>${esc(it[2])}</small>`:""}</span><i class="obck">${IC.chk}</i></button>`).join("");
function bindOpts(sec,get,set,multi,after){
  const paint=()=>sec.querySelectorAll("[data-k]").forEach(b=>b.classList.toggle("on",multi?get().includes(b.dataset.k):get()===b.dataset.k));
  sec.addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(!b)return;set(b.dataset.k);paint();buzz(10);after&&after(b.dataset.k)});paint()}

/* ---------- screens ---------- */
STEPS.welcome={full:1,render(sec){
  sec.style.padding="0";sec.innerHTML=`<div class="obwel"><div class="obfx"><i class="rg"></i><i class="rg b"></i><div class="scan"></div><div class="obfig0"></div></div><div class="obshade"></div>
  <div class="obwc"><div class="oblogo">${LOGOMARK}<span>FORGE</span></div><h1>WORKOUT<br>PLANNER<br><span>&amp; GYM LOG</span></h1><p>A plan built around your body, your goal and your equipment. Track every set, see every win.</p><button class="obn" data-go>Start</button><div class="obre"><span>Already have a backup?</span><button data-re>Restore it ›</button></div></div></div>`;
  const fig=sec.querySelector(".obfig0");fig.style.cssText="display:contents";fig.innerHTML=ForgeBody.svg("front","m",new Set());
  const svg=fig.querySelector("svg"),seq=[["chest"],["shoulder","arm"],["abs"],["leg"],["full"]];let k=0;
  const lit=g=>svg.querySelectorAll(".bz").forEach(p=>{const on=g.includes(p.dataset.g)||g.includes("full");p.setAttribute("fill",on?"url(#bzon)":"#3a4254");p.classList.toggle("on",on)});
  lit(seq[0]);tm=setInterval(()=>{k=(k+1)%seq.length;lit(seq[k])},1100);
  sec.querySelector("[data-go]").onclick=()=>{buzz(12);go(1)};
  sec.querySelector("[data-re]").onclick=()=>{clearInterval(tm);const sh=el(`<div class="obsh"><div><h5>Restore your backup</h5><textarea id="bk" placeholder="Paste your backup text here"></textarea><button class="obn" style="margin-top:12px" data-do>Restore</button><button class="obl" style="width:100%" data-x>Cancel</button></div></div>`);root.querySelector(".obm").appendChild(sh);
    sh.querySelector("[data-x]").onclick=()=>sh.remove();sh.querySelector("[data-do]").onclick=()=>{try{ACT.imp();if(S.ob){window.__forgeOBdone=1;close()}}catch(e){}}}
}};
STEPS.name={render(sec){
  sec.innerHTML=`<div class="obavn" style="align-self:center;width:92px;height:92px;border-radius:50%;margin:14px 0 4px;display:grid;place-items:center;background:linear-gradient(135deg,var(--ac),#8FD21A);color:var(--on);font-family:ForgeCard,Manrope,sans-serif;font-size:44px;box-shadow:0 18px 40px -16px rgba(200,241,58,.6)"><span id="obin">${esc((A.name.trim()[0]||"?").toUpperCase())}</span></div><h2 class="obt">What should we call you?</h2><p class="obsub">We'll use your name to personalise your plan.</p>
  <input id="obnm" maxlength="24" autocomplete="off" placeholder="Your name" value="${esc(A.name)}" style="height:68px;border-radius:20px;background:var(--s1);border:1.5px solid var(--bd);color:var(--tx);font-size:24px;font-weight:800;padding:0 20px;text-align:center;outline:none;font-family:inherit;user-select:text;width:100%">`;
  const i=sec.querySelector("input");i.oninput=()=>{A.name=i.value;setOk(i.value.trim().length>0);const n=sec.querySelector('#obin');if(n)n.textContent=(i.value.trim()[0]||'?').toUpperCase()};i.onfocus=()=>i.style.borderColor="var(--ac)";i.onblur=()=>i.style.borderColor="";
  i.onkeydown=e=>{if(e.key==="Enter"&&A.name.trim()){i.blur();go(1)}};setTimeout(()=>{try{i.focus()}catch(e){}},520);
},ok:()=>A.name.trim().length>0};
STEPS.sex={render(sec){
  sec.innerHTML=`<h2 class="obt">What's your gender?</h2><div class="obnote"><span class="obi">${IC.spark}</span><span>Knowing your gender helps us tailor the intensity to different metabolic rates.</span></div>
  <div class="obg"><button class="obgc" data-k="m">${ForgeBody.svg("front","m",new Set(A.sex==="m"?["full"]:[]))}<b>Male</b></button><button class="obgc" data-k="f">${ForgeBody.svg("front","f",new Set(A.sex==="f"?["full"]:[]))}<b>Female</b></button></div>`;
  const paint=()=>sec.querySelectorAll(".obgc").forEach(b=>{b.classList.toggle("on",A.sex===b.dataset.k);b.querySelector("svg").outerHTML=ForgeBody.svg("front",b.dataset.k,new Set(A.sex===b.dataset.k?["full"]:[]))});
  sec.addEventListener("click",e=>{const b=e.target.closest(".obgc");if(!b)return;A.sex=b.dataset.k;paint();buzz(12);setTimeout(()=>go(1),320)});paint();
},link:{t:"Prefer not to say",fn(){A.sex="m";go(1)}},noNext:1};
STEPS.goal={render(sec){
  sec.innerHTML=`<h2 class="obt">What's your main goal?</h2><p class="obsub">We'll build your whole plan around it.</p>`+card(Object.keys(GOALS).map(k=>[k,GOALS[k][0],GOALS[k][1]]),{pre:it=>`<span class="obth art" data-v="${it[0]}"></span>`});
  bindOpts(sec,()=>A.goal,k=>{A.goal=k},false,()=>setOk(true));
},ok:()=>!!A.goal};
STEPS.focus={render(sec){
  sec.style.paddingBottom="6px";
  sec.innerHTML=`<h2 class="obt">Which areas do you want to focus on?</h2><div class="obchips">${FOCUS.map(f=>`<button class="obchip" data-k="${f[0]}">${f[1]}</button>`).join("")}</div><div class="obmap"></div>`;
  const map=sec.querySelector(".obmap"),paint=()=>{sec.querySelectorAll(".obchip").forEach(b=>b.classList.toggle("on",A.focus.includes(b.dataset.k)));map.innerHTML=body("both",new Set(A.focus));setOk(A.focus.length>0)};
  const tog=k=>{if(k==="full")A.focus=A.focus.includes("full")?[]:["full"];else{A.focus=A.focus.filter(x=>x!=="full");A.focus=A.focus.includes(k)?A.focus.filter(x=>x!==k):[...A.focus,k]}paint();buzz(10)};
  sec.addEventListener("click",e=>{const c=e.target.closest(".obchip");if(c)return tog(c.dataset.k);const z=e.target.closest(".bz");if(z&&z.dataset.g)tog(z.dataset.g)});paint();
},ok:()=>A.focus.length>0};
STEPS.height={render(sec){
  sec.style.padding="0 22px";
  const cm=A.hu==="cm";
  sec.innerHTML=`<h2 class="obt" style="margin-bottom:0">What's your height?</h2><div class="obht"><div class="obseg" data-seg><i></i><button data-u="cm">cm</button><button data-u="ft">ft</button></div><div class="obnum"><b id="obv"></b><small id="obu"></small></div><div class="obfg"></div><div class="obln"></div><div class="obvr"></div></div>`;
  const ht=sec.querySelector(".obht"),vr=sec.querySelector(".obvr"),ln=sec.querySelector(".obln"),fg=sec.querySelector(".obfg"),nb=sec.querySelector("#obv"),nu=sec.querySelector("#obu"),seg=sec.querySelector("[data-seg]");
  fg.innerHTML=body("front",new Set(["full"]));
  let R;const scaleFig=()=>{fg.firstElementChild.style.transform=`scale(${cl(.66+(A.h-140)/80*.34,.62,1.02)})`};
  const upd=()=>{const f=A.hu==="ft";nb.textContent=f?ft(A.h):Math.round(A.h);nu.textContent=f?"":"cm";scaleFig()};
  const build=()=>{const f=A.hu==="ft";seg.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.u===A.hu));seg.firstElementChild.style.transform=f?"translateX(100%)":"none";
    const anchor=.3;ln.style.top=(56+vr.clientHeight*anchor)+"px";
    R=f?ruler(vr,{orient:"v",min:48,max:90,step:1,tick:16,major:12,mid:6,anchor,value:Math.round(A.h/2.54),label:v=>Math.floor(v/12)+"′",onChange:v=>{A.h=v*2.54;upd()}})
       :ruler(vr,{orient:"v",min:120,max:220,step:1,tick:13,major:10,mid:5,anchor,value:Math.round(A.h),onChange:v=>{A.h=v;upd()}});upd()};
  seg.onclick=e=>{const b=e.target.closest("button");if(!b||b.dataset.u===A.hu)return;A.hu=b.dataset.u;buzz(10);build()};
  requestAnimationFrame(build);setOk(true);
},ok:()=>true};
STEPS.age={render(sec){
  sec.innerHTML=`<h2 class="obt">How old are you?</h2><p class="obsub">Age helps us set recovery time and calorie targets.</p><div style="flex:1"></div><div class="obnum"><b id="obv">${A.age}</b><small>years</small></div><div class="obruw" style="margin:20px -22px 0"><div class="obrr"></div></div><div style="flex:1.2"></div>`;
  const nb=sec.querySelector("#obv");ruler(sec.querySelector(".obrr"),{orient:"h",min:14,max:90,step:1,tick:14,major:10,mid:5,value:A.age,onChange:v=>{A.age=v;nb.textContent=v}});setOk(true);
},ok:()=>true};
const bmi=()=>{const m=A.h/100;return A.w/(m*m)};
const bmiCat=b=>b<18.5?["Underweight","#60A5FA"]:b<25?["Healthy range","#4ADE80"]:b<30?["Overweight","#FBBF24"]:["Obese range","#F87171"];
function unitSeg(sec,on){
  const seg=el(`<div class="obseg" style="align-self:center"><i></i><button data-u="kg">kg</button><button data-u="lb">lbs</button></div>`);
  const paint=()=>{seg.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.u===A.unit));seg.firstElementChild.style.transform=A.unit==="lb"?"translateX(100%)":"none"};
  seg.onclick=e=>{const b=e.target.closest("button");if(!b||b.dataset.u===A.unit)return;A.unit=b.dataset.u;buzz(10);paint();on()};paint();return seg}
STEPS.weight={render(sec){
  sec.innerHTML=`<h2 class="obt">What's your weight?</h2><div class="obsegh" style="display:flex;justify-content:center;margin-top:8px"></div><div style="flex:.6"></div><div class="obnum"><b id="obv"></b><small id="obu"></small></div><div class="obbmi" id="obb"><i></i><span></span></div><div style="flex:.5"></div><div class="obruw" style="margin:0 -22px"><div class="obrr"></div></div><div style="flex:1"></div>`;
  const nb=sec.querySelector("#obv"),nu=sec.querySelector("#obu"),bb=sec.querySelector("#obb"),rr=sec.querySelector(".obrr");
  const upd=()=>{nb.textContent=fmtW(A.w);nu.textContent=A.unit==="kg"?"kg":"lbs";const b=bmi(),c=bmiCat(b);bb.style.color=c[1];bb.querySelector("span").textContent=`BMI ${b.toFixed(1)} · ${c[0]}`};
  const build=()=>{const kg=A.unit==="kg";ruler(rr,{orient:"h",min:kg?30:66,max:kg?220:480,step:1,tick:14,major:10,mid:5,value:kg?Math.round(A.w):Math.round(A.w*KG),onChange:v=>{A.w=kg?v:v/KG;upd()}});upd()};
  sec.querySelector(".obsegh").appendChild(unitSeg(sec,build));requestAnimationFrame(build);setOk(true);
},ok:()=>true};
function twInfo(){
  const w=A.w,tw=A.tw==null?A.w:A.tw,d=tw-w,p=d/w*100,ap=Math.abs(p),dir=Math.abs(d)<.5?0:d<0?-1:1,wk=Math.max(1,Math.round(Math.abs(d)/(dir<0?.5:.25)));
  if(!dir)return{t:"info",h:"MAINTAIN WEIGHT",s:"You'll hold your current weight",l:["Ideal for body recomposition: build muscle at the same weight","Strength and consistency are your progress markers"]};
  if(dir<0){const s=`You will lose ${ap.toFixed(1)}% of body weight`;
    if(ap<=10)return{t:"ok",h:"REASONABLE TARGET",s,l:[`About ${wk} weeks at a steady pace`,"Lower blood pressure","Reduce the risk of type 2 diabetes"]};
    if(ap<=20)return{t:"warn",h:"AMBITIOUS TARGET",s,l:[`About ${wk} weeks, so plan for the long run`,"We will split it into smaller milestones","Protein and sleep matter even more"]};
    return{t:"bad",h:"VERY AGGRESSIVE",s,l:["Consider a smaller first milestone","Talk to a doctor before big changes","Slow, steady loss keeps your muscle"]}}
  const s=`You will gain ${ap.toFixed(1)}% of body weight`;
  if(ap<=8)return{t:"ok",h:"LEAN GAIN TARGET",s,l:[`About ${wk} weeks of progressive training`,"Great for building muscle with minimal fat","Eat in a small surplus and sleep well"]};
  return{t:"warn",h:"BIG GAIN TARGET",s,l:[`About ${wk} weeks, so aim for steady progress`,"Faster gain usually adds more fat","We will track milestones along the way"]}
}
STEPS.target={render(sec){
  if(A.tw==null)A.tw=cl(A.goal==="weight"||A.goal==="lean"?A.w-5:A.goal==="muscle"||A.goal==="strength"?A.w+3:A.w,30,220);
  sec.innerHTML=`<h2 class="obt">What's your target weight?</h2><div class="obsegh" style="display:flex;justify-content:center;margin-top:8px"></div><div class="obnum" style="margin-top:14px"><b id="obv"></b><small id="obu"></small></div><div class="obcur" id="obc"></div><div class="obruw" style="margin:6px -22px 0"><div class="obrr"></div></div><div class="obfbw"></div>`;
  const nb=sec.querySelector("#obv"),nu=sec.querySelector("#obu"),cur=sec.querySelector("#obc"),rr=sec.querySelector(".obrr"),fw=sec.querySelector(".obfbw");let last="";
  const upd=()=>{nb.textContent=fmtW(A.tw);nu.textContent=A.unit==="kg"?"kg":"lbs";cur.textContent=`Current ${fmtW(A.w)} ${A.unit==="kg"?"kg":"lbs"}`;
    const f=twInfo(),key=f.t+f.s;if(key!==last){last=key;fw.innerHTML=`<div class="obfb ${f.t}"><h4><i></i>${f.h}</h4><strong>${f.s}</strong>${f.l.map(x=>`<p>${esc(x)}</p>`).join("")}</div>`}};
  const build=()=>{const kg=A.unit==="kg";ruler(rr,{orient:"h",min:kg?30:66,max:kg?220:480,step:1,tick:14,major:10,mid:5,value:kg?Math.round(A.tw):Math.round(A.tw*KG),onChange:v=>{A.tw=kg?v:v/KG;upd()}});upd()};
  sec.querySelector(".obsegh").appendChild(unitSeg(sec,build));requestAnimationFrame(build);setOk(true);
},ok:()=>true};
STEPS.level={render(sec){
  sec.innerHTML=`<h2 class="obt">What's your fitness level?</h2><p class="obsub">Be honest. We'll adjust volume and intensity to match.</p>`+
   card(LEVELS.map((l,i)=>[String(i),l[0],l[1]]),{pre:it=>`<span class="obi lv"><svg viewBox="0 0 36 24">${[0,1,2].map(j=>`<path d="M${9+j*10} 3L${5+j*10} 13h4l-1 8 6-11h-4z" fill="${j<=+it[0]?"currentColor":"rgba(255,255,255,.18)"}"/>`).join("")}</svg></span>`});
  bindOpts(sec,()=>A.level==null?"":String(A.level),k=>{A.level=+k},false,()=>setOk(true));
},ok:()=>A.level!=null};
const epley=()=>A.rm.w*(1+A.rm.reps/30);
STEPS.rm={render(sec){
  const kg=A.unit==="kg",u=kg?"kg":"lb",cv=v=>kg?v:v*KG,rv=v=>kg?v:v/KG;
  sec.innerHTML=`<h2 class="obt">Estimate your 1RM</h2><div class="obrm"></div>
  <div class="obrow"><span>Benchmark</span><button class="obsel" data-bm><span id="bml"></span>${IC.chev}</button></div>
  <div class="obrow"><span>When lifting</span><div class="obstep"><button data-w="-">−</button><input id="rw" type="number" inputmode="decimal" min="0"><u>${u}</u><button data-w="+">+</button></div></div>
  <div class="obrow"><span>Till tired, I can do</span><div class="obstep"><button data-r="-">−</button><input id="rr" type="number" inputmode="numeric" min="1" max="30"><u>reps</u><button data-r="+">+</button></div></div>
  <div class="obhr"></div><div class="obrmv"><span>Your 1RM<small id="bmn"></small></span><b id="rmv"></b></div>`;
  const ill=sec.querySelector(".obrm"),rw=sec.querySelector("#rw"),rr=sec.querySelector("#rr"),out=sec.querySelector("#rmv"),bl=sec.querySelector("#bml"),bn=sec.querySelector("#bmn");
  const upd=(skipInput)=>{ill.innerHTML=LIFTSVG[A.rm.lift];bl.textContent=LIFTS[A.rm.lift];bn.textContent=`(${LIFTS[A.rm.lift]})`;if(!skipInput){rw.value=Math.round(cv(A.rm.w)*2)/2;rr.value=A.rm.reps}out.innerHTML=`${Math.round(cv(epley()))}<small>${u}</small>`};
  rw.oninput=()=>{const v=parseFloat(rw.value);if(isFinite(v)&&v>=0){A.rm.w=rv(v);upd(1)}};rr.oninput=()=>{const v=parseInt(rr.value);if(v>=1&&v<=30){A.rm.reps=v;upd(1)}};
  sec.addEventListener("click",e=>{const w=e.target.closest("[data-w]"),r=e.target.closest("[data-r]");
    if(w){A.rm.w=Math.max(0,A.rm.w+(w.dataset.w==="+"?1:-1)*rv(kg?2.5:5));buzz(6);upd()}
    if(r){A.rm.reps=cl(A.rm.reps+(r.dataset.r==="+"?1:-1),1,30);buzz(6);upd()}
    if(e.target.closest("[data-bm]")){const sh=el(`<div class="obsh"><div><h5>Benchmark lift</h5>${Object.keys(LIFTS).map(k=>`<button class="obo${A.rm.lift===k?" on":""}" data-l="${k}" style="margin-bottom:8px"><span><b>${LIFTS[k]}</b></span><i class="obck">${IC.chk}</i></button>`).join("")}</div></div>`);
      sec.parentElement.appendChild(sh);sh.onclick=ev=>{const b=ev.target.closest("[data-l]");if(b){A.rm.lift=b.dataset.l;buzz(10);upd()}if(b||ev.target===sh)sh.remove()}}});
  A.rm.skip=false;upd();setOk(true);
},ok:()=>true,link:{t:"I'm a beginner and I don't know ›",fn(){A.rm.skip=true;go(1)}}};
STEPS.days={render(sec){
  const more=A.days!=null&&![3,4,5].includes(A.days);
  sec.innerHTML=`<h2 class="obt">How often do you work out?</h2><p class="obsub">We recommend training at least 3 days a week for better results.</p><div class="obgrid" id="dg"></div><div class="obh3">Pick your workout week's start day</div><div class="obgrid d7" id="sg"></div>`;
  const dg=sec.querySelector("#dg"),sg=sec.querySelector("#sg");let all=more;
  const paint=()=>{const L=all?[[1,"1 day / week"],[2,"2 days / week"],[3,"3 days / week"],[4,"4 days / week"],[5,"5 days / week"],[6,"6 days / week"],[7,"Every day"],["less","Fewer options"]]:[[3,"3 days / week"],[4,"4 days / week"],[5,"5 days / week"],["more","More options"]];
    dg.innerHTML=L.map(([v,t])=>`<button class="obbox${A.days===v?" on":""}" data-d="${v}">${t}${v===4&&!all?'<span class="rec">POPULAR</span>':""}</button>`).join("");
    sg.innerHTML=DAYN.map((n,i)=>`<button class="obbox${A.start===i?" on":""}" data-s="${i}">${n.slice(0,3)}</button>`).join("");setOk(A.days!=null&&A.start!=null)};
  sec.addEventListener("click",e=>{const d=e.target.closest("[data-d]"),s=e.target.closest("[data-s]");
    if(d){const v=d.dataset.d;if(v==="more"||v==="less"){all=v==="more";paint();return}A.days=+v;buzz(10);paint()}
    if(s){A.start=+s.dataset.s;buzz(10);paint()}});paint();
},ok:()=>A.days!=null&&A.start!=null};
STEPS.equip={render(sec){
  sec.innerHTML=`<h2 class="obt">Which equipment do you have?</h2><p class="obsub">Select everything you can use. We'll only plan exercises you can actually do.</p>`+card(EQUIP,{pre:it=>`<span class="obi">${IC[it[2]]}</span>`,noDesc:1});
  bindOpts(sec,()=>A.equip,k=>{
    if(k==="all"||k==="none")A.equip=A.equip.includes(k)?[]:[k];
    else{A.equip=A.equip.filter(x=>x!=="all"&&x!=="none");A.equip=A.equip.includes(k)?A.equip.filter(x=>x!==k):[...A.equip,k]}},true,()=>setOk(A.equip.length>0));
},ok:()=>A.equip.length>0};
STEPS.place={render(sec){
  sec.innerHTML=`<h2 class="obt">Where do you prefer to exercise?</h2><p class="obsub">Your plan adapts to the space you have.</p>`+card(PLACES,{pre:it=>`<span class="obi">${IC[it[0]]}</span>`});
  bindOpts(sec,()=>A.place,k=>{A.place=k},false,()=>setOk(true));
},ok:()=>!!A.place};
STEPS.chal={render(sec){
  sec.innerHTML=`<h2 class="obt">What's your biggest challenge when working out?</h2><p class="obsub">We'll build in the right support for it.</p>`+card(CHAL,{noDesc:1,pre:it=>`<span class="obi">${IC[it[0]]}</span>`});
  bindOpts(sec,()=>A.chal,k=>{A.chal=k},false,()=>setOk(true));
},ok:()=>!!A.chal,btn:"Create my plan"};
STEPS.coach={full:1,render(sec){
  const fl=A.focus.includes("full")||!A.focus.length?"Full Body":A.focus.map(k=>FOCUS.find(f=>f[0]===k)[1]).join(", ");
  const P=[["Analysing your profile",0],[`Focusing your training plan on <b>${esc(fl)}</b>`,22],[`Balancing volume for your <b>${LEVELS[A.level==null?1:A.level][0].toLowerCase()}</b> level`,46],["Selecting exercises for your equipment",68],[`Scheduling <b>${A.days||3} days a week</b>`,86]];
  sec.innerHTML=`<div class="obcoach"><div class="obav">${IC.coach}</div><h2 class="obt" style="margin:0">Your coach is busy<br>working for you…</h2><div class="obring"><svg viewBox="0 0 236 236"><circle cx="118" cy="118" r="104" stroke="var(--s2)"/><circle id="rg" cx="118" cy="118" r="104" stroke="url(#rgg)" stroke-dasharray="0 700"/><defs><linearGradient id="rgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8F13A"/><stop offset="1" stop-color="#3ED9A0"/></linearGradient></defs></svg><b id="rp">0%</b></div><div class="obph" id="ph"></div></div>`;
  const rg=sec.querySelector("#rg"),rp=sec.querySelector("#rp"),ph=sec.querySelector("#ph"),C=2*Math.PI*104,t0=performance.now(),D=6200;let lp=-1;
  tm=setInterval(()=>{const t=Math.min(1,(performance.now()-t0)/D),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p=Math.round(e*100);rg.setAttribute("stroke-dasharray",`${C*e} 700`);rp.textContent=p+"%";
    let k=0;P.forEach((x,i)=>{if(p>=x[1])k=i});if(k!==lp){lp=k;ph.innerHTML=P[k][0]+"…"}
    if(t>=1){clearInterval(tm);buzz([20,40,20]);setTimeout(()=>{if(root&&order[idx]==="coach")go(1)},350)}},60);
}};
STEPS.plan={full:1,render(sec){
  const gl=GPLAN[A.goal||"muscle"],fl=A.focus.includes("full")||!A.focus.length?"Full Body":A.focus.map(k=>FOCUS.find(f=>f[0]===k)[1]).join(", ");
  const eq=A.equip.includes("all")?"All Equipment":A.equip.includes("none")?"Bodyweight only":A.equip.map(k=>EQUIP.find(e=>e[0]===k)[1]).join(", ");
  const rmv=A.rm.skip?null:Math.round((A.unit==="kg"?1:KG)*epley());
  sec.innerHTML=`<div style="flex:1;overflow-y:auto;margin:0 -22px;padding:0 22px 8px"><div class="obplanh"><h2>Your <span>${esc(gl)}</span> plan is ready!</h2><div class="obav">${IC.coach}</div></div>
  <div class="obcard obchart"><h6>${esc((GOALS[A.goal||"muscle"][0]))}</h6>
   <svg viewBox="0 0 320 170"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FB923C"/><stop offset=".5" stop-color="#C8F13A"/><stop offset="1" stop-color="#4ADE80"/></linearGradient><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8F13A" stop-opacity=".30"/><stop offset="1" stop-color="#C8F13A" stop-opacity="0"/></linearGradient></defs>
   <path class="ar" d="M22 128C70 126 92 100 136 96C176 92 196 64 236 52C262 45 290 44 304 44L304 142L22 142Z" fill="url(#cf)"/>
   <path class="ln" d="M22 128C70 126 92 100 136 96C176 92 196 64 236 52C262 45 290 44 304 44" fill="none" stroke="url(#cg)" stroke-width="5" stroke-linecap="round"/>
   <g class="mk"><circle cx="22" cy="128" r="8" fill="#0c0e13" stroke="#FB923C" stroke-width="4"/><rect x="2" y="84" width="64" height="30" rx="10" fill="#fff"/><path d="M26 114l-4 7-4-7z" fill="#fff" transform="translate(4 0)"/><text x="34" y="104" text-anchor="middle" font-size="13" font-weight="800" fill="#0c0e13" font-family="Manrope,sans-serif">Before</text>
   <circle cx="236" cy="52" r="8" fill="#0c0e13" stroke="#4ADE80" stroke-width="4"/><rect x="204" y="8" width="64" height="30" rx="10" fill="#C8F13A"/><path d="M232 38l4 7 4-7z" fill="#C8F13A"/><text x="236" y="28" text-anchor="middle" font-size="13" font-weight="800" fill="#0c0e13" font-family="Manrope,sans-serif">After</text></g>
   <text x="22" y="164" font-size="12" font-weight="700" fill="#8A90A2" font-family="Manrope,sans-serif">Today</text><text x="304" y="164" text-anchor="end" font-size="12" font-weight="700" fill="#8A90A2" font-family="Manrope,sans-serif">Week 8</text></svg></div>
  <div class="obcard obsum"><ul>
   <li><span class="obi">${IC.goal}</span><div><small>Goal</small><b>${esc(GOALS[A.goal||"muscle"][0])}</b></div></li>
   <li><span class="obi">${IC.flag}</span><div><small>${rmv?"1RM ("+LIFTS[A.rm.lift]+")":"Level"}</small><b>${rmv?rmv+" "+(A.unit==="kg"?"kg":"lb"):LEVELS[A.level==null?1:A.level][0]}</b></div></li>
   <li><span class="obi">${IC.target}</span><div><small>Focus area</small><b>${esc(fl)}</b></div></li>
   <li><span class="obi">${IC.dumbbell}</span><div><small>Equipment</small><b>${esc(eq)}</b></div></li>
   <li><span class="obi">${IC.cal}</span><div><small>Schedule</small><b>${A.days||3} days a week</b></div></li></ul>
   <div class="mp">${body("front",new Set(A.focus.length?A.focus:["full"]))}</div></div>
  <div class="obtip"><span class="obi" style="width:34px;height:34px;border-radius:10px">${IC.spark}</span><span>${A.chal==="motivation"?"Streaks and weekly goals will keep you motivated.":A.chal==="bored"?"Your plan rotates exercises so it never gets stale.":"Every session is laid out step by step, with form videos."}</span></div></div>`;
  nx.textContent="Start Now";root.querySelector(".obf").style.display="";nx.disabled=false;
},ok:()=>true,btn:"Start Now",onNext(){finish()}};
STEPS.plan.full=0;

/* ---------- finish: write everything into the app state ---------- */
function applyFocus(){
  if(typeof DT==="undefined")return;
  if(!applyFocus.o){applyFocus.o={};for(const k in DT)applyFocus.o[k]=DT[k].g.slice()}
  const m={shoulder:"shoulders",arm:"arms",chest:"chest",leg:"legs",butt:"glutes"},f=((S.focus)||[]).filter(x=>x!=="full").map(x=>m[x]).filter(Boolean);
  for(const k in DT){const o=applyFocus.o[k];if(!o)continue;if(o.every(g=>g==="cardio")||!f.length){DT[k].g=o.slice();continue}
    /* days that already train a focus area put it first (more of its exercises); other days get one finisher from the top focus area */
    const has=o.filter(g=>f.includes(g)),rest=o.filter(g=>!f.includes(g));
    DT[k].g=has.length?[...has,...rest]:[...o,f[0]].slice(0,4)}
}
window.__forgeApplyFocus=applyFocus;
function finish(){
  const lvl=A.level==null?1:A.level;
  Object.assign(S,{name:A.name.trim()||"Athlete",sex:A.sex||"m",goal:A.goal||"muscle",level:lvl,w:+A.w.toFixed(1),tw:+(A.tw==null?A.w:A.tw).toFixed(1),h:Math.round(A.h),hu:A.hu,age:A.age,unit:A.unit,days:A.days||3,start:A.start==null?1:A.start,
    place:A.place==="home"?"home":"gym",loc:A.place||"large",focus:A.focus.slice(),equip:A.equip.slice(),rm:A.rm.skip?null:{lift:A.rm.lift,w:+A.rm.w.toFixed(1),reps:A.rm.reps,est:+epley().toFixed(1)},chal:A.chal,ob:1});
  applyFocus();
  V.step=0;V.view="";V.tab="home";save();close();window.__forgeOBdone=1;render();buzz(25)}

/* ---------- hooks ---------- */
window.__forgeOB={open,close,A,STEPS,order,idx:()=>idx,jump(i){idx=i;show(i,'f')}};
const _ob=window.obV;if(typeof _ob==="function")window.obV=function(){return root?"":_ob.apply(this,arguments)};
const _r=window.render;
window.render=function(){if(!S.ob){if(!root)open()}else if(root){close()}return _r.apply(this,arguments)};
try{applyFocus()}catch(e){}
if(!S.ob){open();try{_r()}catch(e){}}
})();

</script>
