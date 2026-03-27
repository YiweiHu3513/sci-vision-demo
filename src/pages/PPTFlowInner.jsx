import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
 *  PPT 生成子流程（内嵌版，无 Navbar/StepBar）
 *  场景选择 → 配置 → 等待生成 → 预览与下载
 * ═══════════════════════════════════════════════════════════════════ */

const SUB_STEPS = ['场景选择', '配置', '生成中', '预览与下载'];

const SCENES = [
  { id: 'popular_science', icon: '🎬', title: '科普演讲', desc: '全屏视觉冲击，TED/Keynote 风格', detail: '全屏背景图+大字标题 · 每页 1-2 要点 · 暗色/渐变', available: true },
  { id: 'lab_report', icon: '🔬', title: '课题汇报', desc: '信息密集，图表为主，支持校模板', detail: '数据+图表+要点 · 论文原图 · 亮色/白底', available: true },
  { id: 'conference', icon: '📊', title: '学术会议', desc: '严肃规范，大量引用，学术风', detail: '方法+结果+引用 · 论文原图+流程图 · 白底/浅色', available: false },
  { id: 'thesis_defense', icon: '🎓', title: '毕业答辩', desc: '清晰条理，逻辑清晰，平衡美观', detail: 'AI 概念图+论文原图混合 · 学校色系', available: false },
  { id: 'business_pitch', icon: '💼', title: '企业路演', desc: '数据亮点突出，高端质感，商业叙事', detail: 'AI 概念图+数据可视化 · 暗色/渐变', available: false },
];

const GEN_STAGES = [
  { key: 'analyzing', label: '分析论文内容', duration: 3000 },
  { key: 'outlining', label: '规划 PPT 大纲', duration: 3000 },
  { key: 'generating_images', label: '生成配图', duration: 5000, showPages: true },
  { key: 'designing', label: '排版与渲染', duration: 3000 },
];

const MOCK_OUTLINE = [
  { page: 1, title: 'The Rise of LLM-Based Agents' },
  { page: 2, title: 'Historical Background of AI Agents' },
  { page: 3, title: 'Core Framework: Brain / Perception / Action' },
  { page: 4, title: 'Capability Analysis: Memory & Reasoning' },
  { page: 5, title: 'Planning & Decision Making' },
  { page: 6, title: 'Multi-Agent Collaboration' },
  { page: 7, title: 'Applications & Use Cases' },
  { page: 8, title: 'Challenges & Future Outlook' },
];

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
                background: done ? 'var(--sage)' : act ? 'var(--dust)' : 'transparent',
                border: `1.5px solid ${done ? 'var(--sage)' : act ? 'var(--dust)' : 'var(--border)'}`,
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

