import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const initialData = {
  title: 'Efficient Neural Network Pruning via Gradient-Based Structural Optimization',
  authors: 'Zhang Wei, Li Ming · Tsinghua University · 2024',
  venue: 'NeurIPS 2024',
  field: '计算机视觉 · 模型压缩 · 深度学习',
  contribution: '提出基于梯度的结构剪枝方法（Gradient-Based Structural Pruning, GBSP），通过计算每个卷积通道的一阶梯度重要性得分，动态识别并移除冗余连接。在 ResNet-50 上实现 3× 参数压缩，ImageNet Top-1 精度仅损失 0.5%（从 76.1% 降至 75.6%），推理延迟降低 58%。与现有幅度剪枝方法相比，GBSP 在相同压缩率下精度保留高出 1.8 个百分点。方法具备架构无关性，已在 MobileNetV3、EfficientNet-B0、Vision Transformer 上完成迁移验证，均保持同等性能优势。',
};

const scores = [
  { label:'可视化潜力', val:85, color:'var(--sage)' },
  { label:'叙事适合度', val:78, color:'var(--dust)' },
  { label:'受众广度',   val:70, color:'var(--taupe)' },
];

const initialMessages = [
  { role: 'ai', text: '我已解析完成，请问以上分析结果是否准确？如有问题请告诉我。' },
];

const hints = ['作者信息有误', '领域分类不准确', '核心贡献描述需要修正', '图表描述遗漏'];

function computeReplyDelayMs(text) {
  // Use a deterministic hash to keep response delay varied without impure randomness in component scope.
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) >>> 0;
  }
  return 1800 + (hash % 801); // 1800~2600ms
}

// 铅笔图标
function PencilIcon({ color = 'var(--text-l)' }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink:0 }}>
      <path d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11 1 12l1-3 7.5-7.5z"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 单个可编辑字段
function EditableField({ label, value, onChange, multiline }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef();

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
        <div style={{ fontSize:10, color:'var(--text-l)' }}>{label}</div>
        {!editing && (
          <button onClick={() => { setDraft(value); setEditing(true); }} style={{
            background:'none', border:'none', cursor:'pointer', padding:'1px 4px',
            borderRadius:4, display:'flex', alignItems:'center', gap:3,
            color:'var(--text-l)', fontSize:10, fontFamily:'inherit',
            transition:'all .15s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.color='var(--sage)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-l)'; }}
          >
            <PencilIcon/>
          </button>
        )}
      </div>

      {editing ? (
        <div>
          {multiline ? (
            <textarea ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
              style={{
                width:'100%', padding:'10px 14px', borderRadius:10, resize:'vertical',
                border:'1.5px solid var(--sage)', background:'var(--bg)',
                fontSize:13, lineHeight:1.7, color:'var(--text-d)',
                fontFamily:'inherit', outline:'none', minHeight:120,
                boxSizing:'border-box',
              }}
            />
          ) : (
            <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') cancel(); }}
              style={{
                width:'100%', padding:'10px 14px', borderRadius:10,
                border:'1.5px solid var(--sage)', background:'var(--bg)',
                fontSize:13, color:'var(--text-d)',
                fontFamily:'inherit', outline:'none', boxSizing:'border-box',
              }}
            />
          )}
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button onClick={save} style={{
              padding:'6px 16px', borderRadius:8, fontSize:12, fontWeight:700,
              background:'var(--sage)', color:'#fff', border:'none',
              fontFamily:'inherit', cursor:'pointer',
            }}>保存</button>
            <button onClick={cancel} style={{
              padding:'6px 16px', borderRadius:8, fontSize:12,
              background:'var(--bg)', color:'var(--text-m)',
              border:'1px solid var(--border)', fontFamily:'inherit', cursor:'pointer',
            }}>取消</button>
          </div>
        </div>
      ) : (
        <div style={{
          fontSize:13, color:'var(--text-d)',
          fontWeight: label==='TITLE' ? 700 : 400,
          lineHeight: 1.7,
          padding:'8px 12px', borderRadius:8,
          border:'1px solid transparent',
          transition:'border .15s, background .15s',
          cursor:'text',
        }}
        onClick={() => { setDraft(value); setEditing(true); }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg)'; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}
        >{value}</div>
      )}
    </div>
  );
}

