import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import SciBgIcons from '../components/SciBgIcons';

export default function Upload({ onNext }) {
  const [tab, setTab] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  const tabs = ['📄  PDF 上传', '🔗  arXiv 链接', '#  DOI 号'];
  const placeholders = ['将 PDF 文件拖拽到此处', 'arxiv.org/abs/2301.xxxxx', '10.1038/s41586-000-0000-0'];

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <SciBgIcons />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar showLogin />

        {/* 上段：Badge + 标题 */}
        <div style={{ textAlign: 'center', paddingTop: 32 }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--sage-bg)', border: '1px solid var(--border-s)',
            borderRadius: 16, padding: '7px 20px',
            fontSize: 12, color: 'var(--sage)', marginBottom: 20,
          }}>✦&nbsp;&nbsp;AI 科研视频生成平台 — 仅需上传论文</div>

          <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: 8 }}>
            把论文
          </h1>
          <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
            变成&nbsp;<span style={{ color: 'var(--sage)' }}>科研短视频</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-m)', marginBottom: 32 }}>
            上传 PDF · 粘贴 arXiv 链接 · 输入 DOI，AI 自动生成科研短视频
          </p>
        </div>

        {/* 中段：智能输入框 */}
        <div style={{
          margin: '0 auto', width: 880,
          background: 'var(--card)',
          borderRadius: 20,
          border: `2px solid var(--border-s)`,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}>
          {/* Tab 切换 */}
          <div style={{ display: 'flex', gap: 8, padding: '16px 20px 0' }}>
            {tabs.map((t, i) => (
              <button key={i} onClick={() => setTab(i)} style={{
                padding: '8px 16px', borderRadius: 12, fontSize: 13,
                border: `1px solid ${tab===i ? 'var(--border-s)' : 'var(--border)'}`,
                background: tab===i ? 'var(--sage-bg)' : 'var(--bg)',
                color: tab===i ? 'var(--sage)' : 'var(--text-l)',
                fontWeight: tab===i ? 700 : 400,
                fontFamily: 'inherit',
                transition: 'all .2s',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 20px 0' }}/>

          {/* 内容区 */}
          {tab === 0 ? (
            // PDF 拖拽区
            <div
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={handleDrop}
              style={{
                margin: 20, borderRadius: 12, minHeight: 200,
                border: `1.5px dashed ${dragging ? 'var(--sage)' : selectedFile ? 'var(--sage)' : 'var(--border-s)'}`,
                background: dragging ? 'var(--sage-bg)' : selectedFile ? 'var(--sage-bg)' : 'transparent',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
                padding: '32px 20px',
                transition: 'all .2s',
              }}
            >
              {selectedFile ? (
                // 已选文件状态
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:16,
                    background:'var(--card)', borderRadius:12, padding:'16px 24px',
                    border:'1px solid var(--border-s)', boxShadow:'var(--shadow)',
                  }}>
                    {/* PDF 图标 */}
                    <div style={{
                      width:44, height:54, borderRadius:6,
                      border:'1.5px solid var(--border-s)',
                      background:'#fff', position:'relative',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                    }}>
                      <div style={{
                        position:'absolute', top:0, right:0, width:14, height:14,
                        background:'#fff', borderLeft:'1.5px solid var(--border-s)',
                        borderBottom:'1.5px solid var(--border-s)', borderRadius:'0 0 0 4px',
                      }}/>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--sage)', marginTop:6 }}>PDF</span>
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:'var(--text-d)', marginBottom:4, maxWidth:420,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize:12, color:'var(--text-l)' }}>{formatSize(selectedFile.size)}</div>
                    </div>
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background:'var(--green-ok)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:14, color:'#fff', flexShrink:0,
                    }}>✓</div>
                  </div>
                  <button onClick={()=>setSelectedFile(null)} style={{
                    padding:'6px 16px', borderRadius:10, fontSize:12,
                    border:'1px solid var(--border)', background:'var(--bg)',
                    color:'var(--text-l)', fontFamily:'inherit', cursor:'pointer',
                  }}>重新选择</button>
                </>
              ) : (
                // 未选状态
                <>
                  <div style={{
                    width: 48, height: 60, borderRadius: 6,
                    border: '1.5px solid var(--border-s)',
                    background: 'var(--bg)', position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      position:'absolute', top:0, right:0, width:16, height:16,
                      background: 'var(--bg)',
                      borderLeft: '1.5px solid var(--border-s)',
                      borderBottom: '1.5px solid var(--border-s)',
                      borderRadius: '0 0 0 4px',
                    }}/>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sage)', marginTop: 8 }}>PDF</span>
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-d)' }}>将 PDF 文件拖拽到此处</p>
                  <p style={{ fontSize: 13, color: 'var(--text-l)' }}>或</p>
                  <button onClick={()=>fileRef.current.click()} style={{
                    padding: '10px 24px', borderRadius: 12, fontSize: 14,
                    border: '1px solid var(--border-s)',
                    background: 'var(--bg)', color: 'var(--sage)',
                    fontFamily: 'inherit', fontWeight: 700,
                  }}>点击选择文件</button>
                </>
              )}
              <input ref={fileRef} type="file" accept=".pdf" style={{display:'none'}}
                onChange={e=>{ if(e.target.files[0]) setSelectedFile(e.target.files[0]); }}/>
            </div>
          ) : (
            // arXiv / DOI 输入
            <div style={{ padding: '20px' }}>
              <input
                value={input} onChange={e=>setInput(e.target.value)}
                placeholder={placeholders[tab]}
                style={{
                  width: '100%', padding: '14px 18px',
                  fontSize: 14, borderRadius: 12,
                  border: '1.5px solid var(--border-s)',
                  background: 'var(--bg)', color: 'var(--text-d)',
                  outline: 'none', fontFamily: 'inherit',
                  minHeight: 200, resize: 'none',
                }}
              />
            </div>
          )}

          {/* 开始分析按钮 */}
          <div style={{ padding: '0 20px 20px' }}>
            <button onClick={onNext} style={{
              width: '100%', padding: '15px',
              background: 'var(--text-d)', color: '#fff',
              border: 'none', borderRadius: 13,
              fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              transition: 'opacity .2s',
            }}>开始分析  →</button>
          </div>
        </div>

        {/* 下段：数字 + 标签 */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ height: 1, background: 'var(--border)', width: 600, margin: '0 auto 28px' }}/>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 120, marginBottom: 28 }}>
            {[['500+','科研视频完成'],['50+','合作高校与科研机构'],['98%','客户满意度']].map(([n,l])=>(
              <div key={n}>
                <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--sage)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-m)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', maxWidth: 860, margin: '0 auto 16px' }}>
            <span style={{ fontSize: 12, color: 'var(--sage)', fontWeight: 600, whiteSpace: 'nowrap', marginRight: 4 }}>点击标签查看演示</span>
            {['神经网络','蛋白质折叠','量子计算','材料科学','流体力学','气候模拟','合成生物学'].map(tag=>(
              <span key={tag} onClick={onNext} style={{
                padding: '5px 14px', borderRadius: 14,
                border: '1px solid var(--border)', background: 'var(--card)',
                fontSize: 12, color: 'var(--text-m)',
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--sage)';e.currentTarget.style.color='var(--sage)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-m)';}}
              >{tag}</span>
            ))}
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-l)', paddingBottom: 24 }}>
            © 2025 天与视界（深圳）科技有限公司 · Tianyu Vision Technology
          </p>
        </div>
      </div>
    </div>
  );
}
