import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
/* ═══════════════════════════════════════════════════════════════════
 *  Agent 智能模式 — 对话式生成
 *  用户用自然语言描述需求，AI 自动解析意图并生成
 * ═══════════════════════════════════════════════════════════════════ */

// Mock paper analysis (auto-generated from upload)
const PAPER_INFO = {
  title: 'Efficient Neural Network Pruning via Gradient-Based Structural Optimization',
  authors: 'Zhang Wei, Li Ming · Tsinghua University · 2024',
  venue: 'NeurIPS 2024',
  field: '计算机视觉 · 模型压缩 · 深度学习',
  summary: '提出基于梯度的结构化剪枝方法（GBSP），在 ResNet-50 上实现 3× 参数压缩，精度仅损失 0.5%。',
};

// Intent detection mock results
const INTENT_RESPONSES = [
  {
    triggers: ['海报', '封面', 'poster', 'cover'],
    material: 'poster',
    response: (userMsg) => {
      const journal = userMsg.match(/nature|cell|science/i)?.[0] || 'Nature';
      return {
        thinking: `正在分析您的需求...\n\n✅ 物料类型：期刊封面海报\n✅ 目标期刊：${journal}\n✅ 论文主题：神经网络剪枝\n\n让我为您生成创意方案...`,
        generating: `🎨 正在生成中...\n\n1/4 分析论文视觉元素\n2/4 生成创意构思\n3/4 AI 绘制封面图\n4/4 期刊排版中`,
        done: `✅ 海报已生成完成！\n\n我为您生成了 ${journal} 风格的期刊封面海报，包含三种版式：\n• A3 竖版\n• 16:9 横版\n• 1:1 方形\n\n创意方向：以「石刻基因修复」为视觉隐喻，展现神经网络结构化剪枝的精确性。`,
        preview: {
          type: 'poster',
          images: [
            '/demo-samples/llm-agents-poster-a3-portrait.png',
            '/demo-samples/llm-agents-poster.png',
            '/demo-samples/llm-agents-poster-square.png',
          ],
          labels: ['A3 竖版', '16:9 横版', '1:1 方形'],
        },
      };
    },
  },
  {
    triggers: ['PPT', 'ppt', '幻灯片', '演示', '汇报', '答辩', '演讲'],
    material: 'ppt',
    response: (userMsg) => {
      const pages = userMsg.match(/(\d+)\s*页/)?.[1] || '8';
      const scene = userMsg.match(/答辩|汇报|演讲|路演/) ?
        (userMsg.match(/答辩/) ? '毕业答辩' : userMsg.match(/汇报/) ? '课题汇报' : '科普演讲') : '科普演讲';
      return {
        thinking: `正在分析您的需求...\n\n✅ 物料类型：科研 PPT\n✅ 场景：${scene}\n✅ 页数：${pages} 页\n�n让我开始生成...`,
        generating: `📊 正在生成 PPT...\n\n1/4 分析论文内容\n2/4 规划大纲结构\n3/4 生成第 3/${pages} 页配图...\n4/4 排版渲染中`,
        done: `✅ PPT 已生成完成！\n\n为您生成了 ${pages} 页「${scene}」风格的科研 PPT：\n• 16:9 宽屏比例\n• 英文内容\n• 含 AI 概念配图\n\n可直接下载 PPTX 文件在 PowerPoint 中编辑。`,
        preview: {
          type: 'ppt',
          images: Array.from({ length: Math.min(Number(pages), 12) }, (_, i) =>
            `/demo-samples/ppt-thumbs/slide-${String(i + 1).padStart(2, '0')}.png`
          ),
        },
      };
    },
  },
  {
    triggers: ['视频', 'video', '动画'],
    material: 'video',
    response: () => ({
      thinking: '正在分析您的需求...\n\n✅ 物料类型：科研视频\n✅ 时长：2 分钟\n✅ 风格：Houdini 渲染 + Morandi 配色\n\n让我开始生成...',
      generating: '🎬 正在生成视频...\n\n1/6 生成分镜脚本\n2/6 审校剧本\n3/6 生成视觉资产\n4/6 合成语音\n5/6 配乐\n6/6 视频合成中',
      done: '✅ 视频已生成完成！\n\n为您生成了 2 分钟的科研解说视频：\n• 1080p MP4 格式\n• Houdini 3D 渲染风格\n• 中文普通话解说\n\n可在下方预览或直接下载。',
      preview: {
        type: 'video',
        url: '/demo-samples/llm-agents-video-demo.mp4',
      },
    }),
  },
  {
    triggers: ['都要', '全部', '全做', '全套', '所有'],
    material: 'all',
    response: () => ({
      thinking: '正在分析您的需求...\n\n✅ 全套物料：视频 + 海报 + PPT\n✅ 视频：2 分钟科普解说\n✅ 海报：Nature 风格\n✅ PPT：8 页科普演讲\n\n让我依次生成...',
      generating: '🚀 正在生成全套物料...\n\n📊 PPT (1/3)... 完成\n🎨 海报 (2/3)... 生成中\n🎬 视频 (3/3)... 等待中',
      done: '✅ 全套物料已生成完成！\n\n为您生成了：\n🎬 2 分钟科研视频（1080p）\n🎨 Nature 风格封面海报（3 种版式）\n📊 8 页科普演讲 PPT\n\n全部可在结果页预览和下载。',
      preview: { type: 'all' },
    }),
  },
];

