import { useState, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Config from './pages/Config';
import Pipeline from './pages/Pipeline';
import Delivery from './pages/Delivery';
import Library from './pages/Library';
import AuthModal from './components/AuthModal';
import './index.css';

// Demo projects data
const DEMO_PROJECTS = [
  {
    id: 'proj_001',
    name: '高效神经网络剪枝：基于梯度的结构化优化',
    venue: 'NeurIPS 2024',
    createdAt: '2026-03-22',
    status: 'completed',
    thumbnail: 'linear-gradient(135deg, #A8B5A2 0%, #8FA888 100%)',
    assets: { video:true, pptx:true, poster:true, pdf:true },
    duration: '2:00',
    slides: 10,
  },
  {
    id: 'proj_002',
    name: '蛋白质折叠预测中的注意力机制改进',
    venue: 'ICML 2024',
    createdAt: '2026-03-18',
    status: 'completed',
    thumbnail: 'linear-gradient(135deg, #9AABBF 0%, #7A94A8 100%)',
    assets: { video:true, pptx:true, poster:false, pdf:true },
    duration: '3:00',
    slides: 15,
  },
  {
    id: 'proj_003',
    name: '量子纠错码的拓扑优化方法',
    venue: 'Physical Review Letters',
    createdAt: '2026-03-15',
    status: 'generating',
    thumbnail: 'linear-gradient(135deg, #B5A8B5 0%, #9A8A9A 100%)',
    assets: { video:false, pptx:false, poster:false, pdf:true },
    duration: null,
    slides: 8,
  },
  {
    id: 'proj_004',
    name: '气候模型中的深度学习降尺度技术',
    venue: 'Nature Climate Change',
    createdAt: '2026-03-10',
    status: 'draft',
    thumbnail: 'linear-gradient(135deg, #B5BFA8 0%, #9AA88A 100%)',
    assets: { video:false, pptx:false, poster:false, pdf:false },
    duration: null,
    slides: 0,
  },
];

export default function App() {
  const [view, setView] = useState('workflow'); // 'workflow' | 'library'
  const [step, setStep] = useState(0);
  const [animIn, setAnimIn] = useState(true);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const busyRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const goTo = (newStep) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimIn(false);
    setTimeout(() => {
      setStep(newStep);
      setView('workflow');
      setAnimIn(true);
      setTimeout(() => { busyRef.current = false; }, 700);
    }, 400);
  };

  const switchView = (newView) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimIn(false);
    setTimeout(() => {
      setView(newView);
      setAnimIn(true);
      setTimeout(() => { busyRef.current = false; }, 700);
    }, 400);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleRenameProject = (id, newName) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleOpenProject = (id) => {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      setCurrentProjectName(proj.name);
      setStep(4); // Go to Delivery
      setView('workflow');
      // Animate
      if (!busyRef.current) {
        busyRef.current = true;
        setAnimIn(false);
        setTimeout(() => {
          setAnimIn(true);
          setTimeout(() => { busyRef.current = false; }, 700);
        }, 400);
      }
    }
  };

  const handleNewProject = () => {
    setCurrentProjectName('');
    switchView('workflow');
    setTimeout(() => setStep(0), 50);
  };

  // When moving from Analysis to Config, set project name from paper title
  const handleAnalysisNext = () => {
    if (!currentProjectName) {
      setCurrentProjectName('Efficient Neural Network Pruning via Gradient-Based Structural Optimization');
    }
    goTo(2);
  };

  const authProps = {
    user,
    onOpenAuth: () => setAuthOpen(true),
    onLogout: handleLogout,
  };

  const navProps = {
    ...authProps,
    onNavLibrary: () => switchView('library'),
    projectName: view === 'workflow' && step > 0 ? currentProjectName : undefined,
    onProjectNameChange: (name) => setCurrentProjectName(name),
  };

  return (
    <>
      <div style={{
        animation: animIn
          ? 'pageEnter .7s cubic-bezier(.16,1,.3,1) both'
          : 'pageExit .4s cubic-bezier(.4,0,1,1) both',
        willChange: 'opacity, transform',
      }}>
        {view === 'library' && (
          <Library
            projects={projects}
            onRenameProject={handleRenameProject}
            onOpenProject={handleOpenProject}
            onNewProject={handleNewProject}
            onNavLibrary={() => switchView('library')}
            {...authProps}
          />
        )}
        {view === 'workflow' && (
          <>
            {step === 0 && <Upload   onNext={() => goTo(1)} {...navProps} />}
            {step === 1 && <Analysis onNext={handleAnalysisNext} {...navProps} />}
            {step === 2 && <Config   onNext={() => goTo(3)} {...navProps} />}
            {step === 3 && <Pipeline onNext={() => goTo(4)} {...navProps} />}
            {step === 4 && <Delivery onReset={() => switchView('library')} {...navProps} />}
          </>
        )}
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}

      <style>{`
        @keyframes pageEnter {
          from { opacity:0; transform:translateY(18px) scale(.987); filter:blur(2px); }
          to   { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
        }
        @keyframes pageExit {
          from { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
          to   { opacity:0; transform:translateY(-12px) scale(.993); filter:blur(1px); }
        }
      `}</style>
    </>
  );
}
