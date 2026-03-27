export default function StepBar({ active = 0, onGoToStep, maxReached = active, canGoToStep }) {
  const steps = ['上传论文','分析确认','选择物料','配置参数','生成中','创意工坊','完成'];
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '18px 0 0', gap: 0 }}>
      {steps.map((step, i) => {
        const act  = i === active;
        const reached = i <= maxReached;
        const done = reached && !act;
        const accent = i === 5 ? 'var(--lav)' : 'var(--sage)';
        const allowedByRule = typeof canGoToStep === 'function' ? canGoToStep(i, active) : (done && i !== 4);
        const clickable = allowedByRule && onGoToStep;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={clickable ? () => onGoToStep(i) : undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', width: 72,
                cursor: clickable ? 'pointer' : 'default',
              }}
              title={clickable ? `返回「${step}」` : undefined}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done || act ? accent : 'transparent',
                border: `1.5px solid ${done || act ? accent : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: done || act ? '#fff' : 'var(--text-l)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                transform: clickable ? undefined : undefined,
              }}
              onMouseEnter={e => { if (clickable) { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; } }}
              onMouseLeave={e => { if (clickable) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; } }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 10, marginTop: 5,
                color: act ? 'var(--text-d)' : clickable ? 'var(--sage)' : 'var(--text-l)',
                fontWeight: act ? 700 : 400,
                textDecoration: clickable ? 'underline' : 'none',
                textDecorationColor: clickable ? 'var(--sage)' : undefined,
                textUnderlineOffset: 2,
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 40, height: 1.5, marginTop: -14,
                background: i < maxReached ? 'var(--sage)' : 'var(--border)'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
