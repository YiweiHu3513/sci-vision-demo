import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
 *  海报生成子流程（内嵌版，无 Navbar/StepBar）
 *  风格选择 → 期刊选择 → 创意方案 → 预览与下载
 * ═══════════════════════════════════════════════════════════════════ */

// ── 期刊模板数据 ──
const JOURNAL_GROUPS = [
  {
    group: '热门',
    items: [
      { id: 'nature', label: 'Nature', color: '#C62828', desc: '白色衬线大标题·左上方' },
      { id: 'nature_biotechnology', label: 'Nat. Biotech.', color: '#2E7D32', desc: '绿色渐变·右侧竖排标题' },
      { id: 'cell', label: 'Cell', color: '#1565C0', desc: '蓝色双栏·顶部大横幅' },
      { id: 'science', label: 'Science', color: '#E65100', desc: '红色衬底·居中标题' },
    ],
  },
  {
    group: 'Nature 系',
    items: [
      { id: 'nature_methods', label: 'Nat. Methods', color: '#4527A0', desc: '紫色系·方法示意图' },
      { id: 'nature_geoscience', label: 'Nat. Geoscience', color: '#00695C', desc: '地球色系·地图排版' },
      { id: 'nature_communications', label: 'Nat. Comms', color: '#F57F17', desc: '黄色刊头·简洁排版' },
    ],
  },
  {
    group: 'Cell 系',
    items: [
      { id: 'cell_reports', label: 'Cell Reports', color: '#0277BD', desc: '浅蓝色·数据密集' },
      { id: 'cell_stem_cell', label: 'Cell Stem Cell', color: '#00838F', desc: '青色系·干细胞风格' },
      { id: 'molecular_cell', label: 'Molecular Cell', color: '#283593', desc: '深蓝·分子结构' },
    ],
  },
  {
    group: 'Science 系',
    items: [
      { id: 'science_robotics', label: 'Sci. Robotics', color: '#424242', desc: '灰色调·机器人科技' },
      { id: 'science_advances', label: 'Sci. Advances', color: '#BF360C', desc: '橙红色·开放获取' },
    ],
  },
];

// ── 模拟 AI 创意方案 ──
const MOCK_PROPOSALS = [
  {
    id: 1, title: '石刻基因修复', strategy: '隐喻', score: 92,
    description: '巨型石碑上 A→G 碱基被精准凿刻改写，象征对古老遗传密码的精确修正。金色光线从凿痕中涌出，暗示生命密码被重新点亮。',
    keywords: 'Ancient, transformative, precise',
    scores: { uniqueness: 9, science: 10, impact: 9, feasibility: 9 },
  },
  {
    id: 2, title: '纳米编辑器精炼', strategy: '隐喻', score: 88,
    description: '微缩机械臂在 DNA 双螺旋上精密操作，如同钟表匠修复精密零件。背景是深蓝色的细胞内部环境。',
    keywords: 'Nano, precision, mechanical',
    scores: { uniqueness: 8, science: 9, impact: 9, feasibility: 9 },
  },
  {
    id: 3, title: '蝴蝶效应突变', strategy: '混合', score: 85,
    description: '一只由碱基对构成的蝴蝶从受损的 DNA 链上蜕变飞出，翅膀上的纹路呈现修复后的正确序列。',
    keywords: 'Metamorphosis, beauty, transformation',
    scores: { uniqueness: 9, science: 7, impact: 9, feasibility: 8 },
  },
  {
    id: 4, title: '晶体结构重组', strategy: '写实', score: 83,
    description: '蛋白质晶体在电子显微镜视角下重新排列，呈现出从无序到有序的过程。冷蓝色调配合荧光标记。',
    keywords: 'Crystal, microscope, structural',
    scores: { uniqueness: 7, science: 10, impact: 7, feasibility: 9 },
  },
  {
    id: 5, title: '时间沙漏中的碱基', strategy: '隐喻', score: 80,
    description: '巨大的沙漏中，沙粒由四色碱基组成，沙漏翻转瞬间碱基重新排列为正确序列。',
    keywords: 'Time, reversal, genetic code',
    scores: { uniqueness: 8, science: 7, impact: 8, feasibility: 7 },
  },
];

