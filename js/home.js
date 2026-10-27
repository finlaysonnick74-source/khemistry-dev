/* Khemistry home: shared layout (NDC <-> world, used by hero3d.js and the DOM overlay), title lockup timing, P tiles panel, formula tabs, logo replay. */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,hero=$('.h3d');
const T=Math.tan;
/* All positions derive from the viewport. Final camera sits at (0,0,D) looking at the origin; the table hangs on the z=0 wall. */
function KhemLayout(W,H){const A=W/H,mob=A<1,fov=mob?40:30,D=20,tn=T(fov*Math.PI/360),hh0=D*tn,hw0=hh0*A,hh=z=>(D-z)*tn;
  const o={A,fov,D,hh0,mob};
  if(!mob){const x0=-.33,x1=.94,top=.66,bot=-.50;
    const sW=(x1-x0)*hw0/18,sH=(top-bot)*hh0/10;const s=Math.min(sW,sH);o.s=s;
    o.X0=s===sW?x0*hw0:((x0+x1)/2)*hw0-9*s;o.Ytop=top*hh0;
    o.ws=s*.97;const wy=o.Ytop-1.55*s,wx=o.X0+7*s;o.word=[...Array(9)].map((_,i)=>({x:wx+(i-4)*s*1.02,y:wy,z:.5*s}));
    o.credit={x:wx,y:o.Ytop-2.78*s,z:0};
    o.ps=1.55*s;const pz=.9,py=o.Ytop-10*s-.42*s-o.ps/2,right=o.X0+18*s;o.ppp=[0,1,2].map(i=>({x:right-o.ps/2-(2-i)*1.22*o.ps,y:py,z:pz}));
    const pzp=1.4;let ph=1.62*hh(pzp),pw=ph*2/3;const maxW=(x0+1-.03)*hh(pzp)*A;if(pw>maxW){pw=maxW;ph=pw*1.5}
    o.por={w:pw,h:ph,x:x0*hh(pzp)*A-.03*hh(pzp)*A-pw/2+pw*.04,y:-hh(pzp)-.02*hh(pzp)+ph/2,z:pzp};
    o.hl={x:o.X0,y:o.Ytop-10*s-.42*s,z:0,right:o.ppp[0].x-o.ps*.75};
  }else{/* portrait screens: word, then a slightly zoomed table (columns 1 and 18 crop at the edges so tiles stay legible),
    then Maidlin + the three P tiles in the band that ends ABOVE the headline (no overlap). */
    const ws=Math.min(2*hw0*.93/9.3,hh0*.11);o.ws=ws;const ndcY=px=>1-2*px/H;
    const wy=Math.min(.74*hh0,ndcY(80)*hh0-ws*.62);o.word=[...Array(9)].map((_,i)=>({x:(i-4)*ws*1.03,y:wy,z:.5*ws}));
    o.credit={x:0,y:wy-ws*1.02,z:0};
    const s=Math.min(2*hw0/17.4,.062*hh0);o.s=s;o.X0=-9*s;o.Ytop=o.credit.y-ws*.5;
    const tb=o.Ytop-10*s,tcPx=H-(W<380?232:W>=600?240:206);/* top of the headline block (bottom:58px + ~150px of text/buttons) */
    const pzp=1.4,hp=hh(pzp),ptop=(tb/hh0-.02)*hp,pbot=ndcY(tcPx)*hp+.015*hp;let ph=Math.max(.2,ptop-pbot),pw=ph*2/3;
    const maxW=.9*hp*A;if(pw>maxW){pw=maxW;ph=pw*1.5}
    o.por={w:pw,h:ph,x:-hp*A+pw/2+.05*hp*A,y:pbot+ph/2,z:pzp};
    const zp=.9,hz=hh(zp),prR=(o.por.x+pw/2)/(hp*A),xa=(prR+.04)*hz*A,xb=.95*hz*A,yc=((ptop+pbot)/2)/hp*hz;
    o.ps=Math.min((xb-xa)/3.5,(ptop-pbot)/hp*hz*.6,s*2.6);const cx=(xa+xb)/2;
    o.ppp=[0,1,2].map(i=>({x:cx+(i-1)*1.2*o.ps,y:yc,z:zp}));
    o.hl=null;}
  o.proj=p=>{const h=hh(p.z),w=h*A;return[(p.x/w+1)/2*100,(1-p.y/h)/2*100]};
  o.px=(len,z)=>len/(2*hh(z))*H;
  return o}
window.KhemLayout=KhemLayout;
const PPP=$$('.ppp-hit').map(b=>[b.dataset.sym,b.dataset.name,b.dataset.num]);window.KHEM_PPP=PPP;

const dom={credit:$('.credit'),tc:$('.titlecard'),chars:[],ctas:$('.titlecard .ctas')};
const hl=$('.h3d .headline');hl.setAttribute('aria-label',hl.textContent);
hl.innerHTML=hl.textContent.trim().split(' ').map(w=>`<span class="w" aria-hidden="true">${[...w].map(c=>`<span class="c">${c}</span>`).join('')}</span>`).join(' ');
dom.chars=$$('.c',hl);
function place(){const r=hero.getBoundingClientRect(),L=KhemLayout(r.width,r.height);
  const[cx,cy]=L.proj(L.credit);hero.style.setProperty('--cr-x',cx+'%');hero.style.setProperty('--cr-y',cy+'%');
  hero.style.setProperty('--tile',L.px(L.ps,.9)+'px');
  $$('.ppp-hit').forEach((b,i)=>{const[x,y]=L.proj(L.ppp[i]);b.style.left=x+'%';b.style.top=y+'%'});
  if(L.hl){const[x,y]=L.proj(L.hl),[xr]=L.proj({x:L.hl.right,y:0,z:0});hero.style.setProperty('--hl-x',x+'%');hero.style.setProperty('--hl-y',y+'%');hero.style.setProperty('--hl-w',(xr-x)+'%');
    /* short windows: never let the CTA row run into the hero's bottom edge */
    const tcH=dom.tc.offsetHeight,maxTop=r.height-tcH-44;if(y/100*r.height>maxTop)hero.style.setProperty('--hl-y',Math.max(0,maxTop/r.height*100)+'%')}}
