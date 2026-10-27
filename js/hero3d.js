/* Khemistry home: live 3D hero, palette B (stone + sage + ink). Clean-room Three.js r170 (vendored).
   Choreography is a pure function of t, so frames can be captured exactly (?capture).
   Colours: read from css/site.css :root (--bg, --tint-*, --accent*, --text*), nothing hard-coded except family mixes derived from them.
   Cursor fix (v5): the old build parked a teal PointLight (kLight) in front of the settled K plus a glint point light (pppLight/pFill)
   on the clearcoat tiles; their specular hot spot sat still on the tile face and read as a stuck mouse cursor. No point lights here. */
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const root=document.documentElement,hero=document.querySelector('.h3d'),canvas=document.querySelector('.h3d-canvas');
const Q=new URLSearchParams(location.search),CAPTURE=Q.has('capture');
const T_SETTLE=9.0;
const stats={frames:0,samples:[],dpr:0,quality:'high',replays:0};window.KhemStats=stats;
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),ss=(a,b,x)=>{const t=cl((x-a)/(b-a));return t*t*(3-2*t)};
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,expo=t=>t>=1?1:1-Math.pow(2,-10*t),sm=t=>t*t*t*(t*(t*6-15)+10);

function toStill(e){console.warn('3D unavailable, still frame',e);root.classList.remove('live3d');root.classList.add('still3d');window.KhemHome&&window.KhemHome.showFinal();}
if(root.classList.contains('live3d')){try{await init()}catch(e){toStill(e)}}

