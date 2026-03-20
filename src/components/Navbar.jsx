import { useState } from 'react';

export default function Navbar({ showLogin = false, user, onOpenAuth, onLogout }) {
  const [dropOpen, setDropOpen] = useState(false);
  const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      height: 52,
      display: 'flex', alignItems: 'center',
      padding: '0 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '1.5px solid var(--text-d)'
        }} />
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>SCI·VISION</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', gap: 40, marginRight: 32 }}>
        {['产品','案例','定价','关于'].map(item => (
          <a key={item} href="#" style={{ fontSize: 13, color: 'var(--text-l)', textDecoration: 'none' }}>{item}</a>
        ))}
      </div>

      {/* 未登录 */}
      {showLogin && !user && (
        <button
          onClick={onOpenAuth}
          style={{
            background: 'var(--sage)', color: '#fff',
            border: 'none', borderRadius: 14,
            padding: '7px 20px', fontSize: 12, fontWeight: 700,
          }}
        >登录 / 注册</button>
      )}

      {/* 已登录 */}
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--sage-bg)', border: '1px solid var(--border-s)',
              borderRadius: 14, padding: '6px 14px',
              fontSize: 13, fontWeight: 700, color: 'var(--sage)',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--sage)', color: '#fff',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            {displayName}
          </button>

          {dropOpen && (
            <>
              {/* 点外部关闭 */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setDropOpen(false)}
              />
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 12, boxShadow: 'var(--shadow-lg)',
                minWidth: 140, zIndex: 99, overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-d)' }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-l)', marginTop: 2 }}>{user.email}</div>
                </div>
                <button
                  onClick={() => { setDropOpen(false); onLogout(); }}
                  style={{
                    width: '100%', padding: '10px 16px',
                    textAlign: 'left', fontSize: 13,
                    border: 'none', background: 'transparent',
                    color: 'var(--text-m)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-d)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-m)'; }}
                >退出登录</button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
