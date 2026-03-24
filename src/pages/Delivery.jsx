import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const exportItems = [
  { icon:'▶', label:'下载 MP4 视频',    sub:'1080p · H.264 · 124MB', color:'var(--sage)' },
  { icon:'▦', label:'下载 PPTX 幻灯片', sub:'10 页含分镜配图 · 8MB',  color:'var(--dust)' },
  { icon:'◈', label:'下载宣传海报',     sub:'A3 竖版 · 含二维码 · 6MB', color:'#ACA08A' },
  { icon:'≡', label:'下载分镜脚本 PDF', sub:'完整 JSON + 说明 · 2MB', color:'var(--taupe)' },
  { icon:'⬡', label:'生成分享链接',     sub:'7 天有效 · 可设密码',    color:'var(--lav)' },
];

const stats = [['处理时长','18.3 秒'],['生成图片','10 张'],['脚本段落','10 段'],['视频时长','2:00']];
const slides = [
  { title:'引言背景', color:'var(--sage)' },
  { title:'研究方法', color:'var(--dust)' },
  { title:'实验设计', color:'var(--taupe)' },
  { title:'结果分析', color:'var(--lav)' },
  { title:'结论展望', color:'#ACA08A' },
  { title:'数据可视化', color:'var(--sage)' },
  { title:'模型架构', color:'var(--dust)' },
  { title:'对比实验', color:'var(--taupe)' },
  { title:'消融分析', color:'var(--lav)' },
  { title:'未来工作', color:'#ACA08A' },
];

const resolutions = [
  { label:'720p', desc:'标清 · 免费', credits:0, size:'68MB' },
  { label:'1080p', desc:'高清', credits:20, size:'124MB' },
  { label:'4K', desc:'超清', credits:80, size:'520MB' },
];

// 视频内容：SVG仿Houdini节点网络
function VideoContent() {
  const nodes = [[120,80],[300,120],[200,200],[450,160],[380,260],[560,100],[480,300],[650,200]];
  return (
    <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
      <defs>
        <linearGradient id="vbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161412"/>
          <stop offset="100%" stopColor="#1E1C1A"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#vbg)"/>
      {nodes.slice(0,-1).map(([x1,y1],i) => {
        const [x2,y2]=nodes[i+1];
        const cpx=(x1+x2)/2;
        return <path key={i} d={`M${x1}%,${y1}% C${cpx}%,${y1}% ${cpx}%,${y2}% ${x2}%,${y2}%`}
          fill="none" stroke="#8CAF94" strokeWidth="1" opacity="0.35" transform="scale(1)"/>;
      })}
      {nodes.map(([x,y],i) => {
        const colors=['#8CAF94','#6482A0','#948270','#8A7CA0'];
        return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={4+i%3*3} fill="none" stroke={colors[i%4]} strokeWidth="1" opacity="0.5"/>;
      })}
      {nodes.map(([x,y],i) => (
        <circle key={`d${i}`} cx={`${x}%`} cy={`${y}%`} r={3} fill={['#8CAF94','#6482A0','#948270','#8A7CA0'][i%4]} opacity="0.7"/>
      ))}
    </svg>
  );
}

