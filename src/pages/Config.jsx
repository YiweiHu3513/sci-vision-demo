import { useState } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

// 每个字段的选项
const OPTIONS = {
  '视频时长': ['1 分钟（约 5 段分镜）', '2 分钟（约 10 段分镜）', '3 分钟（约 15 段分镜）', '5 分钟（约 25 段分镜）'],
  '目标受众': ['普通科学爱好者（非专业）', '本领域研究者', '高校本科生', '科技媒体读者', '政府/投资人'],
  '视觉风格': ['Houdini 物理渲染 + Morandi 配色', '2D 扁平插图风格', '数据可视化主导', '实拍素材 + 动效', '手绘概念图'],
  '解说语言': ['中文普通话', '英语', '中英双语字幕', '粤语'],
  '叙事角度': ['科普解说（从问题出发）', '学术报告（方法驱动）', '故事叙事（人物驱动）', '对比分析（结果驱动）'],
  '语音音色': ['标准女声 · 沉稳自然', '标准男声 · 沉稳专业', '青年女声 · 活泼亲切', '青年男声 · 充满激情'],
  '背景音乐': ['轻氛围 · 钢琴弦乐 · 低混响', '科技感 · 电子合成器', '无背景音乐', '自然音效 · 纯净'],
  '输出格式': ['MP4 1080p · PPTX · 分镜脚本 PDF', 'MP4 1080p 仅视频', 'MP4 4K 超清', '竖版 MP4 9:16（短视频）'],
};

// 配置项分两列：左列 = 内容相关，右列 = 制作相关
const LEFT_FIELDS = ['视频时长', '目标受众', '视觉风格', '解说语言'];
const RIGHT_FIELDS = ['叙事角度', '语音音色', '背景音乐', '输出格式'];

// 对话中提取到的初始值
const INITIAL = {
  '视频时长': { val:'2 分钟（约 10 段分镜）', fromChat:true },
  '目标受众': { val:'普通科学爱好者（非专业）', fromChat:true },
  '视觉风格': { val:'Houdini 物理渲染 + Morandi 配色', fromChat:true },
  '解说语言': { val:'中文普通话', fromChat:true },
  '叙事角度': { val:'科普解说（从问题出发）', fromChat:false },
  '语音音色': { val:'标准女声 · 沉稳自然', fromChat:false },
  '背景音乐': { val:'轻氛围 · 钢琴弦乐 · 低混响', fromChat:false },
  '输出格式': { val:'MP4 1080p · PPTX · 分镜脚本 PDF', fromChat:false },
};

// 从对话中提取的意图摘要
const CHAT_INTENTS = [
  { key:'视频时长',  val:'「2分钟左右，分10段」' },
  { key:'目标受众',  val:'「面向非专业科学爱好者」' },
  { key:'视觉风格',  val:'「Houdini 渲染质感，莫兰迪色系」' },
  { key:'解说语言',  val:'「中文普通话」' },
];

