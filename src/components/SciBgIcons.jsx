// 纯 SVG 科研图标背景装饰
/*
 *  viewBox = 0 0 1440 900  —  3 layers of depth
 *
 *  Layer 1 (edge):   large icons at margins, opacity 0.14–0.18, slow float
 *  Layer 2 (mid):    medium icons between edge & center, opacity 0.09–0.12
 *  Layer 3 (inner):  small icons near center area, opacity 0.06–0.08, faster float
 *
 *  Each icon gets a `drift` index → unique CSS animation delay + direction
 */
const icons = [
  // ── Layer 1: edges (large, more visible) ──
  { id: 'dna1',  x: 65,   y: 180,  size: 76,  color: '#648C6C', opacity: 0.16, drift: 0 },
  { id: 'atom1', x: 72,   y: 520,  size: 72,  color: '#948270', opacity: 0.14, drift: 1 },
  { id: 'fla1',  x: 58,   y: 780,  size: 64,  color: '#648C6C', opacity: 0.15, drift: 2 },
  { id: 'hex3',  x: 1370, y: 120,  size: 58,  color: '#8A7CA0', opacity: 0.14, drift: 3 },
  { id: 'cell1', x: 1385, y: 380,  size: 62,  color: '#648C6C', opacity: 0.15, drift: 4 },
  { id: 'dna2',  x: 1360, y: 680,  size: 68,  color: '#6482A0', opacity: 0.14, drift: 5 },

  // ── Layer 2: mid-zone (medium, moderate visibility) ──
  { id: 'hex1',  x: 200,  y: 80,   size: 50,  color: '#6482A0', opacity: 0.11, drift: 6 },
  { id: 'mol1',  x: 340,  y: 200,  size: 44,  color: '#648C6C', opacity: 0.10, drift: 7 },
  { id: 'ant1',  x: 260,  y: 620,  size: 52,  color: '#948270', opacity: 0.10, drift: 8 },
  { id: 'pro1',  x: 300,  y: 830,  size: 60,  color: '#948270', opacity: 0.11, drift: 9 },
  { id: 'hex4',  x: 1200, y: 75,   size: 48,  color: '#948270', opacity: 0.10, drift: 10 },
  { id: 'atom2', x: 1180, y: 280,  size: 56,  color: '#8A7CA0', opacity: 0.10, drift: 11 },
  { id: 'mol2',  x: 1220, y: 560,  size: 46,  color: '#6482A0', opacity: 0.10, drift: 12 },
  { id: 'fla2',  x: 1160, y: 810,  size: 50,  color: '#6482A0', opacity: 0.11, drift: 13 },

  // ── Layer 3: inner / center corridor (small, subtle, gives depth) ──
  { id: 'hex5',  x: 500,  y: 60,   size: 36,  color: '#6482A0', opacity: 0.07, drift: 14 },
  { id: 'cell2', x: 680,  y: 120,  size: 34,  color: '#648C6C', opacity: 0.06, drift: 15 },
  { id: 'mol3',  x: 440,  y: 380,  size: 32,  color: '#648C6C', opacity: 0.06, drift: 16 },
  { id: 'ant2',  x: 960,  y: 100,  size: 38,  color: '#8A7CA0', opacity: 0.07, drift: 17 },
  { id: 'hex6',  x: 1020, y: 350,  size: 30,  color: '#948270', opacity: 0.06, drift: 18 },
  { id: 'pro2',  x: 540,  y: 680,  size: 34,  color: '#8A7CA0', opacity: 0.06, drift: 19 },
  { id: 'cell3', x: 880,  y: 750,  size: 36,  color: '#648C6C', opacity: 0.07, drift: 20 },
  { id: 'fla3',  x: 720,  y: 840,  size: 40,  color: '#648C6C', opacity: 0.07, drift: 21 },
  { id: 'atom3', x: 480,  y: 830,  size: 42,  color: '#6482A0', opacity: 0.08, drift: 22 },
  { id: 'hex7',  x: 1060, y: 820,  size: 38,  color: '#948270', opacity: 0.07, drift: 23 },
];

