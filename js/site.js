/* Khemistry inner pages: scroll-phased background, nav state, reveals, mobile menu. */
(function(){
  var d=document.documentElement, rm=matchMedia('(prefers-reduced-motion: reduce)');
  d.classList.add('js'); if(!rm.matches) d.classList.add('motion');
  var track=document.querySelector('.bg-track'), nav=document.querySelector('.nav');
  var secs=[].slice.call(document.querySelectorAll('[data-tone]'));
  var docH=0, bands=[];
  /* Section colours come from the --tone-* custom properties in css/site.css (no hex here). */
  var C={};
  function hex(v){var p=document.createElement('i');p.style.color=v;p.style.display='none';document.body.appendChild(p);
    var m=getComputedStyle(p).color.match(/\d+/g);p.remove();return '#'+m.slice(0,3).map(function(x){return(+x).toString(16).padStart(2,'0')}).join('')}
  function readTones(){var cs=getComputedStyle(d);['tint','glass','cream'].forEach(function(k){C[k]=hex(cs.getPropertyValue('--tone-'+k).trim())})}
  function pct(v){return (v/docH*100).toFixed(3)+'%'}
  function lin(x){x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)}
  function gam(x){x=Math.max(0,Math.min(1,x));return Math.round(255*(x<=.0031308?12.92*x:1.055*Math.pow(x,1/2.4)-.055))}
  function toLab(h){var r=lin(parseInt(h.substr(1,2),16)),g=lin(parseInt(h.substr(3,2),16)),b=lin(parseInt(h.substr(5,2),16));
    var l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
    return[.2104542553*l+.7936177850*m-.0040720468*s,1.9779984951*l-2.4285922050*m+.4505937099*s,.0259040371*l+.7827717662*m-.8086757660*s]}
  function fromLab(L){var l=Math.pow(L[0]+.3963377774*L[1]+.2158037573*L[2],3),m=Math.pow(L[0]-.1055613458*L[1]-.0638541728*L[2],3),s=Math.pow(L[0]-.0894841775*L[1]-1.2914855480*L[2],3);
    return 'rgb('+gam(4.0767416621*l-3.3077115913*m+.2309699292*s)+','+gam(-1.2684380046*l+2.6097574011*m-.3413193965*s)+','+gam(-.0041960863*l-.7034186147*m+1.7076147010*s)+')'}
  function along(p,f){var seg=f*(p.length-1),i=Math.min(Math.floor(seg),p.length-2),t=seg-i,A=toLab(p[i]),B=toLab(p[i+1]);t=t*t*t*(t*(6*t-15)+10);
    return fromLab([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t])}
  function build(){
    docH=Math.max(document.documentElement.scrollHeight,innerHeight);
    readTones(); var stops=[], blend=Math.min(innerHeight*.7,560);
    bands=secs.map(function(s){var r=s.getBoundingClientRect(),t=r.top+scrollY;return{t:t,b:t+r.height,tone:s.dataset.tone}});
    bands.forEach(function(b,i){
      var c=C[b.tone]||C.cream, a=i?b.t+blend/2:0, z=i<bands.length-1?b.b-blend/2:docH;
      if(z<a){a=z=(b.t+b.b)/2}
      stops.push(c+' '+pct(a), c+' '+pct(z));
      var n=bands[i+1]; if(!n) return;
      /* transition zone z..next start: direct same-hue oklab path, smoothstep-eased, 48 stops so there is no visible edge */
      var c2=C[n.tone]||C.cream, na=n.t+blend/2, path=[c,c2];
      for(var k=1;k<48;k++){var f=k/48;stops.push(along(path,f)+' '+pct(z+(na-z)*f))}
    });
    if(track){track.style.height=docH+'px';track.style.background='linear-gradient(180deg,'+stops.join(',')+')'}
    tick();
  }
  var ticking=false;
  function tick(){
    ticking=false; var y=scrollY;
    if(track) track.style.transform='translate3d(0,'+(-y)+'px,0)';
    if(nav){
      nav.classList.toggle('scrolled',y>20);
      var probe=y+34, tone='tint';
      for(var i=0;i<bands.length;i++){if(probe>=bands[i].t&&probe<bands[i].b){tone=bands[i].tone;break}}
      nav.classList.toggle('on-cream',tone==='cream');
    }
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});
  addEventListener('resize',build); addEventListener('load',build);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(build);
  build();

  /* reveals */
  var rvs=document.querySelectorAll('.rv');
  if(d.classList.contains('motion')&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(el){io.observe(el)});
  } else rvs.forEach(function(el){el.classList.add('in')});

  /* mobile menu */
  var btn=document.querySelector('.menu'), list=document.getElementById('navlist');
  if(btn&&list){btn.addEventListener('click',function(){var o=list.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&list.classList.contains('open')){list.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus()}})}

  /* placeholder forms: no backend yet; open the visitor's mail app instead */
  var f=document.getElementById('contact-form');
  if(f) f.addEventListener('submit',function(e){e.preventDefault();
    var n=f.elements.name.value,m=f.elements.email.value,b=f.elements.message.value;
    location.href='mailto:khemistry@khemistry.co?subject='+encodeURIComponent('Website enquiry from '+n)+'&body='+encodeURIComponent(b+'\n\n'+n+' ('+m+')');});
  var nl=document.getElementById('newsletter-form');
  if(nl) nl.addEventListener('submit',function(e){e.preventDefault();var s=document.getElementById('nl-status');if(s)s.textContent='Newsletter sign-up is not live yet. Please email khemistry@khemistry.co to be added.'});
})();
/* v5: shared depth language. Element tiles tilt gently toward the pointer and with scroll; inner-page heroes get a
   ghost periodic table (true 18-column silhouette incl. lanthanide/actinide rows) that drifts with scroll. Decorative only. */