async function init(){
  try{await Promise.race([Promise.all([document.fonts.load('500 120px Fraunces'),document.fonts.load('600 20px Inter')]),new Promise(r=>setTimeout(r,1500))])}catch(e){}
  const css=getComputedStyle(root),cv=n=>css.getPropertyValue(n).trim();
  const C={bg:cv('--bg'),bg2:cv('--bg-2'),acc:cv('--accent'),accD:cv('--accent-d'),t1:cv('--tint-1'),t2:cv('--tint-2'),t3:cv('--tint-3'),ink:cv('--text'),ink2:cv('--text-2')};
  const mix=(a,b,f)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),f).getHexString();
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:CAPTURE});
  const mobile=innerWidth/innerHeight<1;
  let dpr=CAPTURE?(+Q.get('dpr')||1):Math.min(devicePixelRatio,mobile?1.75:2);stats.dpr=dpr;
  renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=1.17;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(C.bg);scene.fog=new THREE.Fog(C.bg,30,70);
  const pm=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment(),env=pm.fromScene(room,0.04);scene.environment=env.texture;scene.environmentIntensity=.25;room.dispose&&room.dispose();
  const cam=new THREE.PerspectiveCamera(30,1,0.1,200);

  // light: soft sky + one warm key with real shadows + sage-tinted fill. (No point lights: see header note.)
  const hemi=new THREE.HemisphereLight(C.bg2,C.t3,0.9);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xfffaf2,1.15);key.castShadow=true;
  key.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);key.shadow.bias=-0.0004;key.shadow.normalBias=.02;key.shadow.radius=4;key.shadow.autoUpdate=false;scene.add(key,key.target);
  const fill=new THREE.DirectionalLight(C.t1,.2);fill.position.set(12,-4,10);scene.add(fill);

  // backplate (the stone "wall" the table hangs on; receives every shadow)
  const wall=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({color:C.bg,roughness:1,metalness:0}));
  wall.receiveShadow=true;scene.add(wall);

  // ---- atlas: 118 numbers+symbols (white, tinted per instance), 9 word letters, 3 P tiles
  const SYM='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
  const LET=['K','h','e','m','i','s','t','r','y'];
  const PPP=(window.KHEM_PPP||[['Pp','People','02'],['Pl','Place','03'],['Pu','Purpose','04']]);
  const CELL=192,COLS=16,N=SYM.length+LET.length+PPP.length,ROWS=Math.ceil(N/COLS);
  const sc=Math.min(1,renderer.capabilities.maxTextureSize/(CELL*COLS));
  const ac=document.createElement('canvas');ac.width=CELL*COLS*sc;ac.height=CELL*ROWS*sc;const g=ac.getContext('2d');g.scale(sc,sc);g.fillStyle='#fff';
  const cell=i=>[(i%COLS)*CELL,Math.floor(i/COLS)*CELL];
  SYM.forEach((s,i)=>{const[x,y]=cell(i);g.textAlign='center';g.textBaseline='middle';g.font=`500 ${s.length>1?84:92}px Fraunces, Georgia, serif`;g.fillText(s,x+CELL/2,y+CELL*.56);
    g.font='600 34px Inter, sans-serif';g.textAlign='left';g.textBaseline='alphabetic';g.fillText(String(i+1),x+22,y+48)});
  LET.forEach((s,i)=>{const[x,y]=cell(SYM.length+i);g.textAlign='center';g.textBaseline='middle';g.font='400 132px Fraunces, Georgia, serif';g.fillText(s,x+CELL/2,y+CELL*.52)});
  PPP.forEach(([s,n,num],i)=>{const[x,y]=cell(SYM.length+LET.length+i);g.textAlign='center';g.textBaseline='middle';g.font='500 88px Fraunces, Georgia, serif';g.fillText(s,x+CELL/2,y+CELL*.46);
    g.font='600 21px Inter, sans-serif';g.letterSpacing='3px';g.fillText(n.toUpperCase(),x+CELL/2,y+CELL*.8);g.letterSpacing='0px';g.textAlign='left';g.textBaseline='alphabetic';g.font='600 26px Inter, sans-serif';g.fillText(num,x+20,y+42)});
  const atlas=new THREE.CanvasTexture(ac);atlas.colorSpace=THREE.SRGBColorSpace;atlas.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());atlas.generateMipmaps=true;atlas.minFilter=THREE.LinearMipmapLinearFilter;
  const planeFor=(i,sz=.86)=>{const geo=new THREE.PlaneGeometry(sz,sz);const u0=(i%COLS)/COLS,v0=1-(Math.floor(i/COLS)+1)/ROWS,uv=geo.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,u0+uv.getX(k)/COLS,v0+uv.getY(k)/ROWS);return geo};

  // ---- element families, tinted in shades of palette B (same hue family, light to dark)
  const fam=z=>{const inS=a=>a.includes(z);
    if(z>=57&&z<=71)return'lan';if(z>=89&&z<=103)return'act';
    if(inS([3,11,19,37,55,87]))return'alk';if(inS([4,12,20,38,56,88]))return'ae';if(inS([2,10,18,36,54,86,118]))return'nob';
    if(inS([9,17,35,53,85,117]))return'hal';if(inS([1,6,7,8,15,16,34]))return'non';if(inS([5,14,32,33,51,52]))return'met';
    if(inS([13,31,49,50,81,82,83,84,113,114,115,116]))return'post';return'tr'};
  const FAM={alk:[C.acc,C.bg2],ae:[mix(C.acc,C.t3,.55),C.ink],tr:[C.t1,C.ink],post:[C.t3,C.ink],met:[mix(C.t3,C.acc,.28),C.ink],
    non:[C.t2,C.ink],hal:[C.accD,C.bg2],nob:[C.ink2,C.bg2],lan:[C.bg2,C.accD],act:[mix(C.bg,C.t3,.45),C.accD]};
  window.KhemFamilies=FAM;

  // ---- layout (shared with the DOM layer in js/home.js)
  let L;const ceramic=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.5,metalness:0,clearcoat:.55,clearcoatRoughness:.3,envMapIntensity:1,sheen:.2,sheenColor:new THREE.Color(C.bg2)});
  const body=new RoundedBoxGeometry(.92,.92,.24,4,.07);
  const pos=z=>{if(z===1)return[1,1];if(z===2)return[1,18];if(z<=10)return[2,z<=4?z-2:z+8];if(z<=18)return[3,z<=12?z-10:z];if(z<=36)return[4,z-18];if(z<=54)return[5,z-36];
    if(z>=57&&z<=71)return[8.6,z-54];if(z>=89&&z<=103)return[9.6,z-86];if(z<=86)return[6,z<=56?z-54:z-68];return[7,z<=88?z-86:z-100]};
  const NT=SYM.length,bodyI=new THREE.InstancedMesh(body,ceramic,NT);bodyI.castShadow=true;bodyI.receiveShadow=true;
  const symGeo=new THREE.PlaneGeometry(.86,.86),uvOff=new Float32Array(NT*2);
  const symMat=new THREE.MeshBasicMaterial({map:atlas,transparent:true,depthWrite:false,toneMapped:false});
  symMat.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 uvOff;').replace('#include <uv_vertex>','#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv=uv*vec2('+(1/COLS).toFixed(6)+','+(1/ROWS).toFixed(6)+')+uvOff;\n#endif')};
  const symI=new THREE.InstancedMesh(symGeo,symMat,NT);symI.renderOrder=2;
  const tiles=[];const col=new THREE.Color();
  SYM.forEach((s,i)=>{const[r,c]=pos(i+1),f=FAM[fam(i+1)];tiles.push({r,c,base:V(0,0,0),lift:0,scale:1,f});
    bodyI.setColorAt(i,col.set(f[0]));symI.setColorAt(i,col.set(f[1]));uvOff[i*2]=(i%COLS)/COLS;uvOff[i*2+1]=1-(Math.floor(i/COLS)+1)/ROWS;});
  symGeo.setAttribute('uvOff',new THREE.InstancedBufferAttribute(uvOff,2));scene.add(bodyI,symI);
  const mA=new THREE.Matrix4(),mB=new THREE.Matrix4(),qI=new THREE.Quaternion(),vS=V(1,1,1),vP=V(0,0,0);
  let tilesDirty=true;
  function writeTile(i){const t=tiles[i];vP.copy(t.base);vP.z+=t.lift*L.s;vS.setScalar(L.s*t.scale);mA.compose(vP,qI,vS);bodyI.setMatrixAt(i,mA);
    vP.z+=.125*L.s*t.scale+.002;mB.compose(vP,qI,vS);symI.setMatrixAt(i,mB);}
  function flushTiles(){for(let i=0;i<NT;i++)writeTile(i);bodyI.instanceMatrix.needsUpdate=true;symI.instanceMatrix.needsUpdate=true;bodyI.computeBoundingSphere();symI.computeBoundingSphere();tilesDirty=false;key.shadow.needsUpdate=true}

  // ---- flying tiles: the word (K h e m i s t r y) and People / Place / Purpose
  const mkFly=(srcZ,atlasIdx,toCol,toTxt)=>{const grp=new THREE.Group();const f=FAM[fam(srcZ)];
    const mat=ceramic.clone();mat.color.set(f[0]);const m=new THREE.Mesh(body,mat);m.castShadow=true;m.receiveShadow=true;grp.add(m);
    const sym=new THREE.Mesh(planeFor(srcZ-1),new THREE.MeshBasicMaterial({map:atlas,transparent:true,depthWrite:false,toneMapped:false,color:f[1]}));sym.position.z=.126;grp.add(sym);
    const lt=new THREE.Mesh(planeFor(atlasIdx,.9),new THREE.MeshBasicMaterial({map:atlas,transparent:true,depthWrite:false,toneMapped:false,opacity:0,color:toTxt}));lt.position.z=.127;grp.add(lt);
    grp.userData={srcI:srcZ-1,sym,lt,m,from:new THREE.Color(f[0]),to:new THREE.Color(toCol)};grp.visible=false;scene.add(grp);return grp};
  const word=[19,1,99,12,53,16,22,37,39].map((z,i)=>mkFly(z,SYM.length+i,i===0?C.acc:C.bg2,i===0?C.bg2:C.ink));
  const ppp=[15,61,94].map((z,i)=>mkFly(z,SYM.length+LET.length+i,i===1?C.accD:C.acc,C.bg2));

  // ---- portrait: the single approved still (never animated beyond a fade); it casts a real soft shadow on the wall
  const ptex=await new THREE.TextureLoader().loadAsync('assets/maidlin-hero.webp');ptex.colorSpace=THREE.SRGBColorSpace;ptex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const pMat=new THREE.MeshBasicMaterial({map:ptex,transparent:true,depthWrite:false,toneMapped:false,opacity:0});
  const portrait=new THREE.Mesh(new THREE.PlaneGeometry(1,1),pMat);portrait.castShadow=true;portrait.renderOrder=5;
  portrait.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:ptex,alphaTest:.5});scene.add(portrait);


  const vcam=new THREE.PerspectiveCamera();let spP,spT,W=1,H=1;
  function layout(){W=CAPTURE?(+Q.get('w')||innerWidth):hero.clientWidth;H=CAPTURE?(+Q.get('h')||innerHeight):hero.clientHeight;L=window.KhemLayout(W,H);
    vcam.fov=L.fov;vcam.aspect=L.A;vcam.position.set(0,0,L.D);vcam.lookAt(0,0,0);vcam.updateProjectionMatrix();
    tiles.forEach((t,i)=>{t.base.set(L.X0+(t.c-.5)*L.s,L.Ytop-(t.r-.5)*L.s,0)});
    wall.position.z=-.16*L.s;
    // key light: upper-left, in front; ortho shadow box sized to the view
    const hh=L.hh0,hw=hh*L.A;key.position.set(-.55*hw*1.6,hh*1.5,L.D*.9);key.target.position.set(.1*hw,-.1*hh,0);
    Object.assign(key.shadow.camera,{left:-hw*1.5,right:hw*1.5,top:hh*1.6,bottom:-hh*1.6,near:1,far:L.D*3});key.shadow.camera.updateProjectionMatrix();
    const P=L.por;portrait.scale.set(P.w,P.h,1);portrait.position.set(P.x,P.y,P.z);
    // intro camera path (relative to the final composition)
    const k=tiles[18].base,tc=V(L.X0+9*L.s,L.Ytop-5*L.s,0);
    spP=new THREE.CatmullRomCurve3([V(k.x-.15*hh,k.y-1.05*hh,.42*L.D),V(tc.x-.6*hw,tc.y-.95*hh,.74*L.D),V(-.18*hw,-.32*hh,.93*L.D),V(0,0,L.D)],false,'centripetal');
    spT=new THREE.CatmullRomCurve3([V(k.x+.75*hh,k.y+.15*hh,0),tc.clone(),tc.clone().multiplyScalar(.45),V(0,0,0)],false,'centripetal');
    renderer.setPixelRatio(dpr);renderer.setSize(W,H,!CAPTURE);
    cam.aspect=L.A;cam.fov=L.fov;cam.updateProjectionMatrix();flushTiles();key.shadow.needsUpdate=true;}
  layout();
  let rT=0;addEventListener('resize',()=>{clearTimeout(rT);rT=setTimeout(()=>{layout();if(!CAPTURE)frame(clock,0)},80)});

  // ---- interaction (smoothed)
  let hoverK=null,focusK=null;const KS=['people','place','purpose'];const hov=[0,0,0];let foc=0,focIdx=0;
  const par=V(0,0,0),parT=V(0,0,0),ptr=V(0,0,0),ptrT=V(9e3,9e3,0);let ptrOn=0,ptrOnT=0,scr=0;
  addEventListener('khem:hover',e=>hoverK=e.detail);addEventListener('khem:focus',e=>{focusK=e.detail;if(e.detail)focIdx=KS.indexOf(e.detail)});
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(V(0,0,1),0);
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;parT.set(x-.5,y-.5,0);
    if(e.pointerType==='mouse'){ndc.set(x*2-1,1-y*2);ray.setFromCamera(ndc,vcam);ray.ray.intersectPlane(plane,ptrT);ptrOnT=1}});
  hero.addEventListener('pointerleave',()=>{ptrOnT=0;parT.set(0,0,0)});
  addEventListener('scroll',()=>{scr=cl(scrollY/Math.max(1,H))},{passive:true});

  const tmp=V(0,0,0),qa=new THREE.Quaternion(),dom=window.KhemHome?window.KhemHome.dom:null;
  const bez=(out,a,b,c,d,t)=>{const u=1-t;out.set(0,0,0).addScaledVector(a,u*u*u).addScaledVector(b,3*u*u*t).addScaledVector(c,3*u*t*t).addScaledVector(d,t*t*t);return out};
  const A_=V(0,0,0),B_=V(0,0,0),C_=V(0,0,0);
  function fly(w,to,sz,p,lift,spin){const src=tiles[w.userData.srcI].base;
    A_.copy(src).add(V(0,0,lift*.9*L.s));B_.copy(to).add(V(0,0,lift*L.s));
    bez(w.position,src,A_,B_,to,p);w.scale.setScalar(L.s+(sz-L.s)*ss(.15,1,p));
    w.rotation.set((1-p)*.25*Math.sin(p*Math.PI),spin*(1-sm(cl(p*1.1))),0);
    const sw=ss(.3,.7,p);w.userData.sym.material.opacity=1-sw;w.userData.lt.material.opacity=sw;w.userData.m.material.color.lerpColors(w.userData.from,w.userData.to,sw);
    const t=tiles[w.userData.srcI],sc=p<=0?1:ss(.72,1,p);if(Math.abs(t.scale-sc)>1e-4){t.scale=sc;tilesDirty=true}}

  let shadowsAllowed=true;
  function frame(t,dt=1/60){
    // camera
    const u=sm(cl(t/7.4));spP.getPoint(u,cam.position);spT.getPoint(u,tmp);
    const live=ss(T_SETTLE-.8,T_SETTLE,t);const k1=1-Math.exp(-dt*3),k2=1-Math.exp(-dt*4),k3=1-Math.exp(-dt*8);
    par.lerp(parT,k1);ptr.lerp(ptrT,ptrOn>.01?k3:1);ptrOn+=(ptrOnT-ptrOn)*k2;foc+=((focusK?1:0)-foc)*k2;
    for(let i=0;i<3;i++)hov[i]+=((hoverK===KS[i]?1:0)-hov[i])*k3;
    const hh=L.hh0;cam.position.x+=par.x*.08*hh*live;cam.position.y+=(-par.y*.06*hh+Math.sin(t*.22)*.006*hh)*live;cam.position.y-=scr*.12*hh;cam.position.z+=scr*.05*L.D;
    cam.lookAt(tmp);
    // table: gentle pointer response (tiles near the pointer rise toward it)
    if(live>0&&(ptrOn>.002||ptrOnT)){const R2=2*Math.pow(1.7*L.s,2);
      for(let i=0;i<NT;i++){const b=tiles[i].base,dx=b.x-ptr.x,dy=b.y-ptr.y,l=.45*Math.exp(-(dx*dx+dy*dy)/R2)*ptrOn*live;if(Math.abs(l-tiles[i].lift)>1e-4){tiles[i].lift=l;tilesDirty=true}}}
    // word
    word.forEach((w,i)=>{const t0=i===0?2.5:3.9+i*.12,dur=i===0?1.7:1.3,p=cl((t-t0)/dur);w.visible=t>=t0;
      if(!w.visible){const tl=tiles[w.userData.srcI];if(tl.scale!==1){tl.scale=1;tilesDirty=true}return}
      const e=i===0?eio(p):expo(p);fly(w,L.word[i],L.ws,e,i===0?2.4:3.4+(i%3)*.5,i===0?0:(i%2?1:-1)*Math.PI*2);
      w.position.y+=Math.sin(t*1.1+i*.7)*.012*L.s*live;});
    // People / Place / Purpose
    ppp.forEach((w,i)=>{const t0=6.5+i*.16,p=cl((t-t0)/1.25);w.visible=t>=t0;
      if(!w.visible){const tl=tiles[w.userData.srcI];if(tl.scale!==1){tl.scale=1;tilesDirty=true}return}
      fly(w,L.ppp[i],L.ps,expo(p),4,(i-1)*Math.PI);
      const h=hov[i]+(focusK===KS[i]?foc:0);w.position.z+=h*.5*L.s;w.position.y+=h*.08*L.ps+Math.sin(t*1.2+i*2)*.01*L.ps*live;
      w.rotation.x+=(-par.y*.25)*live*.6;w.rotation.y+=(par.x*.35)*live*.6;});
    // portrait: fade in with the light (the image itself never moves)
    pMat.opacity=ss(6.1,7.3,t);portrait.visible=pMat.opacity>0;
    if(tilesDirty)flushTiles();
    // shadows only re-render while something moves
    if(shadowsAllowed&&(t<T_SETTLE||foc>.001||Math.max(...hov)>.001||ptrOn>.002))key.shadow.needsUpdate=true;
    if(dom)window.KhemHome.drive(t,foc);
    renderer.render(scene,cam);
  }

  // ---- loop + adaptive quality ladder (dpr -> soft shadows off -> no shadows/clearcoat)
  let start=null,running=true,clock=0,last=0,acc=0,cnt=0,offset=0,lowStreak=0,visible=true;
  let stage=0;const ladder=()=>{if(dpr>1){dpr=Math.max(1,dpr-.5);stats.dpr=dpr;layout();stats.quality='dpr'+dpr;return}
    if(stage===0){stage=1;renderer.shadowMap.type=THREE.PCFShadowMap;key.shadow.mapSize.set(1024,1024);if(key.shadow.map){key.shadow.map.dispose();key.shadow.map=null}ceramic.needsUpdate=true;key.shadow.needsUpdate=true;stats.quality='lite-shadow'}
    else if(stage===1&&shadowsAllowed){stage=2;shadowsAllowed=false;key.castShadow=false;key.shadow.needsUpdate=true;ceramic.clearcoat=0;ceramic.needsUpdate=true;stats.quality='low'}};
  function loop(now){if(!running||document.hidden||!visible){last=0;return}
    if(start===null)start=now;clock=(now-start)/1000+offset;
    if(last){const d=now-last;acc+=d;cnt++;stats.frames++;if(acc>=1000){const fps=cnt*1000/acc;stats.samples.push(+fps.toFixed(1));acc=0;cnt=0;if(fps<45&&stats.samples.length>1){if(++lowStreak>=2){ladder();lowStreak=0}}else lowStreak=0}}
    const dt=last?Math.min(.1,(now-last)/1000):1/60;last=now;frame(clock,dt);root.classList.toggle('done3d',clock>T_SETTLE);requestAnimationFrame(loop)}
  const kick=()=>{if(running&&!CAPTURE){last=0;start=start===null?null:performance.now()-(clock-offset)*1000;requestAnimationFrame(loop)}};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick()});
  new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!visible){visible=true;kick()}else visible=v}).observe(hero);
  addEventListener('khem:skip',()=>{if(clock<T_SETTLE)offset+=T_SETTLE-clock});
  addEventListener('khem:replay',()=>{start=null;offset=0;clock=0;last=0;acc=0;cnt=0;lowStreak=0;hoverK=focusK=null;foc=0;hov.fill(0);par.set(0,0,0);parT.set(0,0,0);ptrOn=ptrOnT=0;
    tiles.forEach(t=>{t.lift=0;t.scale=1});tilesDirty=true;root.classList.remove('done3d');stats.replays++;frame(0,0);if(!visible)visible=true;});
  addEventListener('pagehide',()=>{running=false});
  window.KhemScene={frame,stats,T_SETTLE,layout,get time(){return clock}};
  root.classList.add('ready3d');
  if(CAPTURE){running=false;frame(0,0);window.KhemReady=true;return}
  if(root.classList.contains('rm3d'))offset=T_SETTLE+.05;/* reduced motion: show the settled scene, no intro */
  frame(offset,0);requestAnimationFrame(loop);
}