function DnaIcon({ x, y, size, color, opacity }) {
  const pts = Array.from({length: 13}, (_, i) => {
    const t = i / 12;
    const y1 = t * size;
    const x1a = (size / 4) * Math.sin(t * Math.PI * 3);
    const x1b = -(size / 4) * Math.sin(t * Math.PI * 3);
    return { y1, x1a, x1b };
  });
  return (
    <g transform={`translate(${x - size/2}, ${y - size/2})`} opacity={opacity}>
      {pts.slice(0,-1).map((p, i) => (
        <g key={i}>
          <line x1={size/2+p.x1a} y1={p.y1} x2={size/2+pts[i+1].x1a} y2={pts[i+1].y1} stroke={color} strokeWidth="1.5"/>
          <line x1={size/2+p.x1b} y1={p.y1} x2={size/2+pts[i+1].x1b} y2={pts[i+1].y1} stroke={color} strokeWidth="1.5"/>
        </g>
      ))}
      {pts.filter((_,i)=>i%2===0).map((p,i) => (
        <line key={i} x1={size/2+p.x1a} y1={p.y1} x2={size/2+p.x1b} y2={p.y1} stroke={color} strokeWidth="1" opacity="0.5"/>
      ))}
    </g>
  );
}

function HexIcon({ x, y, size, color, opacity }) {
  const pts = Array.from({length:6}, (_,i) => {
    const a = Math.PI/6 + i*Math.PI/3;
    return [x + size/2*Math.cos(a), y + size/2*Math.sin(a)];
  });
  const pts2 = Array.from({length:6}, (_,i) => {
    const a = Math.PI/6 + i*Math.PI/3;
    return [x + size/4*Math.cos(a), y + size/4*Math.sin(a)];
  });
  const d = pts.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
  const d2 = pts2.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"/>
      <path d={d2} fill="none" stroke={color} strokeWidth="1" opacity="0.5"/>
    </g>
  );
}

function AtomIcon({ x, y, size, color, opacity }) {
  const orbits = [0, 60, 120].map(deg => {
    const rad = deg * Math.PI / 180;
    const a = size/2, b = size/4;
    const pts = Array.from({length:37}, (_,i) => {
      const t = i/36 * 2*Math.PI;
      const ex = a*Math.cos(t), ey = b*Math.sin(t);
      return [x + ex*Math.cos(rad) - ey*Math.sin(rad), y + ex*Math.sin(rad) + ey*Math.cos(rad)];
    });
    return pts.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ');
  });
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={4} fill={color}/>
      {orbits.map((d,i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth="1.2"/>)}
    </g>
  );
}

function CellIcon({ x, y, size, color, opacity }) {
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={size/2} fill="none" stroke={color} strokeWidth="1.5"/>
      <circle cx={x} cy={y} r={size/4} fill="none" stroke={color} strokeWidth="1.2"/>
      {[0,120,240].map((deg,i) => {
        const r=size*3/8, rad=deg*Math.PI/180;
        return <circle key={i} cx={x+r*Math.cos(rad)} cy={y+r*Math.sin(rad)} r={3} fill={color} opacity="0.5"/>;
      })}
    </g>
  );
}

function MoleculeIcon({ x, y, size, color, opacity }) {
  const bonds = [0, 72, 144, 216, 288].map(deg => {
    const rad = deg*Math.PI/180;
    const bx = x + size/2.5*Math.cos(rad), by = y + size/2.5*Math.sin(rad);
    return { bx, by };
  });
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={size/6} fill={color}/>
      {bonds.map((b,i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={b.bx} y2={b.by} stroke={color} strokeWidth="1.2" opacity="0.5"/>
          <circle cx={b.bx} cy={b.by} r={size/9} fill={color} opacity="0.8"/>
        </g>
      ))}
    </g>
  );
}

function FlaskIcon({ x, y, size, color, opacity }) {
  const nw=size/8, bw=size/2, nh=size/3;
  const ty=y-size/2, by=ty+nh+size/2;
  return (
    <g opacity={opacity} stroke={color} strokeWidth="1.5" fill="none">
      <line x1={x-nw} y1={ty} x2={x-nw} y2={ty+nh}/>
      <line x1={x+nw} y1={ty} x2={x+nw} y2={ty+nh}/>
      <line x1={x-nw} y1={ty} x2={x+nw} y2={ty}/>
      <line x1={x-nw} y1={ty+nh} x2={x-bw} y2={by}/>
      <line x1={x+nw} y1={ty+nh} x2={x+bw} y2={by}/>
      <line x1={x-bw} y1={by} x2={x+bw} y2={by}/>
      <line x1={x-bw*0.6} y1={by-size/5} x2={x+bw*0.6} y2={by-size/5} opacity="0.5"/>
    </g>
  );
}

