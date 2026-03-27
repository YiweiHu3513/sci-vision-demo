import { useState } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';
import PosterFlowInner from './PosterFlowInner';
import PPTFlowInner from './PPTFlowInner';

/* ═══════════════════════════════════════════════════════════════════
 *  创意工坊 — PPT + 海报 双标签页
 *
 *  设计逻辑：
 *  - 两个 tab 独立运行，互不影响
 *  - 每个 tab 完成后标记 ✓，不跳转
 *  - 至少一个完成 → 底部浮动"前往交付页"
 *  - 两个 tab 都用 display 切换，不卸载，保留状态
 * ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { key: 'poster', icon: '◈', label: '海报设计', color: 'var(--lav)' },
  { key: 'ppt', icon: '▦', label: 'PPT 设计', color: 'var(--dust)' },
];

export default function CreativeStudio({
  onNext,
  user, onOpenAuth, onLogout, onNavLibrary,
  projectName, onProjectNameChange,
}) {
  const [activeTab, setActiveTab] = useState('poster');
  const [posterDone, setPosterDone] = useState(false);
  const [pptDone, setPptDone] = useState(false);

  const anyDone = posterDone || pptDone;
  const allDone = posterDone && pptDone;

  // Summary text for the floating bar
  const getSummaryText = () => {
    if (allDone) return '海报和 PPT 都已完成';
    if (posterDone) return '海报已完成 · PPT 可稍后再做';
    if (pptDone) return 'PPT 已完成 · 海报可稍后再做';
    return '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: anyDone ? 80 : 0 }}>
      <Navbar
        user={user} onOpenAuth={onOpenAuth} onLogout={onLogout}
        onNavLibrary={onNavLibrary} projectName={projectName}
        onProjectNameChange={onProjectNameChange}
      />
      <StepBar active={4} />

      {/* Tab switcher */}
      <div style={{
        display: 'flex', justifyContent: 'center', padding: '10px 0 0',
      }}>
        <div style={{
          display: 'inline-flex', gap: 4, padding: '4px 5px',
          borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)',
          boxShadow: 'var(--shadow)',
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isDone = tab.key === 'poster' ? posterDone : pptDone;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  border: 'none', borderRadius: 9, padding: '7px 20px',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: isActive ? '#fff' : 'var(--text-m)',
                  background: isActive ? tab.color : 'transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
                {isDone && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 16, height: 16, borderRadius: '50%',
                    background: isActive ? 'rgba(255,255,255,0.3)' : 'var(--sage)',
                    color: '#fff', fontSize: 9, fontWeight: 700,
                    marginLeft: 2,
                  }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area — both always mounted, toggle visibility */}
      <div style={{ display: activeTab === 'poster' ? 'block' : 'none' }}>
        <PosterFlowInner
          onDone={() => setPosterDone(true)}
          isDone={posterDone}
          onSwitchToPPT={() => setActiveTab('ppt')}
        />
      </div>
      <div style={{ display: activeTab === 'ppt' ? 'block' : 'none' }}>
        <PPTFlowInner
          onDone={() => setPptDone(true)}
          isDone={pptDone}
          onSwitchToPoster={() => setActiveTab('poster')}
        />
      </div>

      {/* Floating bottom bar — appears when at least one module is done */}
      {anyDone && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'var(--card)', borderTop: '1px solid var(--border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          animation: 'slideUp 0.3s ease',
        }}>
          {/* Status badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusBadge label="海报" done={posterDone} color="var(--lav)" />
            <StatusBadge label="PPT" done={pptDone} color="var(--dust)" />
          </div>

          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

          {/* Summary text */}
          <span style={{ fontSize: 12, color: 'var(--text-l)' }}>{getSummaryText()}</span>

          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

          {/* Go to delivery button */}
          <button
            onClick={onNext}
            style={{
              padding: '10px 28px', borderRadius: 10,
              background: allDone ? 'var(--sage)' : 'var(--dust)',
              border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.2s',
            }}
          >
            前往交付页 →
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── 小组件：状态徽标 ── */
function StatusBadge({ label, done, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 8,
      background: done ? `${color}12` : 'var(--bg2)',
      border: `1px solid ${done ? color : 'var(--border)'}`,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, fontWeight: 700,
        background: done ? 'var(--sage)' : 'transparent',
        border: done ? 'none' : '1.5px solid var(--border)',
        color: done ? '#fff' : 'var(--text-l)',
      }}>{done ? '✓' : ''}</span>
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: done ? 'var(--text-d)' : 'var(--text-l)',
      }}>{label}</span>
    </div>
  );
}
