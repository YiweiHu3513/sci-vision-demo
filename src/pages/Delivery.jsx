import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';
import { DEMO_ASSETS } from '../config/demoAssets';

const slidePalette = ['var(--sage)', 'var(--dust)', 'var(--taupe)', 'var(--lav)', '#ACA08A'];
const slides = Array.from({ length: 12 }, (_, i) => ({
  title: `第 ${i + 1} 页`,
  color: slidePalette[i % slidePalette.length],
  thumb: `/demo-samples/ppt-thumbs/slide-${String(i + 1).padStart(2, '0')}.png`,
}));

const allStats = {
  time: ['处理时长', '18.3 秒'],
  images: ['生成图片', '12 张'],
  scripts: ['脚本段落', '10 段'],
  videoDur: ['视频时长', '2:00'],
  posterCount: ['海报版式', '3 版'],
  pptPages: ['PPT 页数', '12 页'],
};

const mediaTabs = [
  { key: 'all', label: '全部' },
  { key: 'video', label: '视频' },
  { key: 'ppt', label: 'PPT' },
  { key: 'poster', label: '海报' },
];

const resolutions = [
  { label: '720p', desc: '标清 · 免费', credits: 0, size: '83MB' },
  { label: '1080p', desc: '高清', credits: 20, size: '124MB' },
  { label: '4K', desc: '超清', credits: 80, size: '520MB' },
];

const POSTER_LAYOUTS = [
  {
    key: 'a3_landscape',
    label: 'A3 横版',
    url: DEMO_ASSETS.poster.url,
    filename: 'A3横版海报.png',
    size: '5.9MB',
    meta: 'PNG · A3 横版',
  },
  {
    key: 'a3_portrait',
    label: 'A3 竖版',
    url: '/demo-samples/llm-agents-poster-a3-portrait.png',
    filename: 'A3竖版海报.png',
    size: '6.1MB',
    meta: 'PNG · A3 竖版',
  },
  {
    key: 'square',
    label: '方形 1:1',
    url: '/demo-samples/llm-agents-poster-square.png',
    filename: '1_1方形海报.png',
    size: '5.8MB',
    meta: 'PNG · 1:1 方形',
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ExportAction({ item }) {
  if (!item.href) {
    return (
      <button
        disabled
        style={{
          padding: '6px 16px',
          borderRadius: 9,
          fontSize: 11,
          border: `1px solid ${item.color}`,
          background: 'var(--bg)',
          color: item.color,
          fontFamily: 'inherit',
          opacity: 0.45,
          cursor: 'not-allowed',
        }}
      >
        待接入
      </button>
    );
  }

  return (
    <a
      href={item.href}
      download={item.download}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 16px',
        borderRadius: 9,
        fontSize: 11,
        border: `1px solid ${item.color}`,
        background: 'var(--bg)',
        color: item.color,
        fontFamily: 'inherit',
        cursor: 'pointer',
        textDecoration: 'none',
        fontWeight: 700,
      }}
    >
      下载
    </a>
  );
}

