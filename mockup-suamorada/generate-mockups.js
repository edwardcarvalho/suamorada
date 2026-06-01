const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const FD = path.join('C:','Users','Edward','AppData','Roaming','Claude',
  'local-agent-mode-sessions','skills-plugin',
  '15be5a37-8c82-4b91-b4ab-a7c0972d19f1',
  'fdc8765f-c28e-4b2a-81fd-64908cc12071',
  'skills','canvas-design','canvas-fonts');

registerFont(path.join(FD,'Gloock-Regular.ttf'),   {family:'Gloock', weight:'normal'});
registerFont(path.join(FD,'Lora-Regular.ttf'),     {family:'Lora',   weight:'normal'});
registerFont(path.join(FD,'Lora-Bold.ttf'),        {family:'Lora',   weight:'bold'  });
registerFont(path.join(FD,'WorkSans-Regular.ttf'), {family:'WS',     weight:'normal'});
registerFont(path.join(FD,'WorkSans-Bold.ttf'),    {family:'WS',     weight:'bold'  });
registerFont(path.join(FD,'Jura-Light.ttf'),       {family:'Jura',   weight:'normal'});

const C = {
  navy:'#1B3A5C', navyD:'#0d2035', navyM:'#162d47',
  orange:'#E8651A', green:'#2D9E6B', red:'#DC2626',
  warm:'#F7F6F3', warmD:'#EEECEA',
  white:'#FFFFFF', ink:'#1C1C2E',
  muted:'#6B7280', faint:'#9CA3AF', border:'#E5E4E0',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function rr(ctx,x,y,w,h,r=0){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}
const sh  = (ctx,b,c,ox=0,oy=0) => { ctx.shadowBlur=b; ctx.shadowColor=c; ctx.shadowOffsetX=ox; ctx.shadowOffsetY=oy; };
const nsh = ctx => { ctx.shadowBlur=0; ctx.shadowColor='transparent'; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0; };

function navbar(ctx, W, active='') {
  ctx.fillStyle='rgba(27,58,92,0.95)'; ctx.fillRect(0,0,W,64);
  ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(0,63,W,1);
  // house icon
  ctx.strokeStyle=C.orange; ctx.lineWidth=2; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(29,43); ctx.lineTo(29,30); ctx.lineTo(38,22); ctx.lineTo(47,30); ctx.lineTo(47,43);
  ctx.moveTo(33,43); ctx.lineTo(33,35); ctx.lineTo(43,35); ctx.lineTo(43,43); ctx.stroke();
  // logo
  ctx.fillStyle=C.white; ctx.font='bold 20px WS'; ctx.fillText('Sua',54,40);
  const sw=ctx.measureText('Sua').width;
  ctx.fillStyle=C.orange; ctx.font='normal 20px Gloock'; ctx.fillText('Morada',57+sw,40);
  // links — NOW WITH VENDER
  const links=['Comprar','Arrendar','Vender','Avaliar','Agencias'];
  const lx0=W/2-230;
  ctx.font='bold 13px WS';
  links.forEach((l,i)=>{
    const lx=lx0+i*110;
    ctx.fillStyle=l===active ? C.white : 'rgba(255,255,255,0.58)';
    ctx.fillText(l,lx,40);
    if(l===active){ ctx.fillStyle=C.orange; ctx.fillRect(lx,61,ctx.measureText(l).width,3); }
  });
  // cta
  ctx.fillStyle=C.orange; rr(ctx,W-204,17,158,38,8); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 13px WS';
  ctx.textAlign='center'; ctx.fillText('Publicar Anuncio',W-125,41); ctx.textAlign='left';
}

function navbarCompact(ctx, W) {
  ctx.fillStyle=C.white; ctx.fillRect(0,0,W,64);
  ctx.fillStyle=C.border; ctx.fillRect(0,63,W,1);
  ctx.strokeStyle=C.orange; ctx.lineWidth=1.5; ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(22,42); ctx.lineTo(22,32); ctx.lineTo(29,26); ctx.lineTo(36,32); ctx.lineTo(36,42);
  ctx.moveTo(25,42); ctx.lineTo(25,36); ctx.lineTo(33,36); ctx.lineTo(33,42); ctx.stroke();
  ctx.fillStyle=C.navy; ctx.font='bold 18px WS'; ctx.fillText('Sua',40,40);
  const sw=ctx.measureText('Sua').width;
  ctx.fillStyle=C.orange; ctx.font='normal 18px Gloock'; ctx.fillText('Morada',43+sw,40);
}

function buildings(ctx, x, y, W, H, alpha=0.05) {
  const bldgs=[[0,680,90],[95,640,80],[180,700,60],[245,620,100],[350,660,70],[425,600,120],
    [550,650,80],[635,580,110],[750,640,90],[845,600,130],[980,650,85],
    [1070,620,100],[1175,660,75],[1255,600,110],[1370,640,70]];
  bldgs.forEach(([bx,by,bw])=>{
    if(bx>W) return;
    ctx.fillStyle=`rgba(255,255,255,${alpha})`; ctx.fillRect(x+bx,y+(by-580),bw,H-(by-580));
    for(let r=0;r<3;r++) for(let c=0;c<Math.floor(bw/22);c++){
      ctx.fillStyle=(r+c)%3===0?'rgba(232,101,26,0.15)':'rgba(255,200,100,0.04)';
      ctx.fillRect(x+bx+4+c*22,y+(by-580)+18+r*48,14,22);
    }
  });
}

// ── CARD helper ──────────────────────────────────────────────────────────────
function drawCard(ctx, cX, cY, cW, cH, card) {
  const pH=178;
  sh(ctx,18,'rgba(28,28,46,0.11)',0,4);
  ctx.fillStyle=C.white; rr(ctx,cX,cY,cW,cH,12); ctx.fill(); nsh(ctx);
  ctx.save(); rr(ctx,cX,cY,cW,pH,12); ctx.clip();
  const pg=ctx.createLinearGradient(cX,cY,cX+cW,cY+pH);
  pg.addColorStop(0,card.bg[0]); pg.addColorStop(1,card.bg[1]);
  ctx.fillStyle=pg; ctx.fillRect(cX,cY,cW,pH);
  [[20,100,40],[80,80,55],[155,90,50],[220,70,60]].forEach(([bx,by,bw])=>{
    ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(cX+bx,cY+by,bw,pH-by);
  });
  const og=ctx.createLinearGradient(cX,cY+pH-50,cX,cY+pH);
  og.addColorStop(0,'transparent'); og.addColorStop(1,'rgba(0,0,0,0.45)');
  ctx.fillStyle=og; ctx.fillRect(cX,cY+pH-50,cW,50); ctx.restore();
  // badges
  let bx2=cX+10;
  if(card.ver){ ctx.fillStyle=C.green; rr(ctx,bx2,cY+10,84,22,4); ctx.fill(); ctx.fillStyle=C.white; ctx.font='bold 10px WS'; ctx.fillText('OK VERIFICADO',bx2+6,cY+24); bx2+=90; }
  if(card.newb){ ctx.fillStyle=C.navy; rr(ctx,bx2,cY+10,46,22,4); ctx.fill(); ctx.fillStyle=C.white; ctx.font='bold 10px WS'; ctx.fillText('NOVO',bx2+6,cY+24); }
  if(card.feat){ ctx.font='bold 10px WS'; const fw=ctx.measureText('* DESTAQUE').width+16; ctx.fillStyle=C.orange; rr(ctx,cX+cW-fw-6,cY+10,fw+4,22,4); ctx.fill(); ctx.fillStyle=C.white; ctx.fillText('* DESTAQUE',cX+cW-fw-2,cY+24); }
  // heart
  ctx.fillStyle='rgba(255,255,255,0.92)'; rr(ctx,cX+cW-40,cY+pH-40,30,30,15); ctx.fill();
  ctx.fillStyle='#C0BDB8'; ctx.font='bold 16px WS'; ctx.textAlign='center'; ctx.fillText('o',cX+cW-25,cY+pH-20); ctx.textAlign='left';
  // content
  const cY2=cY+pH+14;
  ctx.fillStyle=C.ink; ctx.font='bold 22px Lora'; ctx.fillText(card.price,cX+14,cY2+22);
  ctx.font='bold 13px WS'; ctx.fillText(card.title,cX+14,cY2+44);
  ctx.fillStyle=C.muted; ctx.font='normal 12px WS'; ctx.fillText('Pin  '+card.loc,cX+14,cY2+62);
  ctx.fillStyle=C.border; ctx.fillRect(cX+14,cY2+74,cW-28,1);
  ctx.fillStyle=C.muted; ctx.font='normal 12px WS';
  ctx.fillText('Qt '+card.bed,cX+14,cY2+96); ctx.fillText('WC '+card.bath,cX+68,cY2+96); ctx.fillText(card.area+' m2',cX+112,cY2+96);
  ctx.fillStyle=C.border; ctx.fillRect(cX+14,cY2+108,cW-28,1);
  ctx.fillStyle=C.navy; rr(ctx,cX+14,cY2+120,28,16,3); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 8px WS'; ctx.textAlign='center'; ctx.fillText('ERA',cX+28,cY2+131); ctx.textAlign='left';
  ctx.fillStyle=C.faint; ctx.font='normal 11px WS'; ctx.fillText('ERA Imobiliaria',cX+48,cY2+131);
}

const CARDS=[
  {price:'285.000 EUR',title:'Apartamento T2 com varanda',loc:'Campo de Ourique, Lisboa',bed:2,bath:1,area:85,ver:true,feat:true,newb:false,bg:['#1e3d55','#2a5070']},
  {price:'195.000 EUR',title:'Apartamento T1 renovado',loc:'Mouraria, Lisboa',bed:1,bath:1,area:52,ver:true,feat:false,newb:true,bg:['#2a4a30','#3d6040']},
  {price:'420.000 EUR',title:'Moradia T3 com jardim',loc:'Cascais, Lisboa',bed:3,bath:2,area:140,ver:true,feat:false,newb:false,bg:['#5a3020','#7a4030']},
  {price:'1.350 EUR/mes',title:'Apartamento T2 mobilado',loc:'Principe Real, Lisboa',bed:2,bath:1,area:78,ver:false,feat:true,newb:true,bg:['#1e2d4a','#2a3d60']},
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 1 — HOMEPAGE
// ═══════════════════════════════════════════════════════════════════════════════
function m1_homepage() {
  const W=1440, H=900, cv=createCanvas(W,H), ctx=cv.getContext('2d');
  ctx.fillStyle=C.warm; ctx.fillRect(0,0,W,H);
  // hero
  const heroH=820;
  const g=ctx.createLinearGradient(0,0,0,heroH);
  g.addColorStop(0,C.navyD); g.addColorStop(0.5,C.navyM); g.addColorStop(1,'#0a1520');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,heroH);
  buildings(ctx,0,580,W,heroH);
  navbar(ctx,W,'Comprar');

  // hero content
  ctx.fillStyle='rgba(232,101,26,0.18)'; rr(ctx,W/2-155,98,310,30,15); ctx.fill();
  ctx.fillStyle=C.orange; ctx.font='normal 11px Jura';
  ctx.textAlign='center'; ctx.fillText('PORTAL IMOBILIARIO No 1 EM PORTUGAL',W/2,118);
  ctx.fillStyle=C.white; ctx.font='normal 66px Gloock'; ctx.fillText('Encontre a sua morada',W/2,208);
  ctx.fillStyle=C.orange; ctx.fillText('ideal em Portugal',W/2,282);
  ctx.fillStyle='rgba(255,255,255,0.72)'; ctx.font='normal 19px WS';
  ctx.fillText('Milhares de propriedades verificadas em todo o pais',W/2,326); ctx.textAlign='left';

  // search bar with COMPRAR / ARRENDAR / VENDER tabs
  const sbW=900,sbH=84,sbX=(W-sbW)/2,sbY=366;
  sh(ctx,40,'rgba(0,0,0,0.40)',0,8); ctx.fillStyle=C.white; rr(ctx,sbX,sbY,sbW,sbH,14); ctx.fill(); nsh(ctx);

  // 3 tabs
  const tabs=[['Comprar',true],['Arrendar',false],['Vender',false]];
  let tx=sbX+8;
  tabs.forEach(([t,active])=>{
    const tw=ctx.measureText(t).width+28;
    ctx.fillStyle=active?C.navy:'transparent'; rr(ctx,tx,sbY+8,tw,38,8); if(active) ctx.fill();
    ctx.fillStyle=active?C.white:C.muted; ctx.font='bold 14px WS';
    ctx.textAlign='center'; ctx.fillText(t,tx+tw/2,sbY+32); ctx.textAlign='left';
    tx+=tw+4;
  });

  // divider + fields
  ctx.fillStyle=C.border; ctx.fillRect(sbX+200,sbY+16,1,sbH-32);
  ctx.fillStyle=C.border; ctx.fillRect(sbX+390,sbY+16,1,sbH-32);
  ctx.fillStyle=C.border; ctx.fillRect(sbX+550,sbY+16,1,sbH-32);

  [{l:'LOCALIZACAO',v:'Lisboa, Portugal',x:sbX+212},
   {l:'TIPO DE IMOVEL',v:'Apartamento',x:sbX+402},
   {l:'QUARTOS',v:'T2 - 2 quartos',x:sbX+562}].forEach(f=>{
    ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.fillText(f.l,f.x,sbY+27);
    ctx.fillStyle=C.ink; ctx.font='bold 15px WS'; ctx.fillText(f.v,f.x,sbY+53);
  });

  ctx.fillStyle=C.orange; rr(ctx,sbX+sbW-148,sbY+12,136,60,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 15px WS';
  ctx.textAlign='center'; ctx.fillText('Pesquisar',sbX+sbW-80,sbY+48); ctx.textAlign='left';

  // trust badges
  ['10.000+ imoveis verificados','Resposta em 24h','100% Seguro','4.9 / 5 avaliacao'].forEach((b,i)=>{
    const bx=W/2-315+i*210;
    ctx.fillStyle=C.orange; ctx.font='bold 12px WS'; ctx.fillText('>',bx-12,sbY+sbH+30);
    ctx.fillStyle='rgba(255,255,255,0.82)'; ctx.font='normal 13px WS'; ctx.fillText(b,bx+4,sbY+sbH+30);
  });

  ctx.fillStyle=C.warm; ctx.fillRect(0,heroH,W,H-heroH);
  ctx.fillStyle=C.muted; ctx.font='normal 11px Jura';
  ctx.textAlign='center'; ctx.fillText('v  IMOVEIS EM DESTAQUE',W/2,heroH+36); ctx.textAlign='left';

  fs.writeFileSync('mockup-01-homepage.png',cv.toBuffer('image/png'));
  console.log('OK 01 homepage');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 2 — LISTING RESULTS + MAP
// ═══════════════════════════════════════════════════════════════════════════════
function m2_listing() {
  const W=1440,H=900,cv=createCanvas(W,H),ctx=cv.getContext('2d');
  ctx.fillStyle=C.warm; ctx.fillRect(0,0,W,H);
  navbarCompact(ctx,W);
  ctx.fillStyle=C.navy; ctx.fillRect(128,0,W-128,64);
  ctx.fillStyle='rgba(255,255,255,0.13)'; rr(ctx,146,13,500,38,8); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='normal 14px WS';
  ctx.fillText('Lisboa   Apartamento   T2   150k - 350k EUR',162,37);
  const chips=[['Verificados',false],['Com garagem',false],['T2',false],['150k-350k x',true]];
  let cpx=676; ctx.font='bold 12px WS';
  chips.forEach(([t,a])=>{ const tw=ctx.measureText(t).width+24; ctx.fillStyle=a?'rgba(232,101,26,0.30)':'rgba(255,255,255,0.14)'; rr(ctx,cpx,20,tw,24,12); ctx.fill(); ctx.fillStyle=a?C.orange:'rgba(255,255,255,0.88)'; ctx.fillText(t,cpx+12,36); cpx+=tw+8; });
  ctx.fillStyle=C.ink; ctx.font='normal 14px WS'; ctx.fillText('347 imoveis encontrados em Lisboa',20,90);
  ctx.fillStyle=C.muted; ctx.font='normal 13px WS'; ctx.fillText('Ordenar: Relevancia  v',W-200,90);

  const cW=296,cH=378,cY=108;
  CARDS.forEach((card,i)=>drawCard(ctx,16+i*(cW+16),cY,cW,cH,card));

  // map
  const mX=16+4*(cW+16)+8,mW=W-mX-16,mY=cY,mH=H-cY-20;
  const mg=ctx.createLinearGradient(mX,mY,mX+mW,mY+mH);
  mg.addColorStop(0,'#ccd8e5'); mg.addColorStop(1,'#b8c9db');
  ctx.fillStyle=mg; rr(ctx,mX,mY,mW,mH,12); ctx.fill();
  ctx.strokeStyle='rgba(27,58,92,0.07)'; ctx.lineWidth=1;
  for(let gx=mX;gx<mX+mW;gx+=38){ctx.beginPath();ctx.moveTo(gx,mY);ctx.lineTo(gx,mY+mH);ctx.stroke();}
  for(let gy=mY;gy<mY+mH;gy+=38){ctx.beginPath();ctx.moveTo(mX,gy);ctx.lineTo(mX+mW,gy);ctx.stroke();}
  ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=7;
  [[mX+30,mY+50,mX+mW-20,mY+190],[mX+10,mY+170,mX+mW-10,mY+170]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  ctx.lineWidth=3;
  [[mX+mW/2,mY,mX+mW/2,mY+mH],[mX+90,mY+70,mX+90,mY+mH-50],[mX+190,mY+90,mX+190,mY+mH-30]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  ctx.font='bold 11px WS';
  [{x:mX+100,y:mY+80,p:'285k',a:true},{x:mX+200,y:mY+140,p:'195k',a:false},{x:mX+290,y:mY+190,p:'420k',a:false},{x:mX+145,y:mY+260,p:'1350/m',a:false},{x:mX+68,y:mY+300,p:'310k',a:false},{x:mX+235,y:mY+305,p:'265k',a:false}].forEach(pin=>{
    const pw=ctx.measureText(pin.p).width+20;
    sh(ctx,pin.a?14:6,'rgba(0,0,0,0.3)',0,2); ctx.fillStyle=pin.a?C.orange:C.navy;
    rr(ctx,pin.x-pw/2,pin.y-18,pw,28,6); ctx.fill();
    ctx.beginPath();ctx.moveTo(pin.x-6,pin.y+10);ctx.lineTo(pin.x,pin.y+18);ctx.lineTo(pin.x+6,pin.y+10);ctx.fill();
    nsh(ctx); ctx.fillStyle=C.white; ctx.textAlign='center'; ctx.fillText(pin.p,pin.x,pin.y+1); ctx.textAlign='left';
  });
  sh(ctx,8,'rgba(0,0,0,0.15)',0,2); ctx.fillStyle=C.white; rr(ctx,mX+mW-46,mY+16,32,70,8); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 18px WS'; ctx.textAlign='center';
  ctx.fillText('+',mX+mW-30,mY+40); ctx.fillStyle=C.border; ctx.fillRect(mX+mW-40,mY+52,24,1);
  ctx.fillStyle=C.ink; ctx.fillText('-',mX+mW-30,mY+72); ctx.textAlign='left';
  sh(ctx,10,'rgba(0,0,0,0.2)',0,2); ctx.fillStyle=C.white; rr(ctx,mX+mW/2-88,mY+mH-44,176,34,17); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.navy; ctx.font='bold 13px WS'; ctx.textAlign='center'; ctx.fillText('Pesquisar nesta area',mX+mW/2,mY+mH-22); ctx.textAlign='left';

  fs.writeFileSync('mockup-02-listing.png',cv.toBuffer('image/png'));
  console.log('OK 02 listing');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 3 — PROPERTY DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function m3_detail() {
  const W=1440,H=1040,cv=createCanvas(W,H),ctx=cv.getContext('2d');
  ctx.fillStyle=C.warm; ctx.fillRect(0,0,W,H);
  navbarCompact(ctx,W);
  ctx.fillStyle=C.muted; ctx.font='normal 13px WS';
  ctx.fillText('Inicio  /  Comprar  /  Lisboa  /  Campo de Ourique  /  Apartamento T2',20,92);

  const gY=108,gH=370,mW2=870,sW2=W-20-mW2-8-20,sX2=20+mW2+8;
  const mpg=ctx.createLinearGradient(20,gY,20,gY+gH);
  mpg.addColorStop(0,'#1e3d55'); mpg.addColorStop(1,'#0d2035');
  ctx.fillStyle=mpg; rr(ctx,20,gY,mW2,gH,12); ctx.fill();
  [[60,200,80],[180,160,110],[330,180,90],[480,150,130],[650,190,100],[800,170,60]].forEach(([bx,by,bw])=>{
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(20+bx,gY+by,bw,gH-by);
    for(let r=0;r<3;r++) for(let c=0;c<Math.floor(bw/24);c++){ctx.fillStyle='rgba(232,101,26,0.14)'; ctx.fillRect(20+bx+4+c*24,gY+by+18+r*48,15,22);}
  });
  sh(ctx,8,'rgba(0,0,0,0.2)',0,2); ctx.fillStyle='rgba(255,255,255,0.92)'; rr(ctx,20+mW2-168,gY+gH-48,152,34,8); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 13px WS'; ctx.fillText('Ver todas as 18 fotos',20+mW2-162,gY+gH-26);
  [['#1e3248','#2a4560'],['#3d2a1e','#5a3d2b']].forEach(([c1,c2],i)=>{
    const sg=ctx.createLinearGradient(sX2,gY+i*(gH/2+4),sX2+sW2,gY+(i+1)*(gH/2));
    sg.addColorStop(0,c1); sg.addColorStop(1,c2);
    ctx.fillStyle=sg; rr(ctx,sX2,gY+i*(gH/2+4),sW2,gH/2-2,12); ctx.fill();
  });

  const cY2=gY+gH+28,mCW=860,sbX2=20+mCW+24,sbW2=W-sbX2-20;
  ctx.fillStyle=C.green; rr(ctx,20,cY2,92,26,4); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 11px WS'; ctx.fillText('OK  VERIFICADO',28,cY2+17);
  ctx.fillStyle=C.ink; ctx.font='normal 34px Gloock'; ctx.fillText('Apartamento T2 com varanda e vista para o jardim',20,cY2+64);
  ctx.fillStyle=C.muted; ctx.font='normal 15px WS'; ctx.fillText('Pin   Rua Ferreira Borges, Campo de Ourique, Lisboa',20,cY2+94);
  ctx.fillStyle=C.orange; ctx.font='bold 42px Lora'; ctx.fillText('285.000 EUR',20,cY2+146);
  ctx.fillStyle=C.green; ctx.font='bold 13px WS'; ctx.fillText('OK  Preco dentro da media para T2 em Campo de Ourique',20,cY2+170);
  ctx.fillStyle=C.faint; ctx.font='normal 12px Jura'; ctx.fillText('Publicado ha 3 dias   142 visualizacoes   12 contactos',20,cY2+192);

  const stY=cY2+218,stH=112;
  sh(ctx,10,'rgba(28,28,46,0.07)',0,2); ctx.fillStyle=C.white; rr(ctx,20,stY,mCW,stH,12); ctx.fill(); nsh(ctx);
  [['Quartos','2'],['Casa de banho','1'],['Area util','85 m2'],['Area bruta','95 m2'],
   ['Andar','3 de 6'],['Energia','B'],['Garagem','Incluida'],['Estado','Usado']].forEach((s,i)=>{
    const col=i%4,row=Math.floor(i/4),sx=20+22+col*(mCW/4),sy=stY+20+row*58;
    ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.fillText(s[0],sx,sy);
    ctx.fillStyle=C.ink; ctx.font='bold 16px WS'; ctx.fillText(s[1],sx,sy+22);
    if(col<3){ctx.fillStyle=C.border; ctx.fillRect(sx+mCW/4-22,stY+16,1,stH-32);}
  });

  const ad1Y=stY+stH+16;
  ctx.fillStyle='#EFEFED'; ctx.strokeStyle='#CDCCC8'; ctx.lineWidth=1; ctx.setLineDash([5,5]);
  rr(ctx,20,ad1Y,mCW,74); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.textAlign='center';
  ctx.fillText('GOOGLE ADSENSE  728 x 90  Leaderboard',20+mCW/2,ad1Y+40); ctx.textAlign='left';

  const dY=ad1Y+90;
  ctx.fillStyle=C.ink; ctx.font='bold 16px WS'; ctx.fillText('Descricao',20,dY);
  ctx.fillStyle=C.muted; ctx.font='normal 14px WS';
  ['Excelente apartamento T2 em Campo de Ourique, bairro residencial de Lisboa.',
   'Totalmente renovado em 2022, acabamentos de qualidade, cozinha equipada...'].forEach((l,i)=>ctx.fillText(l,20,dY+26+i*22));
  ctx.fillStyle=C.orange; ctx.font='bold 13px WS'; ctx.fillText('Ler mais  v',20,dY+82);

  sh(ctx,24,'rgba(28,28,46,0.12)',0,6); ctx.fillStyle=C.white; rr(ctx,sbX2,cY2-10,sbW2,570,16); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 28px Lora'; ctx.fillText('285.000 EUR',sbX2+20,cY2+38);
  ctx.fillStyle=C.muted; ctx.font='normal 12px WS'; ctx.fillText('Apartamento T2  -  Campo de Ourique',sbX2+20,cY2+58);
  ctx.fillStyle=C.border; ctx.fillRect(sbX2+20,cY2+70,sbW2-40,1);
  ctx.fillStyle=C.navy; rr(ctx,sbX2+20,cY2+84,44,44,22); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 15px WS'; ctx.textAlign='center'; ctx.fillText('ML',sbX2+42,cY2+111); ctx.textAlign='left';
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Margarida Lima',sbX2+74,cY2+100);
  ctx.fillStyle=C.muted; ctx.font='normal 12px WS'; ctx.fillText('ERA Lisboa Centro',sbX2+74,cY2+116);
  ctx.fillStyle=C.green; rr(ctx,sbX2+74,cY2+124,96,16,8); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 10px WS'; ctx.fillText('Responde em < 2h',sbX2+80,cY2+135);
  ctx.fillStyle=C.orange; ctx.font='bold 13px WS'; ctx.fillText('* * * * *',sbX2+20,cY2+160);
  ctx.fillStyle=C.muted; ctx.font='normal 12px WS'; ctx.fillText('4.9  (127 avaliacoes)',sbX2+90,cY2+160);

  const btnY2=cY2+178,bW2=sbW2-40;
  ctx.fillStyle=C.orange; rr(ctx,sbX2+20,btnY2,bW2,48,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 15px WS'; ctx.textAlign='center'; ctx.fillText('Contactar Agente',sbX2+20+bW2/2,btnY2+29);
  ctx.fillStyle='#25D366'; rr(ctx,sbX2+20,btnY2+56,bW2,44,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 14px WS'; ctx.fillText('WhatsApp',sbX2+20+bW2/2,btnY2+83);
  ctx.fillStyle=C.white; ctx.strokeStyle=C.navy; ctx.lineWidth=1.5;
  rr(ctx,sbX2+20,btnY2+108,bW2,44,10); ctx.fill(); ctx.stroke();
  ctx.fillStyle=C.navy; ctx.font='bold 14px WS'; ctx.fillText('Tel.  912 *** ***  (revelar)',sbX2+20+bW2/2,btnY2+135);
  ctx.textAlign='left';
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.textAlign='center';
  ctx.fillText('Resposta tipica em menos de 24 horas',sbX2+20+bW2/2,btnY2+168); ctx.textAlign='left';
  ctx.fillStyle=C.border; ctx.fillRect(sbX2+20,btnY2+182,bW2,1);
  const hw=(bW2-8)/2;
  ctx.fillStyle=C.warmD; rr(ctx,sbX2+20,btnY2+192,hw,36,8); ctx.fill();
  ctx.fillStyle=C.muted; ctx.font='bold 13px WS'; ctx.textAlign='center'; ctx.fillText('Guardar',sbX2+20+hw/2,btnY2+215);
  ctx.fillStyle=C.warmD; rr(ctx,sbX2+20+hw+8,btnY2+192,hw,36,8); ctx.fill();
  ctx.fillStyle=C.muted; ctx.fillText('Partilhar',sbX2+20+hw+8+hw/2,btnY2+215); ctx.textAlign='left';
  ctx.fillStyle='#EFEFED'; ctx.strokeStyle='#CDCCC8'; ctx.lineWidth=1; ctx.setLineDash([5,5]);
  rr(ctx,sbX2+20,btnY2+240,bW2,285); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.textAlign='center';
  ctx.fillText('ADSENSE  300 x 600',sbX2+20+bW2/2,btnY2+382); ctx.textAlign='left';

  fs.writeFileSync('mockup-03-detail.png',cv.toBuffer('image/png'));
  console.log('OK 03 detail');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 4 — VENDER: FORMULÁRIO MULTI-STEP (PUBLICAR ANÚNCIO)
// ═══════════════════════════════════════════════════════════════════════════════
function m4_vender() {
  const W=1440,H=900,cv=createCanvas(W,H),ctx=cv.getContext('2d');
  ctx.fillStyle=C.warm; ctx.fillRect(0,0,W,H);
  navbar(ctx,W,'Vender');

  // Page header
  ctx.fillStyle=C.ink; ctx.font='normal 32px Gloock'; ctx.textAlign='center';
  ctx.fillText('Publicar o seu imovel',W/2,118); ctx.textAlign='left';
  ctx.fillStyle=C.muted; ctx.font='normal 15px WS'; ctx.textAlign='center';
  ctx.fillText('Gratis, rapido e com verificacao em 24 horas',W/2,146); ctx.textAlign='left';

  // Progress bar — 4 steps
  const steps=['1. Tipo','2. Localizacao','3. Detalhes','4. Fotos'];
  const stW=220, stStart=(W-stW*4-24*3)/2;
  steps.forEach((s,i)=>{
    const sx=stStart+i*(stW+24);
    const done=i<1, active=i===1;
    ctx.fillStyle=done?C.green:active?C.navy:C.border;
    rr(ctx,sx,164,stW,6,3); ctx.fill();
    ctx.fillStyle=done?C.green:active?C.navy:C.faint;
    ctx.font=active?'bold 13px WS':'normal 13px WS';
    ctx.textAlign='center'; ctx.fillText(s,sx+stW/2,190); ctx.textAlign='left';
  });

  // Main form card
  const fX=W/2-460, fW=920, fY=206;
  sh(ctx,20,'rgba(28,28,46,0.09)',0,4); ctx.fillStyle=C.white; rr(ctx,fX,fY,fW,H-fY-40,16); ctx.fill(); nsh(ctx);

  // Step title
  ctx.fillStyle=C.navy; ctx.font='bold 11px Jura';
  ctx.fillText('PASSO 2 DE 4  —  LOCALIZACAO',fX+40,fY+38);
  ctx.fillStyle=C.ink; ctx.font='normal 26px Gloock'; ctx.fillText('Onde fica o seu imovel?',fX+40,fY+74);

  // Form fields — 2 column grid
  const fields=[
    {l:'Morada (rua e numero)',v:'Rua Ferreira Borges, 24',w:1},
    {l:'Codigo Postal',v:'1350-119',w:0.4},
    {l:'Cidade',v:'Lisboa',w:0.55},
    {l:'Freguesia',v:'Campo de Ourique',w:0.48},
    {l:'Concelho',v:'Lisboa',w:0.48},
    {l:'Distrito',v:'Lisboa',w:0.48},
  ];
  const fw=fW-80, row1Y=fY+110;
  // full-width
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.fillText(fields[0].l,fX+40,row1Y);
  ctx.fillStyle=C.border; rr(ctx,fX+40,row1Y+8,fw,46,8); ctx.fill();
  ctx.fillStyle='rgba(27,58,92,0.15)'; rr(ctx,fX+40,row1Y+8,fw,46,8); ctx.fill();
  ctx.strokeStyle=C.navy; ctx.lineWidth=2; rr(ctx,fX+40,row1Y+8,fw,46,8); ctx.stroke();
  ctx.fillStyle=C.ink; ctx.font='normal 15px WS'; ctx.fillText(fields[0].v,fX+56,row1Y+37);

  // 2-col row
  const r2Y=row1Y+78;
  [[fields[1],0.38],[fields[2],0.57]].forEach(([f,ratio],col)=>{
    const fx2=fX+40+(col===1?fw*0.42+16:0), fw2=fw*(col===0?0.38:0.55);
    ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.fillText(f.l,fx2,r2Y);
    ctx.fillStyle=C.warmD; rr(ctx,fx2,r2Y+8,fw2,46,8); ctx.fill();
    ctx.strokeStyle=C.border; ctx.lineWidth=1; rr(ctx,fx2,r2Y+8,fw2,46,8); ctx.stroke();
    ctx.fillStyle=C.ink; ctx.font='normal 15px WS'; ctx.fillText(f.v,fx2+16,r2Y+37);
  });

  // Map pin confirmation
  const mapY=r2Y+78, mapH=220, mapW=fw;
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.fillText('CONFIRME A LOCALIZACAO NO MAPA',fX+40,mapY);
  const mg2=ctx.createLinearGradient(fX+40,mapY+10,fX+40+mapW,mapY+10+mapH);
  mg2.addColorStop(0,'#ccd8e5'); mg2.addColorStop(1,'#b5c8da');
  ctx.fillStyle=mg2; rr(ctx,fX+40,mapY+10,mapW,mapH,12); ctx.fill();
  // grid
  ctx.strokeStyle='rgba(27,58,92,0.07)'; ctx.lineWidth=1;
  for(let gx=fX+40;gx<fX+40+mapW;gx+=40){ctx.beginPath();ctx.moveTo(gx,mapY+10);ctx.lineTo(gx,mapY+10+mapH);ctx.stroke();}
  for(let gy=mapY+10;gy<mapY+10+mapH;gy+=40){ctx.beginPath();ctx.moveTo(fX+40,gy);ctx.lineTo(fX+40+mapW,gy);ctx.stroke();}
  // roads
  ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(fX+40,mapY+120);ctx.lineTo(fX+40+mapW,mapY+120);ctx.stroke();
  ctx.beginPath();ctx.moveTo(fX+40+mapW/2,mapY+10);ctx.lineTo(fX+40+mapW/2,mapY+10+mapH);ctx.stroke();
  // pin
  const pinX=fX+40+mapW/2+30, pinY=mapY+115;
  sh(ctx,16,'rgba(232,101,26,0.5)',0,4);
  ctx.fillStyle=C.orange; ctx.beginPath(); ctx.arc(pinX,pinY,16,0,Math.PI*2); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.white; ctx.font='bold 16px WS'; ctx.textAlign='center'; ctx.fillText('P',pinX,pinY+6); ctx.textAlign='left';
  ctx.fillStyle='rgba(255,255,255,0.92)'; rr(ctx,pinX-50,pinY-48,100,26,8); ctx.fill();
  ctx.fillStyle=C.navy; ctx.font='bold 11px WS'; ctx.textAlign='center'; ctx.fillText('A sua morada',pinX,pinY-30); ctx.textAlign='left';

  // Privacy checkbox
  const ckY=mapY+mapH+28;
  ctx.fillStyle=C.navy; rr(ctx,fX+40,ckY,20,20,4); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 12px WS'; ctx.textAlign='center'; ctx.fillText('OK',fX+50,ckY+14); ctx.textAlign='left';
  ctx.fillStyle=C.muted; ctx.font='normal 13px WS'; ctx.fillText('Nao mostrar morada exacta no anuncio (mostrar localizacao aproximada)',fX+68,ckY+14);

  // Navigation buttons
  const navBY=H-80;
  ctx.fillStyle=C.warmD; rr(ctx,fX+40,navBY,140,46,10); ctx.fill();
  ctx.fillStyle=C.muted; ctx.font='bold 14px WS'; ctx.textAlign='center'; ctx.fillText('< Anterior',fX+110,navBY+29);
  ctx.fillStyle=C.orange; rr(ctx,fX+fW-180,navBY,140,46,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.fillText('Continuar >',fX+fW-110,navBY+29); ctx.textAlign='left';

  fs.writeFileSync('mockup-04-vender.png',cv.toBuffer('image/png'));
  console.log('OK 04 vender');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 5 — DASHBOARD DO ANUNCIANTE
// ═══════════════════════════════════════════════════════════════════════════════
function m5_dashboard() {
  const W=1440,H=900,cv=createCanvas(W,H),ctx=cv.getContext('2d');
  ctx.fillStyle='#F0EFF0'; ctx.fillRect(0,0,W,H);
  navbarCompact(ctx,W);

  // Sidebar
  const sW=240;
  ctx.fillStyle=C.navy; ctx.fillRect(0,64,sW,H-64);
  // user avatar
  ctx.fillStyle='rgba(255,255,255,0.15)'; rr(ctx,20,90,48,48,24); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 16px WS'; ctx.textAlign='center'; ctx.fillText('JC',44,120); ctx.textAlign='left';
  ctx.fillStyle=C.white; ctx.font='bold 14px WS'; ctx.fillText('Joao Cardoso',78,108);
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='normal 12px WS'; ctx.fillText('Agente ERA Lisboa',78,124);
  ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fillRect(20,148,sW-40,1);

  const menuItems=[
    ['Visao Geral',true],['Os Meus Imoveis',false],['Mensagens',false],
    ['Estatisticas',false],['Perfil',false],['Sair',false]
  ];
  menuItems.forEach(([label,active],i)=>{
    const my=170+i*52;
    if(active){ ctx.fillStyle='rgba(232,101,26,0.2)'; rr(ctx,12,my-10,sW-24,40,8); ctx.fill(); ctx.fillStyle=C.orange; ctx.fillRect(0,my-10,4,40); }
    ctx.fillStyle=active?C.white:'rgba(255,255,255,0.58)'; ctx.font=active?'bold 14px WS':'normal 14px WS';
    ctx.fillText(label,32,my+14);
  });

  // Main content
  const mX=sW+24, mY=80;
  ctx.fillStyle=C.ink; ctx.font='normal 28px Gloock'; ctx.fillText('Visao Geral',mX,mY+26);
  ctx.fillStyle=C.muted; ctx.font='normal 13px WS'; ctx.fillText('Bem-vindo de volta, Joao',mX,mY+50);

  // Stats cards — 4 in a row
  const statCards=[
    {label:'Imoveis Activos',val:'8',sub:'+1 este mes',color:C.navy},
    {label:'Visualizacoes (30d)',val:'1.247',sub:'+18% vs mes anterior',color:C.green},
    {label:'Contactos (30d)',val:'34',sub:'Taxa: 2.7%',color:C.orange},
    {label:'Favoritos',val:'89',sub:'Em 23 imoveis',color:'#8B5CF6'},
  ];
  const scW=(W-sW-24-24-24*3)/4;
  statCards.forEach((sc,i)=>{
    const scX=mX+i*(scW+24), scY=mY+66;
    sh(ctx,12,'rgba(28,28,46,0.08)',0,3); ctx.fillStyle=C.white; rr(ctx,scX,scY,scW,100,12); ctx.fill(); nsh(ctx);
    ctx.fillStyle=sc.color; ctx.fillRect(scX,scY,4,100);
    ctx.font='normal 11px Jura'; ctx.fillStyle=C.faint; ctx.fillText(sc.label.toUpperCase(),scX+20,scY+28);
    ctx.font='bold 36px Lora'; ctx.fillStyle=C.ink; ctx.fillText(sc.val,scX+20,scY+72);
    ctx.font='normal 12px WS'; ctx.fillStyle=sc.color; ctx.fillText(sc.sub,scX+20,scY+90);
  });

  // Chart area
  const chY=mY+200, chH=180, chW=W-sW-24-24-320;
  sh(ctx,12,'rgba(28,28,46,0.08)',0,3); ctx.fillStyle=C.white; rr(ctx,mX,chY,chW,chH,12); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Visualizacoes por dia (ultimos 30 dias)',mX+20,chY+28);
  // chart bars
  const bars=[22,35,28,41,38,55,48,62,44,38,52,68,74,58,44,38,62,78,85,72,66,80,92,88,76,82,95,88,74,68];
  const barW=(chW-80)/bars.length, maxB=100;
  bars.forEach((b,i)=>{
    const bh=(b/maxB)*(chH-60), bx=mX+40+i*barW, by=chY+chH-20-bh;
    const grad=ctx.createLinearGradient(bx,by,bx,by+bh);
    grad.addColorStop(0,C.navy); grad.addColorStop(1,'rgba(27,58,92,0.3)');
    ctx.fillStyle=grad; rr(ctx,bx+1,by,barW-4,bh,2); ctx.fill();
  });
  // x axis
  ctx.fillStyle=C.border; ctx.fillRect(mX+40,chY+chH-20,chW-60,1);
  ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.textAlign='center';
  ['1 Mai','8 Mai','15 Mai','22 Mai','30 Mai'].forEach((l,i)=>{
    ctx.fillText(l,mX+40+i*((chW-60)/4),chY+chH-6);
  }); ctx.textAlign='left';

  // Recent listings mini-table
  const tbX=mX+chW+20, tbW=W-tbX-20, tbY=chY;
  sh(ctx,12,'rgba(28,28,46,0.08)',0,3); ctx.fillStyle=C.white; rr(ctx,tbX,tbY,tbW,chH,12); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Mais Vistos',tbX+20,tbY+28);
  [['Apt T2 Campo Ourique','142 views'],['Moradia T3 Cascais','98 views'],['Apt T1 Mouraria','67 views']].forEach(([t,v],i)=>{
    const ry=tbY+54+i*44;
    ctx.fillStyle=C.warmD; rr(ctx,tbX+16,ry,tbW-32,36,6); ctx.fill();
    ctx.fillStyle=C.ink; ctx.font='normal 13px WS'; ctx.fillText(t,tbX+28,ry+22);
    ctx.fillStyle=C.orange; ctx.font='bold 13px WS'; ctx.textAlign='right'; ctx.fillText(v,tbX+tbW-24,ry+22); ctx.textAlign='left';
  });

  // Listings table
  const ltY=mY+420;
  sh(ctx,12,'rgba(28,28,46,0.08)',0,3); ctx.fillStyle=C.white; rr(ctx,mX,ltY,W-sW-48,H-ltY-24,12); ctx.fill(); nsh(ctx);
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Os Meus Imoveis Activos',mX+20,ltY+28);
  ctx.fillStyle=C.orange; rr(ctx,W-200,ltY+12,138,32,8); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 12px WS'; ctx.textAlign='center'; ctx.fillText('+ Publicar Novo',W-131,ltY+32); ctx.textAlign='left';

  const headers=['Imovel','Status','Preco','Views','Contactos','Publicado','Accoes'];
  const colW=[300,100,130,80,100,120,130];
  let hx=mX+20; ctx.fillStyle=C.faint; ctx.font='normal 10px Jura';
  headers.forEach((h,i)=>{ ctx.fillText(h,hx,ltY+56); hx+=colW[i]; });
  ctx.fillStyle=C.border; ctx.fillRect(mX+20,ltY+62,W-sW-88,1);

  const rows=[
    ['Apt T2 Campo Ourique','Activo','285.000 EUR','142','12','3 dias',true,C.green],
    ['Moradia T3 Cascais','Activo','420.000 EUR','98','7','8 dias',true,C.green],
    ['Apt T1 Mouraria','Pausado','195.000 EUR','67','4','15 dias',false,C.muted],
  ];
  rows.forEach(([nome,status,preco,views,cont,pub,active,sColor],i)=>{
    const ry=ltY+80+i*52;
    if(i%2===0){ ctx.fillStyle='rgba(247,246,243,0.5)'; ctx.fillRect(mX+20,ry-14,W-sW-88,48); }
    ctx.font='bold 13px WS'; ctx.fillStyle=C.ink; ctx.fillText(nome,mX+20,ry+8);
    ctx.fillStyle=sColor; rr(ctx,mX+20+colW[0],ry-8,74,24,12); ctx.fill();
    ctx.fillStyle=C.white; ctx.font='bold 10px WS'; ctx.textAlign='center'; ctx.fillText(status,mX+20+colW[0]+37,ry+8); ctx.textAlign='left';
    ctx.fillStyle=C.ink; ctx.font='bold 13px WS'; ctx.fillText(preco,mX+20+colW[0]+colW[1],ry+8);
    ctx.fillStyle=C.muted; ctx.font='normal 13px WS';
    ctx.fillText(views,mX+20+colW[0]+colW[1]+colW[2],ry+8);
    ctx.fillText(cont,mX+20+colW[0]+colW[1]+colW[2]+colW[3],ry+8);
    ctx.fillText(pub,mX+20+colW[0]+colW[1]+colW[2]+colW[3]+colW[4],ry+8);
    // action btns
    const ax=mX+20+colW[0]+colW[1]+colW[2]+colW[3]+colW[4]+colW[5];
    ctx.fillStyle=C.warmD; rr(ctx,ax,ry-8,52,24,6); ctx.fill();
    ctx.fillStyle=C.navy; ctx.font='bold 10px WS'; ctx.textAlign='center'; ctx.fillText('Editar',ax+26,ry+8);
    ctx.fillStyle=C.warmD; rr(ctx,ax+58,ry-8,52,24,6); ctx.fill();
    ctx.fillStyle=active?C.green:C.muted; ctx.fillText(active?'Pausar':'Activar',ax+84,ry+8);
    ctx.textAlign='left';
  });

  fs.writeFileSync('mockup-05-dashboard.png',cv.toBuffer('image/png'));
  console.log('OK 05 dashboard');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 6 — AVALIAR: ESTIMATIVA DE VALOR (AVM)
// ═══════════════════════════════════════════════════════════════════════════════
function m6_avaliar() {
  const W=1440,H=900,cv=createCanvas(W,H),ctx=cv.getContext('2d');
  ctx.fillStyle=C.warm; ctx.fillRect(0,0,W,H);
  navbar(ctx,W,'Avaliar');

  // Hero strip
  const hg=ctx.createLinearGradient(0,64,0,200);
  hg.addColorStop(0,C.navyD); hg.addColorStop(1,'#1a3050');
  ctx.fillStyle=hg; ctx.fillRect(0,64,W,136);
  ctx.fillStyle=C.white; ctx.font='normal 36px Gloock'; ctx.textAlign='center';
  ctx.fillText('Quanto vale o seu imovel?',W/2,126);
  ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font='normal 16px WS';
  ctx.fillText('Estimativa gratuita e imediata baseada no mercado actual',W/2,158); ctx.textAlign='left';

  // Main card
  const cX=W/2-640, cW2=1280, cY=216;
  sh(ctx,20,'rgba(28,28,46,0.09)',0,4); ctx.fillStyle=C.white; rr(ctx,cX,cY,cW2,H-cY-32,16); ctx.fill(); nsh(ctx);

  // Left: input form (45%)
  const formW=cW2*0.44, formX=cX+40;
  ctx.fillStyle=C.ink; ctx.font='bold 18px WS'; ctx.fillText('Dados do imovel',formX,cY+40);

  const avmFields=[
    {l:'Morada ou zona',v:'Campo de Ourique, Lisboa'},
    {l:'Tipo de imovel',v:'Apartamento  v'},
    {l:'Tipologia',v:'T2  v'},
    {l:'Area util (m2)',v:'85'},
  ];
  avmFields.forEach((f,i)=>{
    const fy=cY+72+i*72;
    ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.fillText(f.l,formX,fy);
    ctx.fillStyle=C.warmD; rr(ctx,formX,fy+8,formW,46,8); ctx.fill();
    ctx.strokeStyle=C.border; ctx.lineWidth=1; rr(ctx,formX,fy+8,formW,46,8); ctx.stroke();
    ctx.fillStyle=C.ink; ctx.font='normal 15px WS'; ctx.fillText(f.v,formX+16,fy+37);
  });

  ctx.fillStyle=C.orange; rr(ctx,formX,cY+368,formW,50,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 16px WS'; ctx.textAlign='center';
  ctx.fillText('Estimar Valor Agora',formX+formW/2,cY+399); ctx.textAlign='left';

  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura'; ctx.textAlign='center';
  ctx.fillText('Baseado em '+Math.floor(Math.random()*50+80)+' imoveis comparaveis na zona',formX+formW/2,cY+432); ctx.textAlign='left';

  // Divider
  ctx.fillStyle=C.border; ctx.fillRect(cX+formW+60,cY+20,1,H-cY-52);

  // Right: result panel (55%)
  const resX=cX+formW+80, resW=cW2-formW-100;

  // Result card — highlighted
  const resCardY=cY+30, resCardH=240;
  ctx.fillStyle=C.navyD; rr(ctx,resX,resCardY,resW,resCardH,16); ctx.fill();
  buildings(ctx,resX,resCardY+50,resW,resCardH+50,0.04);

  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='normal 11px Jura';
  ctx.textAlign='center'; ctx.fillText('ESTIMATIVA DE VALOR ACTUAL',resX+resW/2,resCardY+36);
  ctx.fillStyle=C.orange; ctx.font='bold 56px Lora'; ctx.fillText('263.000 EUR',resX+resW/2,resCardY+110);
  ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='normal 14px WS';
  ctx.fillText('Intervalo provavel: 248.000 EUR  —  278.000 EUR',resX+resW/2,resCardY+144);
  // confidence badge
  ctx.fillStyle=C.green; rr(ctx,resX+resW/2-60,resCardY+162,120,28,14); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 12px WS'; ctx.fillText('Confianca: Alta',resX+resW/2,resCardY+181);
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='normal 11px Jura';
  ctx.fillText('Baseado em 94 imoveis comparaveis num raio de 1km',resX+resW/2,resCardY+216); ctx.textAlign='left';

  // Price per sqm stat
  const st2Y=resCardY+resCardH+20;
  [[resX,resW/3-8,'3.094 EUR/m2','Preco por m2 na zona'],[resX+resW/3+8,resW/3-8,'2.8%','Valorizacao anual'],[resX+resW*2/3+16,resW/3-16,'94','Comparaveis usados']].forEach(([sx,sw,val,lab])=>{
    sh(ctx,8,'rgba(28,28,46,0.07)',0,2); ctx.fillStyle=C.warm; rr(ctx,sx,st2Y,sw,72,10); ctx.fill(); nsh(ctx);
    ctx.fillStyle=C.navy; ctx.font='bold 22px Lora'; ctx.textAlign='center'; ctx.fillText(val,sx+sw/2,st2Y+38);
    ctx.fillStyle=C.muted; ctx.font='normal 11px Jura'; ctx.fillText(lab,sx+sw/2,st2Y+58); ctx.textAlign='left';
  });

  // Market position bar
  const barY=st2Y+96, barTW=resW;
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Posicao no mercado',resX,barY);
  ctx.fillStyle=C.warmD; rr(ctx,resX,barY+14,barTW,20,10); ctx.fill();
  const fillW=barTW*0.62;
  const barG=ctx.createLinearGradient(resX,0,resX+fillW,0);
  barG.addColorStop(0,'#2D9E6B'); barG.addColorStop(0.5,C.orange); barG.addColorStop(1,C.red);
  ctx.fillStyle=barG; rr(ctx,resX,barY+14,fillW,20,10); ctx.fill();
  // indicator
  ctx.fillStyle=C.navy; ctx.beginPath(); ctx.arc(resX+fillW,barY+24,8,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=C.faint; ctx.font='normal 11px Jura';
  ctx.fillText('Abaixo da media',resX,barY+52);
  ctx.textAlign='center'; ctx.fillText('Preco justo',resX+barTW/2,barY+52); ctx.textAlign='right';
  ctx.fillText('Acima da media',resX+barTW,barY+52); ctx.textAlign='left';

  // CTA
  const ctaY=st2Y+200;
  ctx.fillStyle=C.orange; rr(ctx,resX,ctaY,resW/2-8,48,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 14px WS'; ctx.textAlign='center';
  ctx.fillText('Publicar por este preco',resX+resW/4-4,ctaY+29);
  ctx.fillStyle=C.white; ctx.strokeStyle=C.navy; ctx.lineWidth=1.5;
  rr(ctx,resX+resW/2+8,ctaY,resW/2-8,48,10); ctx.fill(); ctx.stroke();
  ctx.fillStyle=C.navy; ctx.fillText('Falar com um agente',resX+resW*3/4+8,ctaY+29); ctx.textAlign='left';

  fs.writeFileSync('mockup-06-avaliar.png',cv.toBuffer('image/png'));
  console.log('OK 06 avaliar');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCKUP 7 — MOBILE HOMEPAGE (375px — iPhone)
// ═══════════════════════════════════════════════════════════════════════════════
function m7_mobile() {
  const W=390,H=844,cv=createCanvas(W,H),ctx=cv.getContext('2d');

  // Hero background
  const g=ctx.createLinearGradient(0,0,0,H*0.75);
  g.addColorStop(0,C.navyD); g.addColorStop(0.6,C.navyM); g.addColorStop(1,'#0a1520');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  // Buildings silhouette (compressed)
  [[0,480,40],[44,460,35],[82,490,30],[115,450,45],[163,470,35],[202,440,55],
   [260,475,40],[303,445,50],[356,470,30]].forEach(([bx,by,bw])=>{
    ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fillRect(bx,by,bw,H*0.75-by);
    for(let r=0;r<3;r++) for(let c=0;c<Math.floor(bw/18);c++){
      ctx.fillStyle='rgba(232,101,26,0.15)'; ctx.fillRect(bx+3+c*18,by+15+r*42,11,18);
    }
  });

  // Mobile nav
  ctx.fillStyle='rgba(27,58,92,0.95)'; ctx.fillRect(0,0,W,56);
  ctx.fillStyle=C.white; ctx.font='bold 17px WS'; ctx.fillText('Sua',14,36);
  const sw=ctx.measureText('Sua').width;
  ctx.fillStyle=C.orange; ctx.font='normal 17px Gloock'; ctx.fillText('Morada',17+sw,36);
  // hamburger
  [0,7,14].forEach(dy=>{ ctx.fillStyle=C.white; ctx.fillRect(W-46,20+dy,26,2); });

  // Hero text
  ctx.fillStyle=C.white; ctx.font='normal 38px Gloock'; ctx.textAlign='center';
  ctx.fillText('Encontre a sua',W/2,120);
  ctx.fillStyle=C.orange; ctx.fillText('morada ideal',W/2,166);
  ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='normal 15px WS';
  ctx.fillText('em Portugal',W/2,198); ctx.textAlign='left';

  // Search card
  const scY=226, scH=200;
  sh(ctx,24,'rgba(0,0,0,0.35)',0,6); ctx.fillStyle=C.white; rr(ctx,16,scY,W-32,scH,14); ctx.fill(); nsh(ctx);

  // Tabs
  ctx.fillStyle=C.navy; rr(ctx,24,scY+10,88,34,8); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 13px WS'; ctx.textAlign='center'; ctx.fillText('Comprar',68,scY+31);
  ctx.fillStyle=C.muted; ctx.fillText('Arrendar',147,scY+31); ctx.fillText('Vender',222,scY+31); ctx.textAlign='left';

  // Fields
  ctx.fillStyle=C.border; ctx.fillRect(24,scY+54,W-48,1);
  ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.fillText('LOCALIZACAO',30,scY+72);
  ctx.fillStyle=C.ink; ctx.font='bold 15px WS'; ctx.fillText('Lisboa, Portugal',30,scY+94);

  ctx.fillStyle=C.border; ctx.fillRect(24,scY+108,W-48,1);
  const hw2=(W-48)/2;
  ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.fillText('TIPO',30,scY+126);
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('Apartamento v',30,scY+148);
  ctx.fillStyle=C.faint; ctx.font='normal 10px Jura'; ctx.fillText('QUARTOS',30+hw2+8,scY+126);
  ctx.fillStyle=C.ink; ctx.font='bold 14px WS'; ctx.fillText('T2 v',30+hw2+8,scY+148);

  ctx.fillStyle=C.orange; rr(ctx,24,scY+scH-48,W-48,38,10); ctx.fill();
  ctx.fillStyle=C.white; ctx.font='bold 15px WS'; ctx.textAlign='center';
  ctx.fillText('Pesquisar Imoveis',W/2,scY+scH-24); ctx.textAlign='left';

  // Trust pills
  const pills=['OK Verificados','Resposta 24h','100% Gratis'];
  const pillY=scY+scH+20;
  let pillX=16;
  pills.forEach(p=>{
    const pw=ctx.measureText(p).width+20;
    ctx.fillStyle='rgba(255,255,255,0.12)'; rr(ctx,pillX,pillY,pw,28,14); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font='normal 12px WS'; ctx.fillText(p,pillX+10,pillY+18);
    pillX+=pw+8;
  });

  // Featured section
  const featY=pillY+48;
  ctx.fillStyle=C.warm; ctx.fillRect(0,featY,W,H-featY);
  ctx.fillStyle=C.ink; ctx.font='normal 20px Gloock'; ctx.textAlign='center';
  ctx.fillText('Imoveis em Destaque',W/2,featY+30); ctx.textAlign='left';

  // 2 mini cards
  const mcW=(W-40)/2;
  CARDS.slice(0,2).forEach((card,i)=>{
    const mcX=16+i*(mcW+8), mcY=featY+44;
    sh(ctx,10,'rgba(28,28,46,0.10)',0,3); ctx.fillStyle=C.white; rr(ctx,mcX,mcY,mcW,190,10); ctx.fill(); nsh(ctx);
    const pg=ctx.createLinearGradient(mcX,mcY,mcX+mcW,mcY+100);
    pg.addColorStop(0,card.bg[0]); pg.addColorStop(1,card.bg[1]);
    ctx.save(); rr(ctx,mcX,mcY,mcW,100,10); ctx.clip(); ctx.fillStyle=pg; ctx.fillRect(mcX,mcY,mcW,100); ctx.restore();
    if(card.ver){ ctx.fillStyle=C.green; rr(ctx,mcX+6,mcY+6,66,18,3); ctx.fill(); ctx.fillStyle=C.white; ctx.font='bold 9px WS'; ctx.fillText('OK VERIF.',mcX+12,mcY+18); }
    ctx.fillStyle=C.ink; ctx.font='bold 15px Lora'; ctx.fillText(card.price,mcX+10,mcY+124);
    ctx.fillStyle=C.ink; ctx.font='bold 11px WS'; ctx.fillText(card.title.slice(0,20)+'...',mcX+10,mcY+142);
    ctx.fillStyle=C.muted; ctx.font='normal 11px WS'; ctx.fillText(card.loc.split(',')[0],mcX+10,mcY+158);
    ctx.fillStyle=C.muted; ctx.font='normal 11px WS'; ctx.fillText('Qt '+card.bed+' WC '+card.bath+' '+card.area+'m2',mcX+10,mcY+176);
  });

  // Bottom nav bar (mobile)
  const bnY=H-60;
  ctx.fillStyle=C.white; ctx.fillRect(0,bnY,W,60);
  ctx.fillStyle=C.border; ctx.fillRect(0,bnY,W,1);
  const bnItems=[['Inicio',true],['Pesquisa',false],['Favoritos',false],['Mensagens',false],['Perfil',false]];
  const bnW=W/bnItems.length;
  bnItems.forEach(([l,active],i)=>{
    const bx=i*bnW;
    ctx.fillStyle=active?C.orange:C.faint; ctx.fillRect(bx+bnW/2-14,bnY+8,28,4);
    ctx.fillStyle=active?C.navy:C.faint; ctx.font='bold 10px WS';
    ctx.textAlign='center'; ctx.fillText(l,bx+bnW/2,bnY+40); ctx.textAlign='left';
  });

  fs.writeFileSync('mockup-07-mobile.png',cv.toBuffer('image/png'));
  console.log('OK 07 mobile');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN ALL
// ═══════════════════════════════════════════════════════════════════════════════
m1_homepage();
m2_listing();
m3_detail();
m4_vender();
m5_dashboard();
m6_avaliar();
m7_mobile();
console.log('\nTodos os 7 mockups gerados para suamorada.pt');