function AntibodyIcon({ x, y, size, color, opacity }) {
  const arms = [135, 45].map(deg => {
    const rad = deg*Math.PI/180;
    return { lx: x+size/2*Math.cos(rad), ly: y-size/2*Math.sin(rad) };
  });
  return (
    <g opacity={opacity} stroke={color} strokeWidth="1.5">
      <line x1={x} y1={y+size/2} x2={x} y2={y}/>
      {arms.map((a,i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={a.lx} y2={a.ly}/>
          <circle cx={a.lx} cy={a.ly} r={size/10} fill={color} stroke="none"/>
        </g>
      ))}
      <circle cx={x} cy={y+size/2} r={size/10} fill={color} stroke="none"/>
    </g>
  );
}

function ProteinIcon({ x, y, size, color, opacity }) {
  const pts = Array.from({length:16}, (_,i) => {
    const t=i/15;
    return [x-size/2+t*size, y+size/3*Math.sin(t*Math.PI*2.5)];
  });
  const d = pts.map((p,i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ');
  const last = pts[pts.length-1], prev = pts[pts.length-3];
  const angle = Math.atan2(last[1]-prev[1], last[0]-prev[0]);
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <polygon
        points={`${last[0]},${last[1]} ${last[0]-10*Math.cos(angle+0.4)},${last[1]-10*Math.sin(angle+0.4)} ${last[0]-10*Math.cos(angle-0.4)},${last[1]-10*Math.sin(angle-0.4)}`}
        fill={color}
      />
    </g>
  );
}

/*
 *  Each icon gets a slow, unique floating animation via SVG <animateTransform>.
 *  Drift patterns alternate between vertical and diagonal to feel organic.
 *  Duration 12–24s so the motion is barely perceptible — ambient, not distracting.
 */
const driftConfigs = [
  { dx: 0,  dy: -8,  dur: 18 },
  { dx: 5,  dy: -6,  dur: 22 },
  { dx: -6, dy: -5,  dur: 20 },
  { dx: 4,  dy: 7,   dur: 16 },
  { dx: -5, dy: -7,  dur: 24 },
  { dx: 0,  dy: 6,   dur: 19 },
  { dx: 6,  dy: -4,  dur: 21 },
  { dx: -4, dy: 5,   dur: 17 },
  { dx: 3,  dy: -8,  dur: 23 },
  { dx: -6, dy: 4,   dur: 15 },
  { dx: 5,  dy: 6,   dur: 20 },
  { dx: -3, dy: -7,  dur: 18 },
];

function FloatingGroup({ drift, children }) {
  const cfg = driftConfigs[drift % driftConfigs.length];
  return (
    <g>
      {children}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0,0; ${cfg.dx},${cfg.dy}; 0,0`}
        dur={`${cfg.dur}s`}
        repeatCount="indefinite"
        begin={`-${(drift * 2.7) % cfg.dur}s`}
      />
    </g>
  );
}

function renderIcon(id, props) {
  if (id.startsWith('dna'))  return <DnaIcon {...props}/>;
  if (id.startsWith('hex'))  return <HexIcon {...props}/>;
  if (id.startsWith('atom')) return <AtomIcon {...props}/>;
  if (id.startsWith('cell')) return <CellIcon {...props}/>;
  if (id.startsWith('mol'))  return <MoleculeIcon {...props}/>;
  if (id.startsWith('fla'))  return <FlaskIcon {...props}/>;
  if (id.startsWith('ant'))  return <AntibodyIcon {...props}/>;
  if (id.startsWith('pro'))  return <ProteinIcon {...props}/>;
  return null;
}

export default function SciBgIcons() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}>
      {icons.map(({ id, x, y, size, color, opacity, drift }) => (
        <FloatingGroup key={id} drift={drift}>
          {renderIcon(id, { x, y, size, color, opacity })}
        </FloatingGroup>
      ))}
    </svg>
  );
}