function SelectField({ label, value, fromChat, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position:'relative' }}>
      <div style={{ fontSize:10, color:'var(--text-l)', marginBottom:3 }}>{label}</div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding:'9px 12px', borderRadius:8, cursor:'pointer',
          border:`1.5px solid ${fromChat ? 'var(--border-s)' : open ? 'var(--border-s)' : 'var(--border)'}`,
          background: open ? 'var(--card)' : 'var(--bg)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          transition:'all .15s',
          userSelect:'none',
          fontSize:12,
        }}
      >
        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, marginRight:6 }}>{value}</span>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          {fromChat && (
            <span style={{
              fontSize:9, padding:'2px 7px', borderRadius:6,
              background:'var(--sage-bg)', border:'1px solid var(--border-s)',
              color:'var(--sage)', whiteSpace:'nowrap',
            }}>✦ 对话预填</span>
          )}
          <span style={{
            color:'var(--text-l)', fontSize:10,
            transform: open ? 'rotate(180deg)' : 'none',
            transition:'transform .2s', display:'inline-block',
          }}>▾</span>
        </div>
      </div>

      {open && (
        <div style={{
          position:'absolute', top:'100%', left:0, right:0, zIndex:50,
          background:'var(--card)', borderRadius:8,
          border:'1px solid var(--border-s)',
          boxShadow:'0 8px 24px rgba(0,0,0,0.10)',
          overflow:'hidden', marginTop:3,
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding:'9px 12px', fontSize:12, cursor:'pointer',
                background: opt===value ? 'var(--sage-bg)' : 'transparent',
                color: opt===value ? 'var(--sage)' : 'var(--text-d)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                transition:'background .1s',
              }}
              onMouseEnter={e=>{ if(opt!==value) e.currentTarget.style.background='var(--bg2)'; }}
              onMouseLeave={e=>{ if(opt!==value) e.currentTarget.style.background='transparent'; }}
            >
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{opt}</span>
              {opt===value && <span style={{ color:'var(--sage)', fontSize:11, flexShrink:0, marginLeft:6 }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 根据配置估算时长（秒）和积分
function calcEstimate(configs) {
  const durMap = {
    '1 分钟（约 5 段分镜）':  { sec: 60,  pts: 8  },
    '2 分钟（约 10 段分镜）': { sec: 120, pts: 12 },
    '3 分钟（约 15 段分镜）': { sec: 180, pts: 18 },
    '5 分钟（约 25 段分镜）': { sec: 300, pts: 28 },
  };
  const styleExtra = {
    'Houdini 物理渲染 + Morandi 配色': { sec: 30, pts: 4 },
    '2D 扁平插图风格':                 { sec: 10, pts: 1 },
    '数据可视化主导':                  { sec: 15, pts: 2 },
    '实拍素材 + 动效':                 { sec: 20, pts: 3 },
    '手绘概念图':                       { sec: 25, pts: 3 },
  };
  const formatExtra = {
    'MP4 1080p · PPTX · 分镜脚本 PDF': { sec: 15, pts: 2 },
    'MP4 1080p 仅视频':                  { sec: 0,  pts: 0 },
    'MP4 4K 超清':                        { sec: 40, pts: 5 },
    '竖版 MP4 9:16（短视频）':            { sec: 10, pts: 1 },
  };
  const base = durMap[configs['视频时长']?.val] ?? { sec: 120, pts: 12 };
  const style = styleExtra[configs['视觉风格']?.val] ?? { sec: 0, pts: 0 };
  const fmt = formatExtra[configs['输出格式']?.val] ?? { sec: 0, pts: 0 };
  const totalSec = base.sec + style.sec + fmt.sec;
  const totalPts = base.pts + style.pts + fmt.pts;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const timeStr = min > 0 ? `约 ${min} 分 ${sec > 0 ? sec + ' 秒' : ''}` : `约 ${sec} 秒`;
  return { timeStr: timeStr.trim(), pts: totalPts };
}

export default function Config({ onNext, user, onOpenAuth, onLogout }) {
  const [configs, setConfigs] = useState(INITIAL);

  const update = (label, val) => {
    setConfigs(c => ({ ...c, [label]: { val, fromChat: false } }));
  };

  const estimate = calcEstimate(configs);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} />
      <StepBar active={2} />

      {/* Main content area — fill remaining viewport, no scroll needed */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'12px 24px 16px', minHeight:0 }}>
        {/* Header row */}
        <div style={{ marginBottom:10 }}>
          <h2 style={{ fontSize:17, fontWeight:700, marginBottom:3 }}>配置生成参数</h2>
          <p style={{ fontSize:12, color:'var(--text-m)', marginBottom:8 }}>以下配置已根据你在对话中的描述自动预填，可手动调整</p>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'5px 12px', borderRadius:12,
            background:'var(--sage-bg)', border:'1px solid var(--border-s)',
            fontSize:11, color:'var(--sage)',
          }}>✦&nbsp;已从对话中提取配置偏好</div>
        </div>

        {/* Two-panel layout: paper info + config grid */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'260px 1fr', gap:14, minHeight:0 }}>
          {/* Left: Paper info card */}
          <div style={{
            background:'var(--card)',
            borderRadius:12, border:'1px solid var(--border)',
            boxShadow:'var(--shadow)', padding:'16px',
            borderTop:'2px solid var(--sage)',
            alignSelf:'start',
          }}>
            <div style={{ fontWeight:700, fontSize:12, marginBottom:12 }}>论文信息</div>
            <div style={{ fontSize:9, color:'var(--text-l)', marginBottom:3 }}>TITLE</div>
            <div style={{ fontSize:11, fontWeight:700, lineHeight:1.5, marginBottom:10 }}>Efficient Neural Network Pruning via Gradient-Based Structural Optimization</div>
            <div style={{ fontSize:9, color:'var(--text-l)', marginBottom:3 }}>VENUE</div>
            <div style={{ fontSize:11, color:'var(--sage)', marginBottom:14 }}>NeurIPS 2024</div>

            {[['可视化潜力',85,'var(--sage)'],['叙事适合度',78,'var(--dust)']].map(([l,v,c])=>(
              <div key={l} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, marginBottom:3 }}>
                  <span>{l}</span><span style={{ color:c }}>{v}%</span>
                </div>
                <div style={{ height:4, background:'var(--bg)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${v}%`, background:c, borderRadius:3 }}/>
                </div>
              </div>
            ))}

            {/* Chat intents */}
            <div style={{
              marginTop:12, padding:'10px 12px',
              background:'var(--sage-bg)', borderRadius:8,
              border:'1px solid var(--border-s)',
            }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--sage)', marginBottom:6 }}>对话提取意图</div>
              {CHAT_INTENTS.map(({ key, val }) => (
                <div key={key} style={{ marginBottom:6 }}>
                  <div style={{ fontSize:9, color:'var(--text-l)', marginBottom:1 }}>{key}</div>
                  <div style={{ fontSize:10, color:'var(--text-d)', lineHeight:1.4 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Config panel — grid layout */}
          <div style={{
            background:'var(--card)',
            borderRadius:12, border:'1px solid var(--border)',
            boxShadow:'var(--shadow)', padding:'16px',
            borderTop:'2px solid var(--sage)',
            display:'flex', flexDirection:'column',
          }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>视频生成配置</div>

            {/* 2-column config grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 14px', flex:1 }}>
              {/* Left column fields */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {LEFT_FIELDS.map(label => (
                  <SelectField
                    key={label}
                    label={label}
                    value={configs[label].val}
                    fromChat={configs[label].fromChat}
                    options={OPTIONS[label]}
                    onChange={(v) => update(label, v)}
                  />
                ))}
              </div>
              {/* Right column fields */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {RIGHT_FIELDS.map(label => (
                  <SelectField
                    key={label}
                    label={label}
                    value={configs[label].val}
                    fromChat={configs[label].fromChat}
                    options={OPTIONS[label]}
                    onChange={(v) => update(label, v)}
                  />
                ))}
              </div>
            </div>

            {/* AI suggestion + button — always at bottom */}
            <div style={{ marginTop:12 }}>
              <div style={{
                padding:'10px 14px', borderRadius:10,
                background:'var(--sage-bg)', border:'1px solid var(--border-s)',
                marginBottom:12,
              }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--sage)', marginBottom:4 }}>✦  AI 推荐补充</div>
                <div style={{ fontSize:11, color:'var(--text-m)', lineHeight:1.6 }}>
                  基于论文图表密度，建议重点呈现「F1 流程图 → F3 压缩对比 → F5 可视化」三段递进叙事弧线。当前配置中目标受众为非专业用户，叙事语言建议以类比替代公式。
                </div>
              </div>

              <button onClick={onNext} style={{
                width:'100%', padding:'14px',
                background:'var(--sage)', color:'#fff',
                border:'none', borderRadius:10,
                fontSize:15, fontWeight:700, fontFamily:'inherit',
                cursor:'pointer',
              }}>▶  开始生成视频</button>
              <p style={{ fontSize:10, color:'var(--text-l)', textAlign:'center', marginTop:6, marginBottom:0 }}>
                预计生成时间：{estimate.timeStr} · 消耗积分：{estimate.pts}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
