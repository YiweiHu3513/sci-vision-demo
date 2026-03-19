export default function Navbar({ showLogin = false }) {
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
      {showLogin ? (
        <button style={{
          background: 'var(--sage)', color: '#fff',
          border: 'none', borderRadius: 14,
          padding: '7px 20px', fontSize: 12, fontWeight: 700
        }}>登录 / 注册</button>
      ) : (
        <span style={{ fontSize: 13, color: 'var(--text-m)' }}>一葳</span>
      )}
    </nav>
  );
}