(function(){
  var d=document.documentElement,motion=d.classList.contains('motion'),fine=matchMedia('(pointer:fine)').matches;
  // ghost table for inner-page heroes
  function pos(z){if(z===1)return[1,1];if(z===2)return[1,18];if(z<=10)return[2,z<=4?z-2:z+8];if(z<=18)return[3,z<=12?z-10:z];if(z<=36)return[4,z-18];if(z<=54)return[5,z-36];
    if(z>=57&&z<=71)return[9,z-54];if(z>=89&&z<=103)return[10,z-86];if(z<=86)return[6,z<=56?z-54:z-68];return[7,z<=88?z-86:z-100]}
  var SYM='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
  function fam(z){function a(l){return l.indexOf(z)>=0}if(z>=57&&z<=71||z>=89&&z<=103)return'f';if(a([3,11,19,37,55,87]))return'alk';if(a([2,10,18,36,54,86,118]))return'nob';if(a([9,17,35,53,85,117]))return'hal';
    if(a([4,12,20,38,56,88]))return'ae';if(a([13,31,49,50,81,82,83,84,113,114,115,116,5,14,32,33,51,52]))return'post';return'tr'}
  var ghosts=[];
  if(!document.body.classList.contains('home'))document.querySelectorAll('.sec.hero').forEach(function(sec){if(sec.querySelector('img.portrait'))return;/* no table behind Maidlin */
    var g=document.createElement('div');g.className='pt-ghost';g.setAttribute('aria-hidden','true');var h='';
    for(var z=1;z<=118;z++){var p=pos(z);h+='<span class="'+fam(z)+'" style="grid-row:'+p[0]+';grid-column:'+p[1]+'"><i>'+z+'</i>'+SYM[z-1]+'</span>'}
    g.innerHTML=h;sec.insertBefore(g,sec.firstChild);ghosts.push(g)});
  var els=[].slice.call(document.querySelectorAll('.el'));
  if(!motion)return;
  var mx=-1,my=-1,raf=0;
  function upd(){raf=0;var vh=innerHeight;
    ghosts.forEach(function(g){var r=g.parentNode.getBoundingClientRect();g.style.setProperty('--gy0',(-r.top*.18).toFixed(1)+'px')});
    els.forEach(function(e){var r=e.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
      var cx=r.left+r.width/2,cy=r.top+r.height/2,sy=(cy/vh-.5);var rx=-sy*10,ry=0,tz=0;
      if(mx>=0){var dx=mx-cx,dy=my-cy,dist=Math.sqrt(dx*dx+dy*dy),f=Math.max(0,1-dist/(r.width*2.6));
        ry+=dx/r.width*14*f;rx+=-dy/r.height*14*f;tz=f*8;e.style.setProperty('--gx',(50+dx/r.width*60*f).toFixed(0)+'%');e.style.setProperty('--gy',(40+dy/r.height*60*f).toFixed(0)+'%')}
      e.style.setProperty('--rx',rx.toFixed(2)+'deg');e.style.setProperty('--ry',ry.toFixed(2)+'deg');e.style.setProperty('--tz',tz.toFixed(1)+'px')})}
  function q(){if(!raf)raf=requestAnimationFrame(upd)}
  if(fine)addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;q()},{passive:true});
  addEventListener('scroll',q,{passive:true});addEventListener('resize',q);q();
  ghosts.forEach(function(g){var sp=g.children;setInterval(function(){var s=sp[(Math.random()*118)|0];s.style.transform='translateZ(18px)';setTimeout(function(){s.style.transform=''},1400)},900)});
})();