/* ── Step 1: 场景选择 ── */
function SceneSelect({ onSelect }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>选择 PPT 用途</h2>
        <p style={{ fontSize: 13, color: 'var(--text-l)' }}>不同场景会影响视觉风格、信息密度和配图策略</p>
      </div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 0 12px', scrollSnapType: 'x mandatory' }} className="no-scrollbar">
        {SCENES.map((s) => (
          <div key={s.id} onClick={() => s.available && onSelect(s.id)}
            style={{
              flex: '0 0 180px', scrollSnapAlign: 'start', borderRadius: 16, overflow: 'hidden',
              border: s.available ? '1.5px solid var(--border)' : '1.5px dashed var(--border)',
              background: 'var(--card)', boxShadow: s.available ? 'var(--shadow)' : 'none',
              cursor: s.available ? 'pointer' : 'default', opacity: s.available ? 1 : 0.5,
              transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
            }}
            onMouseEnter={(e) => { if (s.available) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--dust)'; } }}
            onMouseLeave={(e) => { if (s.available) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
          >
            <div style={{
              height: 100,
              background: s.available
                ? s.id === 'popular_science' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, var(--card2) 0%, var(--bg2) 100%)'
                : 'var(--bg2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            }}>{s.icon}</div>
            <div style={{ padding: '12px 14px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.title}</div>
                {!s.available && <span style={{ fontSize: 8, color: 'var(--text-l)', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>即将上线</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-m)', lineHeight: 1.5, marginBottom: 6 }}>{s.desc}</div>
              <div style={{ fontSize: 9, color: 'var(--text-l)', lineHeight: 1.4 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 2: 配置 ── */
function PPTConfig({ scene, onSubmit, onBack }) {
  const [pages, setPages] = useState(scene === 'popular_science' ? 6 : 10);
  const [language, setLanguage] = useState('en');
  const [ratio, setRatio] = useState('16:9');
  const isLabReport = scene === 'lab_report';
  const sceneLabel = SCENES.find(s => s.id === scene)?.title || scene;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ border: '1px solid var(--border)', background: 'var(--card)', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-m)', cursor: 'pointer', fontFamily: 'inherit' }}>← 返回</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>PPT 配置</h2>
          <p style={{ fontSize: 12, color: 'var(--text-l)', marginTop: 2 }}>场景：{sceneLabel}</p>
        </div>
      </div>
      <div style={{ borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)', padding: '20px' }}>
        {/* Pages */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-m)', marginBottom: 8 }}>页数</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[6, 8, 10, 12].map(n => (
              <button key={n} onClick={() => setPages(n)}
                style={{ flex: 1, padding: '10px 4px', borderRadius: 8, border: pages === n ? '1.5px solid var(--dust)' : '1px solid var(--border)', background: pages === n ? 'var(--dust-bg)' : 'var(--bg)', color: pages === n ? 'var(--dust)' : 'var(--text-m)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >{n} 页</button>
            ))}
          </div>
        </div>
        {/* Language */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-m)', marginBottom: 8 }}>语言</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'zh', label: '中文' }, { id: 'en', label: '英文' }, { id: 'bilingual', label: '中英双语' }].map(l => (
              <button key={l.id} onClick={() => setLanguage(l.id)}
                style={{ flex: 1, padding: '10px 4px', borderRadius: 8, border: language === l.id ? '1.5px solid var(--dust)' : '1px solid var(--border)', background: language === l.id ? 'var(--dust-bg)' : 'var(--bg)', color: language === l.id ? 'var(--dust)' : 'var(--text-m)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >{l.label}</button>
            ))}
          </div>
        </div>
        {/* Ratio */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-m)', marginBottom: 8 }}>宽高比</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['16:9', '4:3'].map(r => (
              <button key={r} onClick={() => setRatio(r)}
                style={{ flex: 1, padding: '10px 4px', borderRadius: 8, border: ratio === r ? '1.5px solid var(--dust)' : '1px solid var(--border)', background: ratio === r ? 'var(--dust-bg)' : 'var(--bg)', color: ratio === r ? 'var(--dust)' : 'var(--text-m)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >{r}</button>
            ))}
          </div>
        </div>
        {/* Custom template */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-m)', marginBottom: 8 }}>📤 上传自定义模板（可选）</div>
          <div style={{ padding: '20px', borderRadius: 10, border: `1.5px dashed ${isLabReport ? 'var(--border)' : 'var(--bg2)'}`, background: isLabReport ? 'var(--bg)' : 'var(--bg2)', textAlign: 'center', opacity: isLabReport ? 1 : 0.45, cursor: isLabReport ? 'pointer' : 'default' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📁</div>
            <div style={{ fontSize: 11, color: 'var(--text-l)' }}>{isLabReport ? '拖拽 .pptx 文件到此处，或点击上传' : '仅「课题汇报」场景可用'}</div>
          </div>
          {isLabReport && <div style={{ fontSize: 10, color: 'var(--text-l)', marginTop: 6, lineHeight: 1.5 }}>上传学校/机构的 PPT 模板，AI 会按照你的模板风格生成内容。</div>}
        </div>
        <button onClick={() => onSubmit({ pages, language, ratio })}
          style={{ width: '100%', padding: '13px', borderRadius: 10, background: 'var(--dust)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>开始生成</button>
      </div>
    </div>
  );
}

/* ── Step 3: 等待生成 ── */
function PPTGenerating({ config, onDone }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let timeout;
    const advanceStage = (idx) => {
      if (idx >= GEN_STAGES.length) {
        if (!doneRef.current) { doneRef.current = true; setTimeout(() => onDone(), 500); }
        return;
      }
      setStageIdx(idx);
      if (GEN_STAGES[idx].showPages) {
        let page = 0;
        const pageInterval = GEN_STAGES[idx].duration / (config.pages + 1);
        const pi = setInterval(() => { page++; if (page > config.pages) { clearInterval(pi); return; } setCurrentPage(page); }, pageInterval);
      }
      timeout = setTimeout(() => advanceStage(idx + 1), GEN_STAGES[idx].duration);
    };
    advanceStage(0);
    return () => clearTimeout(timeout);
  }, []);

  const totalDuration = GEN_STAGES.reduce((s, g) => s + g.duration, 0);
  const elapsed = GEN_STAGES.slice(0, stageIdx).reduce((s, g) => s + g.duration, 0);
  const overallPercent = Math.min(95, Math.round((elapsed / totalDuration) * 100));

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>📊</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>正在生成您的 PPT...</h2>
      <p style={{ fontSize: 12, color: 'var(--text-l)', marginBottom: 24 }}>{config.pages} 页 · {config.language === 'zh' ? '中文' : config.language === 'en' ? '英文' : '中英双语'} · {config.ratio}</p>
      <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, marginBottom: 24 }}>
        <div style={{ height: '100%', borderRadius: 3, background: 'var(--dust)', width: `${overallPercent}%`, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ borderRadius: 14, border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)', padding: '16px 20px', textAlign: 'left' }}>
        {GEN_STAGES.map((stage, i) => {
          const isDone = i < stageIdx;
          const isActive = i === stageIdx;
          const isPending = i > stageIdx;
          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < GEN_STAGES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14 }}>{isDone ? '✅' : isActive ? '🔄' : '⬜'}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isPending ? 'var(--text-l)' : 'var(--text-d)' }}>
                  {stage.label}
                  {isActive && stage.showPages && currentPage > 0 && <span style={{ color: 'var(--dust)', marginLeft: 6 }}>第 {currentPage}/{config.pages} 页</span>}
                </span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isDone ? 'var(--sage)' : isActive ? 'var(--dust)' : 'var(--text-l)' }}>{isDone ? '完成' : isActive ? '进行中' : '等待中'}</span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-l)', marginTop: 16 }}>预计剩余时间：~{Math.max(1, Math.round((totalDuration - elapsed) / 1000))} 秒</div>
    </div>
  );
}

/* ── Step 4: PPT 预览与下载 ── */
function PPTPreview({ config, onDone, isDone, onSwitchToPoster }) {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [markedSlides, setMarkedSlides] = useState(new Set());
  const [regenToast, setRegenToast] = useState(false);

  const slides = Array.from({ length: Math.min(config.pages, 12) }, (_, i) => ({
    page: i + 1,
    title: i < MOCK_OUTLINE.length ? MOCK_OUTLINE[i].title : `Slide ${i + 1}`,
    thumb: `/demo-samples/ppt-thumbs/slide-${String(i + 1).padStart(2, '0')}.png`,
  }));

  const toggleMark = (i) => { setMarkedSlides(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; }); };
  const handleRegen = () => { setRegenToast(true); setTimeout(() => { setRegenToast(false); setMarkedSlides(new Set()); }, 2000); };
  const marked = markedSlides.size;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>PPT 预览</h2>
          <p style={{ fontSize: 12, color: 'var(--text-l)' }}>{slides.length} 页 · 点击缩略图选中查看大图</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {marked > 0 && <button onClick={handleRegen} style={{ fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', color: '#fff', background: '#C45C5C', border: 'none', borderRadius: 8, padding: '7px 16px' }}>↻ 重新生成 {marked} 页</button>}
          <a href="/demo-samples/llm-agents-deck.pptx" download style={{ fontSize: 11, color: 'var(--dust)', textDecoration: 'none', border: '1px solid var(--dust)', borderRadius: 8, padding: '7px 16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>⬇️ 下载 PPTX</a>
        </div>
      </div>

      {/* Thumbnail carousel */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 0 10px', marginBottom: 12 }} className="slide-scrollbar">
        {slides.map((s, i) => {
          const isSelected = i === selectedSlide;
          const isMarked = markedSlides.has(i);
          return (
            <div key={i} onClick={() => setSelectedSlide(i)}
              style={{
                flex: '0 0 130px', borderRadius: 10, overflow: 'hidden',
                border: isSelected ? '2px solid var(--dust)' : isMarked ? '2px solid #C45C5C' : '1px solid var(--border)',
                background: 'var(--card)', cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 12px rgba(100,130,160,0.2)' : 'var(--shadow)',
                transition: 'all 0.15s', position: 'relative',
              }}
            >
              {isMarked && <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2, width: 16, height: 16, borderRadius: '50%', background: '#C45C5C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>↻</div>}
              <div style={{ aspectRatio: '16/9', background: 'var(--bg)', overflow: 'hidden', position: 'relative' }}>
                <img src={s.thumb} alt={`Slide ${s.page}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', left: 6, top: 4, fontSize: 10, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{String(s.page).padStart(2, '0')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Big preview + side panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 14 }}>
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: '#F0EEEB', boxShadow: 'var(--shadow)', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={slides[selectedSlide]?.thumb} alt={`Slide ${selectedSlide + 1}`}
            style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: 'var(--text-m)', textAlign: 'center' }}>第 {selectedSlide + 1} 页 — {slides[selectedSlide]?.title}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Mark for regen */}
          <div style={{ borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>当前页操作</div>
            <button onClick={() => toggleMark(selectedSlide)}
              style={{ width: '100%', padding: '9px', borderRadius: 8, border: markedSlides.has(selectedSlide) ? '1.5px solid #C45C5C' : '1px solid var(--border)', background: markedSlides.has(selectedSlide) ? 'rgba(196,92,92,0.06)' : 'var(--bg)', color: markedSlides.has(selectedSlide) ? '#C45C5C' : 'var(--text-m)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >{markedSlides.has(selectedSlide) ? '↻ 已标记重新生成（点击取消）' : '标记此页需要重新生成'}</button>
          </div>

          {/* Outline */}
          <div style={{ borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)', flex: 1, minHeight: 0, overflow: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📋 大纲</div>
            {slides.map((s, i) => (
              <div key={i} onClick={() => setSelectedSlide(i)}
                style={{ padding: '6px 8px', borderRadius: 6, background: i === selectedSlide ? 'var(--dust-bg)' : 'transparent', cursor: 'pointer', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.1s' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-l)', width: 16, textAlign: 'right', flexShrink: 0 }}>{s.page}</span>
                <span style={{ fontSize: 10, color: i === selectedSlide ? 'var(--dust)' : 'var(--text-m)', fontWeight: i === selectedSlide ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
              </div>
            ))}
          </div>

          {/* Download */}
          <div style={{ borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-l)', lineHeight: 1.6, marginBottom: 10 }}>📌 下载后可在 PowerPoint / WPS / Keynote 中自由编辑。</div>
            <a href="/demo-samples/llm-agents-deck.pptx" download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '11px', borderRadius: 10, background: 'var(--dust)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>⬇️ 下载 PPTX 可编辑文件</a>
          </div>

          {!isDone ? (
            <button onClick={onDone}
              style={{ padding: '12px', borderRadius: 10, background: 'var(--sage)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ PPT 设计完成</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--sage-bg)', border: '1px solid var(--sage)', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--sage)' }}>✓ PPT 已完成</div>
              {onSwitchToPoster && (
                <button onClick={onSwitchToPoster}
                  style={{ padding: '10px', borderRadius: 10, border: '1px solid var(--lav)', background: 'transparent', color: 'var(--lav)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>◈ 去做海报 →</button>
              )}
            </div>
          )}
        </div>
      </div>

      {regenToast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 140, padding: '12px 24px', borderRadius: 12, background: '#C45C5C', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          正在重新生成选中页面，请稍候…
        </div>
      )}
    </div>
  );
}

/* ═══ 主容器 ═══ */
export default function PPTFlowInner({ onDone, isDone, onSwitchToPoster }) {
  const [subStep, setSubStep] = useState(0);
  const [selectedScene, setSelectedScene] = useState(null);
  const [config, setConfig] = useState(null);

  return (
    <>
      <SubStepBar active={subStep} />
      {subStep === 0 && <SceneSelect onSelect={(id) => { setSelectedScene(id); setSubStep(1); }} />}
      {subStep === 1 && <PPTConfig scene={selectedScene} onSubmit={(cfg) => { setConfig(cfg); setSubStep(2); }} onBack={() => setSubStep(0)} />}
      {subStep === 2 && <PPTGenerating config={config} onDone={() => setSubStep(3)} />}
      {subStep === 3 && <PPTPreview config={config} onDone={onDone} isDone={isDone} onSwitchToPoster={onSwitchToPoster} />}
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
    </>
  );
}
