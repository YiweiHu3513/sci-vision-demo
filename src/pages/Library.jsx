import { useState } from 'react';
import Navbar from '../components/Navbar';
import EditableText from '../components/EditableText';

// 物料图标映射
const ASSET_ICONS = {
  video:  { icon:'▶', label:'视频' },
  pptx:   { icon:'■', label:'PPT' },
  poster: { icon:'◆', label:'海报' },
  pdf:    { icon:'≡', label:'脚本' },
};

const STATUS_MAP = {
  completed:  { label:'已完成', bg:'var(--sage-bg)', color:'var(--sage)', border:'var(--border-s)' },
  generating: { label:'生成中', bg:'#FFF8E1', color:'#B8860B', border:'#E8D5A0' },
  draft:      { label:'草稿',   bg:'var(--bg)', color:'var(--text-l)', border:'var(--border)' },
};

function ProjectCard({ project, onOpen, onRename }) {
  const st = STATUS_MAP[project.status] || STATUS_MAP.draft;

  return (
    <div
      onClick={() => project.status === 'completed' && onOpen(project.id)}
      style={{
        background:'var(--card)', borderRadius:14,
        border:'1px solid var(--border)',
        boxShadow:'var(--shadow)',
        overflow:'hidden', cursor: project.status === 'completed' ? 'pointer' : 'default',
        transition:'box-shadow .2s, transform .2s',
      }}
      onMouseEnter={e => {
        if (project.status === 'completed') {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height:140, background: project.thumbnail,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative',
      }}>
        {project.status === 'completed' && (
          <div style={{
            width:44, height:44, borderRadius:'50%',
            background:'rgba(255,255,255,0.85)', backdropFilter:'blur(4px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, color:'var(--sage)',
          }}>▶</div>
        )}
        {project.status === 'generating' && (
          <div style={{ fontSize:13, color:'#fff', fontWeight:600, textShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
            生成中...
          </div>
        )}
        {/* Status badge */}
        <div style={{
          position:'absolute', top:10, right:10,
          padding:'3px 10px', borderRadius:8, fontSize:10, fontWeight:600,
          background:st.bg, color:st.color, border:`1px solid ${st.border}`,
        }}>{st.label}</div>
      </div>

      {/* Info */}
      <div style={{ padding:'14px 16px' }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:6, lineHeight:1.4 }}
          onClick={e => e.stopPropagation()}
        >
          <EditableText
            value={project.name}
            onChange={(newName) => onRename(project.id, newName)}
            style={{ display:'block' }}
          />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{
            fontSize:10, padding:'2px 8px', borderRadius:6,
            background:'var(--sage-bg)', color:'var(--sage)',
            border:'1px solid var(--border-s)',
          }}>{project.venue}</span>
          <span style={{ fontSize:10, color:'var(--text-l)' }}>{project.createdAt}</span>
        </div>

        {/* Asset pills */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {Object.entries(project.assets).filter(([,v]) => v).map(([key]) => {
            const a = ASSET_ICONS[key];
            return a ? (
              <span key={key} style={{
                fontSize:10, padding:'3px 8px', borderRadius:6,
                background:'var(--bg)', border:'1px solid var(--border)',
                color:'var(--text-m)', display:'flex', alignItems:'center', gap:3,
              }}>
                <span style={{ fontSize:8 }}>{a.icon}</span> {a.label}
              </span>
            ) : null;
          })}
          {project.duration && (
            <span style={{
              fontSize:10, padding:'3px 8px', borderRadius:6,
              background:'var(--bg)', border:'1px solid var(--border)',
              color:'var(--text-l)',
            }}>{project.duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function NewProjectCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:'var(--card)', borderRadius:14,
        border:'2px dashed var(--border)',
        minHeight:220, cursor:'pointer',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:12,
        transition:'border-color .2s, background .2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--sage)';
        e.currentTarget.style.background = 'var(--sage-bg)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--card)';
      }}
    >
      <div style={{
        width:48, height:48, borderRadius:12,
        background:'var(--bg)', border:'1px solid var(--border)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:24, color:'var(--sage)', fontWeight:300,
      }}>+</div>
      <div style={{ fontSize:14, fontWeight:700, color:'var(--text-d)' }}>新建项目</div>
      <div style={{ fontSize:11, color:'var(--text-l)', textAlign:'center', lineHeight:1.5 }}>
        上传论文，AI 自动生成<br/>科研短视频
      </div>
    </div>
  );
}

export default function Library({ projects, onRenameProject, onOpenProject, onNewProject, user, onOpenAuth, onLogout, onNavLibrary }) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? projects.filter(p => p.name.includes(search) || p.venue.includes(search))
    : projects;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Navbar
        user={user} onOpenAuth={onOpenAuth} onLogout={onLogout}
        onNavLibrary={onNavLibrary} activeNav="项目库"
      />

      <div style={{ padding:'24px 32px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>项目库</h1>
            <p style={{ fontSize:13, color:'var(--text-l)' }}>
              共 {projects.length} 个项目 · 管理你的科研视频作品
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <input
              type="text"
              placeholder="搜索项目..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding:'8px 14px', fontSize:12, borderRadius:8,
                border:'1px solid var(--border)', background:'var(--card)',
                outline:'none', width:220, fontFamily:'inherit',
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
          gap:18,
        }}>
          <NewProjectCard onClick={onNewProject} />
          {filtered.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onOpen={onOpenProject}
              onRename={onRenameProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
