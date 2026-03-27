import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const CARDS = [
  {
    key: 'video',
    icon: '\uD83C\uDFAC',
    title: '科研视频',
    desc: 'AI 驱动的论文可视化叙事，自动生成分镜与解说',
    time: '~3-5 分钟',
    color: 'var(--sage)',
    bg: 'var(--sage-bg)',
    border: 'var(--border-s)',
    preview: 'video',
  },
  {
    key: 'poster',
    icon: '\u25C8',
    title: '期刊封面海报',
    desc: '还原真实期刊 masthead 排版，含视觉隐喻创意',
    time: '~45 秒',
    color: 'var(--lav)',
    bg: 'var(--lav-bg, rgba(139,92,246,0.06))',
    border: 'var(--border-lav, rgba(139,92,246,0.18))',
    preview: 'poster',
  },
  {
    key: 'ppt',
    icon: '\u25A6',
    title: '科研 PPT',
    desc: '学术风格幻灯片，自动提炼论文结构与图表',
    time: '~3-5 分钟',
    color: 'var(--dust)',
    bg: 'var(--dust-bg)',
    border: 'var(--border-dust, rgba(180,140,100,0.18))',
    preview: 'ppt',
  },
];

/* ── Preview: muted autoplay video ── */
function VideoPreview() {
  return (
    <div style={{
      height: 200, borderRadius: 10, overflow: 'hidden',
      background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <video
        src="/demo-samples/llm-agents-video-demo.mp4"
        autoPlay muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

/* ── Preview: poster crossfade ── */
const POSTER_IMGS = [
  '/demo-samples/llm-agents-poster-a3-portrait.png',
  '/demo-samples/llm-agents-poster.png',
  '/demo-samples/llm-agents-poster-square.png',
];

function PosterPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % POSTER_IMGS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      height: 200, borderRadius: 10, overflow: 'hidden',
      background: 'var(--bg)', position: 'relative',
    }}>
      {POSTER_IMGS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`poster-${i}`}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'contain',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        />
      ))}
    </div>
  );
}

/* ── Preview: PPT horizontal scroll ── */
function PPTPreview() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf;
    let pos = 0;
    const speed = 0.4; // px per frame

    const step = () => {
      pos += speed;
      // Loop back when scrolled past half (we duplicate children conceptually)
      if (pos >= el.scrollWidth / 2) {
        pos = 0;
      }
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const slides = Array.from({ length: 12 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `/demo-samples/ppt-thumbs/slide-${num}.png`;
  });
  // Double the slides for seamless looping
  const allSlides = [...slides, ...slides];

  return (
    <div
      ref={scrollRef}
      style={{
        height: 200, borderRadius: 10, overflow: 'hidden',
        background: 'var(--bg)', display: 'flex', gap: 8,
        alignItems: 'center', padding: '0 8px',
      }}
    >
      {allSlides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`slide-${i}`}
          style={{
            height: 160, borderRadius: 6, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid var(--border)',
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ── */
export default function MaterialSelect({
  onNext,
  selectedOutputs,
  onOutputsChange,
  user, onOpenAuth, onLogout, onNavLibrary,
  projectName, onProjectNameChange,
}) {
  const sel = selectedOutputs || { video: true, poster: true, ppt: true };
  const selectedCount = Object.values(sel).filter(Boolean).length;

  const toggle = (key) => {
    const next = { ...sel, [key]: !sel[key] };
    // Prevent deselecting all — at least one must remain
    if (Object.values(next).filter(Boolean).length === 0) return;
    onOutputsChange(next);
  };

  const previewComponents = {
    video: VideoPreview,
    poster: PosterPreview,
    ppt: PPTPreview,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        user={user} onOpenAuth={onOpenAuth} onLogout={onLogout}
        onNavLibrary={onNavLibrary}
        projectName={projectName} onProjectNameChange={onProjectNameChange}
      />
      <StepBar active={2} />

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '36px 24px 8px' }}>
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: 'var(--text-d)',
          margin: 0, letterSpacing: 0.3,
        }}>
          你想为这篇论文生成什么？
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--text-l)', marginTop: 10, marginBottom: 0,
        }}>
          可多选，稍后可以随时补充
        </p>
      </div>

      {/* Cards row */}
      <div style={{
        display: 'flex', gap: 20, justifyContent: 'center',
        padding: '28px 32px 0',
        flexWrap: 'wrap',
        maxWidth: 1120, margin: '0 auto',
      }}>
        {CARDS.map(card => {
          const active = sel[card.key];
          const Preview = previewComponents[card.key];
          return (
            <div
              key={card.key}
              onClick={() => toggle(card.key)}
              style={{
                flex: '1 1 300px',
                maxWidth: 340,
                minWidth: 280,
                background: active ? card.bg : 'var(--card)',
                border: `2px solid ${active ? card.color : 'var(--border)'}`,
                borderRadius: 16,
                boxShadow: active ? 'var(--shadow-lg)' : 'var(--shadow)',
                cursor: 'pointer',
                transition: 'all .25s ease',
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = card.color;
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Top: icon + title + checkbox */}
              <div style={{
                padding: '20px 20px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{card.icon}</span>
                  <span style={{
                    fontSize: 17, fontWeight: 700, color: 'var(--text-d)',
                  }}>{card.title}</span>
                </div>
                {/* Checkbox */}
                <div style={{
                  width: 24, height: 24, borderRadius: 8,
                  border: `2px solid ${active ? card.color : 'var(--border)'}`,
                  background: active ? card.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .2s ease',
                  flexShrink: 0,
                }}>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L5.5 10L11 4" stroke="#fff" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Preview area */}
              <div style={{ padding: '0 16px' }}>
                <Preview />
              </div>

              {/* Description + time */}
              <div style={{ padding: '14px 20px 20px' }}>
                <p style={{
                  fontSize: 13, color: 'var(--text-m)', margin: 0,
                  lineHeight: 1.6,
                }}>
                  {card.desc}
                </p>
                <div style={{
                  marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.5)' : 'var(--bg)',
                  fontSize: 11, color: 'var(--text-l)', fontWeight: 600,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  预计生成 {card.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom: continue button */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '36px 24px 48px',
      }}>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          style={{
            padding: '15px 56px',
            background: 'var(--sage)',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all .2s ease',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
          }}
        >
          继续 →
        </button>
      </div>

      {/* Hint text */}
      <p style={{
        textAlign: 'center', fontSize: 11, color: 'var(--text-l)',
        marginTop: -28, paddingBottom: 32,
      }}>
        已选择 {selectedCount} 项物料 · 至少选择 1 项才能继续
      </p>
    </div>
  );
}
