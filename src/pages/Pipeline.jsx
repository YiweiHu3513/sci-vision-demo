import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

/*
 *  DAG layout — 4 columns, clean fan-out from C
 *
 *  col1(100)   col2(260)   col3(440)          col4(660)     col5(830)
 *     A ──────── B ─┐
 *     └──────────────┤ C ──┬── D (语音)  ──┐
 *                    │     ├── G (海报)  ──┤── F (合成)
 *                    │     └── E (配乐)  ──┘
 */
const nodes = [
  { id:'A', label:'脚本生成',   sub:'JSON 分镜脚本', x:100,  y:160 },
  { id:'B', label:'剧本审校',   sub:'提示词优化',    x:260,  y:110 },
  { id:'C', label:'资产生成',   sub:'Houdini 渲染',  x:440,  y:160 },
  { id:'D', label:'语音合成',   sub:'TTS 中文女声',  x:640,  y:72  },
  { id:'G', label:'海报生成',   sub:'A3 排版合成',    x:640,  y:168 },
  { id:'E', label:'配乐混音',   sub:'氛围弦乐',      x:640,  y:264 },
  { id:'F', label:'视频合成',   sub:'最终剪辑 1080p', x:840,  y:168 },
];
const edges = [['A','B'],['A','C'],['B','C'],['C','D'],['C','G'],['C','E'],['D','F'],['G','F'],['E','F']];

/* ── 10-segment mock script (will be replaced by real backend data) ── */
const scriptSegments = [
  { id:1, narration:'神经网络剪枝通过移除冗余连接，大幅降低模型参数量与推理延迟。', image_prompt:'Frosted resin neural network, Morandi palette, soft subsurface glow, 4K Houdini render', duration:12 },
  { id:2, narration:'结构化剪枝按通道或层级整体裁剪，保持硬件友好的稠密矩阵运算。', image_prompt:'Transparent acrylic filter blocks dissolving layer by layer, muted teal and ivory, C4D glass shader', duration:10 },
  { id:3, narration:'非结构化剪枝将单个权重置零，生成稀疏矩阵以换取更高压缩比。', image_prompt:'Sparse matrix grid with glowing dots fading out, dark background, volumetric light rays, Redshift render', duration:11 },
  { id:4, narration:'量化感知训练在前向传播中模拟低比特运算，减少精度损失。', image_prompt:'Floating-point numbers morphing into integers inside crystal cubes, warm amber lighting, Octane', duration:9 },
  { id:5, narration:'知识蒸馏让轻量学生网络模仿教师网络的软标签分布。', image_prompt:'Large translucent sphere transferring luminous particles to a smaller sphere, sage green palette, Houdini VDB', duration:13 },
  { id:6, narration:'通道注意力机制动态加权特征图，抑制无关信息传递。', image_prompt:'Stacked feature planes with spotlight beams highlighting select channels, cool blue atmosphere, Cinema 4D', duration:10 },
  { id:7, narration:'残差连接为梯度提供跨层快捷通路，缓解深层网络退化。', image_prompt:'Glowing shortcut bridges arcing over dense block towers, isometric view, lavender mist, Blender Cycles', duration:11 },
  { id:8, narration:'批归一化重新中心化每层激活值，加速收敛并起到正则化效果。', image_prompt:'Histogram bars smoothly aligning to a bell curve, frosted glass material, soft studio lighting', duration:9 },
  { id:9, narration:'混合精度训练在 FP16 与 FP32 间切换，平衡速度与数值稳定性。', image_prompt:'Dual-tone data streams interleaving through a processor chip, gold and silver metallic shaders, macro lens', duration:12 },
  { id:10, narration:'模型部署阶段通过 ONNX Runtime 与 TensorRT 进行推理图优化。', image_prompt:'Computation graph nodes snapping into optimized clusters, dark slate background, neon green edges, 4K', duration:10 },
];

/* Build typed-out lines from segments for the typewriter effect */
const allCodeLines = (() => {
  const lines = [['{ "segments": [', 'bracket']];
  scriptSegments.forEach((seg, idx) => {
    lines.push([`  {`, 'bracket']);
    lines.push([`    "id": ${seg.id},`, 'num']);
    lines.push([`    "narration":`, 'key']);
    lines.push([`      "${seg.narration}",`, 'cn']);
    lines.push([`    "image_prompt":`, 'key']);
    // split long prompt across 2 lines
    const mid = seg.image_prompt.indexOf(',', 30);
    if (mid > 0) {
      lines.push([`      "${seg.image_prompt.slice(0, mid + 1)}`, 'en']);
      lines.push([`       ${seg.image_prompt.slice(mid + 2)}",`, 'en']);
    } else {
      lines.push([`      "${seg.image_prompt}",`, 'en']);
    }
    lines.push([`    "duration": ${seg.duration}`, 'num']);
    lines.push([`  }${idx < scriptSegments.length - 1 ? ',' : ''}`, 'bracket']);
    if (idx < scriptSegments.length - 1) lines.push(['', 'blank']);
  });
  lines.push([`]}`, 'bracket']);
  return lines;
})();

