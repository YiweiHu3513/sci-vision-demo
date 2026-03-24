import Navbar from '../components/Navbar';
import StepBar from '../components/StepBar';

const SAMPLE_ASSETS = {
  video: {
    path: '/demo-samples/llm-agents-video.mp4',
    filename: 'The Rise and Potential of Large Language Model Based Agents【Video】..mp4',
    size: '337MB',
    meta: 'MP4 · H.264',
  },
  ppt: {
    path: '/demo-samples/llm-agents-deck.pptx',
    filename: 'The Rise and Potential of Large Language Model Based Agents【PPt】..pptx',
    size: '12MB',
    meta: 'PPTX · 演示文稿',
  },
  poster: {
    path: '/demo-samples/llm-agents-poster.png',
    filename: 'The Rise and Potential of Large Language Model Based Agents【Post】.png',
    size: '8.1MB',
    meta: 'PNG · A3 竖版',
  },
};

const exportItems = [
  {
    icon: '▶',
    label: '下载 MP4 视频',
    sub: `${SAMPLE_ASSETS.video.meta} · ${SAMPLE_ASSETS.video.size}`,
    color: 'var(--sage)',
    href: SAMPLE_ASSETS.video.path,
    download: SAMPLE_ASSETS.video.filename,
  },
  {
    icon: '▦',
    label: '下载 PPTX 幻灯片',
    sub: `${SAMPLE_ASSETS.ppt.meta} · ${SAMPLE_ASSETS.ppt.size}`,
    color: 'var(--dust)',
    href: SAMPLE_ASSETS.ppt.path,
    download: SAMPLE_ASSETS.ppt.filename,
  },
  {
    icon: '◈',
    label: '下载宣传海报',
    sub: `${SAMPLE_ASSETS.poster.meta} · ${SAMPLE_ASSETS.poster.size}`,
    color: '#ACA08A',
    href: SAMPLE_ASSETS.poster.path,
    download: SAMPLE_ASSETS.poster.filename,
  },
  {
    icon: '≡',
    label: '下载分镜脚本 PDF',
    sub: '暂未上传样本',
    color: 'var(--taupe)',
  },
  {
    icon: '⬡',
    label: '生成分享链接',
    sub: '暂未启用',
    color: 'var(--lav)',
  },
];

const stats = [
  ['处理时长', '18.3 秒'],
  ['生成图片', '10 张'],
  ['脚本段落', '10 段'],
  ['视频时长', '2:00'],
];

function ExportAction({ item }) {
  if (item.href) {
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

export default function Delivery({ onReset, user, onOpenAuth, onLogout, onNavLibrary, projectName, onProjectNameChange }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar user={user} onOpenAuth={onOpenAuth} onLogout={onLogout} onNavLibrary={onNavLibrary} projectName={projectName} onProjectNameChange={onProjectNameChange} />
      <StepBar active={4} />

      <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--sage)' }}>✦  视频生成完成</span>
      </div>

      <div style={{ display: 'flex', gap: 16, padding: '0 24px 16px', alignItems: 'stretch' }}>
        <div style={{ flex: '0 0 56%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              border: '1px solid #2A2826',
              background: '#0E0D0C',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                background: '#161412',
                borderBottom: '1px solid #2A2826',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 12, color: '#A8A4A0', fontWeight: 700 }}>样本视频预览</span>
              <a
                href={SAMPLE_ASSETS.video.path}
                download={SAMPLE_ASSETS.video.filename}
                style={{
                  fontSize: 11,
                  color: '#C5D4C8',
                  textDecoration: 'none',
                  border: '1px solid rgba(140,175,148,0.45)',
                  borderRadius: 8,
                  padding: '3px 10px',
                  fontWeight: 700,
                }}
              >
                下载视频
              </a>
            </div>
            <video
              controls
              preload="metadata"
              poster={SAMPLE_ASSETS.poster.path}
              style={{
                width: '100%',
                display: 'block',
                aspectRatio: '2.2 / 1',
                background: '#0E0D0C',
              }}
            >
              <source src={SAMPLE_ASSETS.video.path} type="video/mp4" />
              您的浏览器不支持 video 标签。
            </video>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                background: 'var(--card)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, borderBottom: '1px solid var(--border)' }}>
                海报样本预览
              </div>
              <div style={{ padding: 10 }}>
                <img
                  src={SAMPLE_ASSETS.poster.path}
                  alt="样本海报"
                  style={{
                    width: '100%',
                    height: 260,
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    display: 'block',
                    background: '#F0EEE8',
                  }}
                />
                <a
                  href={SAMPLE_ASSETS.poster.path}
                  download={SAMPLE_ASSETS.poster.filename}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '9px 12px',
                    borderRadius: 9,
                    border: '1px solid #ACA08A',
                    color: '#ACA08A',
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    background: 'var(--bg)',
                  }}
                >
                  下载海报（PNG）
                </a>
              </div>
            </div>

            <div
              style={{
                borderRadius: 12,
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                background: 'var(--card)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>PPT 样本文件</div>
                <div
                  style={{
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 8 }}>▦</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-d)', marginBottom: 4 }}>
                    The Rise and Potential of LLM Based Agents
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-m)' }}>{SAMPLE_ASSETS.ppt.meta}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-m)' }}>{SAMPLE_ASSETS.ppt.size}</div>
                </div>
              </div>
              <a
                href={SAMPLE_ASSETS.ppt.path}
                download={SAMPLE_ASSETS.ppt.filename}
                style={{
                  marginTop: 12,
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 12px',
                  borderRadius: 9,
                  border: '1px solid var(--dust)',
                  color: 'var(--dust)',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'var(--bg)',
                }}
              >
                下载 PPT（PPTX）
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: 'var(--card)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            borderTop: '2px solid var(--sage)',
            padding: '20px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>导出与分享</div>

          {exportItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--card2)',
                marginBottom: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: item.color,
                  borderRadius: '12px 0 0 12px',
                }}
              />
              <span style={{ fontSize: 20, color: item.color, marginLeft: 6 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-m)' }}>{item.sub}</div>
              </div>
              <ExportAction item={item} />
            </div>
          ))}

          <div style={{ margin: '16px 0 8px', fontSize: 11, color: 'var(--text-l)' }}>本次生成统计</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {stats.map(([k, v]) => (
              <div
                key={k}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--text-l)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button
              onClick={onNavLibrary}
              style={{
                flex:1,
                padding: '13px',
                background: 'var(--sage)',
                border: 'none',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              ← 回到项目库
            </button>
            <button
              onClick={onReset}
              style={{
                flex:1,
                padding: '13px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-m)',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              + 新建项目
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
