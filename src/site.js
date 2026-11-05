/* ====== نمای زاویه‌ها، ورود، پرداخت، مجله ====== */
(function(){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const A=()=>window.__app,fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const st={get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600)};

/* ---------- زاویه‌ها ---------- */
function views(){
 const s=$('#stage');if(!s||s.querySelector('.views'))return;
 const d=document.createElement('div');d.className='views';d.setAttribute('role','group');d.setAttribute('aria-label','زاویه‌ی دید');
 d.innerHTML=[['front','روبه‌رو'],['three','سه‌چهارم'],['side','کنار'],['back','پشت'],['top','از بالا']].map(v=>`<button type="button" data-v="${v[0]}">${v[1]}</button>`).join('')+'<i></i><button type="button" data-z="1.18" aria-label="دور">−</button><button type="button" data-z="0.85" aria-label="نزدیک">+</button>';
 s.appendChild(d);
 d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const S=A().STUDIO;
  if(b.dataset.v){S.view(b.dataset.v);$$('.views button[data-v]',d).forEach(x=>x.classList.toggle('on',x===b))}
  else S.zoomBy(+b.dataset.z)});
 const hint=document.createElement('div');hint.className='dragHint';hint.textContent='بکش و بچرخون';s.appendChild(hint);
 setTimeout(()=>hint.classList.add('off'),6000);s.addEventListener('pointerdown',()=>hint.classList.add('off'),{once:true});
}

/* ---------- ورود ---------- */
let user=st.get('uf_user',null);
function ovl(html,cls){
 let o=$('#modal');if(!o){o=document.createElement('div');o.id='modal';document.body.appendChild(o)}
 o.className='md on '+(cls||'');o.innerHTML=`<div class="md-b" role="dialog" aria-modal="true">${html}</div>`;
 o.onclick=e=>{if(e.target===o||e.target.closest('[data-close]'))closeM()};document.body.style.overflow='hidden';return o;
}
function closeM(){const o=$('#modal');if(o){o.classList.remove('on');o.innerHTML=''}document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});
function userBtn(){
 const b=$('#userBtn');if(!b)return;b.querySelector('span').textContent=user?fa(user.phone.slice(-4)):'ورود';
}
function loginUI(after){
 const o=ovl(`<button class="x" data-close aria-label="بستن">✕</button><h3>ورود یا ثبت‌نام</h3><p class="sub">شماره‌ی موبایلت رو وارد کن تا سفارش‌هات ذخیره بشه.</p>
 <div id="lg1"><label for="lgPhone">شماره‌ی موبایل</label><input class="in" id="lgPhone" inputmode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" autocomplete="tel"><button class="btn" id="lgSend">ارسال کد</button></div>
 <div id="lg2" hidden><label for="lgCode">کد تأیید پنج‌رقمی</label><input class="in" id="lgCode" inputmode="numeric" maxlength="5" placeholder="•••••"><button class="btn" id="lgOk">تأیید و ورود</button><p class="sub" id="lgNote"></p></div>`);
 const norm=v=>v.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g,'');
 $('#lgSend').onclick=()=>{const p=norm($('#lgPhone').value);if(!/^09\d{9}$/.test(p)){toast('شماره‌ی موبایل رو درست وارد کن (۰۹...)');return}
  $('#lg1').hidden=true;$('#lg2').hidden=false;$('#lgNote').textContent='نسخه‌ی نمایشی: پیامک واقعی ارسال نمی‌شه. کد ۱۲۳۴۵ رو بزن.';$('#lgCode').focus();o.dataset.p=p};
 $('#lgOk').onclick=()=>{if(norm($('#lgCode').value)!=='12345'){toast('کد اشتباهه');return}
  user={phone:o.dataset.p};st.set('uf_user',user);userBtn();closeM();toast('وارد شدی');if(after)after()};
 setTimeout(()=>$('#lgPhone').focus(),50);
}
function accountUI(){
 const os=st.get('uf_orders',[]).filter(x=>x.phone===user.phone||!x.phone);
 ovl(`<button class="x" data-close aria-label="بستن">✕</button><h3>حساب من</h3><p class="sub">${fa(user.phone)}</p>
 <h4>سفارش‌ها</h4>${os.length?os.map(o=>`<div class="ord"><b>${o.code}</b><span>${esc(o.branch)} • ${esc(o.when)}</span><em>${A().T$(o.sum)}</em></div>`).join(''):'<p class="sub">هنوز سفارشی نداری.</p>'}
 <button class="btn ghost" id="lgOut">خروج</button>`);
 $('#lgOut').onclick=()=>{user=null;st.set('uf_user',null);userBtn();closeM()};
}

