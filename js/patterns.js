/* ══════════════════════════════════════════════════════════
   patterns.js — All background canvas patterns
   Each pattern is a function that receives (canvas, ctx, isDark)
   and returns a stop() function to cancel the animation loop.
   ══════════════════════════════════════════════════════════ */

function getColors(isDark) {
  return isDark
    ? { a: '200,235,100', b: '130,110,240', c: '100,200,220', neutral: '180,185,190', bg: '12,12,11' }
    : { a: '40,110,65',   b: '70,90,200',   c: '20,140,160', neutral: '80,90,100',   bg: '250,249,246' };
}

/* ── A: Binary Rain ── */
export function patternBinaryRain(canvas, ctx, isDark) {
  const FONT = 13;
  let cols, drops, speeds, opacities, raf;

  function init() {
    cols     = Math.floor(canvas.width / FONT);
    drops    = Array.from({ length: cols }, () => Math.random() * -canvas.height / FONT);
    speeds   = Array.from({ length: cols }, () => Math.random() * 0.6 + 0.2);
    opacities= Array.from({ length: cols }, () => Math.random() * 0.22 + 0.07);
  }
  init();

  function draw() {
    const c   = getColors(isDark());
    const col = c.a;
    ctx.fillStyle = isDark() ? `rgba(${c.bg},0.07)` : `rgba(${c.bg},0.07)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT}px "DM Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const char = Math.random() > 0.5 ? '1' : '0';
      const x = i * FONT, y = drops[i] * FONT;
      ctx.fillStyle = `rgba(${col},${Math.min(opacities[i] * 2.8, 0.7)})`;
      ctx.fillText(char, x, y);
      for (let t = 1; t < 6; t++) {
        ctx.fillStyle = `rgba(${col},${opacities[i] * (1 - t * 0.18)})`;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y - t * FONT);
      }
      drops[i] += speeds[i];
      if (drops[i] * FONT > canvas.height && Math.random() > 0.975) {
        drops[i]    = Math.random() * -20;
        opacities[i]= Math.random() * 0.22 + 0.07;
      }
    }
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ── B: Hexagonal Grid Pulse ── */
export function patternHexGrid(canvas, ctx, isDark) {
  const R = 38;
  let hexes = [], mouse = { x: canvas.width / 2, y: canvas.height / 2 }, raf;

  function build() {
    hexes = [];
    const dx = R * 1.732, dy = R * 1.5;
    for (let row = -1; row < canvas.height / dy + 2; row++)
      for (let col = -1; col < canvas.width / dx + 2; col++)
        hexes.push({ x: col * dx + (row % 2 ? dx / 2 : 0), y: row * dy, phase: Math.random() * Math.PI * 2 });
  }
  build();

  const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
  window.addEventListener('mousemove', onMove);

  function drawHex(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  }

  let t = 0;
  function draw() {
    t += 0.04;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getColors(isDark());
    hexes.forEach(h => {
      const dist   = Math.hypot(h.x - mouse.x, h.y - mouse.y);
      const wave   = (Math.sin(t - dist * 0.018 + h.phase) + 1) / 2;
      const prox   = Math.max(0, 1 - dist / 320);
      drawHex(h.x, h.y, R - 1);
      ctx.strokeStyle = `rgba(${c.a},${0.04 + wave * 0.10 + prox * 0.18})`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(h.x, h.y, 1.5 + prox * 3.5 + wave * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.a},${0.06 + prox * 0.55 + wave * 0.12})`;
      ctx.fill();
      h.phase += 0.004;
    });
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
}

