import { useState } from 'react';
import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

/* ═══════════════════════════════════════════════════════════════════
 *  模式选择 — 上传论文后的第一个决策点
 *  智能模式（Agent）vs 自定义模式（Manual 7步流程）
 * ═══════════════════════════════════════════════════════════════════ */

const MODES = [
  {
    key: 'agent',
    icon: '🤖',
    title: '智能模式',
    subtitle: '告诉 AI 你想要什么，一句话搞定',
    description: '上传论文后直接用自然语言描述需求，AI 自动分析论文、选择最佳方案、一键生成。适合不想做太多选择的你。',
    pros: ['一句话生成', '全程 AI 做决策', '最快 45 秒出结果'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#6C8CFF',
    time: '最快 45 秒',
  },
  {
    key: 'manual',
    icon: '🎛️',
    title: '自定义模式',
    subtitle: '一步步精细配置，完全掌控每个细节',
    description: '逐步选择生成物料、配置参数、挑选风格方案。适合对输出质量有精确要求、想要完全掌控的你。',
    pros: ['精细控制每个参数', '逐步预览和调整', '适合专业用户'],
    gradient: 'linear-gradient(135deg, var(--sage-bg) 0%, var(--dust-bg) 100%)',
    accentColor: 'var(--sage)',
    time: '3-8 分钟',
  },
];

export default function ModeSelect({
  onSelectAgent,
  onSelectManual,
  user, onOpenAuth, onLogout, onNavLibrary,
  projectName, onProjectNameChange,
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar
        user={user} onOpenAuth={onOpenAuth} onLogout={onLogout}
        onNavLibrary={onNavLibrary} projectName={projectName}
        onProjectNameChange={onProjectNameChange}
      />
      <StepBar active={0} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>论文已就绪，接下来你想怎么做？</h2>
          <p style={{ fontSize: 14, color: 'var(--text-l)', lineHeight: 1.6 }}>
            选择适合你的工作方式 —— 你随时可以在两种模式之间切换
          </p>
        </div>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {MODES.map((mode) => {
            const isHovered = hovered === mode.key;
            const isAgent = mode.key === 'agent';
            return (
              <div
                key={mode.key}
                onClick={() => isAgent ? onSelectAgent() : onSelectManual()}
                onMouseEnter={() => setHovered(mode.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${isHovered ? mode.accentColor : 'var(--border)'}`,
                  background: 'var(--card)',
                  boxShadow: isHovered ? '0 8px 32px rgba(0,0,0,0.12)' : 'var(--shadow)',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(.16,1,.3,1)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {/* Top visual area */}
                <div style={{
                  height: 160, background: mode.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <span style={{ fontSize: 56, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{mode.icon}</span>
                  {isAgent && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '4px 10px', borderRadius: 8,
                      background: 'rgba(108,140,255,0.25)', backdropFilter: 'blur(8px)',
                      fontSize: 10, fontWeight: 700, color: '#B8CCFF',
                      border: '1px solid rgba(108,140,255,0.3)',
                    }}>✦ 推荐</div>
                  )}
                  {/* Animated particles for agent mode */}
                  {isAgent && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                      {[...Array(6)].map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          width: 3, height: 3, borderRadius: '50%',
                          background: 'rgba(108,140,255,0.5)',
                          left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`,
                          animation: `float${i % 3} ${2 + i * 0.3}s ease-in-out infinite`,
                        }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{mode.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-m)', marginBottom: 12 }}>{mode.subtitle}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-l)', lineHeight: 1.7, marginBottom: 16 }}>{mode.description}</div>

                  {/* Pros */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {mode.pros.map((pro, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-m)' }}>
                        <span style={{
                          width: 16, height: 16, borderRadius: '50%',
                          background: isAgent ? 'rgba(108,140,255,0.12)' : 'var(--sage-bg)',
                          color: isAgent ? '#6C8CFF' : 'var(--sage)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, fontWeight: 700, flexShrink: 0,
                        }}>✓</span>
                        {pro}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    {/* Time estimate */}
                    <div style={{
                      padding: '8px 12px', borderRadius: 10,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      fontSize: 11, color: 'var(--text-l)', textAlign: 'center',
                      marginBottom: 12,
                    }}>
                      ⏱ 预计耗时：{mode.time}
                    </div>

                    {/* CTA button */}
                    <button
                      style={{
                        width: '100%', padding: '13px', borderRadius: 12,
                        border: 'none',
                        background: isAgent
                          ? 'linear-gradient(135deg, #4A6CF7 0%, #6C8CFF 100%)'
                          : 'var(--sage)',
                        color: '#fff', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: isAgent
                          ? '0 4px 16px rgba(74,108,247,0.3)'
                          : '0 4px 16px rgba(100,140,108,0.2)',
                      }}
                    >
                      {isAgent ? '🤖 开始智能模式' : '🎛️ 进入自定义模式'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes float0 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes float1 { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-8px) translateX(6px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
      `}</style>
    </div>
  );
}
