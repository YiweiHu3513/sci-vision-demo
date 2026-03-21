import { useState } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const exportItems = [
  { icon:'▶', label:'下载 MP4 视频',    sub:'1080p · H.264 · 124MB', color:'var(--sage)' },
  { icon:'▦', label:'下载 PPTX 幻灯片', sub:'10 页含分镜配图 · 8MB',  color:'var(--dust)' },
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

export default function Delivery({ onReset, user, onOpenAuth, onLogout }) {
  const [progress] = useState(37.5);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} />
      <StepBar active={4} />

      <div style={{ textAlign:'center', padding:'12px 0 8px' }}>
        <span style={{ fontSize:20, fontWeight:700, color:'var(--sage)' }}>✦  视频生成完成</span>
      </div>

      <div style={{ display:'flex', gap:16, padding:'0 24px 16px' }}>
        {/* 播放器 */}
        <div style={{ flex:'0 0 56%' }}>
          <div style={{
            borderRadius:16, overflow:'hidden',
            boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            border:'1px solid #2A2826',
          }}>
            {/* 视频区 */}
            <div style={{ position:'relative', height:340 }}>
              <VideoContent />
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
                }}>
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
              <div style={{ fontSize:11, color:'#706860', letterSpacing:2 }}>⏮  ⏯  ⏭&nbsp;&nbsp;&nbsp;&nbsp;🔊</div>
            </div>
          </div>

          {/* PPT 缩略图 */}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>幻灯片预览</div>
            <div style={{ display:'flex', gap:10 }}>
              {slides.map((s,i) => (
                <div key={i} style={{
                  flex:1, borderRadius:10, overflow:'hidden',
                  border:'1px solid var(--border)',
                  boxShadow:'var(--shadow)', background:'var(--card)',
                }}>
                  <div style={{ height:3, background:s.color }}/>
                  <div style={{
                    height:60,
                    background:`linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
                    padding:'8px',
                  }}>
                    <div style={{ fontSize:10, fontWeight:700, color:s.color }}>0{i+1}</div>
                    <div style={{ height:1, background:`${s.color}40`, margin:'4px 0' }}/>
                    <div style={{ height:1, background:'var(--border)', marginBottom:3 }}/>
                    <div style={{ height:1, background:'var(--border)', width:'80%' }}/>
                  </div>
                  <div style={{ fontSize:9, color:'var(--text-m)', padding:'4px 8px 6px' }}>{s.title}</div>
                </div>
              ))}
            </div>
          </div>
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

          {exportItems.map((e,i) => (
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

          <button onClick={onReset} style={{
            width:'100%', padding:'13px',
            background:'var(--bg)', border:'1px solid var(--border)',
            borderRadius:12, fontSize:14, fontWeight:700,
            color:'var(--text-m)', fontFamily:'inherit', cursor:'pointer',
          }}>+ 新建项目</button>
        </div>
      </div>
    </div>
  );
}
