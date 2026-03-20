import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState(0); // 0=登录 1=注册
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => { setError(''); setSuccess(''); };

  const handleLogin = async () => {
    reset(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(translateError(error.message)); return; }
    onClose();
  };

  const handleRegister = async () => {
    reset(); setLoading(true);
    if (!username.trim()) { setError('请输入用户名'); setLoading(false); return; }
    if (password.length < 6) { setError('密码至少 6 位'); setLoading(false); return; }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username: username.trim() } },
    });
    setLoading(false);
    if (error) { setError(translateError(error.message)); return; }
    if (data.session) {
      onClose();
    } else {
      setSuccess('注册成功！请查收验证邮件，点击链接后即可登录。');
    }
  };

  const translateError = (msg) => {
    if (msg.includes('Invalid login credentials')) return '邮箱或密码错误';
    if (msg.includes('Email not confirmed')) return '请先点击邮件中的验证链接';
    if (msg.includes('already registered') || msg.includes('already been registered')) return '该邮箱已注册，请直接登录';
    if (msg.includes('Password should be')) return '密码至少 6 位';
    if (msg.includes('Unable to validate email')) return '邮箱格式不正确';
    return msg;
  };

  const field = (label, value, onChange, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-m)', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => { if (e.key === 'Enter') tab === 0 ? handleLogin() : handleRegister(); }}
        style={{
          width: '100%', padding: '11px 14px',
          fontSize: 14, borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--bg)', color: 'var(--text-d)',
          outline: 'none', transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border-s)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(32,30,28,0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        width: 420, background: 'var(--card)',
        borderRadius: 20, border: '1px solid var(--border-s)',
        boxShadow: 'var(--shadow-lg)',
        padding: '32px 32px 28px',
        position: 'relative',
        animation: 'modalIn .35s cubic-bezier(.16,1,.3,1) both',
      }}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--text-l)',
            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Logo 小点 + 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--text-d)' }} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1 }}>SCI·VISION</span>
        </div>

        {/* Tab 切换 */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: 'var(--bg)', borderRadius: 12, padding: 4,
        }}>
          {['登录', '注册'].map((t, i) => (
            <button
              key={i}
              onClick={() => { setTab(i); reset(); }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 9,
                border: 'none', fontSize: 14, fontWeight: 700,
                background: tab === i ? 'var(--card)' : 'transparent',
                color: tab === i ? 'var(--text-d)' : 'var(--text-l)',
                boxShadow: tab === i ? 'var(--shadow)' : 'none',
                transition: 'all .2s',
              }}
            >{t}</button>
          ))}
        </div>

        {/* 表单 */}
        {tab === 1 && field('用户名', username, setUsername, 'text', '显示在页面右上角的名称')}
        {field('邮箱', email, setEmail, 'email', 'your@email.com')}
        {field('密码', password, setPassword, 'password', tab === 0 ? '' : '至少 6 位')}

        {/* 错误 / 成功提示 */}
        {error && (
          <div style={{
            marginBottom: 16, padding: '10px 14px', borderRadius: 10,
            background: '#FFF2F2', border: '1px solid #FFCDD2',
            fontSize: 13, color: '#C62828',
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            marginBottom: 16, padding: '10px 14px', borderRadius: 10,
            background: 'var(--sage-bg)', border: '1px solid var(--border-s)',
            fontSize: 13, color: 'var(--sage)',
          }}>{success}</div>
        )}

        {/* 主按钮 */}
        {!success && (
          <button
            onClick={tab === 0 ? handleLogin : handleRegister}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--text-l)' : 'var(--sage)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              transition: 'opacity .2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '处理中…' : tab === 0 ? '登录' : '创建账号'}
          </button>
        )}

        {/* 切换提示 */}
        {!success && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-l)', marginTop: 16 }}>
            {tab === 0 ? '还没有账号？' : '已有账号？'}
            <span
              onClick={() => { setTab(tab === 0 ? 1 : 0); reset(); }}
              style={{ color: 'var(--sage)', fontWeight: 700, cursor: 'pointer', marginLeft: 4 }}
            >
              {tab === 0 ? '立即注册' : '去登录'}
            </span>
          </p>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:translateY(12px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
