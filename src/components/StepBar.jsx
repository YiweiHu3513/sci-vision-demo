export default function StepBar({ active = 0 }) {
  const steps = ['上传论文','分析确认','配置参数','生成中','完成'];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18px 0 0', gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < active;
        const act  = i === active;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done || act ? 'var(--sage)' : 'transparent',
                border: `1.5px solid ${done || act ? 'var(--sage)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: done || act ? '#fff' : 'var(--text-l)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 11, marginTop: 6,
                color: act ? 'var(--text-d)' : 'var(--text-l)',
                fontWeight: act ? 700 : 400,
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 80, height: 1.5, marginTop: -14,
                background: done ? 'var(--sage)' : 'var(--border)'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