const MOCK_SUGGESTIONS = [
  { text: '调整色调：当前偏暖粉色，可改为冷蓝学术风', icon: '🎨' },
  { text: '突出主体：让核心结构更清晰，减少背景干扰', icon: '🔍' },
  { text: '换个角度：从俯视改为平视，增强纪念碑感', icon: '📐' },
];

const POSTER_LAYOUTS = [
  { key: 'portrait', label: '竖版 A3', ratio: '3/4', size: '6.1MB', meta: 'PNG · A3 竖版' },
  { key: 'landscape', label: '横版 16:9', ratio: '16/9', size: '5.9MB', meta: 'PNG · 16:9 横版' },
  { key: 'square', label: '方形 1:1', ratio: '1/1', size: '5.8MB', meta: 'PNG · 1:1 方形' },
];

const STRATEGY_COLORS = { '写实': '#50A864', '隐喻': '#8A7CA0', '混合': '#6482A0' };
const SUB_STEPS = ['风格选择', '期刊选择', '创意方案', '预览与下载'];

function ScoreBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
      <span style={{ width: 32, color: 'var(--text-l)', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--sage)', borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ width: 14, textAlign: 'right', fontWeight: 700, color: 'var(--text-m)' }}>{value}</span>
    </div>
  );
}

function SubStepBar({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '8px 0 4px' }}>
      {SUB_STEPS.map((label, i) => {
        const done = i < active;
        const act = i === active;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 72 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: done ? 'var(--sage)' : act ? 'var(--lav)' : 'transparent',
                border: `1.5px solid ${done ? 'var(--sage)' : act ? 'var(--lav)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 700, color: done || act ? '#fff' : 'var(--text-l)',
              }}>{done ? '✓' : i + 1}</div>
              <span style={{ fontSize: 9, marginTop: 3, color: act ? 'var(--text-d)' : 'var(--text-l)', fontWeight: act ? 700 : 400 }}>{label}</span>
            </div>
            {i < SUB_STEPS.length - 1 && <div style={{ width: 40, height: 1.5, marginTop: -12, background: done ? 'var(--sage)' : 'var(--border)' }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 1: 风格选择 ── */
function StyleSelect({ onSelect }) {
  const styles = [
    { id: 'journal', icon: '📖', title: '期刊封面风格', desc: '还原 Nature / Cell / Science 等期刊封面排版', detail: '竖版为主 · 遵循期刊模板 · 博物馆质感', available: true },
    { id: 'academic', icon: '📋', title: '学术海报风格', desc: '适合学术会议 poster session', detail: 'A0 竖版 · 标题+摘要+配图+数据', available: false },
    { id: 'social', icon: '📱', title: '社交分享图', desc: '适合朋友圈 / 小红书 / Twitter', detail: '方形或竖版 · 简洁大图+标题', available: false },
  ];
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>选择海报风格</h2>
        <p style={{ fontSize: 13, color: 'var(--text-l)' }}>为您的论文选择最适合的视觉呈现方式</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {styles.map((s) => (
          <div key={s.id} onClick={() => s.available && onSelect(s.id)}
            style={{
              borderRadius: 16, overflow: 'hidden',
              border: s.available ? '1.5px solid var(--border)' : '1.5px dashed var(--border)',
              background: 'var(--card)', boxShadow: s.available ? 'var(--shadow)' : 'none',
              cursor: s.available ? 'pointer' : 'default', opacity: s.available ? 1 : 0.55,
              transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
            }}
            onMouseEnter={(e) => { if (s.available) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--sage)'; } }}
            onMouseLeave={(e) => { if (s.available) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
          >
            <div style={{ height: 160, background: s.available ? 'linear-gradient(135deg, var(--sage-bg) 0%, var(--dust-bg) 100%)' : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{s.icon}</div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{s.title}</div>
                {!s.available && <span style={{ fontSize: 9, color: 'var(--text-l)', background: 'var(--bg2)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>即将上线</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-m)', lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
              <div style={{ fontSize: 10, color: 'var(--text-l)' }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 2: 期刊选择 ── */
function JournalSelect({ onSelect, onBack }) {
  const [customInput, setCustomInput] = useState('');
  const [hoveredJournal, setHoveredJournal] = useState(null);
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ border: '1px solid var(--border)', background: 'var(--card)', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-m)', cursor: 'pointer', fontFamily: 'inherit' }}>← 返回</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>选择目标期刊</h2>
          <p style={{ fontSize: 12, color: 'var(--text-l)', marginTop: 2 }}>排版将遵循所选期刊的封面模板风格</p>
        </div>
      </div>
      {JOURNAL_GROUPS.map((group) => (
        <div key={group.group} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-l)', marginBottom: 8, letterSpacing: 0.5 }}>{group.group}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {group.items.map((j) => (
              <div key={j.id} onClick={() => onSelect(j.id)}
                onMouseEnter={() => setHoveredJournal(j.id)} onMouseLeave={() => setHoveredJournal(null)}
                style={{
                  position: 'relative', padding: '10px 18px', borderRadius: 10,
                  border: '1.5px solid var(--border)', background: 'var(--card)', cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: hoveredJournal === j.id ? 'var(--shadow)' : 'none',
                  borderColor: hoveredJournal === j.id ? j.color : 'var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: j.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{j.label}</span>
                </div>
                {hoveredJournal === j.id && (
                  <div style={{
                    position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                    background: '#1E1C1A', color: '#E8E4DC', padding: '6px 12px', borderRadius: 8,
                    fontSize: 10, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 10,
                    animation: 'fadeIn 0.15s ease',
                  }}>{j.desc}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-l)', marginBottom: 8, letterSpacing: 0.5 }}>自定义</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="输入期刊名称..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--card)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-d)', outline: 'none' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--sage)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            onKeyDown={(e) => { if (e.key === 'Enter' && customInput.trim()) onSelect(customInput.trim()); }}
          />
          <button onClick={() => customInput.trim() && onSelect(customInput.trim())} disabled={!customInput.trim()}
            style={{ padding: '10px 20px', borderRadius: 10, background: customInput.trim() ? 'var(--sage)' : 'var(--bg2)', border: 'none', color: customInput.trim() ? '#fff' : 'var(--text-l)', fontSize: 12, fontWeight: 700, cursor: customInput.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}
          >确认</button>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: 创意方案选择 ── */
function ProposalSelect({ journal, onSelect, onBack }) {
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const proposals = MOCK_PROPOSALS;
  useEffect(() => { const t = setTimeout(() => { setLoading(false); setExpandedId(proposals[0].id); }, 2500); return () => clearTimeout(t); }, []);
  const journalLabel = JOURNAL_GROUPS.flatMap(g => g.items).find(j => j.id === journal)?.label || journal;

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }}>💡</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>AI 正在头脑风暴中...</h2>
        <p style={{ fontSize: 12, color: 'var(--text-l)', marginBottom: 24 }}>正在为 <b>{journalLabel}</b> 风格生成 5 个创意方案</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 64, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', animation: `shimmer 1.8s ease infinite ${i*0.15}s` }} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{ border: '1px solid var(--border)', background: 'var(--card)', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-m)', cursor: 'pointer', fontFamily: 'inherit' }}>← 返回</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>AI 为您生成了 5 个封面创意方向</h2>
          <p style={{ fontSize: 12, color: 'var(--text-l)', marginTop: 2 }}>期刊：{journalLabel} · 选择一个方案进行生成</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {proposals.map((p, idx) => {
          const isExpanded = expandedId === p.id;
          const isTop = idx === 0;
          return (
            <div key={p.id} style={{
              borderRadius: 14, overflow: 'hidden',
              border: isTop ? '1.5px solid var(--sage)' : '1px solid var(--border)',
              background: 'var(--card)',
              boxShadow: isTop ? '0 2px 12px rgba(100,140,108,0.12)' : 'var(--shadow)',
            }}>
              <div onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isTop && <span style={{ fontSize: 14 }}>⭐</span>}
                  {isTop && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--sage)', background: 'var(--sage-bg)', padding: '2px 8px', borderRadius: 6 }}>推荐</span>}
                  <span style={{ fontSize: 14, fontWeight: 700 }}>#{p.id} {p.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: STRATEGY_COLORS[p.strategy], background: `${STRATEGY_COLORS[p.strategy]}18`, padding: '2px 8px', borderRadius: 6 }}>{p.strategy}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--sage)' }}>{p.score}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-l)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)', animation: 'slideDown 0.25s ease' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-m)', lineHeight: 1.7, margin: '12px 0' }}>{p.description}</p>
                  <div style={{ fontSize: 11, color: 'var(--dust)', marginBottom: 12 }}>🎨 {p.keywords}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', marginBottom: 14 }}>
                    <ScoreBar label="独特性" value={p.scores.uniqueness} />
                    <ScoreBar label="科学性" value={p.scores.science} />
                    <ScoreBar label="冲击力" value={p.scores.impact} />
                    <ScoreBar label="可行性" value={p.scores.feasibility} />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onSelect(p); }}
                    style={{ width: '100%', padding: '11px', borderRadius: 10, background: 'var(--sage)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>选择此方案</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 4: 预览与下载 ── */
function PosterPreview({ proposal, journal, onBackToProposals, onCancelGeneration, onDone, isDone, onSwitchToPPT }) {
  const [generating, setGenerating] = useState(true);
  const [activeLayout, setActiveLayout] = useState('portrait');
  const [showModifyPanel, setShowModifyPanel] = useState(false);
  const [modifyText, setModifyText] = useState('');
  const [adoptedSuggestions, setAdoptedSuggestions] = useState(new Set());
  const [freeRetries, setFreeRetries] = useState(2);
  const [regenerating, setRegenating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [qualityWarning] = useState(false);

  const posterUrls = {
    portrait: '/demo-samples/llm-agents-poster-a3-portrait.png',
    landscape: '/demo-samples/llm-agents-poster.png',
    square: '/demo-samples/llm-agents-poster-square.png',
  };

  useEffect(() => { const t = setTimeout(() => setGenerating(false), 4000); return () => clearTimeout(t); }, []);

  const handleRegenerate = () => {
    if (freeRetries <= 0) { setShowPaywall(true); return; }
    setRegenating(true);
    setFreeRetries(v => v - 1);
    setTimeout(() => setRegenating(false), 3000);
  };

  const currentLayout = POSTER_LAYOUTS.find(l => l.key === activeLayout);
  const journalLabel = JOURNAL_GROUPS.flatMap(g => g.items).find(j => j.id === journal)?.label || journal;

  if (generating) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>🎨</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>正在绘制封面...</h2>
        <p style={{ fontSize: 12, color: 'var(--text-l)', marginBottom: 24 }}>方案 #{proposal.id} · {proposal.title} · {journalLabel}</p>
        <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, maxWidth: 320, margin: '0 auto' }}>
          <div style={{ height: '100%', borderRadius: 3, background: 'var(--sage)', animation: 'progressFill 4s ease forwards' }} />
        </div>
        {onCancelGeneration && (
          <button onClick={onCancelGeneration}
            style={{
              marginTop: 20, border: '1px solid var(--border)', background: 'var(--card)',
              borderRadius: 8, padding: '5px 14px', fontSize: 11, fontWeight: 600,
              color: 'var(--text-m)', cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C45C5C'; e.currentTarget.style.color = '#C45C5C'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-m)'; }}
          >取消</button>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '12px 24px' }}>
      {/* Layout tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', gap: 4, padding: '4px 5px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)' }}>
          {POSTER_LAYOUTS.map(layout => (
            <button key={layout.key} onClick={() => setActiveLayout(layout.key)}
              style={{ border: 'none', borderRadius: 7, padding: '5px 14px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', color: activeLayout === layout.key ? '#fff' : 'var(--text-m)', background: activeLayout === layout.key ? 'var(--sage)' : 'transparent' }}
            >{layout.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-l)' }}>{currentLayout?.meta} · {currentLayout?.size}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 16 }}>
        {/* Poster preview */}
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: '#F0EEEB', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16 }}>
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', flex: 1, minHeight: 0 }}>
            {regenerating && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(240,238,235,0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <div style={{ fontSize: 28, marginBottom: 8, animation: 'pulse 1.5s ease infinite' }}>🎨</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>正在重新生成...</div>
              </div>
            )}
            <img src={posterUrls[activeLayout]} alt={`海报 ${currentLayout?.label}`} onClick={() => setPreviewUrl(posterUrls[activeLayout])}
              style={{ maxWidth: '100%', maxHeight: '56vh', objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', transition: 'opacity 0.3s', opacity: regenerating ? 0.4 : 1 }} />
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-l)', marginTop: 8 }}>点击放大查看</div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Proposal info */}
          <div style={{ borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>#{proposal.id} {proposal.title}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: STRATEGY_COLORS[proposal.strategy], background: `${STRATEGY_COLORS[proposal.strategy]}18`, padding: '2px 8px', borderRadius: 6 }}>{proposal.strategy}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-m)' }}>{journalLabel} · {proposal.score} 分</div>
          </div>

          {qualityWarning && (
            <div style={{ borderRadius: 10, padding: '8px 12px', background: 'rgba(172,128,74,0.08)', border: '1px solid rgba(172,128,74,0.2)', fontSize: 11, color: 'var(--amber)', lineHeight: 1.5 }}>
              AI 检测到图片中可能存在细微瑕疵，如不满意可点击重新生成
            </div>
          )}

          {/* Free download */}
          <div style={{ borderRadius: 12, padding: '14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>📥 免费下载（PNG 一键出图）</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {POSTER_LAYOUTS.map(layout => (
                <a key={layout.key} href={posterUrls[layout.key]} download={`poster_${layout.key}.png`}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', textAlign: 'center', textDecoration: 'none', color: 'var(--text-d)', fontSize: 10, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span>{layout.label}</span>
                  <span style={{ color: 'var(--sage)', fontWeight: 700 }}>下载</span>
                </a>
              ))}
            </div>
          </div>

          {/* Paid editable */}
          <div style={{ borderRadius: 12, padding: '14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>✏️ 可编辑版（PPTX + PDF）</div>
              <span style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700 }}>🔒 付费</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-l)', lineHeight: 1.6, marginBottom: 10 }}>文字和图片分层，可自由修改标题、作者、字体</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowPaywall(true)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-m)' }}>📄 PPTX · 🔒 ¥3</button>
              <button onClick={() => setShowPaywall(true)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-m)' }}>📄 PDF · 🔒 ¥3</button>
            </div>
          </div>

          {/* Modify */}
          <button onClick={() => setShowModifyPanel(!showModifyPanel)}
            style={{ padding: '11px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-m)' }}>
            {showModifyPanel ? '收起修改面板' : '✏️ 不满意？修改再生成'}
          </button>

          {showModifyPanel && (
            <div style={{ borderRadius: 12, padding: '14px', border: '1px solid var(--lav)', background: 'var(--card)', boxShadow: 'var(--shadow)', animation: 'slideDown 0.25s ease' }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>AI 建议的改进方向：</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {MOCK_SUGGESTIONS.map((s, i) => {
                  const adopted = adoptedSuggestions.has(i);
                  return (
                    <div key={i} style={{ padding: '8px 12px', borderRadius: 8, border: adopted ? '1px solid var(--sage)' : '1px solid var(--border)', background: adopted ? 'var(--sage-bg)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-m)' }}>{s.icon} {s.text}</div>
                      <button onClick={() => setAdoptedSuggestions(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; })}
                        style={{ border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: adopted ? 'var(--sage)' : 'transparent', color: adopted ? '#fff' : 'var(--sage)' }}>{adopted ? '已采纳 ✓' : '采纳'}</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-m)', marginBottom: 6 }}>或者自己描述修改需求：</div>
              <textarea value={modifyText} onChange={(e) => setModifyText(e.target.value)} placeholder="我希望背景换成深蓝色，主体的结构再大一点..."
                style={{ width: '100%', minHeight: 56, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 11, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0 8px' }}>
                <button onClick={onBackToProposals} style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 8, padding: '6px 14px', fontSize: 10, fontWeight: 600, color: 'var(--text-m)', cursor: 'pointer', fontFamily: 'inherit' }}>🔄 换一个创意方案</button>
                <span style={{ fontSize: 10, color: 'var(--text-l)' }}>剩余免费修改：{freeRetries}/2</span>
              </div>
              <button onClick={handleRegenerate}
                style={{ width: '100%', padding: '11px', borderRadius: 10, background: 'var(--lav)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🔄 重新生成</button>
            </div>
          )}

          {!isDone ? (
            <button onClick={onDone}
              style={{ padding: '12px', borderRadius: 10, background: 'var(--sage)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ 海报设计完成</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--sage-bg)', border: '1px solid var(--sage)', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--sage)' }}>✓ 海报已完成</div>
              {onSwitchToPPT && (
                <button onClick={onSwitchToPPT}
                  style={{ padding: '10px', borderRadius: 10, border: '1px solid var(--dust)', background: 'transparent', color: 'var(--dust)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>▦ 去做 PPT →</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Paywall modal */}
      {showPaywall && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowPaywall(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', zIndex: 1, width: '92%', maxWidth: 380, borderRadius: 18, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: '0 16px 48px rgba(0,0,0,0.2)', padding: '24px 26px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>解锁可编辑版</div>
            <div style={{ fontSize: 12, color: 'var(--text-m)', lineHeight: 1.6, marginBottom: 16 }}>可编辑版提供 5 层分离的 PPTX 和矢量 PDF，可自由修改文字、字体和布局。</div>
            <div style={{ padding: '12px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 16, fontSize: 22, fontWeight: 700, color: 'var(--sage)' }}>¥3 <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-l)' }}>/ 份</span></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowPaywall(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-m)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>取消</button>
              <button onClick={() => setShowPaywall(false)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: 'var(--sage)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>确认支付 ¥3</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewUrl && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setPreviewUrl(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)' }} />
          <div style={{ position: 'relative', zIndex: 1, width: 'min(960px, 92vw)', background: '#12100F', border: '1px solid #2E2A27', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #2E2A27', color: '#D4CEC4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
              海报预览 · {currentLayout?.label}
              <button onClick={() => setPreviewUrl(null)} style={{ border: '1px solid #3F3A36', background: 'transparent', color: '#BDB6AB', borderRadius: 8, fontSize: 11, padding: '3px 9px', cursor: 'pointer', fontFamily: 'inherit' }}>关闭</button>
            </div>
            <div style={{ background: '#0B0A09', display: 'flex', justifyContent: 'center', padding: 12 }}>
              <img src={previewUrl} alt="海报预览" style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: 10, border: '1px solid #3A3430', display: 'block' }} />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes progressFill { from { width: 0; } to { width: 95%; } }`}</style>
    </div>
  );
}

/* ═══ 主容器 ═══ */
export default function PosterFlowInner({ onDone, isDone, onSwitchToPPT }) {
  const [subStep, setSubStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  return (
    <>
      <SubStepBar active={subStep} />
      {subStep === 0 && <StyleSelect onSelect={(id) => { setSelectedStyle(id); if (id === 'journal') setSubStep(1); }} />}
      {subStep === 1 && <JournalSelect onSelect={(id) => { setSelectedJournal(id); setSubStep(2); }} onBack={() => setSubStep(0)} />}
      {subStep === 2 && <ProposalSelect journal={selectedJournal} onSelect={(p) => { setSelectedProposal(p); setSubStep(3); }} onBack={() => setSubStep(1)} />}
      {subStep === 3 && <PosterPreview proposal={selectedProposal} journal={selectedJournal} onBackToProposals={() => setSubStep(2)} onCancelGeneration={() => setSubStep(2)} onDone={onDone} isDone={isDone} onSwitchToPPT={onSwitchToPPT} />}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes shimmer { 0% { opacity: 0.4; } 50% { opacity: 0.7; } 100% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