/* ---------- صفحه‌ی پرداخت ---------- */
const TIMES=['۹ تا ۱۱','۱۱ تا ۱۳','۱۳ تا ۱۵','۱۵ تا ۱۷','۱۷ تا ۱۹'];
function checkout(){
 const a=A(),cart=a.cart;if(!cart.length){toast('سبد خالیه');return}
 if(!user){a.openCart(false);loginUI(checkout);return}
 a.openCart(false);
 const bs=a.BRANCHES.filter(b=>!b.soon),cur=a.DELIV&&a.DELIV.branch||a.branchObj.id,sum=cart.reduce((t,i)=>t+a.price(i.cfg)*i.qty,0);
 const ship=0,tomorrow=new Date(Date.now()+864e5).toISOString().slice(0,10);
 const pg=document.createElement('div');pg.id='ckpage';pg.className='ckpage';
 pg.innerHTML=`<div class="wrap"><button class="back" data-back>← بازگشت به سایت</button><h2>ثبت سفارش</h2>
 <div class="ckgrid"><form id="ckForm" novalidate>
  <fieldset><legend>تحویل</legend>
   <div class="fld"><label for="c1">شعبه</label><select class="in" id="c1">${bs.map(b=>`<option value="${b.id}" ${b.id===cur?'selected':''}>${b.name} | ${b.uni}</option>`).join('')}</select><small class="hint" id="c1s"></small></div>
   <div class="f2"><div class="fld"><label for="c2">تاریخ</label><input class="in" type="date" id="c2" value="${tomorrow}" min="${new Date().toISOString().slice(0,10)}"></div><div class="fld"><label for="c3">ساعت</label><select class="in" id="c3">${TIMES.map(t=>`<option>${t}</option>`).join('')}</select></div></div>
  </fieldset>
  <fieldset><legend>گیرنده</legend>
   <div class="f2"><div class="fld"><label for="c4">نام گیرنده</label><input class="in" id="c4" autocomplete="name"></div><div class="fld"><label for="c5">موبایل گیرنده</label><input class="in" id="c5" inputmode="tel" value="${user.phone}"></div></div>
   <div class="fld"><label for="c6">توضیحات (اختیاری)</label><textarea class="in" id="c6" rows="2" placeholder="مثلاً تحویل در کتابخانه"></textarea></div>
  </fieldset>
  <fieldset><legend>پرداخت</legend>
   <label class="opt"><input type="radio" name="pay" value="online" checked><span><b>پرداخت آنلاین</b><small>اتصال به درگاه (در نسخه‌ی نمایشی شبیه‌سازی می‌شه)</small></span></label>
   <label class="opt"><input type="radio" name="pay" value="cod"><span><b>پرداخت هنگام تحویل</b><small>در شعبه یا به پیک</small></span></label>
   <div class="fld"><label for="c7">کد تخفیف</label><div class="f2 g"><input class="in" id="c7" placeholder="UNI10"><button type="button" class="btn ghost" id="c7b">اعمال</button></div></div>
  </fieldset>
  <button class="btn big" id="ckGo" type="submit">پرداخت و ثبت سفارش</button>
 </form>
 <aside class="ckside"><h3>خلاصه‌ی سفارش</h3>${cart.map(i=>`<div class="ckit"><img alt="" src="${i.img||''}"><div><b>${esc(i.name)}</b><small>${fa(i.qty)} عدد</small></div><em>${a.T$(a.price(i.cfg)*i.qty)}</em></div>`).join('')}
  <div class="row"><span>جمع</span><span>${a.T$(sum)}</span></div><div class="row" id="dis" hidden><span>تخفیف</span><span></span></div><div class="row"><span>هزینه‌ی تحویل در دانشگاه</span><span>رایگان</span></div>
  <div class="row tot"><span>قابل پرداخت</span><span id="payT">${a.T$(sum)}</span></div></aside></div></div>`;
 document.body.appendChild(pg);document.body.style.overflow='hidden';requestAnimationFrame(()=>pg.classList.add('on'));
 let off=0;const upd=()=>{const b=bs.find(x=>x.id===$('#c1').value);$('#c1s').textContent=b.spot+' • '+b.hours};upd();$('#c1').onchange=upd;
 const close=()=>{pg.remove();document.body.style.overflow=''};$('[data-back]',pg).onclick=close;
 $('#c7b').onclick=()=>{if($('#c7').value.trim().toUpperCase()==='UNI10'){off=Math.round(sum*.1);$('#dis').hidden=false;$('#dis span:last-child').textContent='− '+a.T$(off);$('#payT').textContent=a.T$(sum-off);toast('۱۰٪ تخفیف اعمال شد')}else toast('کد معتبر نیست')};
 $('#ckForm').onsubmit=e=>{e.preventDefault();
  const nm=$('#c4').value.trim(),ph=$('#c5').value.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g,'');
  if(!nm){toast('نام گیرنده رو بنویس');$('#c4').focus();return}
  if(!/^09\d{9}$/.test(ph)){toast('موبایل گیرنده درست نیست');$('#c5').focus();return}
  const b=bs.find(x=>x.id===$('#c1').value),pay=$('input[name=pay]:checked').value,go=()=>{
   const o={code:'UF-'+Math.random().toString(36).slice(2,8).toUpperCase(),branch:b.name,when:$('#c2').value+' • '+$('#c3').value,sum:sum-off,phone:user.phone,pay,to:nm,at:Date.now()};
   const os=st.get('uf_orders',[]);os.unshift(o);st.set('uf_orders',os.slice(0,30));a.clearCart();done(pg,o,b,close)};
  if(pay==='online'){const btn=$('#ckGo');btn.disabled=true;btn.textContent='در حال اتصال به درگاه نمونه…';setTimeout(go,1400)}else go();
 };
}
function done(pg,o,b,close){
 pg.querySelector('.wrap').innerHTML=`<div class="okpg"><svg viewBox="0 0 52 52" width="64"><circle cx="26" cy="26" r="24" fill="none" stroke="var(--accent)" stroke-width="1"/><path d="M15 27l8 8 14-16" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="40" stroke-dashoffset="40"><animate attributeName="stroke-dashoffset" to="0" dur=".7s" begin=".2s" fill="freeze"/></path></svg>
 <h2>سفارشت ثبت شد</h2><p>کد پیگیری</p><div class="code">${o.code}</div>
 <ol class="tl"><li class="on">ثبت شد</li><li>آماده‌سازی در شعبه</li><li>تحویل در ${esc(b.spot)}</li></ol>
 <p class="sub">${esc(o.branch)} • ${esc(o.when)} • ${A().T$(o.sum)}${o.pay==='cod'?' • پرداخت هنگام تحویل':''}</p>
 <p class="sub">این نسخه‌ی نمایشیه؛ پرداخت و ارسال واقعی نشده.</p><button class="btn" id="okc">بستن</button></div>`;
 $('#okc').onclick=close;
}