/* ── 清晰度选择下拉 ── */
function ResolutionPicker({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:600,
          background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
          color:'#E8E4DC', cursor:'pointer', fontFamily:'inherit',
          display:'flex', alignItems:'center', gap:4,
          transition:'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
      >
        {current.label}
        <span style={{ fontSize:8, opacity:0.6 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position:'absolute', bottom:'calc(100% + 8px)', right:0,
          background:'#1E1C1A', border:'1px solid #3A3836',
          borderRadius:12, padding:6, minWidth:200,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
          zIndex:20,
        }}>
          <div style={{ padding:'6px 10px', fontSize:10, color:'#706860', fontWeight:600, letterSpacing:0.5 }}>
            选择清晰度
          </div>
          {resolutions.map((r) => {
            const active = r.label === current.label;
            return (
              <button
                key={r.label}
                onClick={() => { onChange(r); setOpen(false); }}
                style={{
                  display:'flex', alignItems:'center', gap:10, width:'100%',
                  padding:'10px 12px', borderRadius:8, border:'none',
                  background: active ? 'rgba(100,140,108,0.15)' : 'transparent',
                  cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                  transition:'background 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background='transparent'; }}
              >
                {/* radio circle */}
                <div style={{
                  width:16, height:16, borderRadius:'50%',
                  border: active ? '2px solid #648C6C' : '2px solid #504E4C',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>
                  {active && <div style={{ width:8, height:8, borderRadius:'50%', background:'#648C6C' }}/>}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:13, fontWeight:700, color: active ? '#C5D4C8' : '#A8A4A0' }}>{r.label}</span>
                    <span style={{ fontSize:10, color:'#706860' }}>{r.desc}</span>
                  </div>
                  <div style={{ fontSize:10, color:'#504E4C', marginTop:2 }}>
                    预估文件 {r.size}
                  </div>
                </div>

                {r.credits > 0 ? (
                  <div style={{
                    padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:700,
                    background:'rgba(100,140,108,0.15)', color:'#8CAF94',
                  }}>
                    {r.credits} 积分
                  </div>
                ) : (
                  <div style={{
                    padding:'3px 8px', borderRadius:6, fontSize:10, fontWeight:600,
                    background:'rgba(255,255,255,0.05)', color:'#706860',
                  }}>
                    免费
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── 积分确认弹窗 ── */
function CreditsModal({ resolution, userCredits, onConfirm, onCancel }) {
  const enough = userCredits >= resolution.credits;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {/* 遮罩 */}
      <div
        onClick={onCancel}
        style={{
          position:'absolute', inset:0,
          background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)',
        }}
      />
      {/* 弹窗 */}
      <div style={{
        position:'relative', zIndex:1,
        background:'var(--card)', borderRadius:20,
        border:'1px solid var(--border)',
        boxShadow:'0 16px 48px rgba(0,0,0,0.2)',
        padding:'28px 32px', maxWidth:400, width:'90%',
        animation:'modalIn 0.25s ease',
      }}>
        {/* 图标 */}
        <div style={{
          width:52, height:52, borderRadius:14,
          background:'linear-gradient(135deg, rgba(100,140,108,0.15), rgba(100,140,108,0.05))',
          display:'flex', alignItems:'center', justifyContent:'center',
          marginBottom:16,
        }}>
          <span style={{ fontSize:24 }}>✦</span>
        </div>

        <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>
          升级至 {resolution.label} 清晰度
        </div>
        <div style={{ fontSize:13, color:'var(--text-m)', lineHeight:1.6, marginBottom:20 }}>
          当前视频将以 <b>{resolution.label}</b> 重新渲染，
          预计文件大小 {resolution.size}。
          此操作需要消耗 <b style={{ color:'var(--sage)' }}>{resolution.credits} 积分</b>。
        </div>

        {/* 积分状态 */}
        <div style={{
          padding:'12px 16px', borderRadius:12,
          background:'var(--bg)', border:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:20,
        }}>
          <div>
            <div style={{ fontSize:10, color:'var(--text-l)', marginBottom:2 }}>当前积分余额</div>
            <div style={{ fontSize:18, fontWeight:700, color: enough ? 'var(--sage)' : '#C45C5C' }}>
              {userCredits}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, color:'var(--text-l)', marginBottom:2 }}>本次消耗</div>
            <div style={{ fontSize:18, fontWeight:700 }}>-{resolution.credits}</div>
          </div>
        </div>

        {!enough && (
          <div style={{
            padding:'10px 14px', borderRadius:10,
            background:'rgba(196,92,92,0.08)', border:'1px solid rgba(196,92,92,0.2)',
            fontSize:12, color:'#C45C5C', marginBottom:16, lineHeight:1.5,
          }}>
            积分不足，还需 {resolution.credits - userCredits} 积分。
            请先充值后再升级清晰度。
          </div>
        )}

        {/* 按钮 */}
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel}
            style={{
              flex:1, padding:'12px', borderRadius:12, fontSize:13, fontWeight:600,
              background:'var(--bg)', border:'1px solid var(--border)',
              color:'var(--text-m)', cursor:'pointer', fontFamily:'inherit',
            }}
          >
            取消
          </button>
          <button
            onClick={() => enough && onConfirm()}
            style={{
              flex:1, padding:'12px', borderRadius:12, fontSize:13, fontWeight:700,
              background: enough ? 'var(--sage)' : '#A8A4A0',
              border:'none', color:'#fff', cursor: enough ? 'pointer' : 'not-allowed',
              fontFamily:'inherit', opacity: enough ? 1 : 0.6,
              transition:'transform 0.1s',
            }}
            onMouseDown={e => { if (enough) e.currentTarget.style.transform='scale(0.97)'; }}
            onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
          >
            {enough ? `确认升级 · ${resolution.credits} 积分` : '积分不足'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:translateY(16px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── 升级中 Toast ── */
function UpgradeToast({ resolution }) {
  return (
    <div style={{
      position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
      zIndex:100, padding:'12px 24px', borderRadius:12,
      background:'var(--sage)', color:'#fff', fontSize:13, fontWeight:600,
      boxShadow:'0 8px 32px rgba(0,0,0,0.2)',
      display:'flex', alignItems:'center', gap:10,
      animation:'toastIn 0.3s ease',
    }}>
      <span style={{
        width:20, height:20, borderRadius:'50%',
        border:'2px solid rgba(255,255,255,0.4)',
        borderTopColor:'#fff',
        animation:'spin 0.8s linear infinite',
        flexShrink:0,
      }}/>
      正在升级至 {resolution.label}，请稍候…
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(-50%) translateY(-12px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}


/* ── 幻灯片横向滚动预览 ── */
function SlideCarousel() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, marginTop:14 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>幻灯片预览</div>
        <div style={{ fontSize:10, color:'var(--text-l)' }}>{slides.length} 张</div>
      </div>
      <div style={{ flex:1, position:'relative', minHeight:0 }}>
        {/* 右侧渐隐遮罩 */}
        <div style={{
          position:'absolute', right:0, top:0, bottom:10,
          width:48, zIndex:1, pointerEvents:'none',
          background:'linear-gradient(to right, transparent, var(--bg))',
        }}/>
      <div
        className="slide-scrollbar"
        style={{
          height:'100%', display:'flex', gap:12, overflowX:'auto',
          padding:'0 0 10px',
        }}
      >
        {slides.map((s,i) => (
          <div key={i} style={{
            flex:'0 0 160px', borderRadius:12, overflow:'hidden',
            border:'1px solid var(--border)',
            boxShadow:'var(--shadow)', background:'var(--card)',
            cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s',
            display:'flex', flexDirection:'column',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}
          >
            <div style={{ height:3, background:s.color }}/>
            <div style={{
              flex:1, minHeight:80,
              background:`linear-gradient(135deg, ${s.color}18, ${s.color}08)`,
              padding:'10px',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
            }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:s.color, marginBottom:6 }}>{String(i+1).padStart(2,'0')}</div>
                <div style={{ height:1, background:`${s.color}40`, marginBottom:4 }}/>
                <div style={{ height:1, background:'var(--border)', marginBottom:3 }}/>
                <div style={{ height:1, background:'var(--border)', width:'85%', marginBottom:3 }}/>
                <div style={{ height:1, background:'var(--border)', width:'60%' }}/>
              </div>
            </div>
            <div style={{
              fontSize:10, color:'var(--text-m)', padding:'6px 10px 8px',
              borderTop:'1px solid var(--border)',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>{s.title}</div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default function Delivery({ onReset, user, onOpenAuth, onLogout, onNavLibrary, projectName, onProjectNameChange, orientation='landscape' }) {
  const isLandscape = orientation === 'landscape';
  const [progress] = useState(37.5);
  const [currentRes, setCurrentRes] = useState(resolutions[0]); // 默认720p
  const [pendingRes, setPendingRes] = useState(null);            // 等待确认的清晰度
  const [upgrading, setUpgrading] = useState(false);
  const [userCredits] = useState(150); // 模拟用户积分
  const [speed, setSpeed] = useState('1x');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (speedRef.current && !speedRef.current.contains(e.target)) setShowSpeedMenu(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleResChange = (r) => {
    if (r.label === currentRes.label) return;
    if (r.credits > 0 && r.credits > currentRes.credits) {
      setPendingRes(r);
    } else {
      setCurrentRes(r);
    }
  };

  const handleUpgradeConfirm = () => {
    setPendingRes(null);
    setUpgrading(true);
    // 模拟渲染
    setTimeout(() => {
      setCurrentRes(pendingRes);
      setUpgrading(false);
    }, 2500);
  };

  // 动态更新导出项中的清晰度/大小
  const dynamicExport = exportItems.map((e, i) =>
    i === 0 ? { ...e, sub:`${currentRes.label} · H.264 · ${currentRes.size}` } : e
  );

  const speeds = ['0.5x','0.75x','1x','1.25x','1.5x','2x'];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} onNavLibrary={onNavLibrary} projectName={projectName} onProjectNameChange={onProjectNameChange} />
      <StepBar active={4} />

      <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
        <span style={{ fontSize:20, fontWeight:700, color:'var(--sage)' }}>✦  视频生成完成</span>
      </div>

      <div style={{ display:'flex', gap:16, padding:'0 24px 16px', alignItems:'stretch' }}>
        {/* 播放器 + 幻灯片 */}
        <div style={{ flex:'0 0 56%', minWidth:0, display:'flex', flexDirection:'column' }}>
          <div style={{
            borderRadius:16, overflow:'hidden',
            boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            border:'1px solid #2A2826',
          }}>
            {/* 视频区 — 固定 16:9 容器，内容按横竖屏适配 */}
            <div style={{ position:'relative', aspectRatio:'2.2/1', background:'#0E0D0C' }}>
              {/* 视频内容区：横屏顶满，竖屏顶高留边 */}
              <div style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{
                  position:'relative',
                  ...(isLandscape
                    ? { width:'100%', height:'100%' }
                    : { height:'100%', aspectRatio:'9/16' }),
                }}>
                  <VideoContent />
                </div>
              </div>
              {/* 当前清晰度标签 */}
              <div style={{
                position:'absolute', top:12, right:12,
                padding:'4px 10px', borderRadius:8,
                background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(255,255,255,0.1)',
                fontSize:11, fontWeight:700, color:'#E8E4DC',
                letterSpacing:0.5,
              }}>
                {currentRes.label}
                {currentRes.credits === 0 && (
                  <span style={{ marginLeft:4, fontSize:9, opacity:0.5 }}>预览</span>
                )}
              </div>
              {/* 播放按钮 */}
              <div style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{
                  width:84, height:84, borderRadius:'50%',
                  background:'rgba(245,240,232,0.9)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
                  transition:'transform 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                >
                  <span style={{ fontSize:28, marginLeft:6, color:'#201E1C' }}>▶</span>
                </div>
              </div>
            </div>
            {/* 控制栏 */}
            <div style={{ background:'#161412', padding:'12px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <span style={{ fontSize:11, color:'#706860', minWidth:36 }}>00:45</span>
                <div style={{ flex:1, height:4, background:'#302E2C', borderRadius:2, position:'relative' }}>
                  <div style={{ width:`${progress}%`, height:'100%', background:'var(--sage-l)', borderRadius:2 }}/>
                  <div style={{
                    position:'absolute', top:'50%', left:`${progress}%`,
                    width:12, height:12, borderRadius:'50%',
                    background:'#E8E4DC', transform:'translate(-50%,-50%)',
                  }}/>
                </div>
                <span style={{ fontSize:11, color:'#706860', minWidth:36, textAlign:'right' }}>02:00</span>
              </div>
              {/* 底部控制行 */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:11, color:'#706860', letterSpacing:2 }}>⏮  ⏯  ⏭&nbsp;&nbsp;&nbsp;&nbsp;🔊</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {/* 倍速选择 */}
                  <div ref={speedRef} style={{ position:'relative', display:'flex', alignItems:'center' }}>
                    <button
                      onClick={() => setShowSpeedMenu(v => !v)}
                      style={{
                        padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:600,
                        background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                        color:'#A8A4A0', cursor:'pointer', fontFamily:'inherit',
                      }}
                    >
                      {speed}
                    </button>
                    {showSpeedMenu && (
                      <div style={{
                        position:'absolute', bottom:'calc(100% + 6px)', right:0,
                        background:'#1E1C1A', border:'1px solid #3A3836',
                        borderRadius:8, padding:4, zIndex:10,
                        boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
                      }}>
                        {speeds.map(s => (
                          <button key={s} onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
                            style={{
                              display:'block', width:'100%', padding:'6px 16px',
                              border:'none', borderRadius:5, fontSize:11, fontWeight:600,
                              background: s===speed ? 'rgba(100,140,108,0.2)' : 'transparent',
                              color: s===speed ? '#8CAF94' : '#A8A4A0',
                              cursor:'pointer', fontFamily:'inherit', textAlign:'center',
                              whiteSpace:'nowrap',
                            }}
                          >{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 字幕按钮 */}
                  <button style={{
                    padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:600,
                    background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                    color:'#A8A4A0', cursor:'pointer', fontFamily:'inherit',
                  }}>CC</button>
                  {/* 清晰度选择 */}
                  <ResolutionPicker current={currentRes} onChange={handleResChange} />
                </div>
              </div>
            </div>
          </div>

          {/* PPT 缩略图 - 横向滚动 */}
          <SlideCarousel />
        </div>

        {/* 右侧面板 */}
        <div style={{
          flex:1, background:'var(--card)',
          borderRadius:14, border:'1px solid var(--border)',
          boxShadow:'var(--shadow)',
          borderTop:'2px solid var(--sage)',
          padding:'20px',
        }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>导出与分享</div>

          {dynamicExport.map((e,i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'14px', borderRadius:12,
              border:'1px solid var(--border)',
              background:'var(--card2)', marginBottom:10,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background:e.color, borderRadius:'12px 0 0 12px' }}/>
              <span style={{ fontSize:20, color:e.color, marginLeft:6 }}>{e.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{e.label}</div>
                <div style={{ fontSize:11, color:'var(--text-m)' }}>{e.sub}</div>
              </div>
              <button style={{
                padding:'6px 16px', borderRadius:9, fontSize:11,
                border:`1px solid ${e.color}`, background:'var(--bg)',
                color:e.color, fontFamily:'inherit', cursor:'pointer',
              }}>导出</button>
            </div>
          ))}

          <div style={{ margin:'16px 0 8px', fontSize:11, color:'var(--text-l)' }}>本次生成统计</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {stats.map(([k,v]) => (
              <div key={k} style={{
                padding:'10px 14px', borderRadius:10,
                background:'var(--bg)', border:'1px solid var(--border)',
              }}>
                <div style={{ fontSize:10, color:'var(--text-l)', marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:16, fontWeight:700 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onNavLibrary} style={{
              flex:1, padding:'13px',
              background:'var(--sage)', border:'none',
              borderRadius:12, fontSize:14, fontWeight:700,
              color:'#fff', fontFamily:'inherit', cursor:'pointer',
            }}>← 回到项目库</button>
            <button onClick={onReset} style={{
              flex:1, padding:'13px',
              background:'var(--bg)', border:'1px solid var(--border)',
              borderRadius:12, fontSize:14, fontWeight:700,
              color:'var(--text-m)', fontFamily:'inherit', cursor:'pointer',
            }}>+ 解读下一篇</button>
          </div>
        </div>
      </div>

      {/* 积分确认弹窗 */}
      {pendingRes && (
        <CreditsModal
          resolution={pendingRes}
          userCredits={userCredits}
          onConfirm={handleUpgradeConfirm}
          onCancel={() => setPendingRes(null)}
        />
      )}

      {/* 升级中 Toast */}
      {upgrading && <UpgradeToast resolution={pendingRes || currentRes} />}
    </div>
  );
}