/* ── C: Data Packet Simulation ── */
export function patternDataPackets(canvas, ctx, isDark) {
  const SERVICES = [
    { label:'API Gateway',  rx:0.50, ry:0.12 }, { label:'Auth Service', rx:0.20, ry:0.28 },
    { label:'Spring Boot',  rx:0.72, ry:0.25 }, { label:'Kafka',        rx:0.50, ry:0.44 },
    { label:'PostgreSQL',   rx:0.18, ry:0.62 }, { label:'Redis',        rx:0.50, ry:0.72 },
    { label:'Docker',       rx:0.80, ry:0.58 }, { label:'Kubernetes',   rx:0.30, ry:0.82 },
    { label:'IRIS',         rx:0.72, ry:0.82 },
  ];
  const EDGES = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[2,6],[5,7],[6,8],[3,8],[4,7],[5,8]];
  let nodes = [], packets = [], hovered = -1, raf;
  let mouse = { x:-9999, y:-9999 };

  function build() {
    nodes = SERVICES.map((s, i) => ({
      x: s.rx * canvas.width, y: s.ry * canvas.height,
      label: s.label, r: 5, pulse: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? 'b' : 'a',
    }));
  }
  build();

  function spawn() {
    const e = EDGES[Math.floor(Math.random() * EDGES.length)], rev = Math.random() > 0.5;
    packets.push({ from: rev ? e[1]:e[0], to: rev ? e[0]:e[1], t:0, speed: Math.random()*0.004+0.003, size: Math.random()*2+1.5 });
  }

  const iv = setInterval(() => { if (packets.length < 28) spawn(); }, 220);
  const onMove = e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    hovered = nodes.findIndex(n => Math.hypot(n.x - mouse.x, n.y - mouse.y) < 32);
  };
  const onLeave = () => { mouse.x=-9999; hovered=-1; };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseleave', onLeave);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getColors(isDark());
    EDGES.forEach(([a,b]) => {
      const na=nodes[a], nb=nodes[b], act=hovered===a||hovered===b;
      ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle=`rgba(${c.a},${act?0.30:0.10})`; ctx.lineWidth=act?1.2:0.6; ctx.stroke();
    });
    packets.forEach((p,i) => {
      p.t += p.speed;
      if (p.t >= 1) { packets.splice(i,1); return; }
      const na=nodes[p.from], nb=nodes[p.to];
      const x=na.x+(nb.x-na.x)*p.t, y=na.y+(nb.y-na.y)*p.t;
      const pkt = isDark() ? '255,255,255' : '20,20,20';
      for (let t=1;t<=4;t++) {
        const tp=Math.max(0,p.t-t*0.025);
        ctx.beginPath(); ctx.arc(na.x+(nb.x-na.x)*tp, na.y+(nb.y-na.y)*tp, p.size*(1-t*0.22),0,Math.PI*2);
        ctx.fillStyle=`rgba(${pkt},${0.35-t*0.07})`; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x,y,p.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(${pkt},0.9)`; ctx.fill();
    });
    nodes.forEach((n,i) => {
      n.pulse+=0.025;
      const pr=n.r+Math.sin(n.pulse)*1.2, isH=hovered===i, col=c[n.color];
      const grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,isH?28:18);
      grd.addColorStop(0,`rgba(${col},${isH?0.25:0.12})`); grd.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(n.x,n.y,isH?28:18,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,isH?pr*1.6:pr,0,Math.PI*2);
      ctx.fillStyle=`rgba(${col},${isH?0.95:0.75})`; ctx.fill();
      ctx.font=`500 11px "DM Mono",monospace`; ctx.textAlign='center';
      ctx.fillStyle=`rgba(${isDark()?'200,235,100':'40,110,65'},${isH?1:0.55})`;
      ctx.fillText(n.label,n.x,n.y+pr+14);
    });
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(raf); clearInterval(iv);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
  };
}

/* ── D: Sine Wave Interference ── */
export function patternSineWaves(canvas, ctx, isDark) {
  const WAVES = [
    { freq:0.008, amp:60, speed:0.012, phase:0,   yFrac:0.25 },
    { freq:0.012, amp:45, speed:0.018, phase:1.2, yFrac:0.42 },
    { freq:0.006, amp:70, speed:0.009, phase:2.5, yFrac:0.58 },
    { freq:0.015, amp:35, speed:0.022, phase:0.7, yFrac:0.72 },
    { freq:0.010, amp:50, speed:0.014, phase:3.8, yFrac:0.88 },
  ];
  let mouse = { x:-1, y:-1 }, raf;
  const onMove = e => { mouse.x=e.clientX; mouse.y=e.clientY; };
  window.addEventListener('mousemove', onMove);
  let t = 0;

  function draw() {
    t++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cs = getColors(isDark());
    const cols = [cs.a, cs.b, cs.c, cs.a, cs.b];
    const w = canvas.width, h = canvas.height;
    WAVES.forEach((wave, wi) => {
      wave.phase += wave.speed;
      const baseY = h * wave.yFrac, col = cols[wi];
      let amp = wave.amp;
      const dy = Math.abs(mouse.y - baseY);
      const prox = mouse.y > 0 ? Math.max(0, 1 - dy / 200) : 0;
      amp += prox * 40;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const dist = Math.abs(x - mouse.x);
        const distortion = mouse.x > 0 ? Math.exp(-dist*dist/12000)*prox*30 : 0;
        const y = baseY + Math.sin(x*wave.freq+wave.phase)*amp
                        + Math.sin(x*wave.freq*2.3+wave.phase*1.4)*amp*0.3
                        + distortion*Math.sin(x*0.05+t*0.1);
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(${col},0.18)`; ctx.lineWidth=1.2; ctx.stroke();
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
      ctx.fillStyle=`rgba(${col},0.018)`; ctx.fill();
      for (let x=0; x<=w; x+=Math.floor(w/14)) {
        const y = baseY+Math.sin(x*wave.freq+wave.phase)*amp+Math.sin(x*wave.freq*2.3+wave.phase*1.4)*amp*0.3;
        if (Math.sin(x*wave.freq+wave.phase) > 0.85) {
          ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(${col},0.55)`; ctx.fill();
        }
      }
    });
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
}

/* ── E: Constellation / Tech Stack Map ── */
export function patternConstellation(canvas, ctx, isDark) {
  const TECH = [
    'Java','Spring Boot','Kafka','PostgreSQL','Docker','Kubernetes',
    'Redis','Microservices','Python','REST','CI/CD','Jenkins',
    'Generative AI','LLMs','Cloud','Mockito','Maven','Unix','React','TypeScript',
  ];
  const CONNECT_DIST = 220;
  let nodes = [], raf;
  let mouse = { x:-9999, y:-9999 };

  function build() {
    nodes = TECH.map(label => ({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx:(Math.random()-.5)*0.22, vy:(Math.random()-.5)*0.22,
      r: Math.random()*2.5+2, pulse: Math.random()*Math.PI*2,
      label, color: Math.random()>0.5?'a':'b',
      fontSize: Math.random()*3+10,
    }));
  }
  build();

  const onMove = e => { mouse.x=e.clientX; mouse.y=e.clientY; };
  const onLeave = () => { mouse.x=-9999; mouse.y=-9999; };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseleave', onLeave);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getColors(isDark());
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
      const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y);
      if (d<CONNECT_DIST) {
        ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.strokeStyle=`rgba(${c.a},${0.18*(1-d/CONNECT_DIST)})`; ctx.lineWidth=.6; ctx.stroke();
      }
    }
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<60||n.x>canvas.width-60) n.vx*=-1;
      if(n.y<20||n.y>canvas.height-20) n.vy*=-1;
      const mdx=mouse.x-n.x, mdy=mouse.y-n.y, md=Math.hypot(mdx,mdy);
      if(md<180&&md>0) {
        const pull=(180-md)/180*0.015;
        n.vx+=(mdx/md)*pull; n.vy+=(mdy/md)*pull;
        const spd=Math.hypot(n.vx,n.vy);
        if(spd>1.2){n.vx=(n.vx/spd)*1.2;n.vy=(n.vy/spd)*1.2;}
      }
      n.pulse+=0.02;
      const pr=n.r+Math.sin(n.pulse)*0.8, col=c[n.color];
      const grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,pr*4);
      grd.addColorStop(0,`rgba(${col},0.18)`); grd.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(n.x,n.y,pr*4,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,Math.PI*2); ctx.fillStyle=`rgba(${col},0.80)`; ctx.fill();
      ctx.font=`500 ${n.fontSize}px "DM Mono",monospace`; ctx.textAlign='center';
      ctx.fillStyle=`rgba(${c.neutral},${isDark()?0.35:0.40})`;
      ctx.fillText(n.label,n.x,n.y-pr-7);
    });
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseleave',onLeave); };
}

/* ── F: Circuit Traces ── */
export function patternCircuitTraces(canvas, ctx, isDark) {
  const GRID = 52;
  let nodes=[], edges=[], signals=[], raf;

  function build() {
    nodes=[]; edges=[];
    const cols=Math.ceil(canvas.width/GRID)+1, rows=Math.ceil(canvas.height/GRID)+1;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++)
      if(Math.random()>0.35) nodes.push({ x:c*GRID, y:r*GRID, pulse:Math.random()*Math.PI*2, active:false });
    nodes.forEach((n,i) => {
      nodes.slice(i+1).forEach((m,j) => {
        const same = (n.x===m.x&&Math.abs(n.y-m.y)===GRID)||(n.y===m.y&&Math.abs(n.x-m.x)===GRID);
        if(same&&Math.random()>0.3) edges.push({a:i, b:nodes.indexOf(m)});
      });
    });
  }
  build();

  function spawnSignal() {
    if(!edges.length) return;
    const e=edges[Math.floor(Math.random()*edges.length)], rev=Math.random()>0.5;
    signals.push({ from:rev?e.b:e.a, to:rev?e.a:e.b, t:0, speed:Math.random()*0.018+0.010 });
  }
  const iv=setInterval(()=>{ if(signals.length<20) spawnSignal(); },180);

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const c=getColors(isDark()), col=c.a, colB=c.b;
    edges.forEach(e => {
      const na=nodes[e.a], nb=nodes[e.b];
      ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle=`rgba(${col},0.10)`; ctx.lineWidth=1; ctx.stroke();
    });
    signals.forEach((s,i) => {
      s.t+=s.speed;
      if(s.t>=1){ nodes[s.to].active=true; setTimeout(()=>nodes[s.to].active=false,400); signals.splice(i,1); return; }
      const na=nodes[s.from], nb=nodes[s.to];
      // Right-angle routing: go horizontal first then vertical
      const mx=nb.x, my=na.y;
      ctx.beginPath();
      if(s.t<0.5) {
        const prog=s.t*2;
        ctx.moveTo(na.x,na.y);
        ctx.lineTo(na.x+(mx-na.x)*prog, my);
      } else {
        const prog=(s.t-0.5)*2;
        ctx.moveTo(na.x,na.y); ctx.lineTo(mx,my);
        ctx.lineTo(mx,my+(nb.y-my)*prog);
      }
      ctx.strokeStyle=`rgba(${colB},0.70)`; ctx.lineWidth=1.5; ctx.stroke();
      // Signal head
      const hx=s.t<0.5?na.x+(mx-na.x)*(s.t*2):mx;
      const hy=s.t<0.5?my:my+(nb.y-my)*((s.t-0.5)*2);
      ctx.beginPath(); ctx.arc(hx,hy,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(${colB},0.95)`; ctx.fill();
      // Glow
      ctx.beginPath(); ctx.arc(hx,hy,7,0,Math.PI*2);
      ctx.fillStyle=`rgba(${colB},0.15)`; ctx.fill();
    });
    nodes.forEach(n => {
      n.pulse+=0.025;
      const pr=1.8+Math.sin(n.pulse)*0.6;
      ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,Math.PI*2);
      ctx.fillStyle=`rgba(${n.active?colB:col},${n.active?0.95:0.28})`; ctx.fill();
      if(n.active) {
        ctx.beginPath(); ctx.arc(n.x,n.y,8,0,Math.PI*2);
        ctx.fillStyle=`rgba(${colB},0.18)`; ctx.fill();
      }
    });
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  return ()=>{ cancelAnimationFrame(raf); clearInterval(iv); };
}

/* ── G: Code Keyword Rain ── */
export function patternCodeRain(canvas, ctx, isDark) {
  const KEYWORDS = [
    'null','void','async','await','SELECT','FROM','WHERE','JOIN',
    'kubectl','docker','kafka','redis','git push','deploy','rollback',
    'COMMIT','BEGIN','catch','throw','finally','@Bean','@Service',
    'GET','POST','PUT','DELETE','200 OK','404','503','JWT',
    'retry','timeout','latency','throughput','p99','SLA',
  ];
  const FONT=12;
  let columns=[], raf;

  function init() {
    columns=[];
    const count=Math.floor(canvas.width/90);
    for(let i=0;i<count;i++) columns.push({
      x: (i/count)*canvas.width + Math.random()*40 - 20,
      y: Math.random()*-canvas.height,
      speed: Math.random()*0.5+0.25,
      opacity: Math.random()*0.20+0.07,
      keyword: KEYWORDS[Math.floor(Math.random()*KEYWORDS.length)],
      timer:0, interval: Math.floor(Math.random()*80+40),
    });
  }
  init();

  function draw() {
    const c=getColors(isDark()), col=c.a;
    ctx.fillStyle=isDark()?`rgba(12,12,11,0.06)`:`rgba(250,249,246,0.06)`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font=`${FONT}px "DM Mono",monospace`;
    columns.forEach(col_ => {
      col_.timer++;
      if(col_.timer>col_.interval) {
        col_.keyword=KEYWORDS[Math.floor(Math.random()*KEYWORDS.length)];
        col_.timer=0; col_.interval=Math.floor(Math.random()*80+40);
      }
      // Leading keyword — bright
      ctx.fillStyle=`rgba(${col},${Math.min(col_.opacity*3.2,0.75)})`;
      ctx.fillText(col_.keyword, col_.x, col_.y);
      // Ghost trail above
      for(let t=1;t<=3;t++) {
        ctx.fillStyle=`rgba(${col},${col_.opacity*(1-t*0.3)})`;
        ctx.fillText(KEYWORDS[Math.floor(Math.random()*KEYWORDS.length)], col_.x, col_.y-t*22);
      }
      col_.y+=col_.speed;
      if(col_.y>canvas.height+50) {
        col_.y=Math.random()*-200;
        col_.opacity=Math.random()*0.20+0.07;
        col_.speed=Math.random()*0.5+0.25;
      }
    });
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  return ()=>cancelAnimationFrame(raf);
}

/* ── H: Breathing Dot Grid ── */
export function patternBreathingGrid(canvas, ctx, isDark) {
  const SPACING=42;
  let dots=[], mouse={x:-9999,y:-9999}, raf;

  function build() {
    dots=[];
    for(let y=SPACING/2;y<canvas.height;y+=SPACING)
      for(let x=SPACING/2;x<canvas.width;x+=SPACING)
        dots.push({ x,y, phase:Math.random()*Math.PI*2 });
  }
  build();

  const onMove=e=>{ mouse.x=e.clientX; mouse.y=e.clientY; };
  const onLeave=()=>{ mouse.x=-9999; mouse.y=-9999; };
  window.addEventListener('mousemove',onMove);
  window.addEventListener('mouseleave',onLeave);

  let t=0;
  function draw() {
    t+=0.018;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const c=getColors(isDark()), col=c.a, colB=c.b;
    const cx=canvas.width/2, cy=canvas.height/2;
    dots.forEach(d => {
      d.phase+=0.012;
      const distCenter=Math.hypot(d.x-cx,d.y-cy);
      const distMouse=Math.hypot(d.x-mouse.x,d.y-mouse.y);
      const waveCenter=(Math.sin(t-distCenter*0.022+d.phase)+1)/2;
      const waveMouse=Math.max(0,1-distMouse/160);
      const r=1+waveCenter*2.2+waveMouse*4.5;
      const alpha=0.08+waveCenter*0.22+waveMouse*0.55;
      const useB=waveMouse>0.3;
      ctx.beginPath(); ctx.arc(d.x,d.y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${useB?colB:col},${alpha})`; ctx.fill();
      if(waveMouse>0.5) {
        ctx.beginPath(); ctx.arc(d.x,d.y,r*2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(${colB},0.08)`; ctx.fill();
      }
    });
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseleave',onLeave); };
}

/* ── I: Network Ping (nodes send sonar rings on packet receive) ── */
export function patternNetworkPing(canvas, ctx, isDark) {
  const COUNT=18, CONNECT=180;
  let nodes=[], rings=[], raf;
  let mouse={x:-9999,y:-9999};

  function build() {
    nodes=Array.from({length:COUNT},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*0.3, vy:(Math.random()-.5)*0.3,
      r:Math.random()*3+3, pulse:Math.random()*Math.PI*2,
      color:Math.random()>0.5?'a':'b', pingTimer:Math.random()*120,
    }));
  }
  build();

  const onMove=e=>{mouse.x=e.clientX;mouse.y=e.clientY;};
  window.addEventListener('mousemove',onMove);

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const c=getColors(isDark());

    // Update rings
    rings=rings.filter(r=>r.alpha>0.01);
    rings.forEach(r=>{ r.radius+=1.8; r.alpha*=0.96; });

    // Connections
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
      const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y);
      if(d<CONNECT){
        ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.strokeStyle=`rgba(${c[nodes[i].color]},${0.20*(1-d/CONNECT)})`; ctx.lineWidth=.8; ctx.stroke();
      }
    }

    // Rings
    rings.forEach(r=>{
      ctx.beginPath(); ctx.arc(r.x,r.y,r.radius,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${c[r.color]},${r.alpha})`; ctx.lineWidth=1; ctx.stroke();
    });

    // Nodes
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>canvas.width) n.vx*=-1;
      if(n.y<0||n.y>canvas.height) n.vy*=-1;
      // Mouse repulsion
      const mdx=n.x-mouse.x, mdy=n.y-mouse.y, md=Math.hypot(mdx,mdy);
      if(md<100&&md>0){const f=(100-md)/100; n.x+=(mdx/md)*f*2; n.y+=(mdy/md)*f*2;}
      // Ping timer
      n.pingTimer--;
      if(n.pingTimer<=0){ rings.push({x:n.x,y:n.y,radius:n.r,alpha:0.7,color:n.color}); n.pingTimer=Math.random()*180+80; }
      n.pulse+=0.03;
      const pr=n.r+Math.sin(n.pulse)*1, col=c[n.color];
      const grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,pr*3);
      grd.addColorStop(0,`rgba(${col},0.3)`); grd.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(n.x,n.y,pr*3,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,pr,0,Math.PI*2); ctx.fillStyle=`rgba(${col},0.85)`; ctx.fill();
    });
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('mousemove',onMove); };
}

/* ── J: Dual-color Particle Network (original upgraded) ── */
export function patternParticleNetwork(canvas, ctx, isDark) {
  const MOUSE_R=120, CONNECT=140;
  let pts=[], raf;
  let mouse={x:-9999,y:-9999};

  function build() {
    const count=Math.max(60,Math.floor(canvas.width*canvas.height/14000));
    pts=Array.from({length:Math.min(count,90)},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45,
      r:Math.random()*2+1.2, pulse:Math.random()*Math.PI*2,
      type:Math.random()<0.55?'a':'b',
    }));
  }
  build();

  const onMove=e=>{mouse.x=e.clientX;mouse.y=e.clientY;};
  const onLeave=()=>{mouse.x=-9999;mouse.y=-9999;};
  window.addEventListener('mousemove',onMove);
  window.addEventListener('mouseleave',onLeave);

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const c=getColors(isDark());
    const theme={ a:{rgb:c.a,alpha:isDark()?0.80:0.65,glow:0.08}, b:{rgb:c.b,alpha:isDark()?0.70:0.55,glow:0.07}, lineAlpha:isDark()?0.28:0.22, mix:{rgb:c.neutral,alpha:isDark()?0.18:0.14} };
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      const mdx=p.x-mouse.x,mdy=p.y-mouse.y,md=Math.hypot(mdx,mdy);
      if(md<MOUSE_R&&md>0){const f=(MOUSE_R-md)/MOUSE_R;p.x+=(mdx/md)*f*2.5;p.y+=(mdy/md)*f*2.5;}
      p.pulse+=0.018;
      const pr=p.r+Math.sin(p.pulse)*0.5, col=theme[p.type];
      ctx.beginPath(); ctx.arc(p.x,p.y,pr,0,Math.PI*2); ctx.fillStyle=`rgba(${col.rgb},${col.alpha})`; ctx.fill();
      if(p.r>2.2){ctx.beginPath();ctx.arc(p.x,p.y,pr*2.4,0,Math.PI*2);ctx.fillStyle=`rgba(${col.rgb},${col.glow})`;ctx.fill();}
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
      if(d<CONNECT){
        const fade=1-d/CONNECT;
        const same=pts[i].type===pts[j].type;
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=same?`rgba(${theme[pts[i].type].rgb},${theme.lineAlpha*fade})`:`rgba(${theme.mix.rgb},${theme.mix.alpha*fade})`;
        ctx.lineWidth=.7; ctx.stroke();
      }
    }
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseleave',onLeave); };
}

/* ── K: Aurora Borealis ── */
export function patternAurora(canvas, ctx, isDark) {
  let raf;
  // Each curtain is a vertical sine column with its own phase, speed, hue
  const CURTAINS = [
    { x:0.10, width:0.28, hue:145, speed:0.007, phase:0.0,  amp:0.18 },
    { x:0.22, width:0.32, hue:175, speed:0.005, phase:1.2,  amp:0.22 },
    { x:0.40, width:0.30, hue:270, speed:0.009, phase:2.5,  amp:0.15 },
    { x:0.55, width:0.35, hue:160, speed:0.006, phase:0.8,  amp:0.20 },
    { x:0.72, width:0.28, hue:300, speed:0.008, phase:3.1,  amp:0.17 },
    { x:0.85, width:0.22, hue:190, speed:0.004, phase:1.7,  amp:0.14 },
  ];

  let t = 0;
  function draw() {
    t += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const h = canvas.height, w = canvas.width;
    const dark = isDark();

    CURTAINS.forEach(c => {
      c.phase += c.speed;
      const cx   = c.x * w;
      const cw   = c.width * w;
      const sat  = dark ? 75 : 60;
      const lum  = dark ? 55 : 45;

      // Build vertical gradient — aurora fades from mid-screen upward
      const grd = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.75);
      grd.addColorStop(0,   `hsla(${c.hue},${sat}%,${lum}%,0)`);
      grd.addColorStop(0.15,`hsla(${c.hue},${sat}%,${lum}%,${dark?0.18:0.12})`);
      grd.addColorStop(0.4, `hsla(${c.hue},${sat+10}%,${lum}%,${dark?0.28:0.18})`);
      grd.addColorStop(0.7, `hsla(${c.hue},${sat}%,${lum-10}%,${dark?0.12:0.07})`);
      grd.addColorStop(1,   `hsla(${c.hue},${sat}%,${lum}%,0)`);

      // Draw curtain as a wavy ribbon using bezier columns
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const py   = h * 0.10 + frac * h * 0.65;
        // Lateral sway: each y-slice is shifted horizontally
        const sway = Math.sin(frac * 4.5 + c.phase) * cw * c.amp
                   + Math.sin(frac * 2.1 + c.phase * 0.7) * cw * 0.08;
        const px   = cx + sway;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      // Widen the ribbon by also drawing the right edge back
      for (let i = steps; i >= 0; i--) {
        const frac = i / steps;
        const py   = h * 0.10 + frac * h * 0.65;
        const sway = Math.sin(frac * 4.5 + c.phase) * cw * c.amp
                   + Math.sin(frac * 2.1 + c.phase * 0.7) * cw * 0.08;
        ctx.lineTo(cx + sway + cw * 0.5, py);
      }
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Subtle horizontal shimmer lines
    ctx.save();
    ctx.globalAlpha = dark ? 0.04 : 0.025;
    for (let y = 0; y < h * 0.75; y += 18) {
      const shimmer = Math.sin(y * 0.03 + t * 0.02) * 0.5 + 0.5;
      ctx.fillStyle = `hsl(160,70%,${dark?60:45}%)`;
      ctx.fillRect(0, y, w, shimmer * 2);
    }
    ctx.restore();

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ── L: Rain on Glass ── */
export function patternRainGlass(canvas, ctx, isDark) {
  let drops=[], raf;

  function mkDrop() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * -canvas.height * 0.3,
      len:  Math.random() * 55 + 18,
      speed:Math.random() * 2.2 + 0.8,
      width:Math.random() * 1.8 + 0.5,
      alpha:Math.random() * 0.28 + 0.09,
      trail:[],
      splat: null,
    };
  }

  function init() {
    drops = Array.from({ length: 55 }, mkDrop);
  }
  init();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const col  = dark ? '160,210,255' : '20,80,140';

    drops.forEach((d, i) => {
      // Store trail points
      d.trail.push({ x: d.x, y: d.y });
      if (d.trail.length > 8) d.trail.shift();

      // Draw trail with tapering opacity
      if (d.trail.length > 1) {
        for (let t = 1; t < d.trail.length; t++) {
          const p1 = d.trail[t-1], p2 = d.trail[t];
          const frac = t / d.trail.length;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${col},${d.alpha * frac * 0.6})`;
          ctx.lineWidth   = d.width * frac;
          ctx.stroke();
        }
      }

      // Drop head — elongated oval
      const grd = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
      grd.addColorStop(0,   `rgba(${col},0)`);
      grd.addColorStop(0.3, `rgba(${col},${d.alpha * 0.5})`);
      grd.addColorStop(1,   `rgba(${col},${d.alpha})`);
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.bezierCurveTo(d.x - d.width, d.y + d.len * 0.5, d.x + d.width, d.y + d.len * 0.7, d.x, d.y + d.len);
      ctx.strokeStyle = grd;
      ctx.lineWidth   = d.width;
      ctx.stroke();

      // Splat ring when reaching bottom
      if (d.splat) {
        d.splat.r += 1.4;
        d.splat.a *= 0.88;
        ctx.beginPath();
        ctx.ellipse(d.splat.x, d.splat.y, d.splat.r * 2.5, d.splat.r * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},${d.splat.a})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
        if (d.splat.a < 0.02) d.splat = null;
      }

      d.y += d.speed;

      if (d.y > canvas.height + d.len) {
        d.splat = { x: d.x, y: canvas.height - 4, r: 2, a: d.alpha * 1.5 };
        Object.assign(d, mkDrop());
      }
    });

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ── M: Depth Field / Parallax Stars ── */
export function patternDepthField(canvas, ctx, isDark) {
  let layers=[], raf;
  let mouse={x: canvas.width/2, y: canvas.height/2};
  let target={x: canvas.width/2, y: canvas.height/2};
  let current={x: canvas.width/2, y: canvas.height/2};

  const LAYER_COUNT = 4;

  function build() {
    layers = Array.from({ length: LAYER_COUNT }, (_, li) => {
      const depth    = (li + 1) / LAYER_COUNT; // 0.25 → 1.0
      const count    = Math.floor(28 + (1 - depth) * 55);
      const maxR     = 0.6 + depth * 2.2;
      const alpha    = 0.2 + depth * 0.6;
      const parallax = (LAYER_COUNT - li) * 18; // farther = more parallax
      return {
        depth, parallax, alpha, maxR,
        stars: Array.from({ length: count }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * maxR + 0.4,
          pulse: Math.random() * Math.PI * 2,
          twinkle: Math.random() * 0.3 + 0.7,
        })),
      };
    });
  }
  build();

  const onMove = e => { target.x=e.clientX; target.y=e.clientY; };
  window.addEventListener('mousemove', onMove);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();

    // Smooth mouse follow
    current.x += (target.x - current.x) * 0.04;
    current.y += (target.y - current.y) * 0.04;
    const offsetX = (current.x - canvas.width  / 2) / canvas.width;
    const offsetY = (current.y - canvas.height / 2) / canvas.height;

    layers.forEach((layer, li) => {
      const px = offsetX * layer.parallax;
      const py = offsetY * layer.parallax;
      const col = dark
        ? li < 2 ? '200,235,100' : '170,150,255'
        : li < 2 ? '40,110,65'   : '70,90,200';

      layer.stars.forEach(s => {
        s.pulse += 0.012 + layer.depth * 0.008;
        const twinkle = s.twinkle + Math.sin(s.pulse) * 0.2;
        const alpha   = layer.alpha * twinkle;
        let dx = s.x + px, dy = s.y + py;
        // Wrap around edges
        dx = ((dx % canvas.width)  + canvas.width)  % canvas.width;
        dy = ((dy % canvas.height) + canvas.height) % canvas.height;

        // Glow halo for deeper layer stars
        if (layer.depth > 0.6) {
          ctx.beginPath();
          ctx.arc(dx, dy, s.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col},${alpha * 0.15})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(dx, dy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.fill();
      });
    });

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
}