export default function Analysis({ onNext, user, onOpenAuth, onLogout, onNavLibrary, projectName, onProjectNameChange }) {
  const [data, setData] = useState(initialData);
  const [msgs, setMsgs] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, thinking]);

  const send = (text) => {
    if (!text.trim() || thinking) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    // 500ms 后才显示 thinking 气泡，让用户消息先落地
    setTimeout(() => setThinking(true), 500);
    setTimeout(() => {
      setThinking(false);
      setMsgs(m => [...m, {
        role: 'ai',
        text: `已记录您的反馈：「${text}」。我将在生成时重点关注这一点，并在配置页为您预设相关选项。`,
      }]);
    }, 500 + computeReplyDelayMs(text));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} onNavLibrary={onNavLibrary} projectName={projectName} onProjectNameChange={onProjectNameChange} />
      <StepBar active={1} />

      <div style={{ display: 'flex', gap: 16, padding: '16px 24px', height: 'calc(100vh - 120px)' }}>

        {/* 左栏：解析结果 */}
        <div style={{
          flex: '0 0 55%', background: 'var(--card)',
          borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)', overflow: 'auto',
          borderTop: '2px solid var(--sage)',
        }}>
          <div style={{ padding: '18px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:15 }}>论文解析结果</span>
            <span style={{ fontSize:11, color:'var(--sage)' }}>来源：PDF 上传 · 解析置信度 高</span>
          </div>
          <div style={{ height:1, background:'var(--border)', margin:'12px 24px 0' }}/>

          <div style={{ padding: '16px 24px' }}>
            <EditableField label="论文标题"  value={data.title}        onChange={v=>setData(d=>({...d,title:v}))}  />
            <EditableField label="作者信息" value={data.authors}     onChange={v=>setData(d=>({...d,authors:v}))} />
            <EditableField label="发表期刊 / 会议"  value={data.venue}        onChange={v=>setData(d=>({...d,venue:v}))}  />
            <EditableField label="研究领域"  value={data.field}        onChange={v=>setData(d=>({...d,field:v}))}  />
            <EditableField label="核心贡献" value={data.contribution} onChange={v=>setData(d=>({...d,contribution:v}))} multiline />

            <div style={{ height:1, background:'var(--border)', marginBottom:16 }}/>

            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>可视化评估</div>
            {scores.map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12 }}>{s.label}</span>
                  <span style={{ fontSize:11, color:s.color, fontWeight:700 }}>{s.val}%</span>
                </div>
                <div style={{ height:6, background:'var(--bg)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${s.val}%`, background:s.color, borderRadius:3, transition:'width .6s' }}/>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 16, padding: '14px 18px',
              background: 'var(--sage-bg)', borderRadius: 12,
              border: '1px solid var(--border-s)',
            }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--sage)', marginBottom:6 }}>✦  AI 视角</div>
              <div style={{ fontSize:12, color:'var(--text-m)', lineHeight:1.7 }}>
                本文的剪枝流程图（Figure 1）和对比实验图（Figure 3）视觉化潜力极高，建议重点围绕「压缩 vs 精度」的权衡关系构建视频叙事。
              </div>
            </div>
          </div>

          <div style={{ padding: '0 24px 24px' }}>
            <button onClick={onNext} style={{
              width:'100%', padding:'15px',
              background:'var(--sage)', color:'#fff',
              border:'none', borderRadius:12,
              fontSize:15, fontWeight:700, fontFamily:'inherit',
            }}>分析结果确认，进入配置  →</button>
            <p style={{ fontSize:11, color:'var(--text-l)', textAlign:'center', marginTop:8 }}>
              你也可以先在右侧聊天框校正分析结果
            </p>
          </div>
        </div>

        {/* 右栏：聊天校正 */}
        <div style={{
          flex: 1, background: 'var(--card)',
          borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)', display:'flex', flexDirection:'column',
          borderTop: '2px solid var(--dust)',
        }}>
          <div style={{ padding:'18px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:15 }}>校正对话</span>
            <span style={{ fontSize:11, color:'var(--green-ok)' }}>● AI 助手在线</span>
          </div>
          <div style={{ height:1, background:'var(--border)', margin:'12px 20px 0' }}/>

          <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role==='ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth:'80%', padding:'10px 14px',
                  borderRadius: m.role==='ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  background: m.role==='ai' ? 'var(--bg)' : 'var(--sage-bg)',
                  border: `1px solid ${m.role==='ai' ? 'var(--border)' : 'var(--border-s)'}`,
                  fontSize:13, lineHeight:1.7, color:'var(--text-d)',
                }}>
                  {m.role==='ai' && <div style={{ fontSize:10, color:'var(--text-l)', marginBottom:4 }}>SCI·VISION</div>}
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display:'flex', justifyContent:'flex-start' }}>
                <div style={{
                  padding:'12px 16px',
                  borderRadius:'4px 14px 14px 14px',
                  background:'var(--bg)',
                  border:'1px solid var(--border)',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <div style={{ fontSize:10, color:'var(--text-l)', marginRight:4 }}>SCI·VISION</div>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width:7, height:7, borderRadius:'50%',
                      background:'var(--sage)',
                      animation:`dotBounce 1.2s ease-in-out ${i*0.2}s infinite`,
                      opacity:0.7,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={msgEndRef}/>
          </div>
          <style>{`
            @keyframes dotBounce {
              0%,80%,100% { transform: translateY(0); opacity:0.5; }
              40% { transform: translateY(-6px); opacity:1; }
            }
          `}</style>

          <div style={{ padding:'0 20px 8px', display:'flex', gap:6, flexWrap:'wrap' }}>
            {hints.map(h => (
              <button key={h} onClick={()=>send(h)} style={{
                padding:'4px 12px', borderRadius:12, fontSize:11,
                border:'1px solid var(--border)', background:'var(--bg)',
                color:'var(--text-m)', fontFamily:'inherit', cursor:'pointer',
              }}>{h}</button>
            ))}
          </div>

          <div style={{ padding:'0 20px 20px', display:'flex', gap:8 }}>
            <input
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') send(input); }}
              placeholder="告诉 AI 哪里需要修正..."
              style={{
                flex:1, padding:'12px 16px', borderRadius:12,
                border:'1.5px solid var(--border-s)', background:'var(--bg)',
                fontSize:13, fontFamily:'inherit', color:'var(--text-d)', outline:'none',
              }}
            />
            <button onClick={()=>send(input)} style={{
              width:44, height:44, borderRadius:10,
              background:'var(--sage)', border:'none', color:'#fff',
              fontSize:18, cursor:'pointer',
            }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
