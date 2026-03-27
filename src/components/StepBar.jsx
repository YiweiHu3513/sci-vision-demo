export default function StepBar({ active = 0 }) {
  const steps = ['上传论文','分析确认','选择物料','配置参数','生成中','创意工坊','完成'];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18px 0 0', gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < active;
        const act  = i === active;
        // Color: 创意工坊 (index 5) uses lav, others use sage
        const accent = i === 5 ? 'var(--lav)' : 'var(--sage)';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 72 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done || act ? accent : 'transparent',
                border: `1.5px solid ${done || act ? accent : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: done || act ? '#fff' : 'var(--text-l)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 10, marginTop: 5,
                color: act ? 'var(--text-d)' : 'var(--text-l)',
                fontWeight: act ? 700 : 400,
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 40, height: 1.5, marginTop: -14,
                background: done ? 'var(--sage)' : 'var(--border)'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
