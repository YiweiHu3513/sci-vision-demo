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

// 右侧配置改为三组卡片，避免“大表单”阅读负担
const CONFIG_GROUPS = [
  {
    id: 'narrative',
    icon: '◉',
    title: '叙事目标',
    hint: '时长 / 受众 / 叙事角度',
    fields: ['视频时长', '目标受众', '叙事角度'],
  },
  {
    id: 'visual',
    icon: '◌',
    title: '视听风格',
    hint: '视觉 / 音色 / 背景',
    fields: ['视觉风格', '语音音色', '背景音乐'],
  },
  {
    id: 'delivery',
    icon: '◍',
    title: '交付设置',
    hint: '语言 / 输出格式',
    fields: ['解说语言', '输出格式'],
  },
];

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
      <div style={{ fontSize:10, color:'var(--text-m)', marginBottom:5, fontWeight:700, letterSpacing:0.2 }}>{label}</div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding:'10px 12px', borderRadius:10, cursor:'pointer',
          border:`1px solid ${fromChat ? 'var(--border-s)' : open ? 'var(--border-s)' : 'var(--border)'}`,
          background: open ? 'var(--card)' : '#fff',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          transition:'all .15s',
          userSelect:'none',
          fontSize:12,
          minHeight:42,
        }}
      >
        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, marginRight:6 }}>{value}</span>
        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          {fromChat && (
            <span style={{
              fontSize:9, padding:'2px 6px', borderRadius:999,
              background:'var(--sage-bg)', border:'1px solid var(--border-s)',
              color:'var(--sage)', whiteSpace:'nowrap',
            }}>预填</span>
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
          overflow:'auto', marginTop:3, maxHeight:220,
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

export default function Config({ onNext, user, onOpenAuth, onLogout, onNavLibrary, projectName, onProjectNameChange, selectedOutputs }) {
  const [configs, setConfigs] = useState(INITIAL);
  const outputs = selectedOutputs || { video: true, poster: true, ppt: true };
  const hasVideo = outputs.video;

  const update = (label, val) => {
    setConfigs(c => ({ ...c, [label]: { val, fromChat: false } }));
  };

  const estimate = calcEstimate(configs);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} onNavLibrary={onNavLibrary} projectName={projectName} onProjectNameChange={onProjectNameChange} />
      <StepBar active={3} />

      <div style={{ flex:1, padding:'12px 20px 18px', minHeight:0 }}>
        <div style={{ width:'100%', maxWidth:1360, margin:'0 auto', display:'flex', flexDirection:'column', minHeight:'100%' }}>
          {/* Header row */}
          <div style={{ marginBottom:12 }}>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4, letterSpacing:0.2 }}>配置生成参数</h2>
            <p style={{ fontSize:12, color:'var(--text-m)', marginBottom:8 }}>以下配置已根据你在对话中的描述自动预填，可手动调整</p>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'6px 12px', borderRadius:999,
              background:'var(--sage-bg)', border:'1px solid var(--border-s)',
              fontSize:11, color:'var(--sage)', fontWeight:700,
            }}>✦ 已从对话中提取配置偏好</div>
          </div>

          {/* Two-panel layout: paper info + config groups */}
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'minmax(240px, 280px) minmax(0, 1fr)', gap:16, minHeight:0 }}>
            {/* Left: Paper info card */}
            <div style={{
              background:'linear-gradient(180deg, var(--card) 0%, var(--card2) 100%)',
              borderRadius:14, border:'1px solid var(--border)',
              boxShadow:'var(--shadow)', padding:'16px',
              alignSelf:'start',
              position:'sticky', top:84,
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

              <div style={{
                marginTop:12, padding:'10px 12px',
                background:'var(--sage-bg)', borderRadius:10,
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

            {/* Right: Config panel */}
            <div style={{
              background:'linear-gradient(180deg, var(--card) 0%, var(--card2) 100%)',
              borderRadius:14, border:'1px solid var(--border)',
              boxShadow:'var(--shadow-lg)', padding:'14px',
              display:'flex', flexDirection:'column',
              minHeight:0,
            }}>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{hasVideo ? '视频生成配置' : '生成配置'}</div>
                <div style={{ fontSize:11, color:'var(--text-l)' }}>{hasVideo ? '分组调整参数，先定叙事，再定风格，最后确认交付格式' : '已跳过视频，将直接进入创意工坊'}</div>
              </div>

              <div style={{ flex:1, minHeight:0, overflowY:'auto', paddingRight:2 }}>
                {!hasVideo && (
                  <div style={{
                    padding:'20px', borderRadius:12, marginBottom:10,
                    border:'1px dashed var(--border)', background:'var(--bg2)',
                    textAlign:'center',
                  }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>快速模式</div>
                    <div style={{ fontSize:11, color:'var(--text-l)', lineHeight:1.6 }}>
                      已跳过视频生成，点击下方按钮直接进入
                      {outputs.poster && outputs.ppt ? '海报和 PPT 设计' : outputs.poster ? '海报设计' : 'PPT 设计'}
                    </div>
                  </div>
                )}
                {hasVideo && CONFIG_GROUPS.map((group) => {
                  const tint = group.id === 'narrative'
                    ? 'rgba(100, 140, 108, 0.08)'
                    : group.id === 'visual'
                      ? 'rgba(100, 130, 160, 0.08)'
                      : 'rgba(148, 130, 112, 0.08)';
                  const borderColor = group.id === 'narrative'
                    ? 'var(--border-s)'
                    : 'var(--border)';
                  return (
                    <section
                      key={group.id}
                      style={{
                        marginBottom:10,
                        background:tint,
                        border:`1px solid ${borderColor}`,
                        borderRadius:12,
                        padding:'11px 12px 12px',
                      }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                        <div style={{ fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ color:'var(--sage)' }}>{group.icon}</span>{group.title}
                        </div>
                        <div style={{ fontSize:10, color:'var(--text-l)' }}>{group.hint}</div>
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:'10px 12px', alignItems:'start' }}>
                        {group.fields.map((label, idx) => {
                          const isLastOdd = group.fields.length % 2 === 1 && idx === group.fields.length - 1;
                          return (
                            <div key={label} style={{ gridColumn: isLastOdd ? '1 / span 2' : 'auto' }}>
                              <SelectField
                                label={label}
                                value={configs[label].val}
                                fromChat={configs[label].fromChat}
                                options={OPTIONS[label]}
                                onChange={(v) => update(label, v)}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {group.id === 'narrative' && (
                        <div style={{
                          marginTop:10,
                          padding:'8px 10px',
                          borderRadius:9,
                          border:'1px solid var(--border-s)',
                          background:'#F3FAF4',
                          fontSize:10,
                          lineHeight:1.55,
                          color:'var(--text-m)',
                        }}>
                          <span style={{ color:'var(--sage)', fontWeight:700 }}>AI 推荐补充：</span>
                          这篇论文更适合「问题 → 方法 → 结果」三段叙事，可减少公式密度并多用类比解释。
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* Sticky action area */}
              <div style={{
                position:'sticky',
                bottom:0,
                zIndex:2,
                background:'linear-gradient(180deg, rgba(255,255,253,0.72) 0%, var(--card) 35%)',
                marginTop:6,
                paddingTop:12,
                borderTop:'1px solid var(--border)',
                backdropFilter:'blur(3px)',
              }}>
                <button onClick={onNext} style={{
                  width:'100%', padding:'14px',
                  background: hasVideo
                    ? 'linear-gradient(180deg, #6f9876 0%, var(--sage) 100%)'
                    : 'linear-gradient(180deg, #8A7CA0 0%, var(--lav) 100%)',
                  color:'#fff',
                  border:'none', borderRadius:11,
                  fontSize:15, fontWeight:700, fontFamily:'inherit',
                  cursor:'pointer',
                  boxShadow: hasVideo
                    ? '0 6px 16px rgba(90, 130, 100, 0.25)'
                    : '0 6px 16px rgba(138, 124, 160, 0.25)',
                }}>{hasVideo ? '▶  开始生成视频' : '✦  进入创意工坊'}</button>
                {hasVideo && (
                  <p style={{ fontSize:10, color:'var(--text-l)', textAlign:'center', marginTop:6, marginBottom:0 }}>
                    预计生成时间：{estimate.timeStr} · 消耗积分：{estimate.pts}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