// Default fallback
const DEFAULT_RESPONSE = {
  thinking: '让我理解一下您的需求...',
  generating: null,
  done: '我可以为您生成以下物料：\n\n🎬 **科研视频** — 2-5 分钟动画解说\n🎨 **期刊封面海报** — Nature/Cell/Science 风格\n📊 **科研 PPT** — 演讲/汇报/答辩\n\n请告诉我您想要什么，例如：\n• "帮我做一个 Nature 风格的封面海报"\n• "做 8 页的课题汇报 PPT"\n• "全部都要"',
  preview: null,
};

function detectIntent(userMsg) {
  const lower = userMsg.toLowerCase();
  for (const intent of INTENT_RESPONSES) {
    if (intent.triggers.some(t => lower.includes(t.toLowerCase()))) {
      return intent.response(userMsg);
    }
  }
  return DEFAULT_RESPONSE;
}

/* ── 消息气泡 ── */
function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      <div style={{
        maxWidth: '80%', padding: '12px 16px', borderRadius: 14,
        background: isUser ? 'var(--sage)' : 'var(--card)',
        color: isUser ? '#fff' : 'var(--text-d)',
        border: isUser ? 'none' : '1px solid var(--border)',
        boxShadow: isUser ? '0 2px 8px rgba(100,140,108,0.2)' : 'var(--shadow)',
        fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap',
      }}>
        {!isUser && <div style={{ fontSize: 10, color: 'var(--text-l)', marginBottom: 4, fontWeight: 700 }}>SCI-VISION AI</div>}
        {msg.content}
        {msg.typing && (
          <span style={{ display: 'inline-block', animation: 'blink 1s ease infinite' }}> ●</span>
        )}
      </div>
    </div>
  );
}

