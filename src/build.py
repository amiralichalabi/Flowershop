import re,sys,os
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
v3=open(D+'src/v3-base.html',encoding='utf-8').read()
css3=re.search(r'<style>(.*?)</style>',v3,re.S).group(1)
# حذف بخش‌های قدیمی که دیگر استفاده نمی‌شن (استودیوی قبلی)
a=css3.index('/* studio */');b=css3.index('/* how */')
css3=css3[:a]+css3[b:]
css3=css3.replace("font-family:Amiri;","")
NEW_CSS=r'''
.hero h1{font-size:clamp(2.4rem,5.4vw,4.4rem)}
img{background:transparent!important}

/* ---- ویزارد سه‌بعدی ---- */
.lg{width:30px;height:30px;display:inline-block;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 8%,transparent 9%),radial-gradient(circle,#fff 0 22%,transparent 23% 100%);box-shadow:inset 0 0 0 3px currentColor;position:relative}
.lg::after{content:"";position:absolute;inset:7px;border-radius:50%;background:currentColor;opacity:.9}
.heroart{align-self:stretch;min-height:480px;transform:none;filter:none;position:relative}
.heroart canvas{position:absolute;inset:0;width:100%;height:100%}
.hero .wrap{align-items:stretch}
#studio{background:color-mix(in srgb,var(--accent) 7%,var(--bg));transition:background-color .6s}
.wz{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}
.stageWrap{position:sticky;top:calc(92px + env(safe-area-inset-top,0px));min-width:0}
.stage{position:relative;aspect-ratio:1/1.08;background:radial-gradient(120% 90% at 50% 25%,color-mix(in srgb,var(--accent) 6%,#fff),color-mix(in srgb,var(--accent) 22%,#ece4ee));overflow:hidden;transition:background .6s}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .stage{background:radial-gradient(120% 90% at 50% 25%,color-mix(in srgb,var(--accent) 18%,#2a2030),color-mix(in srgb,var(--accent) 30%,#150f1b))}}
:root[data-theme="dark"] .stage{background:radial-gradient(120% 90% at 50% 25%,color-mix(in srgb,var(--accent) 18%,#2a2030),color-mix(in srgb,var(--accent) 30%,#150f1b))}
.stage .tools{position:absolute;inset-inline-end:10px;top:10px;display:flex;gap:6px;z-index:3}
.stage .tools button{background:var(--card);color:var(--ink);font-size:.78rem;padding:4px 12px;box-shadow:0 1px 0 var(--line);transition:background-color .25s,color .25s}
.stage .tools button:hover:not(:disabled){background:var(--ink);color:var(--bg)}
.stage .tools button:disabled{opacity:.4;cursor:not-allowed}
.stage .hintT{position:absolute;inset-inline-start:12px;bottom:10px;font-size:.74rem;color:var(--mut);pointer-events:none}
.sbar{background:var(--card);padding:14px 18px;display:grid;gap:8px}
.sbar .r1{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.sbar .pr{font-family:var(--disp);font-size:1.9rem;font-weight:700;line-height:1.2;font-variant-numeric:tabular-nums}
.sbar small{color:var(--mut);font-size:.8rem}
.meter{height:3px;background:var(--line)}.meter i{display:block;height:100%;background:var(--accent);transition:width .45s var(--ease)}
.stepper{list-style:none;display:flex;gap:0;overflow-x:auto;margin-bottom:36px;border-bottom:1px solid var(--line);scrollbar-width:none}
.stepper::-webkit-scrollbar{display:none}
.stepper li{flex:1 0 auto;min-width:74px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 8px 12px;cursor:pointer;color:var(--mut);position:relative;font-size:.82rem;transition:color .3s}
.stepper li i{font-style:normal;font-family:var(--disp);font-size:1.5rem;line-height:1.2}
.stepper li::after{content:"";position:absolute;inset-inline:0;bottom:-1px;height:2px;background:var(--accent);transform:scaleX(0);transition:transform .5s var(--ease)}
.stepper li.on{color:var(--ink);font-weight:500}.stepper li.on::after{transform:scaleX(1)}
.stepper li.done{color:var(--accent)}
.stepper li:hover{color:var(--ink)}
#stepHead small{color:var(--accent);font-size:.82rem}
#stepHead h3{font-size:clamp(1.9rem,3.2vw,2.6rem)}
#stepHead p{color:var(--mut);margin:2px 0 22px}
.blk{padding:20px 0;border-top:1px solid var(--line);min-width:0}
#stepBody>.blk:first-child{border-top:0;padding-top:0}
.blk h4{font-size:.8rem;font-weight:500;color:var(--mut);margin-bottom:12px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;letter-spacing:.03em}
.blk h4 small{font-weight:400}
.seg{display:flex;gap:8px;flex-wrap:wrap}
.seg button{padding:8px 16px;box-shadow:inset 0 0 0 1px var(--line);background:transparent;line-height:1.5;text-align:center;transition:background-color .25s,color .25s,box-shadow .25s}
.seg button small{display:block;color:var(--mut);font-size:.72rem}
.seg button:hover{box-shadow:inset 0 0 0 1px var(--ink)}
.seg button.on{background:var(--ink);color:var(--bg);box-shadow:none}.seg button.on small{color:inherit;opacity:.75}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip2{padding:6px 14px;box-shadow:inset 0 0 0 1px var(--line);font-size:.86rem;transition:background-color .25s,color .25s;text-align:start}
.chip2:hover{box-shadow:inset 0 0 0 1px var(--ink)}.chip2.on{background:var(--accent);color:#fff;box-shadow:none}
.mgrid,.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:12px}
.cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.mcard,.tcard,.ccard{display:flex;flex-direction:column;gap:2px;text-align:start;padding:10px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,transform .35s var(--ease);min-width:0}
.mcard:hover,.tcard:hover,.ccard:hover{transform:translateY(-3px);box-shadow:inset 0 0 0 1px var(--ink)}
.mcard.on,.tcard.on,.ccard.on{box-shadow:inset 0 0 0 2px var(--accent)}
.mcard .mi{aspect-ratio:1;background:color-mix(in srgb,var(--accent) 10%,var(--bg));display:grid;place-items:center;margin-bottom:6px}
.mcard .mi img,.tcard img,.ccard img{width:100%;height:100%;object-fit:contain;display:block;animation:fade .6s both}
.tcard img{aspect-ratio:1;background:color-mix(in srgb,var(--accent) 10%,var(--bg));margin-bottom:6px}
.ccard img{aspect-ratio:3/2;object-fit:cover;margin-bottom:6px}
.mcard b,.tcard b,.ccard b{font-family:var(--disp);font-size:1.25rem;line-height:1.4}
.mcard small,.tcard small,.ccard small{color:var(--mut);font-size:.76rem;line-height:1.6}
.sw{display:flex;gap:10px;flex-wrap:wrap}
.sw button{width:30px;height:30px;border-radius:50%;box-shadow:inset 0 0 0 1px #0003;transition:transform .25s var(--ease),outline-offset .25s;outline:2px solid transparent;outline-offset:2px}
.sw button:hover{transform:scale(1.15)}.sw button.on{outline-color:var(--ink);outline-offset:3px}
.sw.sm button{width:22px;height:22px}
.frow{display:flex;align-items:center;gap:16px;padding:14px 0;border-top:1px solid var(--line);flex-wrap:wrap}
.frow:first-of-type{border-top:0}
.frow .ic{width:68px;height:68px;flex:none;background:color-mix(in srgb,var(--accent) 10%,var(--bg));object-fit:contain}
.frow .nm{flex:1;min-width:170px}.frow .nm b{font-family:var(--disp);font-size:1.35rem;display:block;line-height:1.4}.frow .nm b i{font-style:normal;font-family:var(--body);font-size:.68rem;color:var(--accent);margin-inline-start:6px}
.frow .nm small{color:var(--mut);display:block;line-height:1.6;font-size:.78rem}
.step{display:flex;align-items:center;gap:6px}
.step button{width:36px;height:36px;box-shadow:inset 0 0 0 1px var(--line);font-size:1.2rem;transition:background-color .25s,color .25s}
.step button:hover:not(:disabled){background:var(--ink);color:var(--bg)}.step button:disabled{opacity:.3;cursor:not-allowed}
.step span{min-width:32px;text-align:center;font-weight:500;font-variant-numeric:tabular-nums}
.grow{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
.exr{display:flex;align-items:center;gap:12px;padding:8px 0}.exr input{accent-color:var(--accent);width:17px;height:17px}.exr span{flex:1}.exr span i{font-style:normal;color:var(--mut);font-size:.74rem;margin-inline-start:6px}
textarea,.in{width:100%;border:0;box-shadow:inset 0 0 0 1px var(--line);padding:10px 12px;background:var(--card);border-radius:0}
textarea:focus,.in:focus{box-shadow:inset 0 0 0 2px var(--accent);outline:none}
textarea{resize:vertical;min-height:76px}
.hint{font-size:.84rem;color:var(--mut)}
.empty{padding:18px;background:color-mix(in srgb,var(--accent) 8%,var(--card));font-size:.9rem;line-height:1.9}
.acts2{margin-top:12px}
.up{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.up input{position:absolute;opacity:0;width:1px;height:1px}
.up label{cursor:pointer}
#stepNav{display:flex;justify-content:space-between;gap:12px;margin-top:26px;padding-top:20px;border-top:1px solid var(--line)}
#stepNav .btn[data-a=next],#stepNav .btn[data-a=addcart]{margin-inline-start:auto}
#stepWarn{margin-top:16px;display:flex;flex-direction:column;gap:4px}
#stepWarn div,.warns div{font-size:.8rem;padding-inline-start:10px;border-inline-start:2px solid;line-height:1.7}
.warns{display:flex;flex-direction:column;gap:4px;margin:14px 0}
.e{color:var(--err)}.w{color:var(--warn)}.g{color:var(--ok)}
.bsel{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
.bsel button{text-align:start;padding:12px 14px;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .25s,background-color .25s;display:flex;flex-direction:column}
.bsel button b{font-family:var(--disp);font-size:1.25rem}.bsel button small{color:var(--mut);font-size:.76rem}
.bsel button.on{box-shadow:inset 0 0 0 2px var(--bc);background:color-mix(in srgb,var(--bc) 8%,transparent)}
.fsum{display:grid;gap:0}.fsum div{display:grid;grid-template-columns:90px 1fr;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:.9rem}
.fsum dt{color:var(--mut)}.fsum dd{line-height:1.8}
.fsum .lnk{margin-inline-start:10px;font-size:.78rem}
.specs{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0}
.specs small{display:block;color:var(--mut);font-size:.74rem}.specs b{font-weight:500}
.hb{display:inline-flex;gap:7px;align-items:center}.hb i{width:8px;height:8px;transform:rotate(45deg)}
.bd2{width:100%;border-collapse:collapse;font-size:.85rem;margin-top:6px}
.bd2 td{padding:4px 0;color:var(--mut)}.bd2 td:last-child{text-align:left;font-variant-numeric:tabular-nums;white-space:nowrap}
.bd2 tr.t td{color:var(--ink);font-family:var(--disp);font-size:1.6rem;font-weight:700;padding-top:12px;border-top:1px solid var(--line)}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.saved{display:flex;flex-direction:column;gap:2px;margin-top:10px}
.saved div{display:flex;gap:10px;align-items:center;font-size:.82rem;color:var(--mut);border-top:1px solid var(--line);padding:3px 0}.saved div span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .ph{position:absolute;inset:0;display:grid;place-items:center}
.tile .ph img{width:100%;height:100%;object-fit:contain;opacity:0;transform:scale(.94);transition:opacity .7s var(--ease),transform 1s var(--ease);position:relative}
.tile .ph img.in{opacity:1;transform:none}
.pc:hover .tile .ph img{transform:scale(1.06)}
.tile{aspect-ratio:1/1.05}
.ci img{width:84px;height:84px;flex:none;object-fit:contain;background:color-mix(in srgb,var(--accent) 12%,var(--card))}
@media(max-width:900px){.wz{grid-template-columns:1fr;gap:26px}.stageWrap{order:-1;position:sticky;top:calc(64px + env(safe-area-inset-top,0px));z-index:6;background:var(--bg)}.stage{aspect-ratio:auto;height:38vh;min-height:260px}.sbar{padding:8px 14px}.sbar .pr{font-size:1.4rem}.heroart{min-height:380px}.specs{grid-template-columns:1fr 1fr}}
'''
NEW_CSS+=r'''
/* ---- v6: گالری و عکس واقعی ---- */
.gal{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(210px,24%);gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px;scrollbar-width:thin}
.gal button{scroll-snap-align:start;background:color-mix(in srgb,var(--accent) 9%,var(--card));aspect-ratio:3/4;display:grid;place-items:center;padding:14px;position:relative;overflow:hidden;transition:background-color .4s}
.gal img{width:100%;height:100%;object-fit:contain;transition:transform .8s var(--ease);filter:drop-shadow(0 14px 14px rgba(29,22,38,.22))}
.gal button:hover img{transform:scale(1.06) translateY(-4px)}
.gal button span{position:absolute;inset-inline:0;bottom:0;padding:10px 12px;font-size:.82rem;background:linear-gradient(transparent,#0007);color:#fff;opacity:0;transition:opacity .3s}
.gal button:hover span,.gal button:focus-visible span{opacity:1}
/* ---- v5: جلوه‌ها ---- */
#fxc{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:28}
#prog{position:fixed;top:env(safe-area-inset-top,0px);inset-inline:0;height:3px;background:var(--accent);transform-origin:right center;transform:scaleX(0);z-index:45;transition:background-color .5s}
#splash{position:fixed;inset:0;z-index:100;background:#1d1626;color:#fff;display:grid;place-items:center;clip-path:inset(0 0 0 0);transition:clip-path 1s cubic-bezier(.77,0,.18,1)}
#splash.out{clip-path:inset(0 0 100% 0)}
#splash .in{display:grid;justify-items:center;gap:14px}
#splash svg{width:150px;height:150px;overflow:visible}
#splash .pt{transform-box:fill-box;transform-origin:50% 100%;animation:spP .9s cubic-bezier(.2,.9,.2,1) both;animation-delay:calc(var(--i)*85ms + 150ms)}
#splash .ct{transform-box:fill-box;transform-origin:center;animation:spC .7s cubic-bezier(.3,1.6,.5,1) 1s both}
@keyframes spP{from{transform:scale(0) rotate(-25deg);opacity:0}to{transform:none;opacity:1}}
@keyframes spC{from{transform:scale(0)}to{transform:none}}
#splash .t{font-family:var(--disp);font-size:3rem;font-weight:700;overflow:hidden;line-height:1.3}
#splash .t span{display:block;animation:rise 1s cubic-bezier(.2,.8,.2,1) .8s both}
#splash .s{font-size:.95rem;opacity:.7;animation:fade 1s 1.2s both}
.splashing{overflow:hidden}
body.splashing .hero .ln span,body.splashing .hero .lead,body.splashing .hero .cta{animation-play-state:paused}
.hero::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px circle at var(--mx,70%) var(--my,40%),rgba(255,255,255,.16),transparent 65%)}
.heroart{z-index:1}
.band{background:var(--dk);color:#f4ecf7;padding:46px 0}
.band .wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;text-align:center}
.band b{display:block;font-family:var(--disp);font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.2;color:var(--accent);font-variant-numeric:tabular-nums;transition:color .5s}
.band span{font-size:.88rem;opacity:.8}
.tile{transition:transform .25s ease-out,background-color .4s;transform-style:preserve-3d}
.tile::after{content:"";position:absolute;inset:0;background:radial-gradient(260px circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.3),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}
.pc:hover .tile::after{opacity:1}
#stepHead.enter,#stepBody.enter>.blk{animation:fade .6s var(--ease) both}
#stepBody.enter>.blk:nth-child(2){animation-delay:70ms}#stepBody.enter>.blk:nth-child(3){animation-delay:140ms}#stepBody.enter>.blk:nth-child(4){animation-delay:210ms}#stepBody.enter>.blk:nth-child(n+5){animation-delay:280ms}
.stepper li.on i{animation:pop .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes pop{from{transform:scale(.6)}to{transform:none}}
#sPrice.bump{animation:bump .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes bump{40%{transform:scale(1.12);color:var(--accent)}}
.stage[data-light=morning]{background:radial-gradient(120% 90% at 50% 20%,#fffaf2,#d8e7f5)}
.stage[data-light=golden]{background:radial-gradient(120% 90% at 50% 30%,#ffe2bd,#e89a78)}
.stage[data-light=night]{background:radial-gradient(120% 90% at 50% 30%,#2c2a63,#0c0a22)}
.stage{transition:background .9s}
.lights{position:absolute;inset-inline-end:10px;bottom:10px;display:flex;gap:4px;z-index:3;background:#0000002e;backdrop-filter:blur(8px);padding:3px}
.lights button{font-size:.72rem;padding:3px 10px;color:#fff;transition:background-color .25s,color .25s}
.lights button.on{background:#fff;color:#1d1626}
.stage[data-light=night] .hintT,.stage[data-light=golden] .hintT{color:#fffc}
#themeBtn svg{width:22px;height:22px}
.stage .hintT{max-width:46%;line-height:1.6}
#themeBtn .sun{transition:r .4s,fill .4s}#themeBtn .rays{transform-origin:12px 12px;transition:transform .6s var(--ease),opacity .4s}
#themeBtn.dk .sun{fill:currentColor;r:5.4}#themeBtn.dk .rays{transform:rotate(90deg) scale(.6);opacity:0}
.smart{background:color-mix(in srgb,var(--accent) 8%,var(--card));padding:18px!important;margin-bottom:6px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 35%,transparent)}
.rng{display:flex;align-items:center;gap:12px;margin:14px 0 2px;flex-wrap:wrap}
.rng input{flex:1;min-width:140px;accent-color:var(--accent)}
.rng output{min-width:110px;font-family:var(--disp);font-size:1.25rem;font-variant-numeric:tabular-nums}
.pmodal{position:fixed;inset:0;z-index:90;background:#000a;display:grid;place-items:center;padding:16px;opacity:0;transition:opacity .4s;overflow:auto}
.pmodal.on{opacity:1}
.pbox{background:var(--card);padding:14px;max-width:min(440px,100%);display:grid;gap:12px;transform:translateY(24px) scale(.96);transition:transform .5s var(--ease)}
.pmodal.on .pbox{transform:none}
.pbox img{width:100%;height:auto;display:block}
.pact{display:flex;gap:10px;justify-content:center}.pbox small{color:var(--mut);text-align:center;font-size:.76rem}
@media(max-width:700px){.band .wrap{grid-template-columns:1fr 1fr}.lights button{padding:3px 7px}}
@media(prefers-reduced-motion:reduce){#fxc,#splash{display:none}}
'''
NEW_CSS+=r'''
/* ===== v7 مینیمال و ظریف ===== */
:root{--disp:Vazirmatn,Tahoma,sans-serif}
body{font-weight:300;letter-spacing:0}
h1,h2,h3,h4,.disp,.hero h1{font-weight:200!important;letter-spacing:-.01em}
b,strong,.btn,.cartbtn b{font-weight:400!important}
.hero h1{font-weight:200!important}
.sbar .pr,.band b,.bd2 tr.t td,.rng output,.mcard b,.tcard b,.ccard b,.frow .nm b,.bsel button b,#splash .t,.stepper li i{font-weight:300!important}
.tick,.band{display:none!important}
header{box-shadow:none!important;background:transparent!important;border-bottom:1px solid transparent}
header.solid{background:color-mix(in srgb,var(--bg) 88%,transparent)!important;backdrop-filter:blur(14px);border-bottom-color:var(--line)}
header nav a{font-weight:300;font-size:.92rem}
.btn{border-radius:0;letter-spacing:.02em}
.sh h2{font-size:clamp(1.8rem,3.6vw,2.6rem)}
.ubtn{display:flex;align-items:center;gap:6px;font-size:.84rem;padding:0 10px;color:inherit}.ubtn svg{width:20px}
.views{position:absolute;inset-inline-start:10px;bottom:10px;z-index:3;display:flex;gap:2px;align-items:center;background:#ffffffcc;backdrop-filter:blur(8px);padding:3px;flex-wrap:wrap;max-width:calc(100% - 120px)}
.views button{font-size:.72rem;padding:4px 9px;color:#1d1626;transition:background-color .2s,color .2s}
.views button.on,.views button:hover{background:#1d1626;color:#fff}.views i{width:1px;height:14px;background:#0003;margin:0 3px}
.dragHint{position:absolute;inset-inline:0;top:52px;text-align:center;font-size:.76rem;color:#1d1626a0;pointer-events:none;transition:opacity .6s}.dragHint.off{opacity:0}
.md{position:fixed;inset:0;z-index:80;background:#150f1b66;backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:16px}.md.on{display:flex}
.md-b{position:relative;background:var(--card);color:var(--ink);width:min(440px,100%);max-height:88vh;overflow:auto;padding:36px 30px 28px;display:flex;flex-direction:column;gap:12px;animation:mdIn .35s cubic-bezier(.2,.8,.2,1)}
.md.art .md-b{width:min(560px,100%)}@keyframes mdIn{from{opacity:0;transform:translateY(14px)}}
.md-b .x{position:absolute;inset-inline-end:14px;top:12px;font-size:1.1rem;opacity:.6}.md-b h3{font-size:1.9rem}.md-b h4{font-size:1rem;font-weight:400;margin-top:8px}
.md-b p{line-height:2;margin:0}.md-b .sub,.sub{color:var(--mut);font-size:.88rem}.md-b .kick{color:var(--accent);font-size:.78rem}
.md-b label,.ckpage label{font-size:.8rem;color:var(--mut)}.md-b li{line-height:2}
.in{width:100%;border:0;border-bottom:1px solid var(--line);background:transparent;padding:10px 2px;font:inherit;color:inherit;border-radius:0}.in:focus{outline:0;border-bottom-color:var(--accent)}
.ord{display:flex;gap:10px;justify-content:space-between;font-size:.84rem;padding:8px 0;border-bottom:1px solid var(--line)}
.mag{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:28px 22px;margin-top:28px}
.ac{cursor:pointer}.ac .ph{aspect-ratio:1;background:color-mix(in srgb,var(--accent) 7%,var(--bg));display:grid;place-items:center;overflow:hidden}.ac .ph.nop{aspect-ratio:auto;height:6px;background:var(--accent);opacity:.5}.ac .ph.nop canvas{display:none}.ac canvas{width:80%;transition:transform .6s cubic-bezier(.2,.8,.2,1)}.ac:hover canvas{transform:scale(1.08) rotate(-3deg)}
.ac small{display:block;margin-top:12px;color:var(--accent);font-size:.74rem}.ac h3{font-size:1.25rem;margin:2px 0}.ac p{margin:0;color:var(--mut);font-size:.86rem}
.ckpage{position:fixed;inset:0;z-index:90;background:var(--bg);color:var(--ink);overflow:auto;opacity:0;transition:opacity .35s}.ckpage.on{opacity:1}
.ckpage .wrap{padding-top:28px;padding-bottom:60px;max-width:1080px}.ckpage h2{font-size:2.4rem;margin:12px 0 24px}.back{font-size:.84rem;color:var(--mut)}
.ckgrid{display:grid;grid-template-columns:1.25fr 1fr;gap:48px}@media(max-width:820px){.ckgrid{grid-template-columns:1fr;gap:28px}}
.ckpage fieldset{border:0;border-top:1px solid var(--line);padding:18px 0 10px;margin:0 0 6px}.ckpage legend{font-size:.8rem;color:var(--accent);padding-inline-end:10px}
.ckpage .fld{margin-bottom:14px}.ckpage .f2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.ckpage .f2.g{grid-template-columns:1fr auto}
.opt{display:flex;gap:12px;align-items:flex-start;padding:12px 0;cursor:pointer}.opt input{margin-top:6px;accent-color:var(--accent)}.opt b{display:block}.opt small{color:var(--mut)}
.btn.big{width:100%;padding:16px}.ckside{background:color-mix(in srgb,var(--accent) 5%,var(--bg));padding:26px;align-self:start;position:sticky;top:20px}.ckside h3{font-size:1.3rem;margin:0 0 14px}
.ckit{display:flex;gap:12px;align-items:center;padding:8px 0}.ckit img{width:56px;height:56px;object-fit:contain}.ckit div{flex:1}.ckit small{display:block;color:var(--mut)}.ckit em{font-style:normal;font-size:.88rem}
.ckside .row{display:flex;justify-content:space-between;padding:8px 0;font-size:.9rem;border-top:1px solid var(--line)}.ckside .tot{font-size:1.2rem;font-weight:400}
.okpg{text-align:center;padding:60px 0;display:flex;flex-direction:column;gap:14px;align-items:center}.okpg .code{font-size:2rem;letter-spacing:.2em;font-weight:200;direction:ltr}
.tl{display:flex;gap:26px;list-style:none;padding:0;margin:10px 0;font-size:.84rem;color:var(--mut);flex-wrap:wrap;justify-content:center}.tl li::before{content:"";display:inline-block;width:8px;height:8px;border:1px solid currentColor;border-radius:50%;margin-inline-end:8px}.tl li.on{color:var(--accent)}.tl li.on::before{background:var(--accent)}
'''
NEW_CSS+=r'''
.brq{display:flex;gap:18px;align-items:end;margin-top:40px;padding-top:22px;border-top:1px solid var(--line);flex-wrap:wrap}.brq div{flex:1;min-width:200px}.brq b{display:block}.brq small{color:var(--mut)}.brq .in{flex:1;min-width:180px}
#menuBtn{display:none;color:inherit;padding:0 6px}
.back,.btn,.views button,.ac,.tcard,.mcard,#userBtn{-webkit-tap-highlight-color:transparent}
button,a,.btn{touch-action:manipulation}
@media(max-width:760px){
 .bar{gap:6px!important;height:60px!important}
 #menuBtn{display:block}
 header nav{display:none;position:absolute;inset-inline:0;top:100%;background:var(--bg);color:var(--ink);flex-direction:column;padding:8px 20px 16px;border-bottom:1px solid var(--line);box-shadow:0 16px 30px #0001}
 header nav.open{display:flex;animation:mdIn .25s ease}
 header nav a{padding:14px 0;border-bottom:1px solid var(--line);font-size:1rem}
 .branchsel{max-width:120px;font-size:.8rem}
 .ubtn span{display:none}.ubtn{padding:0 4px}
 .hero h1{font-size:2.5rem}.heroart{width:100%;max-width:340px;height:340px;justify-self:center}
 .sh h2{font-size:1.7rem}
 .views{max-width:calc(100% - 20px);inset-inline-end:10px;bottom:48px}.views button{padding:5px 8px}
 .lights{bottom:10px}
 .mag{grid-template-columns:1fr 1fr;gap:20px 14px}
 .ckpage .f2{grid-template-columns:1fr}.ckpage .f2.g{grid-template-columns:1fr auto}.ckpage h2{font-size:1.9rem}
 .md-b{padding:30px 20px 22px}.ckside{position:static}
 .tl{gap:12px;flex-direction:column;align-items:center}
 .stepper{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
 .stepper::-webkit-scrollbar{display:none}
 .stepper li{min-width:64px}
}
@media(max-width:380px){.mag{grid-template-columns:1fr}.hero h1{font-size:2.1rem}}
@media(hover:none){.hintT{display:none}.ac:hover canvas{transform:none}}
button:focus-visible,a:focus-visible,.ac:focus-visible,li[role=button]:focus-visible,.in:focus-visible{outline:1.5px solid var(--accent);outline-offset:3px}
@media(prefers-reduced-motion:reduce){.md-b,header nav.open{animation:none}.ac canvas{transition:none}}
'''
NEW_CSS+=r'''
.dots{display:flex;gap:5px;margin:8px 0 2px}.dots i{width:18px;height:2px;background:var(--line);transition:background-color .3s,width .3s}.dots i.d{background:var(--accent)}.dots i.c{background:var(--ink);width:30px}
.stepper li{flex:1;min-width:0}.stepper li span{font-size:.9rem}
.pqs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.pq{text-align:start;display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--line);background:var(--card);transition:border-color .25s,transform .25s}
.pq:hover{border-color:var(--accent);transform:translateY(-2px)}.pq b{font-weight:400}.pq small{color:var(--mut);font-size:.76rem;line-height:1.6}.pq em{font-style:normal;color:var(--accent);font-size:.82rem;margin-top:auto}
details.more{border-top:1px solid var(--line);padding-top:6px}details.more>summary{cursor:pointer;color:var(--mut);font-size:.88rem;padding:10px 0;list-style:none}details.more>summary::before{content:"+ ";color:var(--accent)}details.more[open]>summary::before{content:"− "}details.more>summary::-webkit-details-marker{display:none}
.navPrice{display:none}
@media(max-width:900px){
 .sbar .r1{display:none}.sbar{padding:6px 14px}
 #stepNav{position:sticky;bottom:0;z-index:7;background:color-mix(in srgb,var(--bg) 94%,transparent);backdrop-filter:blur(12px);margin:20px -18px 0;padding:10px 18px calc(10px + env(safe-area-inset-bottom,0px));align-items:center}
 .navPrice{display:flex;flex-direction:column;line-height:1.3;margin-inline-end:auto}.navPrice small{color:var(--mut);font-size:.7rem}.navPrice b{font-weight:300;font-size:1.05rem;font-variant-numeric:tabular-nums}
 #stepNav .btn{padding:12px 16px;white-space:nowrap}
 .stage{height:44vh!important}
 .pqs{grid-template-columns:1fr 1fr}
}
'''
CSS=css3+NEW_CSS
BODY='''<div id="prog" aria-hidden="true"></div>
<div id="splash" aria-hidden="true"><div class="in"><svg viewBox="-100 -100 200 200"><g fill="none" stroke="#ff8fb3" stroke-width="3">'''+''.join(f'<g transform="rotate({i*45})"><ellipse class="pt" style="--i:{i}" cx="0" cy="-52" rx="19" ry="40" fill="#e83e78" fill-opacity=".85" stroke="#ffd0df"/></g>' for i in range(8))+'''</g><circle class="ct" r="20" fill="#f4c26b"/></svg><div class="t"><span>یونی‌فلاور</span></div><div class="s">دسته‌گلت رو خودت بساز</div></div></div>
<header><div class="wrap bar">
  <a href="#" class="logo" id="logo"></a>
  <nav><a href="#branches">شعبه‌ها</a><a href="#shop">طرح‌های آماده</a><a href="#studio">طراحی سفارشی</a><a href="#magazine">مجله‌ی گل</a></nav>
  <div class="sp"></div>
  <select id="hdrBranch" class="branchsel" aria-label="شعبه"></select>
  <button class="ubtn" id="userBtn" aria-label="حساب کاربری"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg><span>ورود</span></button>
  <button class="cartbtn" id="openCart" aria-label="سبد خرید"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><b id="cartN">۰</b></button>
</div></header>
<main>
<div class="hero"><div class="wrap">
  <div class="htxt">
    <div class="eyebrow">گل‌فروشی دانشگاهی</div>
    <h1><span class="ln" style="--i:0"><span style="--i:0">دسته‌گلت رو</span></span><span class="ln"><span style="--i:1">قدم به قدم بساز</span></span></h1>
    <p class="lead">مدل، گل اصلی و فرعی، کاغذ، روبان، نخ کنفی و کارت تبریک رو یکی‌یکی انتخاب کن و دسته‌گل خودت رو سه‌بعدی ببین؛ بچرخونش و بعد توی شعبه‌ی دانشگاه خودت تحویل بگیر.</p>
    <div class="cta"><a class="btn wh" href="#studio">شروع طراحی</a><a class="lnk" href="#shop">دیدن طرح‌های آماده</a></div>
  </div>
  <div class="heroart" id="heroArt" aria-label="نمونه‌ی سه‌بعدی دسته‌گل"></div>
</div></div>
<div class="tick" aria-hidden="true"><div class="track" id="ticker"></div></div>
<div class="band" data-rv><div class="wrap"><div><b data-n="6">۶</b><span>نوع گل سه‌بعدی</span></div><div><b data-n="8">۸</b><span>مدل دسته‌گل و باکس</span></div><div><b data-n="10">۱۰</b><span>مرحله‌ی طراحی</span></div><div><b data-n="5">۵</b><span>مدل کارت تبریک</span></div></div></div>

<section id="branches"><div class="wrap">
  <div class="sh" data-rv><div><h2>شعبه‌ها</h2><p>دانشگاهت رو انتخاب کن. رنگ سایت، ساعت کاری، محل تحویل و طرح‌های ویژه‌ی همون شعبه عوض می‌شه.</p></div></div>
  <div class="bidx"><div id="branchGrid" data-rv></div><div class="binfo" id="binfo" data-rv></div></div>
</div></section>

<section id="gallery" style="padding:64px 0 8px"><div class="wrap">
  <div class="sh" data-rv><div><h2>نمونه‌ی دسته‌گل‌ها</h2><p>چند نمونه‌ی آماده با گل‌های واقعی. هر کدوم رو می‌تونی توی طراحی سفارشی خودت بسازی و عوض کنی.</p></div></div>
  <div class="gal" id="gal"></div>
</div></section>

<section id="shop" style="padding-top:20px"><div class="wrap">
  <div class="sh" data-rv><div><h2>طرح‌های آماده</h2><p id="shopSub"></p></div></div>
  <div class="toolbar" data-rv>
    <button class="chip on" data-k="all">همه</button><button class="chip" data-k="bouquet">دسته‌گل</button><button class="chip" data-k="box">باکس گل</button>
    <div class="sp"></div>
    <select id="sort" aria-label="مرتب‌سازی"><option value="pop">پیشنهاد شعبه</option><option value="asc">ارزان‌ترین</option><option value="desc">گران‌ترین</option></select>
  </div>
  <div class="grid" id="grid"></div>
  <p class="note">قیمت‌ها تخمینی و بر پایه‌ی بازار گل تهران‌اند و قبل از راه‌اندازی باید با قیمت روز تأمین‌کننده تنظیم بشن. همه‌ی قیمت‌ها از یک جدول واحد (PRICES) خونده می‌شن.</p>
</div></section>

<section id="studio"><div class="wrap">
  <div class="sh" data-rv><div><h2>طراحی سفارشی</h2><p>سه بخش ساده: گل‌ها، بسته‌بندی، تحویل. هر انتخاب همون لحظه روی دسته‌گل سه‌بعدی سمت چپ اثر می‌ذاره.</p></div></div>
  <ol class="stepper" id="stepper"></ol>
  <div class="wz">
    <div>
      <div id="stepHead"></div>
      <div id="stepBody"></div>
      <div id="stepWarn"></div>
      <div id="stepNav"></div>
    </div>
    <div class="stageWrap">
      <div class="stage" id="stage"><div class="tools"><button type="button" id="bUndo">برگشت</button><button type="button" id="bRedo">جلو</button><button type="button" id="bShuf">چیدمان جدید</button><button type="button" id="bOver">نمای کلی</button></div><div class="hintT">بکشید تا بچرخه • دوبار کلیک: نمای کلی</div></div>
      <div class="sbar"><div class="r1"><small>قیمت تخمینی</small><span class="pr" id="sPrice">۰ تومان</span></div><div class="meter"><i id="sCap"></i></div><small id="sCapT"></small></div>
    </div>
  </div>
</div></section>
<section id="magazine"><div class="wrap"><div class="sh"><div><h2>مجله‌ی گل</h2><p>با گل‌ها آشنا شو؛ معنی، فصل، ماندگاری و نگهداری هر کدوم.</p></div></div><div class="mag" id="mag"></div></div></section>
</main>
<footer><div class="wrap"><div class="big" aria-hidden="true">یونی‌فلاور</div>
  <div><small>نام و اطلاعات تماس نمونه‌ست و بعداً با اطلاعات واقعی جایگزین می‌شه.</small><div><small>شعبه‌ها: <span id="ftBranches"></span></small></div></div>
</div></footer>
<div class="ov" id="ov"></div>
<aside class="drawer" id="drawer"><div class="dh"><span>سبد خرید</span><button id="closeCart" style="font-size:1.4rem" aria-label="بستن">✕</button></div><div class="db" id="cartBody"></div><div class="df" id="cartFoot"></div></aside>
<div class="toast" id="toast" role="status"></div>
'''
def build(three_src,out,extra_head=''):
    three=open(D+'src/three.min.js',encoding='utf-8').read()
    import base64,glob,json
    ph={os.path.basename(f)[:-5]:'data:image/webp;base64,'+base64.b64encode(open(f,'rb').read()).decode() for f in sorted(glob.glob(D+'assets/*.webp'))}
    js='window.PHOTOS='+json.dumps(ph)+';\n'+''.join(open(D+'src/'+f,encoding='utf-8').read()+'\n' for f in ['data.js','engine.js','scene.js','photo.js','pflower.js','viewer.js','app.js','fx.js','site.js'])
    html=f'''<title>یونی‌فلاور</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#17a673">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@200;300;400;500&display=swap" rel="stylesheet">
<style>{CSS}</style>
{BODY}
<script>{three}</script>
<script>document.documentElement.dir='rtl';document.documentElement.lang='fa';
{js}</script>'''
    open(out,'w',encoding='utf-8').write(html)
    print(out,len(html))
build('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',D+'index.html')
build('three.min.js',D+'src/local.html')