place();addEventListener('resize',place);document.fonts&&document.fonts.ready.then(place);
const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
/* the lockup appears only after the word has formed (letters land by t=6.2) */
function drive(t,foc){const c1=ss(6.35,7.1,t);dom.credit.style.opacity=c1;dom.credit.style.transform=`translate(-50%,calc(-50% + ${(1-c1)*8}px))`;dom.credit.style.letterSpacing=(.3+.16*(1-c1))+'em';
  dom.tc.style.opacity=t>=7.2?1-foc*.9:0;dom.chars.forEach((c,i)=>{const p=ss(7.2+i*.01,7.2+i*.01+.55,t);c.style.opacity=p;c.style.transform=`translateY(${(1-p)*.45}em)`});
  const b=ss(8.2,8.8,t);dom.ctas.style.opacity=b;dom.ctas.style.transform=`translateY(${(1-b)*10}px)`;}
function showFinal(){[dom.credit,dom.tc,dom.ctas].forEach(e=>{e.style.opacity=1;e.style.transform=''});dom.credit.style.transform='translate(-50%,-50%)';dom.chars.forEach(c=>{c.style.opacity=1;c.style.transform=''})}
window.KhemHome={dom,drive,showFinal,place};
if(!root.classList.contains('live3d'))showFinal();

/* formula tabs */
const tabs=$$('[role=tab]');
function selectTab(k,focus){tabs.forEach(b=>{const on=b.id==='tab-'+k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$('#'+b.getAttribute('aria-controls')).hidden=!on;if(on&&focus)b.focus()});
  const p=$('#panel-'+k);if(!RM){p.classList.remove('enter');void p.offsetWidth;p.classList.add('enter')}}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectTab(b.id.slice(4)));b.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;if(n!==null){e.preventDefault();selectTab(tabs[n].id.slice(4),true)}})});
const toTab=k=>{selectTab(k);$('#formula').scrollIntoView({behavior:RM?'auto':'smooth'});setTimeout(()=>$('#tab-'+k).focus({preventScroll:true}),RM?0:700)};

/* hero P tiles: open a panel with her wording */
const panel=$('#tile-panel'),body=$('.tp-body');let openK=null,opener=null;
function openPanel(k,btn){openK=k;opener=btn;body.innerHTML=$('#panel-'+k).innerHTML;panel.hidden=false;panel.dataset.k=k;hero.classList.add('focus');
  $$('.ppp-hit').forEach(b=>b.setAttribute('aria-expanded',b.dataset.k===k));selectTab(k);dispatchEvent(new CustomEvent('khem:focus',{detail:k}));$('.tp-close').focus({preventScroll:true});}
function closePanel(){if(!openK)return;openK=null;panel.hidden=true;hero.classList.remove('focus');$$('.ppp-hit').forEach(b=>b.setAttribute('aria-expanded','false'));dispatchEvent(new CustomEvent('khem:focus',{detail:null}));opener&&opener.focus({preventScroll:true});}
$$('.ppp-hit').forEach(b=>{b.setAttribute('aria-expanded','false');
  b.addEventListener('click',()=>{dispatchEvent(new CustomEvent('khem:skip'));openK===b.dataset.k?closePanel():openPanel(b.dataset.k,b)});
  ['pointerenter','focus'].forEach(ev=>b.addEventListener(ev,()=>dispatchEvent(new CustomEvent('khem:hover',{detail:b.dataset.k}))));
  ['pointerleave','blur'].forEach(ev=>b.addEventListener(ev,()=>dispatchEvent(new CustomEvent('khem:hover',{detail:null}))));});
$('.tp-close').addEventListener('click',closePanel);
$('.tp-more').addEventListener('click',e=>{e.preventDefault();const k=openK;closePanel();toTab(k||'people')});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(openK)closePanel();else dispatchEvent(new CustomEvent('khem:skip'))}});
$('.skip').addEventListener('click',()=>dispatchEvent(new CustomEvent('khem:skip')));

/* replay: the top-left logo (and the replay control) restart the opening scene */
function replay(){closePanel();const m=$('.menu'),l=$('#navlist');if(m){m.setAttribute('aria-expanded','false');l.classList.remove('open')}
  window.scrollTo({top:0,left:0,behavior:'instant'});
  if(root.classList.contains('live3d'))dispatchEvent(new CustomEvent('khem:replay'));
  const k=$('.brand-k');k.classList.remove('pulse');void k.offsetWidth;k.classList.add('pulse');}
window.KhemReplay=replay;
$('.replay').addEventListener('click',replay);
const brand=$('.brand');brand.addEventListener('click',e=>{e.preventDefault();replay();brand.focus({preventScroll:true})});
if(location.hash==='#replay')history.replaceState(null,'',location.pathname);
})();
