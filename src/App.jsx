import { useState, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Upload from './pages/Upload';
import ModeSelect from './pages/ModeSelect';
import AgentChat from './pages/AgentChat';
import Analysis from './pages/Analysis';
import MaterialSelect from './pages/MaterialSelect';
import Config from './pages/Config';
import Pipeline from './pages/Pipeline';
import CreativeStudio from './pages/CreativeStudio';
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

/*
 * Views & Steps:
 *
 *   view='workflow':
 *     0 = Upload
 *     1 = ModeSelect (choose Agent or Manual)
 *
 *   view='agent':
 *     AgentChat (full-screen chat, skips all manual steps)
 *
 *   view='workflow' (manual path):
 *     2 = Analysis
 *     3 = MaterialSelect
 *     4 = Config
 *     5 = Pipeline (skipped if no video)
 *     6 = CreativeStudio
 *     7 = Delivery
 *
 *   view='library':
 *     Library page
 */

export default function App() {
  const [view, setView] = useState('workflow'); // 'workflow' | 'agent' | 'library'
  const [step, setStep] = useState(0);
  const [animIn, setAnimIn] = useState(true);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [selectedOutputs, setSelectedOutputs] = useState({ video: true, poster: true, ppt: true });
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

  const goTo = (newStep, newView = 'workflow') => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimIn(false);
    setTimeout(() => {
      setStep(newStep);
      setView(newView);
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
      goTo(7); // Go to Delivery
    }
  };

  const handleNewProject = () => {
    setCurrentProjectName('');
    setSelectedOutputs({ video: true, poster: true, ppt: true });
    // Force reset — bypass busyRef to ensure it always works
    busyRef.current = false;
    setAnimIn(false);
    setTimeout(() => {
      setStep(0);
      setView('workflow');
      setAnimIn(true);
      setTimeout(() => { busyRef.current = false; }, 700);
    }, 300);
  };

  // Upload → ModeSelect
  const handleUploadNext = () => {
    if (!currentProjectName) {
      setCurrentProjectName('Efficient Neural Network Pruning via Gradient-Based Structural Optimization');
    }
    goTo(1);
  };

  // ModeSelect → Agent or Manual
  const handleSelectAgent = () => {
    goTo(0, 'agent');
  };
  const handleSelectManual = () => {
    goTo(2); // → Analysis
  };

  // Agent → Delivery (with all outputs selected)
  const handleAgentToDelivery = () => {
    setSelectedOutputs({ video: true, poster: true, ppt: true });
    goTo(7);
  };

  // Agent → switch to Manual (goes to Analysis)
  const handleAgentToManual = () => {
    goTo(2);
  };

  // Analysis → MaterialSelect
  const handleAnalysisNext = () => {
    goTo(3);
  };

  // Config → Pipeline or CreativeStudio
  const handleConfigNext = () => {
    goTo(selectedOutputs.video ? 5 : 6);
  };

  // Pipeline cancel → back to Config
  const handlePipelineCancel = () => {
    goTo(4);
  };

  // StepBar click → map stepbar index to internal step number
  // StepBar indices: 0=上传, 1=分析, 2=选择物料, 3=配置, 4=生成中, 5=创意工坊, 6=完成
  // Internal steps: 0=Upload, 1=ModeSelect, 2=Analysis, 3=MaterialSelect, 4=Config, 5=Pipeline, 6=CreativeStudio, 7=Delivery
  const stepBarIndexToInternalStep = { 0: 0, 1: 2, 2: 3, 3: 4, 5: 6, 6: 7 };
  const handleStepBarClick = (stepBarIndex) => {
    const internalStep = stepBarIndexToInternalStep[stepBarIndex];
    if (internalStep !== undefined) {
      goTo(internalStep);
    }
  };

  const authProps = {
    user,
    onOpenAuth: () => setAuthOpen(true),
    onLogout: handleLogout,
  };

  const navProps = {
    ...authProps,
    onNavLibrary: () => switchView('library'),
    onGoHome: handleNewProject,
    onGoToStep: handleStepBarClick,
    projectName: (view === 'workflow' && step > 0) || view === 'agent' ? currentProjectName : undefined,
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
            onGoHome={handleNewProject}
            {...authProps}
          />
        )}

        {view === 'agent' && (
          <AgentChat
            onGoToDelivery={handleAgentToDelivery}
            onSwitchToManual={handleAgentToManual}
            {...navProps}
          />
        )}

        {view === 'workflow' && (
          <>
            {step === 0 && <Upload   onNext={handleUploadNext} {...navProps} />}
            {step === 1 && <ModeSelect onSelectAgent={handleSelectAgent} onSelectManual={handleSelectManual} onBack={() => goTo(0)} {...navProps} />}
            {step === 2 && <Analysis onNext={handleAnalysisNext} onBack={() => goTo(1)} {...navProps} />}
            {step === 3 && <MaterialSelect onNext={() => goTo(selectedOutputs.video ? 4 : 6)} onBack={() => goTo(2)} selectedOutputs={selectedOutputs} onOutputsChange={setSelectedOutputs} {...navProps} />}
            {step === 4 && <Config   onNext={handleConfigNext} onBack={() => goTo(3)} selectedOutputs={selectedOutputs} onOutputsChange={setSelectedOutputs} {...navProps} />}
            {step === 5 && <Pipeline {...navProps} onNext={() => goTo(6)} onCancel={handlePipelineCancel} />}
            {step === 6 && <CreativeStudio onNext={() => goTo(7)} onBack={() => goTo(selectedOutputs.video ? 5 : 4)} selectedOutputs={selectedOutputs} {...navProps} />}
            {step === 7 && <Delivery onReset={handleNewProject} onBack={() => goTo(6)} selectedOutputs={selectedOutputs} {...navProps} />}
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