function ResolutionPicker({ current, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: '2px 8px',
          borderRadius: 5,
          fontSize: 11,
          fontWeight: 600,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#E8E4DC',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {current.label}
        <span style={{ fontSize: 8, opacity: 0.65 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            right: 0,
            background: '#1E1C1A',
            border: '1px solid #3A3836',
            borderRadius: 12,
            padding: 6,
            minWidth: 210,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 20,
          }}
        >
          <div style={{ padding: '6px 10px', fontSize: 10, color: '#706860', fontWeight: 600 }}>选择清晰度</div>
          {resolutions.map((r) => {
            const active = r.label === current.label;
            return (
              <button
                key={r.label}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: active ? 'rgba(100,140,108,0.15)' : 'transparent',
                  color: active ? '#C5D4C8' : '#A8A4A0',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span>
                  <b style={{ fontWeight: 700 }}>{r.label}</b>
                  <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75 }}>{r.desc}</span>
                </span>
                <span style={{ fontSize: 10, opacity: 0.8 }}>{r.credits > 0 ? `${r.credits} 积分` : '免费'}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreditsModal({ resolution, userCredits, onConfirm, onCancel }) {
  const enough = userCredits >= resolution.credits;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '92%',
          maxWidth: 420,
          borderRadius: 18,
          border: '1px solid var(--border)',
          background: 'var(--card)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          padding: '24px 26px',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>升级至 {resolution.label} 清晰度</div>
        <div style={{ fontSize: 13, color: 'var(--text-m)', lineHeight: 1.65, marginBottom: 16 }}>
          该演示环境只展示一条样本视频，选择更高档位会模拟“渲染升级”流程。
        </div>
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-l)' }}>当前积分</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: enough ? 'var(--sage)' : '#C45C5C' }}>{userCredits}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-l)' }}>本次消耗</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>-{resolution.credits}</div>
          </div>
        </div>

        {!enough && (
          <div
            style={{
              marginBottom: 14,
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(196,92,92,0.08)',
              border: '1px solid rgba(196,92,92,0.2)',
              color: '#C45C5C',
              fontSize: 12,
            }}
          >
            积分不足，还需 {resolution.credits - userCredits} 积分。
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-m)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            取消
          </button>
          <button
            onClick={() => enough && onConfirm()}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: enough ? 'var(--sage)' : '#A8A4A0',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: enough ? 'pointer' : 'not-allowed',
              opacity: enough ? 1 : 0.6,
              fontFamily: 'inherit',
            }}
          >
            {enough ? `确认升级 · ${resolution.credits} 积分` : '积分不足'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PosterPreviewModal({ url, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)' }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(960px, 92vw)',
          background: '#12100F',
          border: '1px solid #2E2A27',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid #2E2A27',
            color: '#D4CEC4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          海报预览
          <button
            onClick={onClose}
            style={{
              border: '1px solid #3F3A36',
              background: 'transparent',
              color: '#BDB6AB',
              borderRadius: 8,
              fontSize: 11,
              padding: '3px 9px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            关闭
          </button>
        </div>
        <div style={{ background: '#0B0A09', display: 'flex', justifyContent: 'center', padding: 12 }}>
          <img
            src={url}
            alt="海报预览"
            style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: 10, border: '1px solid #3A3430', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}

function SlideCarousel({ compact = false }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        marginTop: compact ? 0 : 14,
        height: compact ? '100%' : 'auto',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>PPT 滚动预览</div>
        <div style={{ fontSize: 10, color: 'var(--text-l)' }}>{slides.length} 张</div>
      </div>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 10,
            width: 48,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'linear-gradient(to right, transparent, var(--bg))',
          }}
        />
        <div
          className="slide-scrollbar"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '0 0 10px',
          }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 160px',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                background: 'var(--card)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div style={{ height: 3, background: s.color }} />
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: 'var(--bg)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={s.thumb}
                  alt={`${s.title} 缩略图`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', left: 8, top: 8,
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  textShadow: '0 2px 8px rgba(0,0,0,0.55)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-m)',
                  padding: '6px 10px 8px',
                  borderTop: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {s.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PptGridView({ slides, markedSlides, onToggleMark, onRegenMarked, pptUrl, pptFilename, regenUnitCredits = 2, fillHeight = false }) {
  const marked = markedSlides.size;
  const regenCost = marked * regenUnitCredits;
  return (
    <div style={{
      borderRadius: 16, border: '1px solid var(--border)',
      background: 'var(--card)', boxShadow: 'var(--shadow)',
      display: 'flex', flexDirection: 'column',
      flex: fillHeight ? 1 : '0 0 auto',
      minHeight: fillHeight ? 0 : 'auto',
      height: fillHeight ? '100%' : 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>PPT 逐页预览</span>
          <span style={{
            fontSize: 10, color: 'var(--text-l)',
            background: 'var(--bg)', borderRadius: 6, padding: '2px 8px',
          }}>{slides.length} 页</span>
          {marked > 0 && (
            <span style={{
              fontSize: 10, color: '#C45C5C', fontWeight: 700,
              background: 'rgba(196,92,92,0.08)', borderRadius: 6, padding: '2px 8px',
            }}>已选 {marked} 页待重新生成</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {marked > 0 && (
            <button onClick={onRegenMarked} style={{
              fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              color: '#fff', background: '#C45C5C', border: 'none',
              borderRadius: 8, padding: '5px 14px',
            }}>
              ↻ 重新生成 {marked} 页（{regenCost} 积分）
            </button>
          )}
          <a href={pptUrl} download={pptFilename} style={{
            fontSize: 11, color: 'var(--sage)', textDecoration: 'none',
            border: '1px solid var(--sage)', borderRadius: 8, padding: '5px 14px', fontWeight: 700,
          }}>下载 PPTX</a>
        </div>
      </div>
      {/* Tip */}
      <div style={{
        padding: '8px 16px', fontSize: 11, color: 'var(--text-l)',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      }}>
        💡 点击卡片标记需要重新生成的页面，确认后会扣除对应积分并覆盖当前页
      </div>
      {/* Grid */}
      <div style={{
        padding: 16,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}>
        {slides.map((s, i) => {
          const isMarked = markedSlides.has(i);
          return (
            <div
              key={i}
              onClick={() => onToggleMark(i)}
              style={{
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                border: isMarked ? '2px solid #C45C5C' : '1px solid var(--border)',
                boxShadow: isMarked ? '0 0 0 3px rgba(196,92,92,0.15)' : 'var(--shadow)',
                background: 'var(--card)',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              {/* Mark badge */}
              {isMarked && (
                <div style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 2,
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#C45C5C', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>↻</div>
              )}
              {/* Slide preview area */}
              <div style={{
                aspectRatio: '16/9',
                background: 'var(--bg)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img
                  src={s.thumb}
                  alt={`${s.title} 缩略图`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isMarked ? 'saturate(0.9) brightness(0.85)' : 'none',
                  }}
                />
                <div style={{
                  position: 'absolute', left: 10, top: 8,
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  textShadow: '0 2px 8px rgba(0,0,0,0.55)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              {/* Footer */}
              <div style={{
                padding: '8px 12px', borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>第 {i + 1} 页</div>
                  <div style={{ fontSize: 10, color: 'var(--text-m)' }}>{s.title}</div>
                </div>
                <div style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4,
                  background: isMarked ? 'rgba(196,92,92,0.1)' : 'var(--bg)',
                  color: isMarked ? '#C45C5C' : 'var(--text-l)',
                  fontWeight: 600,
                }}>{isMarked ? '待重生成' : '满意'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ctrlBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 5, padding: '2px 8px',
  fontSize: 11, fontWeight: 600,
  color: '#A8A4A0', cursor: 'pointer',
  fontFamily: 'inherit', lineHeight: 1.4,
};

export default function Delivery({
  onReset,
  onGoToStep,
  stepBarMaxReached,
  canGoToStepBar,
  user,
  onOpenAuth,
  onLogout,
  onNavLibrary,
  projectName,
  onProjectNameChange,
  selectedOutputs,
  userCredits = 0,
  regenPricing,
  onSpendCredits,
  onRequestRegenerate,
}) {
  const outputs = selectedOutputs || { video: true, poster: true, ppt: true };
  // Filter media tabs based on what user selected
  const visibleTabs = mediaTabs.filter(t => {
    if (t.key === 'all') return true; // always show "全部"
    if (t.key === 'video') return outputs.video;
    if (t.key === 'ppt') return outputs.ppt;
    if (t.key === 'poster') return outputs.poster;
    return true;
  });
  const [activeMedia, setActiveMedia] = useState('all');
  const [currentRes, setCurrentRes] = useState(resolutions[0]);
  const [pendingRes, setPendingRes] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showPosterPreview, setShowPosterPreview] = useState(false);
  const [posterLayout, setPosterLayout] = useState('a3_landscape');
  const [posterReady, setPosterReady] = useState(() => new Set(['a3_landscape']));
  const [markedSlides, setMarkedSlides] = useState(new Set());
  const [regenToast, setRegenToast] = useState(false);
  const [regenToastText, setRegenToastText] = useState('');
  const pptRegenPerPage = regenPricing?.pptPerPage ?? 2;
  const posterRegenCost = regenPricing?.poster ?? 12;

  const videoRef = useRef(null);
  const speedRef = useRef(null);
  const progressRef = useRef(null);
  const [duration, setDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerWrapRef = useRef(null);
  const overlayTimer = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (speedRef.current && !speedRef.current.contains(e.target)) setShowSpeedMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    const rate = Number(speed.replace('x', ''));
    if (videoRef.current && Number.isFinite(rate)) {
      videoRef.current.playbackRate = rate;
    }
  }, [speed]);

  // 预加载三种海报版式，减少首次点击切换时的图片加载延迟
  useEffect(() => {
    let cancelled = false;
    POSTER_LAYOUTS.forEach(({ key, url }) => {
      const markReady = () => {
        if (cancelled) return;
        setPosterReady((prev) => {
          if (prev.has(key)) return prev;
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      };
      const img = new Image();
      img.decoding = 'async';
      img.onload = markReady;
      img.onerror = markReady;
      img.src = url;
      if (img.complete) markReady();
    });
    return () => { cancelled = true; };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const flashOverlay = () => {
    setShowOverlay(true);
    clearTimeout(overlayTimer.current);
    overlayTimer.current = setTimeout(() => setShowOverlay(false), 600);
  };

  const seekTo = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = p * duration;
  };

  useEffect(() => {
    const up = () => setDragging(false);
    const move = (e) => { if (dragging) seekTo(e); };
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', move); };
  });

  const toggleFullscreen = () => {
    if (!playerWrapRef.current) return;
    if (!document.fullscreenElement) {
      playerWrapRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleResChange = (r) => {
    if (r.label === currentRes.label) return;
    if (r.credits > currentRes.credits) setPendingRes(r);
    else setCurrentRes(r);
  };

  const handleUpgradeConfirm = () => {
    if (!pendingRes) return;
    const paid = onSpendCredits ? onSpendCredits(pendingRes.credits, `升级至 ${pendingRes.label}`) : true;
    if (!paid) return;
    setPendingRes(null);
    setUpgrading(true);
    setTimeout(() => {
      setCurrentRes(pendingRes);
      setUpgrading(false);
    }, 1800);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];
  const activePoster = POSTER_LAYOUTS.find((item) => item.key === posterLayout) ?? POSTER_LAYOUTS[0];
  const posterSwitching = !posterReady.has(activePoster.key);
  const markPosterReady = (key) => {
    setPosterReady((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const flashRegenToast = (text) => {
    setRegenToastText(text);
    setRegenToast(true);
    setTimeout(() => setRegenToast(false), 2000);
  };

  const dynamicExport = [
    {
      key: 'video',
      icon: '▶',
      label: '下载 MP4 视频',
      sub: `${currentRes.label} · H.264 · ${currentRes.size}`,
      color: 'var(--sage)',
      href: DEMO_ASSETS.video.url,
      download: DEMO_ASSETS.video.filename,
    },
    {
      key: 'ppt',
      icon: '▦',
      label: '下载 PPTX 幻灯片',
      sub: `${DEMO_ASSETS.ppt.meta} · ${DEMO_ASSETS.ppt.size}`,
      color: 'var(--dust)',
      href: DEMO_ASSETS.ppt.url,
      download: DEMO_ASSETS.ppt.filename,
    },
    {
      key: 'poster',
      icon: '◈',
      label: `下载宣传海报（${activePoster.label}）`,
      sub: `${activePoster.meta} · ${activePoster.size}`,
      color: '#ACA08A',
      href: activePoster.url,
      download: activePoster.filename,
    },
    { key: 'pdf', icon: '≡', label: '下载分镜脚本 PDF', sub: '暂未上传样本', color: 'var(--taupe)' },
    { key: 'share', icon: '⬡', label: '生成分享链接', sub: '暂未启用', color: 'var(--lav)' },
  ];

  // Filter export items based on what user selected
  const filteredExport = dynamicExport.filter(item => {
    if (item.key === 'video') return outputs.video;
    if (item.key === 'ppt') return outputs.ppt;
    if (item.key === 'poster') return outputs.poster;
    if (item.key === 'pdf') return outputs.video; // script PDF only with video
    return true;
  });

  // Dynamic stats based on selected outputs
  const stats = [
    allStats.time,
    ...(outputs.video ? [allStats.images, allStats.scripts, allStats.videoDur] : []),
    ...(outputs.poster ? [allStats.posterCount] : []),
    ...(outputs.ppt ? [allStats.pptPages] : []),
  ];

  const showVideo = outputs.video && (activeMedia === 'all' || activeMedia === 'video');
  const showPpt = (activeMedia === 'all' || activeMedia === 'ppt') && outputs.ppt;
  const showPosterPanel = activeMedia === 'poster' && outputs.poster;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        user={user}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onNavLibrary={onNavLibrary}
        projectName={projectName}
        onProjectNameChange={onProjectNameChange}
      />
      <StepBar active={6} onGoToStep={onGoToStep} maxReached={stepBarMaxReached} canGoToStep={canGoToStepBar} />

      <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--sage)' }}>✦  视频生成完成</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(340px, 360px)',
        gap: 16,
        padding: '0 24px 16px',
        alignItems: 'stretch',
        minHeight: 'calc(100vh - 190px)',
      }}>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 10,
              padding: '5px 6px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--card)',
            }}
          >
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveMedia(tab.key)}
                style={{
                  border: 'none',
                  borderRadius: 9,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  color: activeMedia === tab.key ? '#fff' : 'var(--text-m)',
                  background: activeMedia === tab.key ? 'var(--sage)' : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {showVideo && (
            <div
              ref={playerWrapRef}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                border: '1px solid #2A2826',
                background: '#0E0D0C',
                display: 'flex',
                flexDirection: 'column',
                flex: activeMedia === 'video' ? 1 : '0 0 auto',
              }}
            >
              {/* Top bar */}
              <div
                style={{
                  padding: '8px 14px',
                  background: '#161412',
                  borderBottom: '1px solid #2A2826',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, color: '#A8A4A0', fontWeight: 700 }}>样本视频预览</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#8CAF94',
                    background: 'rgba(100,140,108,0.12)', border: '1px solid rgba(100,140,108,0.25)',
                    borderRadius: 6, padding: '2px 8px',
                  }}>{currentRes.label} 预览</span>
                  <a
                    href={DEMO_ASSETS.video.url}
                    download={DEMO_ASSETS.video.filename}
                    style={{
                      fontSize: 11, color: '#C5D4C8', textDecoration: 'none',
                      border: '1px solid rgba(140,175,148,0.45)', borderRadius: 8,
                      padding: '2px 10px', fontWeight: 700,
                    }}
                  >下载</a>
                </div>
              </div>

              {/* Video area — no native controls */}
              <div
                onClick={() => { togglePlay(); flashOverlay(); }}
                style={{ position: 'relative', cursor: 'pointer', background: '#0E0D0C', lineHeight: 0 }}
              >
                <video
                  ref={videoRef}
                  preload="metadata"
                  poster={DEMO_ASSETS.poster.url}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                  style={{
                    width: '100%',
                    display: 'block',
                    background: '#0E0D0C',
                    objectFit: 'contain',
                    maxHeight: activeMedia === 'all' ? '42vh' : '58vh',
                  }}
                >
                  <source src={DEMO_ASSETS.video.url} type="video/mp4" />
                </video>
                {/* Big play/pause overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: showOverlay || !playing ? 1 : 0,
                  transition: 'opacity 0.3s',
                  pointerEvents: 'none',
                  background: !playing && currentTime === 0 ? 'rgba(0,0,0,0.3)' : 'transparent',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: showOverlay ? 1 : (!playing ? 0.9 : 0),
                    transform: showOverlay ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 0.25s',
                  }}>
                    <span style={{ color: '#E8E4DC', fontSize: 22, marginLeft: playing ? 0 : 3 }}>
                      {playing ? '⏸' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Custom control bar */}
              <div style={{ background: '#161412', padding: '8px 14px 10px' }}>
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  onMouseDown={(e) => { setDragging(true); seekTo(e); }}
                  style={{
                    height: 14, display: 'flex', alignItems: 'center',
                    cursor: 'pointer', marginBottom: 6, position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
                    height: 4, background: '#302E2C', borderRadius: 2,
                  }}>
                    <div style={{
                      width: `${progress}%`, height: '100%',
                      background: 'linear-gradient(90deg, var(--sage), var(--sage-l))',
                      borderRadius: 2, transition: dragging ? 'none' : 'width 0.15s',
                    }}/>
                  </div>
                  <div style={{
                    position: 'absolute', top: '50%',
                    left: `${progress}%`,
                    width: 12, height: 12, borderRadius: '50%',
                    background: '#E8E4DC', border: '2px solid var(--sage)',
                    transform: 'translate(-50%,-50%)',
                    transition: dragging ? 'none' : 'left 0.15s',
                    boxShadow: '0 0 6px rgba(100,140,108,0.4)',
                  }}/>
                </div>

                {/* Controls row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Left: time + play controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#706860', fontFamily: 'monospace', minWidth: 75 }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); }}
                      style={ctrlBtnStyle} title="后退 10s">⏮</button>
                    <button onClick={togglePlay} style={{ ...ctrlBtnStyle, fontSize: 14, padding: '2px 6px' }}>
                      {playing ? '⏸' : '▶'}
                    </button>
                    <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10); }}
                      style={ctrlBtnStyle} title="前进 10s">⏭</button>

                    {/* Volume */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => { setMuted(v => !v); if (videoRef.current) videoRef.current.muted = !muted; }}
                        style={ctrlBtnStyle}>
                        {muted || volume === 0 ? '🔇' : '🔊'}
                      </button>
                      <input
                        type="range" min={0} max={1} step={0.05}
                        value={muted ? 0 : volume}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setVolume(v); setMuted(v === 0);
                          if (videoRef.current) { videoRef.current.volume = v; videoRef.current.muted = v === 0; }
                        }}
                        style={{ width: 50, accentColor: 'var(--sage)', cursor: 'pointer', height: 3 }}
                      />
                    </div>
                  </div>

                  {/* Right: speed, CC, resolution, fullscreen */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div ref={speedRef} style={{ position: 'relative' }}>
                      <button onClick={() => setShowSpeedMenu(v => !v)} style={ctrlBtnStyle}>{speed}</button>
                      {showSpeedMenu && (
                        <div style={{
                          position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
                          background: '#1E1C1A', border: '1px solid #3A3836',
                          borderRadius: 8, padding: 4, zIndex: 10,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        }}>
                          {speeds.map(s => (
                            <button key={s}
                              onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
                              style={{
                                display: 'block', width: '100%', padding: '6px 16px',
                                border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600,
                                background: s === speed ? 'rgba(100,140,108,0.2)' : 'transparent',
                                color: s === speed ? '#8CAF94' : '#A8A4A0',
                                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                              }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button style={ctrlBtnStyle}>CC</button>
                    <ResolutionPicker current={currentRes} onChange={handleResChange} />
                    <button onClick={toggleFullscreen} style={ctrlBtnStyle} title="全屏">
                      {isFullscreen ? '⊡' : '⛶'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showPpt && activeMedia === 'ppt' && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <PptGridView
                slides={slides}
                markedSlides={markedSlides}
                onToggleMark={(i) => setMarkedSlides(prev => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i); else next.add(i);
                  return next;
                })}
                onRegenMarked={() => {
                  const markedCount = markedSlides.size;
                  if (markedCount <= 0) return;
                  const allowed = onRequestRegenerate
                    ? onRequestRegenerate({ assetType: 'ppt', pageCount: markedCount })
                    : true;
                  if (!allowed) return;
                  flashRegenToast(`正在重新生成 ${markedCount} 页 PPT，请稍候…`);
                  setMarkedSlides(new Set());
                }}
                pptUrl={DEMO_ASSETS.ppt.url}
                pptFilename={DEMO_ASSETS.ppt.filename}
                regenUnitCredits={pptRegenPerPage}
                fillHeight
              />
            </div>
          )}
          {/* "全部" tab: poster thumbnail + PPT carousel (conditional) */}
          {activeMedia === 'all' && (outputs.poster || outputs.ppt) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: outputs.poster && outputs.ppt ? '180px minmax(0, 1fr)' : '1fr',
                gap: 14,
                marginTop: 12,
                minHeight: 0,
                alignItems: 'stretch',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Poster thumbnail */}
              {outputs.poster && (
                <div
                  onClick={() => setShowPosterPreview(true)}
                  style={{
                    flex: '0 0 180px', borderRadius: 12, overflow: 'hidden',
                    border: '1px solid var(--border)', background: 'var(--card)',
                    boxShadow: 'var(--shadow)', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                >
                  <img
                    src={activePoster.url}
                    alt={`海报（${activePoster.label}）`}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => markPosterReady(activePoster.key)}
                    style={{
                      width: '100%', display: 'block', borderBottom: '1px solid var(--border)', objectFit: 'cover',
                    }}
                  />
                  <div style={{ padding: '6px 8px', fontSize: 10, color: 'var(--text-m)', textAlign: 'center' }}>
                    🖼 海报预览
                  </div>
                </div>
              )}
              {/* PPT carousel */}
              {outputs.ppt && (
                <div style={{ minWidth: 0, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
                  <SlideCarousel compact />
                </div>
              )}
            </div>
          )}

          {showPosterPanel && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                borderRadius: 14, border: '1px solid var(--border)',
                background: 'var(--card)', boxShadow: 'var(--shadow)',
                display: 'grid', gridTemplateColumns: 'minmax(340px, 42%) minmax(0, 1fr)',
                overflow: 'hidden',
                flex: 1,
                minHeight: 0,
                height: '100%',
              }}>
              {/* Left: poster preview */}
                <div style={{
                  background: '#f0eeeb', padding: 12,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  borderRight: '1px solid var(--border)', overflow: 'hidden', minHeight: 0,
                }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, alignSelf: 'flex-start' }}>海报预览</div>
                <img
                  src={activePoster.url} alt={`海报（${activePoster.label}）`}
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => markPosterReady(activePoster.key)}
                  onClick={() => setShowPosterPreview(true)}
                  style={{
                    width: '100%', flex: 1, minHeight: 0,
                    objectFit: 'contain', borderRadius: 8,
                    border: '1px solid var(--border)', cursor: 'pointer',
                  }}
                />
                <div style={{ fontSize: 9, color: 'var(--text-l)', marginTop: 6 }}>点击放大查看</div>
              </div>
              {/* Right: adjustment panel */}
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto', minHeight: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>海报调整</div>
                <div style={{ fontSize: 11, color: 'var(--text-m)', lineHeight: 1.6 }}>
                  如需修改海报内容，可选择调整方向后重新生成。
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-l)', marginBottom: 4 }}>视觉风格</div>
                  <select style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    fontSize: 12, fontFamily: 'inherit', color: 'var(--text)',
                  }}>
                    <option>当前风格（保持不变）</option>
                    <option>学术简洁 — 白底黑字</option>
                    <option>科技感 — 深色渐变</option>
                    <option>杂志风 — 大图排版</option>
                    <option>信息图 — 数据可视化</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-l)', marginBottom: 4 }}>文字修改说明</div>
                  <textarea
                    placeholder="例如：标题改为中文、去掉二维码、补充作者信息…"
                    style={{
                      width: '100%', minHeight: 60, padding: '8px 10px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      fontSize: 11, fontFamily: 'inherit', color: 'var(--text)',
                      resize: 'vertical', lineHeight: 1.5,
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-l)', marginBottom: 4 }}>版面方向</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {POSTER_LAYOUTS.map((layout) => {
                      const active = layout.key === activePoster.key;
                      return (
                        <button
                          key={layout.key}
                          onClick={() => setPosterLayout(layout.key)}
                          style={{
                            flex: 1, padding: '7px 4px', borderRadius: 8, fontSize: 10, fontWeight: 600,
                            border: active ? '1.5px solid var(--sage)' : '1px solid var(--border)',
                            background: active ? 'rgba(100,140,108,0.06)' : 'var(--bg)',
                            color: active ? 'var(--sage)' : 'var(--text-m)',
                            fontFamily: 'inherit', cursor: 'pointer',
                          }}
                        >
                          {layout.label}{active ? '（当前）' : ''}
                        </button>
                      );
                    })}
                  </div>
                  {posterSwitching && (
                    <div style={{ marginTop: 4, fontSize: 9, color: 'var(--text-l)' }}>
                      正在加载该版式预览…
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    const allowed = onRequestRegenerate
                      ? onRequestRegenerate({ assetType: 'poster', pageCount: 1 })
                      : true;
                    if (!allowed) return;
                    flashRegenToast('正在重新生成海报，请稍候…');
                  }}
                  style={{
                  marginTop: 8, padding: '11px', borderRadius: 10,
                  background: 'var(--sage)', border: 'none', color: '#fff',
                  fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                }}>↻ 重新生成海报（{posterRegenCost} 积分）</button>
              </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: 'var(--card)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            borderTop: '2px solid var(--sage)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            height: '100%',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>导出与分享</div>
          <div style={{ fontSize: 11, color: 'var(--text-l)', marginBottom: 10 }}>
            当前积分：<b style={{ color: 'var(--text-d)' }}>{userCredits}</b>
          </div>

          {filteredExport.map((item, i) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--card2)',
                marginBottom: i === dynamicExport.length - 1 ? 0 : 6,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 3, background: item.color, borderRadius: '10px 0 0 10px',
              }}/>
              <span style={{ fontSize: 16, color: item.color, marginLeft: 4 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                <div style={{ fontSize: 9, color: 'var(--text-l)', whiteSpace: 'nowrap' }}>{item.sub}</div>
              </div>
              <ExportAction item={item} />
            </div>
          ))}

          {/* Compact stats row */}
          <div style={{ margin: '14px 0 8px', fontSize: 10, color: 'var(--text-l)' }}>本次生成统计</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
            {stats.map(([k, v]) => (
              <div key={k} style={{
                padding: '6px 8px', borderRadius: 8,
                background: 'var(--bg)', border: '1px solid var(--border)',
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: 8, color: 'var(--text-l)', marginBottom: 1 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Stacked buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={onNavLibrary} style={{
              padding: '11px', background: 'var(--sage)', border: 'none',
              borderRadius: 10, fontSize: 13, fontWeight: 700,
              color: '#fff', fontFamily: 'inherit', cursor: 'pointer',
            }}>← 回到项目库</button>
            <button onClick={onReset} style={{
              padding: '11px', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: 10,
              fontSize: 13, fontWeight: 700, color: 'var(--text-m)',
              fontFamily: 'inherit', cursor: 'pointer',
            }}>+ 解读下一篇</button>
          </div>
        </div>
      </div>

      {pendingRes && (
        <CreditsModal
          resolution={pendingRes}
          userCredits={userCredits}
          onConfirm={handleUpgradeConfirm}
          onCancel={() => setPendingRes(null)}
        />
      )}
      {showPosterPreview && <PosterPreviewModal url={activePoster.url} onClose={() => setShowPosterPreview(false)} />}

      {upgrading && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 140,
            padding: '12px 24px',
            borderRadius: 12,
            background: 'var(--sage)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          正在升级至 {pendingRes?.label || currentRes.label}，请稍候…
        </div>
      )}

      {regenToast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 140,
          padding: '12px 24px', borderRadius: 12, background: '#C45C5C', color: '#fff',
          fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          {regenToastText || '正在重新生成，请稍候…'}
        </div>
      )}
    </div>
  );
}