const lineColor = {
  bracket: 'var(--text-l)',
  key: 'var(--taupe)',
  cn: 'var(--text-d)',
  en: 'var(--dust)',
  num: 'var(--sage)',
  blank: 'transparent',
};

const imgColors = ['#B2C0B8','#A6B4C4','#BCA8A0','#ACA0C4','#B6C0AE','#A0B4C0','#C0B2A6'];

export default function Pipeline({ onNext, user, onOpenAuth, onLogout }) {
  const [progress, setProgress] = useState(0);
  const [activeNode, setActiveNode] = useState(2); // C is active
  const [doneNodes, setDoneNodes] = useState([0,1]); // A, B done
  const [assetCount, setAssetCount] = useState(4);
  const [visibleLines, setVisibleLines] = useState(0);
  const timer = useRef(null);
  const codeRef = useRef(null);

  const done = useRef(false);

  useEffect(() => {
    timer.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer.current);
          if (!done.current) {
            done.current = true;
            setTimeout(onNext, 600);
          }
          return 100;
        }
        return p + 1.2;
      });
    }, 120);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (progress > 50 && assetCount < 7) setAssetCount(Math.floor(progress/10));
    if (progress > 55 && activeNode === 2) { setDoneNodes([0,1,2]); setActiveNode(3); }
    if (progress > 70 && activeNode === 3) { setDoneNodes([0,1,2,3]); setActiveNode(4); }
    if (progress > 80 && activeNode === 4) { setDoneNodes([0,1,2,3,4]); setActiveNode(5); }
    if (progress > 90 && activeNode === 5) { setDoneNodes([0,1,2,3,4,5]); setActiveNode(6); }
    // sync visible lines with progress (0→95% maps to full line count)
    const target = Math.min(Math.floor((progress / 95) * allCodeLines.length), allCodeLines.length);
    if (target > visibleLines) setVisibleLines(target);
  }, [progress]);

  // auto-scroll code panel
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const nd = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodeIndex = Object.fromEntries(nodes.map((n,i) => [n.id, i]));

  const bezier = (n1, n2) => {
    const { x:x1, y:y1 } = nd[n1], { x:x2, y:y2 } = nd[n2];
    const cpx = x1 + (x2-x1)*0.5;
    return `M${x1},${y1} C${cpx},${y1} ${cpx},${y2} ${x2},${y2}`;
  };

  const getNodeStatus = (id) => {
    const i = nodeIndex[id];
    if (doneNodes.includes(i)) return 'done';
    if (i === activeNode) return 'active';
    return 'pending';
  };

  const statusColor = { done:'var(--sage)', active:'var(--sage)', pending:'var(--border)' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} />
      <StepBar active={3} />

      <div style={{ padding:'12px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:700 }}>AI 正在生成...</h2>
            <p style={{ fontSize:13, color:'var(--text-l)', marginTop:2 }}>流水线处理中，完成后自动跳转</p>
          </div>
          <span style={{ fontSize:13, color:'var(--sage)', fontWeight:700 }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height:6, background:'var(--bg2)', borderRadius:3, marginBottom:20 }}>
          <div style={{ height:'100%', width:`${progress}%`, background:'var(--sage)', borderRadius:3, transition:'width .3s' }}/>
        </div>

        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          {/* DAG 图 + 拍立得 */}
          <div style={{ width:'calc(100% - 416px)', flexShrink:0 }}>
            {/* DAG */}
            <div style={{
              background:'var(--card)', borderRadius:14,
              border:'1px solid var(--border)', boxShadow:'var(--shadow)',
              padding:'14px', marginBottom:16,
            }}>
              <svg viewBox="0 0 940 320" preserveAspectRatio="xMidYMid meet" style={{ display:'block', width:'100%', height:'auto' }}>
                {/* Edges */}
                {edges.map(([a,b]) => {
                  const sa = getNodeStatus(a), sb = getNodeStatus(b);
                  const done_e = sa==='done'&&sb==='done';
                  const act_e = (sa==='done'&&sb==='active')||(sa==='active');
                  return (
                    <path key={a+b} d={bezier(a,b)}
                      fill="none"
                      stroke={done_e ? 'var(--sage)' : act_e ? 'var(--sage-l)' : 'var(--border)'}
                      strokeWidth={done_e||act_e ? 2 : 1.5}
                      opacity={done_e ? 1 : act_e ? 0.8 : 0.6}
                    />
                  );
                })}
                {/* Nodes */}
                {nodes.map(({ id, label, sub, x, y }) => {
                  const status = getNodeStatus(id);
                  return (
                    <g key={id} transform={`translate(${x},${y})`}>
                      {status==='active' && (
                        <>
                          <rect x={-56} y={-30} width={112} height={60} rx={11} fill="var(--sage-bg)" opacity={0.3}/>
                          <rect x={-59} y={-33} width={118} height={66} rx={13} fill="none" stroke="var(--sage-l)" strokeWidth={1} opacity={0.4}/>
                        </>
                      )}
                      <rect x={-52} y={-28} width={104} height={56} rx={10}
                        fill={status==='done' ? 'var(--sage-bg)' : status==='active' ? 'var(--card)' : 'var(--bg2)'}
                        stroke={statusColor[status]} strokeWidth={status!=='pending'?1.5:1}
                      />
                      {/* 顶部色条 */}
                      <rect x={-52} y={-28} width={104} height={2.5} rx={10}
                        fill={statusColor[status]}
                      />
                      {/* ID */}
                      <text x={-43} y={-14} fontSize={8} fill="var(--text-l)" fontWeight="700">{id}</text>
                      {/* 状态点 */}
                      <circle cx={43} cy={-17} r={6}
                        fill={status==='done' ? 'var(--green-ok)' : status==='active' ? 'var(--sage)' : 'var(--border)'}
                      />
                      {status==='done' && <text x={39.5} y={-13.5} fontSize={7} fill="white">✓</text>}
                      {/* Label */}
                      <text x={0} y={-1} textAnchor="middle" fontSize={11} fontWeight="700"
                        fill={status==='done' ? 'var(--sage)' : status==='active' ? 'var(--text-d)' : 'var(--text-l)'}
                        fontFamily="'Noto Serif SC',serif"
                      >{label}</text>
                      <text x={0} y={14} textAnchor="middle" fontSize={9} fill="var(--text-l)"
                        fontFamily="'Noto Serif SC',serif"
                      >{sub}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 拍立得资产 */}
            <div style={{
              background:'var(--card)', borderRadius:14,
              border:'1px solid var(--border)', boxShadow:'var(--shadow)', padding:'16px',
            }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>
                资产生成 Step-C — {Math.min(assetCount, 7)} / 10
              </div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {imgColors.slice(0, assetCount).map((c, i) => (
                  <div key={i} style={{
                    width:120, borderRadius:8,
                    background:'var(--card)',
                    border:'1px solid var(--border)',
                    boxShadow:'var(--shadow)',
                    overflow:'hidden', position:'relative',
                    animation: i===assetCount-1 ? 'fadeIn .4s ease' : 'none',
                  }}>
                    <div style={{ height:88, background:c }}/>
                    <div style={{ padding:'6px 8px', fontSize:9, color:'var(--text-l)' }}>asset_{String(i+1).padStart(2,'0')}.png</div>
                    <div style={{
                      position:'absolute', top:6, right:6,
                      width:20, height:20, borderRadius:'50%',
                      background:'var(--green-ok)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, color:'#fff', fontWeight:700,
                    }}>✓</div>
                  </div>
                ))}
                {assetCount < 10 && (
                  <div style={{
                    width:120, height:118, borderRadius:8,
                    border:'1.5px dashed var(--border-s)',
                    background:'var(--bg)',
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', gap:8,
                  }}>
                    <div style={{ fontSize:12, color:'var(--sage)' }}>生成中...</div>
                    <div style={{ width:80, height:4, background:'var(--border)', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${(progress%10)*10}%`, background:'var(--sage)', borderRadius:2 }}/>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右：JSON 实时输出 */}
          <div style={{
            flex:'0 0 400px', background:'var(--card)',
            borderRadius:14, border:'1px solid var(--border)',
            boxShadow:'var(--shadow)',
            borderTop:'2px solid var(--taupe)',
            display:'flex', flexDirection:'column',
            height: 520,
          }}>
            <div style={{ padding:'14px 16px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--text-l)' }}>
                脚本输出（实时）{visibleLines >= allCodeLines.length && ' — 完成 ✓'}
              </span>
              <span style={{ fontSize:10, color:'var(--text-l)', fontFamily:'monospace' }}>
                {visibleLines}/{allCodeLines.length} lines
              </span>
            </div>
            <div style={{ height:1, background:'var(--border)', margin:'0 16px' }}/>
            <div
              ref={codeRef}
              style={{
                flex:1, overflowY:'auto', padding:'10px 16px 10px',
                fontFamily:"'SF Mono', Menlo, Consolas, monospace", fontSize:10.5, lineHeight:1.8,
                scrollBehavior:'smooth',
              }}
            >
              {allCodeLines.slice(0, visibleLines).map(([line, cls], i) => (
                <div key={i} style={{
                  color: lineColor[cls] || 'var(--text-l)',
                  whiteSpace: 'pre',
                  animation: i >= visibleLines - 3 ? 'typeLine .3s ease both' : 'none',
                  minHeight: cls === 'blank' ? 8 : undefined,
                }}>
                  {line}
                  {i === visibleLines - 1 && visibleLines < allCodeLines.length && (
                    <span style={{ animation:'blink .8s step-end infinite', color:'var(--sage)' }}>▌</span>
                  )}
                </div>
              ))}
              {visibleLines === 0 && (
                <div style={{ color:'var(--text-l)', fontStyle:'italic' }}>
                  等待脚本生成<span style={{ animation:'blink .8s step-end infinite' }}>▌</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }
        @keyframes typeLine { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  );
}
