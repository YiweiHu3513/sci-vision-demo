import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const nodes = [
  { id:'A', label:'脚本生成',   sub:'JSON 分镜脚本', x:130, y:200 },
  { id:'B', label:'剧本审校',   sub:'提示词优化',    x:300, y:128 },
  { id:'C', label:'资产生成',   sub:'Houdini 渲染',  x:480, y:176 },
  { id:'D', label:'语音合成',   sub:'TTS 中文女声',  x:640, y:100 },
  { id:'E', label:'配乐混音',   sub:'氛围弦乐',      x:640, y:252 },
  { id:'F', label:'视频合成',   sub:'最终剪辑 1080p',x:800, y:176 },
];
const edges = [['A','B'],['A','C'],['B','C'],['B','D'],['C','D'],['C','E'],['D','F'],['E','F']];

const codeLines = [
  ['{ "segments": [',         'text-m'],
  ['  { "id": 1,',            'text-m'],
  ['    "narration":',        'taupe'],
  ['      "神经网络剪枝通过',   'text-d'],
  ['       移除冗余连接...",', 'text-d'],
  ['    "image_prompt":',     'taupe'],
  ['      "Frosted resin,',   'dust'],
  ['       Morandi palette,', 'dust'],
  ['       4K Houdini",',     'dust'],
  ['    "duration": 12',      'sage'],
  ['  }, // 共10段',           'text-l'],
];

const imgColors = ['#B2C0B8','#A6B4C4','#BCA8A0','#ACA0C4','#B6C0AE','#A0B4C0','#C0B2A6'];

export default function Pipeline({ onNext, user, onOpenAuth, onLogout }) {
  const [progress, setProgress] = useState(0);
  const [activeNode, setActiveNode] = useState(2); // C is active
  const [doneNodes, setDoneNodes] = useState([0,1]); // A, B done
  const [assetCount, setAssetCount] = useState(4);
  const timer = useRef(null);

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
    if (progress > 65 && activeNode === 2) { setDoneNodes([0,1,2]); setActiveNode(3); }
    if (progress > 80 && activeNode === 3) { setDoneNodes([0,1,2,3]); setActiveNode(4); }
    if (progress > 92 && activeNode === 4) { setDoneNodes([0,1,2,3,4]); setActiveNode(5); }
  }, [progress]);

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

        <div style={{ display:'flex', gap:16 }}>
          {/* DAG 图 + 拍立得 */}
          <div style={{ flex:1 }}>
            {/* DAG */}
            <div style={{
              background:'var(--card)', borderRadius:14,
              border:'1px solid var(--border)', boxShadow:'var(--shadow)',
              padding:'20px', marginBottom:16,
            }}>
              <svg width="940" height="320" style={{ display:'block' }}>
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
                          <rect x={-66} y={-36} width={132} height={72} rx={13} fill="var(--sage-bg)" opacity={0.3}/>
                          <rect x={-70} y={-40} width={140} height={80} rx={15} fill="none" stroke="var(--sage-l)" strokeWidth={1} opacity={0.4}/>
                        </>
                      )}
                      <rect x={-62} y={-34} width={124} height={68} rx={12}
                        fill={status==='done' ? 'var(--sage-bg)' : status==='active' ? 'var(--card)' : 'var(--bg2)'}
                        stroke={statusColor[status]} strokeWidth={status!=='pending'?2:1}
                      />
                      {/* 顶部色条 */}
                      <rect x={-62} y={-34} width={124} height={3} rx={12}
                        fill={statusColor[status]}
                      />
                      {/* ID */}
                      <text x={-52} y={-18} fontSize={9} fill="var(--text-l)" fontWeight="700">{id}</text>
                      {/* 状态点 */}
                      <circle cx={52} cy={-22} r={7}
                        fill={status==='done' ? 'var(--green-ok)' : status==='active' ? 'var(--sage)' : 'var(--border)'}
                      />
                      {status==='done' && <text x={48} y={-18} fontSize={8} fill="white">✓</text>}
                      {/* Label */}
                      <text x={0} y={-4} textAnchor="middle" fontSize={13} fontWeight="700"
                        fill={status==='done' ? 'var(--sage)' : status==='active' ? 'var(--text-d)' : 'var(--text-l)'}
                        fontFamily="'Noto Serif SC',serif"
                      >{label}</text>
                      <text x={0} y={14} textAnchor="middle" fontSize={10} fill="var(--text-l)"
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

          {/* 右：JSON 预览 */}
          <div style={{
            flex:'0 0 300px', background:'var(--card)',
            borderRadius:14, border:'1px solid var(--border)',
            boxShadow:'var(--shadow)',
            borderTop:'2px solid var(--taupe)',
          }}>
            <div style={{ padding:'14px 16px 0', fontSize:12, color:'var(--text-l)' }}>脚本输出（实时）</div>
            <div style={{ height:1, background:'var(--border)', margin:'10px 16px 0' }}/>
            <div style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:11, lineHeight:1.9 }}>
              {codeLines.map(([line, cls], i) => (
                <div key={i} style={{
                  color: cls==='sage' ? 'var(--sage)' : cls==='taupe' ? 'var(--taupe)' : cls==='dust' ? 'var(--dust)' : cls==='text-d' ? 'var(--text-d)' : 'var(--text-l)',
                }}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}