/* ── 预览卡片 ── */
function PreviewCard({ preview, onGoToDelivery }) {
  const [activeImg, setActiveImg] = useState(0);

  if (!preview) return null;

  if (preview.type === 'poster') {
    return (
      <div style={{
        margin: '8px 0 12px', padding: '14px', borderRadius: 14,
        border: '1px solid var(--border)', background: 'var(--card)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🎨 海报预览</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {preview.images.map((img, i) => (
            <div key={i} onClick={() => setActiveImg(i)} style={{
              flex: 1, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
              border: i === activeImg ? '2px solid var(--lav)' : '1px solid var(--border)',
              transition: 'all 0.15s',
            }}>
              <img src={img} alt={preview.labels?.[i]} style={{ width: '100%', display: 'block' }} />
              <div style={{ fontSize: 9, textAlign: 'center', padding: '4px', color: 'var(--text-l)' }}>{preview.labels?.[i]}</div>
            </div>
          ))}
        </div>
        <button onClick={onGoToDelivery} style={{
          width: '100%', padding: '10px', borderRadius: 10,
          background: 'var(--sage)', border: 'none', color: '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>查看完整结果并下载 →</button>
      </div>
    );
  }

  if (preview.type === 'ppt') {
    return (
      <div style={{
        margin: '8px 0 12px', padding: '14px', borderRadius: 14,
        border: '1px solid var(--border)', background: 'var(--card)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>📊 PPT 预览</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
          {preview.images.map((img, i) => (
            <div key={i} style={{
              flex: '0 0 120px', borderRadius: 8, overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <img src={img} alt={`Slide ${i + 1}`} style={{ width: '100%', display: 'block' }} />
            </div>
          ))}
        </div>
        <button onClick={onGoToDelivery} style={{
          width: '100%', padding: '10px', borderRadius: 10, marginTop: 8,
          background: 'var(--dust)', border: 'none', color: '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>查看完整结果并下载 →</button>
      </div>
    );
  }

  if (preview.type === 'video') {
    return (
      <div style={{
        margin: '8px 0 12px', padding: '14px', borderRadius: 14,
        border: '1px solid var(--border)', background: 'var(--card)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🎬 视频预览</div>
        <video src={preview.url} controls muted style={{
          width: '100%', borderRadius: 10, border: '1px solid var(--border)',
        }} />
        <button onClick={onGoToDelivery} style={{
          width: '100%', padding: '10px', borderRadius: 10, marginTop: 8,
          background: 'var(--sage)', border: 'none', color: '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>查看完整结果并下载 →</button>
      </div>
    );
  }

  // type === 'all'
  return (
    <div style={{
      margin: '8px 0 12px', padding: '14px', borderRadius: 14,
      border: '1px solid var(--border)', background: 'var(--card)',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🚀 全套物料已就绪</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { icon: '🎬', label: '视频', color: 'var(--sage)' },
          { icon: '🎨', label: '海报', color: 'var(--lav)' },
          { icon: '📊', label: 'PPT', color: 'var(--dust)' },
        ].map((item) => (
          <div key={item.label} style={{
            flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center',
            background: 'var(--bg)', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label} ✓</div>
          </div>
        ))}
      </div>
      <button onClick={onGoToDelivery} style={{
        width: '100%', padding: '10px', borderRadius: 10,
        background: 'linear-gradient(135deg, #4A6CF7 0%, #6C8CFF 100%)',
        border: 'none', color: '#fff',
        fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      }}>查看全部结果并下载 →</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
 *  Quick suggestion chips
 * ══════════════════════════════════════════════════ */
const SUGGESTIONS = [
  '帮我做一个 Nature 风格的封面海报',
  '做 8 页的课题汇报 PPT',
  '生成 2 分钟科普视频',
  '全部都要，你看着办',
];

/* ══════════════════════════════════════════════════
 *  主容器
 * ══════════════════════════════════════════════════ */
export default function AgentChat({
  onGoToDelivery,
  onSwitchToManual,
  user, onOpenAuth, onLogout, onNavLibrary,
  projectName, onProjectNameChange,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'ai', content:
`你好！我已经分析完你的论文了 📄

**${PAPER_INFO.title}**
${PAPER_INFO.venue} · ${PAPER_INFO.field}

我可以为你生成：
🎬 科研视频 · 🎨 期刊封面海报 · 📊 科研 PPT

直接告诉我你想要什么，一句话就够了 👇`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || isProcessing) return;

    setInput('');
    setShowSuggestions(false);
    setIsProcessing(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    const intent = detectIntent(userMsg);

    // Phase 1: thinking (500ms delay)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: intent.thinking, typing: true }]);

      // Phase 2: generating (2s delay)
      if (intent.generating) {
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'ai', content: intent.generating, typing: true };
            return updated;
          });

          // Phase 3: done (3s delay)
          setTimeout(() => {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'ai',
                content: intent.done,
                preview: intent.preview,
              };
              return updated;
            });
            setIsProcessing(false);
          }, 3000);
        }, 2000);
      } else {
        // No generation phase, just show final response
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'ai',
              content: intent.done,
              preview: intent.preview,
            };
            return updated;
          });
          setIsProcessing(false);
        }, 1500);
      }
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user} onOpenAuth={onOpenAuth} onLogout={onLogout}
        onNavLibrary={onNavLibrary} projectName={projectName}
        onProjectNameChange={onProjectNameChange}
      />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 0, maxWidth: 1200, margin: '0 auto', width: '100%', minHeight: 0 }}>
        {/* Left: Paper info panel */}
        <div style={{
          padding: '16px', borderRight: '1px solid var(--border)',
          background: 'var(--card)', overflow: 'auto',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'var(--text-m)' }}>📄 论文分析</div>

          <div style={{ fontSize: 9, color: 'var(--text-l)', marginBottom: 3 }}>TITLE</div>
          <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.5, marginBottom: 10 }}>{PAPER_INFO.title}</div>

          <div style={{ fontSize: 9, color: 'var(--text-l)', marginBottom: 3 }}>AUTHORS</div>
          <div style={{ fontSize: 11, color: 'var(--text-m)', marginBottom: 10 }}>{PAPER_INFO.authors}</div>

          <div style={{ fontSize: 9, color: 'var(--text-l)', marginBottom: 3 }}>VENUE</div>
          <div style={{ fontSize: 11, color: 'var(--sage)', marginBottom: 10 }}>{PAPER_INFO.venue}</div>

          <div style={{ fontSize: 9, color: 'var(--text-l)', marginBottom: 3 }}>FIELD</div>
          <div style={{ fontSize: 11, color: 'var(--text-m)', marginBottom: 14 }}>{PAPER_INFO.field}</div>

          <div style={{
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontSize: 11, color: 'var(--text-m)', lineHeight: 1.6,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sage)', marginBottom: 4 }}>摘要</div>
            {PAPER_INFO.summary}
          </div>

          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <button onClick={onSwitchToManual} style={{
              width: '100%', padding: '9px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 11, fontWeight: 600, color: 'var(--text-l)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>🎛️ 切换到自定义模式</button>
          </div>
        </div>

        {/* Right: Chat area */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Chat header */}
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid var(--border)',
            background: 'var(--card)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.4)',
              }} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>🤖 智能模式</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-l)' }}>AI 助手在线</span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflow: 'auto', padding: '16px 20px',
            display: 'flex', flexDirection: 'column',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <ChatMessage msg={msg} />
                {msg.preview && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ maxWidth: '80%' }}>
                      <PreviewCard preview={msg.preview} onGoToDelivery={onGoToDelivery} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          {showSuggestions && (
            <div style={{
              padding: '0 20px 8px', display: 'flex', flexWrap: 'wrap', gap: 6,
            }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)} style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: '1px solid var(--border)', background: 'var(--card)',
                  fontSize: 11, color: 'var(--text-m)', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C8CFF'; e.currentTarget.style.color = '#6C8CFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-m)'; }}
                >{s}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--border)',
            background: 'var(--card)', display: 'flex', gap: 10,
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isProcessing ? 'AI 正在生成中...' : '告诉 AI 你想要什么...'}
              disabled={isProcessing}
              style={{
                flex: 1, padding: '11px 16px', borderRadius: 12,
                border: '1.5px solid var(--border)', background: 'var(--bg)',
                fontSize: 13, fontFamily: 'inherit', color: 'var(--text-d)',
                outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#6C8CFF'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isProcessing}
              style={{
                width: 42, height: 42, borderRadius: 12, border: 'none',
                background: input.trim() && !isProcessing
                  ? 'linear-gradient(135deg, #4A6CF7 0%, #6C8CFF 100%)'
                  : 'var(--bg2)',
                color: input.trim() && !isProcessing ? '#fff' : 'var(--text-l)',
                fontSize: 16, cursor: input.trim() && !isProcessing ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >↑</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
