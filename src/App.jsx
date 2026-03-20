import { useState, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Config from './pages/Config';
import Pipeline from './pages/Pipeline';
import Delivery from './pages/Delivery';
import AuthModal from './components/AuthModal';
import './index.css';

export default function App() {
  const [step, setStep] = useState(0);
  const [animIn, setAnimIn] = useState(true);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
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
      setAnimIn(true);
      setTimeout(() => { busyRef.current = false; }, 700);
    }, 400);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const authProps = { user, onOpenAuth: () => setAuthOpen(true), onLogout: handleLogout };

  return (
    <>
      <div style={{
        animation: animIn
          ? 'pageEnter .7s cubic-bezier(.16,1,.3,1) both'
          : 'pageExit .4s cubic-bezier(.4,0,1,1) both',
        willChange: 'opacity, transform',
      }}>
        {step === 0 && <Upload   onNext={() => goTo(1)} {...authProps} />}
        {step === 1 && <Analysis onNext={() => goTo(2)} />}
        {step === 2 && <Config   onNext={() => goTo(3)} />}
        {step === 3 && <Pipeline onNext={() => goTo(4)} />}
        {step === 4 && <Delivery onReset={() => goTo(0)} />}
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
