// 纯 SVG 科研图标背景装饰
/*
 *  viewBox = 0 0 1440 900
 *  Grid: 6 columns × 5 rows, icons spread evenly with slight offsets to avoid rigid grid look
 *  Left margin icons: ~60-120,  Right margin icons: ~1300-1400
 *  Top: ~60-140,  Bottom: ~740-860
 */
const icons = [
  // ── Row 1 (top): y ~60–150 ──
  { id: 'hex1',  x: 80,   y: 90,   size: 52,  color: '#6482A0', opacity: 0.13 },
  { id: 'mol1',  x: 380,  y: 68,   size: 48,  color: '#648C6C', opacity: 0.12 },
  { id: 'ant1',  x: 720,  y: 55,   size: 56,  color: '#948270', opacity: 0.11 },
  { id: 'hex3',  x: 1060, y: 80,   size: 54,  color: '#8A7CA0', opacity: 0.12 },
  { id: 'dna2',  x: 1360, y: 110,  size: 64,  color: '#6482A0', opacity: 0.14 },

  // ── Row 2 (upper-mid): y ~220–340 ──
  { id: 'dna1',  x: 65,   y: 260,  size: 78,  color: '#648C6C', opacity: 0.16 },
  { id: 'cell1', x: 1380, y: 300,  size: 60,  color: '#648C6C', opacity: 0.14 },

  // ── Row 3 (mid): y ~400–520 ──
  { id: 'atom2', x: 90,   y: 460,  size: 66,  color: '#8A7CA0', opacity: 0.12 },
  { id: 'pro2',  x: 1340, y: 480,  size: 62,  color: '#8A7CA0', opacity: 0.11 },

  // ── Row 4 (lower-mid): y ~580–700 ──
  { id: 'atom1', x: 70,   y: 640,  size: 74,  color: '#948270', opacity: 0.13 },
  { id: 'hex2',  x: 1370, y: 660,  size: 50,  color: '#948270', opacity: 0.12 },

  // ── Row 5 (bottom): y ~760–870 ──
  { id: 'fla1',  x: 60,   y: 800,  size: 62,  color: '#648C6C', opacity: 0.14 },
  { id: 'pro1',  x: 320,  y: 830,  size: 68,  color: '#948270', opacity: 0.12 },
  { id: 'fla2',  x: 620,  y: 850,  size: 52,  color: '#6482A0', opacity: 0.11 },
  { id: 'cell2', x: 920,  y: 840,  size: 54,  color: '#648C6C', opacity: 0.12 },
  { id: 'mol2',  x: 1200, y: 820,  size: 56,  color: '#6482A0', opacity: 0.12 },
  { id: 'ant2',  x: 1400, y: 860,  size: 58,  color: '#648C6C', opacity: 0.11 },
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

export default function SciBgIcons() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}>
      {icons.map(({ id, x, y, size, color, opacity }) => {
        if (id.startsWith('dna'))  return <DnaIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('hex'))  return <HexIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('atom')) return <AtomIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('cell')) return <CellIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('mol'))  return <MoleculeIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('fla'))  return <FlaskIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('ant'))  return <AntibodyIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        if (id.startsWith('pro'))  return <ProteinIcon key={id} x={x} y={y} size={size} color={color} opacity={opacity}/>;
        return null;
      })}
    </svg>
  );
}