/* ── N: Perlin-style Flow Field ── */
export function patternFlowField(canvas, ctx, isDark) {
  let particles=[], raf;
  const COUNT   = 320;
  const SCALE   = 28;   // grid cell size for pseudo-noise
  let   t       = 0;

  // Smooth pseudo-noise using trig (no library needed)
  function noise(x, y, z) {
    return Math.sin(x * 1.7 + z) * Math.cos(y * 1.3 + z * 0.8)
         + Math.sin(x * 0.9 + y * 1.1 + z * 1.4) * 0.5;
  }

  function flowAngle(x, y) {
    const nx = x / SCALE, ny = y / SCALE;
    return noise(nx, ny, t * 0.004) * Math.PI * 2.5;
  }

  function build() {
    particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      age:   Math.floor(Math.random() * 120),
      maxAge:Math.floor(Math.random() * 100 + 60),
      speed: Math.random() * 1.0 + 0.4,
      alpha: Math.random() * 0.35 + 0.10,
      color: Math.random() > 0.45 ? 'a' : 'b',
      prevX: 0, prevY: 0,
    }));
    particles.forEach(p => { p.prevX=p.x; p.prevY=p.y; });
  }
  build();

  function draw() {
    t++;
    // Fade trail instead of clearing — creates flowing streaks
    const dark = isDark();
    ctx.fillStyle = dark ? 'rgba(12,12,11,0.04)' : 'rgba(250,249,246,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const c = getColors(dark);

    particles.forEach(p => {
      p.age++;
      if (p.age > p.maxAge) {
        // Respawn at random position
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.prevX = p.x; p.prevY = p.y;
        p.age   = 0;
        p.maxAge= Math.floor(Math.random() * 100 + 60);
        return;
      }

      const angle = flowAngle(p.x, p.y);
      p.prevX = p.x; p.prevY = p.y;
      p.x    += Math.cos(angle) * p.speed;
      p.y    += Math.sin(angle) * p.speed;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

      // Fade in/out over lifetime
      const lifeFrac = p.age / p.maxAge;
      const fadedAlpha = p.alpha * Math.sin(lifeFrac * Math.PI);

      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${c[p.color]},${fadedAlpha})`;
      ctx.lineWidth   = 1.0;
      ctx.stroke();
    });

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ── O: Fireflies ── */
export function patternFireflies(canvas, ctx, isDark) {
  let flies=[], raf;
  let mouse={x:-9999, y:-9999};
  const COUNT = 55;

  function mkFly() {
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - .5) * 0.35,
      vy:     (Math.random() - .5) * 0.35,
      r:      Math.random() * 2.5 + 1.5,
      phase:  Math.random() * Math.PI * 2,
      blinkSpeed: Math.random() * 0.018 + 0.006,
      color:  Math.random() > 0.5 ? 'a' : 'b',
      wander: Math.random() * Math.PI * 2,  // wander angle
    };
  }

  flies = Array.from({ length: COUNT }, mkFly);

  const onMove = e => { mouse.x=e.clientX; mouse.y=e.clientY; };
  const onLeave = () => { mouse.x=-9999; mouse.y=-9999; };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseleave', onLeave);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const c = getColors(dark);

    flies.forEach(f => {
      // Gentle wander — slowly change direction
      f.wander += (Math.random() - .5) * 0.06;
      f.vx += Math.cos(f.wander) * 0.008;
      f.vy += Math.sin(f.wander) * 0.008;

      // Speed cap
      const spd = Math.hypot(f.vx, f.vy);
      if (spd > 0.8) { f.vx=(f.vx/spd)*0.8; f.vy=(f.vy/spd)*0.8; }

      // Attraction toward mouse (gentle)
      const mdx=mouse.x-f.x, mdy=mouse.y-f.y, md=Math.hypot(mdx,mdy);
      if (md < 200 && md > 0) {
        const pull = (200-md)/200 * 0.012;
        f.vx += (mdx/md)*pull; f.vy += (mdy/md)*pull;
      }

      f.x += f.vx; f.y += f.vy;
      if (f.x < 0 || f.x > canvas.width)  f.vx *= -1;
      if (f.y < 0 || f.y > canvas.height) f.vy *= -1;

      // Blink: sine wave opacity
      f.phase += f.blinkSpeed;
      const blink = (Math.sin(f.phase) + 1) / 2;  // 0..1
      const alpha = 0.08 + blink * 0.82;
      const r     = f.r * (0.5 + blink * 0.7);
      const col   = c[f.color];

      // Outer soft halo
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 5.5);
      grd.addColorStop(0,   `rgba(${col},${alpha * 0.35})`);
      grd.addColorStop(0.4, `rgba(${col},${alpha * 0.12})`);
      grd.addColorStop(1,   `rgba(${col},0)`);
      ctx.beginPath();
      ctx.arc(f.x, f.y, r * 5.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${alpha})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
  };
}

/* ── P: DNA Helix ── */
export function patternDNAHelix(canvas, ctx, isDark) {
  let raf;
  const CHARS  = ['A','T','G','C','0','1','null','fn','{}','[]','->','//'];
  const HELICES = 2;  // number of side-by-side helices
  let t = 0;

  function draw() {
    t += 0.018;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const c    = getColors(dark);
    const h    = canvas.height, w = canvas.width;

    // Draw multiple helices spread across the width
    const spacing = w / (HELICES + 1);

    for (let hi = 0; hi < HELICES; hi++) {
      const cx    = spacing * (hi + 1);
      const amp   = 38 + hi * 8;       // horizontal amplitude
      const pitch = 80;                 // vertical distance per full revolution
      const phaseOffset = hi * Math.PI; // stagger helices

      // How many base-pairs fit vertically
      const pairs = Math.ceil(h / (pitch / 8)) + 4;

      for (let i = 0; i < pairs; i++) {
        const frac  = i / pairs;
        const y     = ((i * pitch / 8) - (t * 28 % (pitch))) % h;
        const angle = (i / pairs) * Math.PI * 2 * (h / pitch) + t + phaseOffset;

        const x1 = cx + Math.sin(angle) * amp;
        const x2 = cx + Math.sin(angle + Math.PI) * amp;

        const depth = (Math.sin(angle) + 1) / 2;  // 0..1 for depth cue
        const colStrand1 = c.a;
        const colStrand2 = c.b;

        // Depth-based alpha: front brighter, back dimmer
        const a1 = 0.20 + depth * 0.60;
        const a2 = 0.20 + (1 - depth) * 0.60;
        const rung_alpha = 0.08 + Math.abs(Math.sin(angle)) * 0.18;

        // Cross-rung (base pair bridge)
        if (y > -10 && y < h + 10) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(${dark?'180,190,200':'100,110,130'},${rung_alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();

          // Base-pair label (every ~4th rung)
          if (i % 4 === 0) {
            const char = CHARS[Math.floor((i + hi * 3) % CHARS.length)];
            ctx.font      = `400 9px "DM Mono",monospace`;
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(${dark?'180,190,200':'80,90,110'},${rung_alpha * 1.8})`;
            ctx.fillText(char, cx, y + 3);
          }

          // Strand 1 node
          ctx.beginPath();
          ctx.arc(x1, y, 2.5 + depth * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colStrand1},${a1})`;
          ctx.fill();
          if (depth > 0.7) {
            ctx.beginPath();
            ctx.arc(x1, y, 6 + depth * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colStrand1},${a1 * 0.12})`;
            ctx.fill();
          }

          // Strand 2 node
          ctx.beginPath();
          ctx.arc(x2, y, 2.5 + (1-depth) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colStrand2},${a2})`;
          ctx.fill();
          if (depth < 0.3) {
            ctx.beginPath();
            ctx.arc(x2, y, 6 + (1-depth) * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colStrand2},${a2 * 0.12})`;
            ctx.fill();
          }
        }
      }

      // Connect strand nodes with lines (draw as continuous backbone)
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        let first = true;
        for (let i = -2; i < pairs + 2; i++) {
          const y = ((i * pitch / 8) - (t * 28 % pitch)) % h;
          if (y < -20 || y > h + 20) { first = true; continue; }
          const angle = (i / pairs) * Math.PI * 2 * (h / pitch) + t + phaseOffset;
          const x = pass === 0
            ? cx + Math.sin(angle) * amp
            : cx + Math.sin(angle + Math.PI) * amp;
          const depth = pass === 0 ? (Math.sin(angle)+1)/2 : (Math.sin(angle+Math.PI)+1)/2;
          if (first) { ctx.moveTo(x, y); first=false; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${pass===0?c.a:c.b},0.30)`;
        ctx.lineWidth   = 1.2;
        ctx.stroke();
      }
    }

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ── Registry — used by the pattern manager ── */
export const PATTERNS = [
  { id:'A', name:'Binary Rain',       fn: patternBinaryRain     },
  { id:'B', name:'Hex Grid Pulse',    fn: patternHexGrid        },
  { id:'C', name:'Data Packets',      fn: patternDataPackets    },
  { id:'D', name:'Sine Waves',        fn: patternSineWaves      },
  { id:'E', name:'Constellation',     fn: patternConstellation  },
  { id:'F', name:'Circuit Traces',    fn: patternCircuitTraces  },
  { id:'G', name:'Code Rain',         fn: patternCodeRain       },
  { id:'H', name:'Breathing Grid',    fn: patternBreathingGrid  },
  { id:'I', name:'Network Ping',      fn: patternNetworkPing    },
  { id:'J', name:'Particle Network',  fn: patternParticleNetwork},
  { id:'K', name:'Aurora Borealis',   fn: patternAurora         },
  { id:'L', name:'Rain on Glass',     fn: patternRainGlass      },
  { id:'M', name:'Depth Field',       fn: patternDepthField     },
  { id:'N', name:'Flow Field',        fn: patternFlowField      },
  { id:'O', name:'Fireflies',         fn: patternFireflies      },
  { id:'P', name:'DNA Helix',         fn: patternDNAHelix       },
];