/* ---------- مجله ---------- */
const ART=[
 {id:'rose',t:'رز',type:'rose',tag:'گل',sub:'نشانه‌ی عشق و قدردانی',life:7,season:'تمام سال',
  p:['رز پرطرفدارترین گل شاخه‌بریده‌ست. رنگ‌هاش معنی‌های جدا دارن: قرمز برای عشق، صورتی برای قدردانی و مهربانی، سفید برای آغاز تازه و زرد برای دوستی.','برای دسته‌گل، رزهای نیمه‌باز بهتر از غنچه‌ی کاملاً بسته دوام می‌آرن و تا چند روز کامل باز می‌شن.'],
  care:['ته ساقه رو مایل ببُر و برگ‌های زیر آب رو بگیر','هر دو روز آب رو عوض کن','دور از نور مستقیم و میوه‌ی رسیده نگه دار']},
 {id:'lily',t:'لیلیوم',type:'lily',tag:'گل',sub:'بوی خوش و شکوه',life:10,season:'بهار تا پاییز',
  p:['لیلیوم گل بزرگ و معطریه که یک شاخه‌ش چند غنچه داره و در طول چند روز یکی‌یکی باز می‌شه، پس دسته‌گل مدت بیشتری تازه می‌مونه.','سفید لیلیوم نماد پاکی و آرامشه و صورتی‌ش حس لطیف و قدردانی می‌رسونه.'],
  care:['پرچم‌های نارنجی رو با دست‌کش یا دستمال بچین تا لکه نشن','آب خنک بده','برای حساسیت به عطر، اتاق رو تهویه کن']},
 {id:'tulip',t:'لاله',type:'tulip',tag:'گل',sub:'بهار در یک دسته',life:5,season:'زمستان تا اواسط بهار',
  p:['لاله گل فصل سرده و ساقه‌ش توی گلدون هم رشد می‌کنه و به سمت نور خم می‌شه. همین حرکت، دسته‌گل رو زنده نشون می‌ده.','لاله‌ی قرمز اعلام عشقه، زرد شادی و صورتی مهربانی.'],
  care:['آب سرد و کم‌عمق (حدود ۱۰ سانت) کافیه','ساقه رو هر چند روز کمی کوتاه کن','دور از گرما و بخاری نگه دار']},
 {id:'gerbera',t:'ژربرا',type:'gerbera',tag:'گل',sub:'شادی و انرژی',life:8,season:'تمام سال',
  p:['ژربرا از خانواده‌ی مینا و اقاقیاست و با گلبرگ‌های پهن و رنگ‌های زنده، حال‌وهوای شاد به هر دسته‌ای می‌ده.','برای تولد و جشن فارغ‌التحصیلی انتخاب خیلی خوبیه.'],
  care:['ساقه‌ش نرمه؛ آب کم‌عمق (۵ سانت) بریز','ته ساقه رو مایل ببُر','هر روز آب رو عوض کن']},
 {id:'carn',t:'میخک',type:'carn',tag:'گل',sub:'ماندگار و مقاوم',life:12,season:'تمام سال',
  p:['میخک از ماندگارترین گل‌های شاخه‌بریده‌ست و با گلبرگ‌های چین‌دارش دسته‌گل رو پرحجم نشون می‌ده.','میخک صورتی نماد مهر مادریه و قرمز علاقه و احترام.'],
  care:['برگ‌های زیر آب رو حذف کن','با آب و کمی قند یا غذای گل، دوامش بیشتر می‌شه','گل‌های پژمرده رو زود جدا کن']},
 {id:'baby',t:'عروس (ژیپسوفیلا)',type:'baby',tag:'گل',sub:'ابر کوچک سفید',life:14,season:'تمام سال',
  p:['ریزگل‌های سفید ژیپسوفیلا فضای خالی بین گل‌های اصلی رو پر می‌کنن و به دسته‌گل نرمی و عمق می‌دن.','به‌خاطر دوام بالا، می‌تونی بعد از پژمرده شدن گل‌های اصلی، اون رو خشک و نگه‌داری کنی.'],
  care:['نیازی به آب زیاد نداره','دور از رطوبت سنگین نگه دار','برای خشک شدن، وارونه آویزونش کن']},
 {id:'care',t:'۶ کار ساده که عمر دسته‌گل رو دو برابر می‌کنه',tag:'راهنما',sub:'نگهداری',
  p:['۱) ساقه‌ها رو زیر آب و مایل ببُر. ۲) گلدون و آب رو تمیز نگه دار و هر دو روز عوضش کن. ۳) برگ‌های زیر خط آب رو بگیر. ۴) دور از نور مستقیم، بخاری و میوه نگه دار. ۵) گل‌های پژمرده رو جدا کن. ۶) غذای گل اگه داری، بریز.','باکتری آب مهم‌ترین عامل پژمرده شدنه، نه کمبود آب.']},
 {id:'color',t:'چه رنگی برای چه مناسبتی؟',tag:'راهنما',sub:'انتخاب رنگ',
  p:['تولد: رنگ‌های گرم و شاد مثل نارنجی و زرد. قدردانی از استاد یا دوست: صورتی و سفید. ابراز علاقه: قرمز و سرخابی. تبریک فارغ‌التحصیلی: ترکیب رنگی با سبزی زیاد.','اگه مطمئن نیستی، سفید و سبز همیشه امنه.']},
 {id:'wrap',t:'کاغذ و روبان؛ چطور انتخاب کنیم؟',tag:'راهنما',sub:'بسته‌بندی',
  p:['کاغذ کرافت حال‌وهوای طبیعی و ساده می‌ده و با گل‌های رنگی خوب می‌شینه. کاغذ سفید یا کرم برای گل‌های پررنگ مناسبه.','روبان ارگانزا لطیف‌تره و ساتن براق‌تر. نخ کنفی هم ظاهر دست‌ساز می‌ده.']}
];
function magazine(){
 const g=$('#mag');if(!g)return;
 g.innerHTML=ART.map((a,i)=>`<article class="ac" data-a="${a.id}" tabindex="0" role="button"><div class="ph ${a.type?'':'nop'}"><canvas width="220" height="220" data-t="${a.type||''}"></canvas></div><small>${a.tag}${a.life?` • ${fa(a.life)} روز دوام`:''}</small><h3>${a.t}</h3><p>${a.sub}</p></article>`).join('');
 $$('#mag canvas').forEach(c=>{const t=c.dataset.t;if(!t)return;try{const sp=A().FL[t].cols[0][3],im=PH.IMG[sp],x=c.getContext('2d'),r=Math.min(190/im.width,190/im.height);x.drawImage(im,110-im.width*r/2,110-im.height*r/2,im.width*r,im.height*r)}catch(e){}});
 const open=id=>{const a=ART.find(x=>x.id===id);
  ovl(`<button class="x" data-close aria-label="بستن">✕</button><small class="kick">${a.tag}${a.season?` • فصل: ${a.season}`:''}${a.life?` • ${fa(a.life)} روز دوام در گلدون`:''}</small><h3>${a.t}</h3><p class="sub">${a.sub}</p>${a.p.map(x=>`<p>${x}</p>`).join('')}${a.care?`<h4>نگهداری</h4><ul>${a.care.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}${a.type?`<button class="btn" id="mkB">با این گل دسته‌گل بساز</button>`:''}`,'art');
  const b=$('#mkB');if(b)b.onclick=()=>{closeM();const t=a.type,it={};it[t]=[9,0];if(t!=='baby')it.baby=[3,0];const ap=A();ap.loadCfg(ap.def('bouquet',{mainT:t,items:it,seed:5}));$('#studio').scrollIntoView({behavior:'smooth'})};
 };
 g.addEventListener('click',e=>{const c=e.target.closest('.ac');if(c)open(c.dataset.a)});
 g.addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.ac');if(c)open(c.dataset.a)}});
}

function menu(){
 const h=$('header .bar');if(!h||$('#menuBtn'))return;
 const b=document.createElement('button');b.id='menuBtn';b.setAttribute('aria-label','منو');b.setAttribute('aria-expanded','false');b.innerHTML='<svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 8h16M4 16h16"/></svg>';
 h.appendChild(b);const nav=$('header nav');
 const set=on=>{nav.classList.toggle('open',on);b.setAttribute('aria-expanded',on)};
 b.onclick=()=>set(!nav.classList.contains('open'));nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
}
function branchReq(){
 const w=$('#branches .wrap');if(!w||$('#brq'))return;
 const f=document.createElement('form');f.id='brq';f.className='brq';
 f.innerHTML='<div><b>دانشگاهت این‌جا نیست؟</b><small>اسمش رو بنویس؛ شعبه‌های بعدی بر اساس درخواست‌ها باز می‌شن.</small></div><input class="in" id="brqI" placeholder="مثلاً دانشگاه فردوسی" aria-label="نام دانشگاه"><button class="btn" type="submit">ثبت درخواست</button>';
 w.appendChild(f);
 f.onsubmit=e=>{e.preventDefault();const v=$('#brqI').value.trim();if(v.length<3){toast('نام دانشگاه رو بنویس');return}
  const r=st.get('uf_branch_req',[]);r.push({v,at:Date.now()});st.set('uf_branch_req',r);$('#brqI').value='';toast('درخواستت ثبت شد، ممنون');};
}
function init(){menu();branchReq();
 views();magazine();userBtn();
 $('#userBtn').onclick=()=>user?accountUI():loginUI();
 document.addEventListener('click',e=>{if(e.target.id==='toCheckout'){e.stopImmediatePropagation();e.preventDefault();checkout()}},true);
 new MutationObserver(views).observe($('#studio')||document.body,{childList:true,subtree:true});
}
window.addEventListener('load',()=>setTimeout(()=>{try{if(window.__app)init();else setTimeout(init,300)}catch(e){console.error(e)}},50));
})();
