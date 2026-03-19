import { useState, useRef } from 'react';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Config from './pages/Config';
import Pipeline from './pages/Pipeline';
import Delivery from './pages/Delivery';
import './index.css';

export default function App() {
  const [step, setStep] = useState(0);
  const [animIn, setAnimIn] = useState(true);
  const busyRef = useRef(false);

  // 接收明确的目标 step，不依赖闭包里的 step 值
  const goTo = (newStep) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAnimIn(false);                    // 退场 0.4s
    setTimeout(() => {
      setStep(newStep);
      setAnimIn(true);                   // 进场 0.7s
      setTimeout(() => { busyRef.current = false; }, 700);
    }, 400);
  };

  return (
    <>
      <div style={{
        animation: animIn
          ? 'pageEnter .7s cubic-bezier(.16,1,.3,1) both'
          : 'pageExit .4s cubic-bezier(.4,0,1,1) both',
        willChange: 'opacity, transform',
      }}>
        {step === 0 && <Upload   onNext={() => goTo(1)} />}
        {step === 1 && <Analysis onNext={() => goTo(2)} />}
        {step === 2 && <Config   onNext={() => goTo(3)} />}
        {step === 3 && <Pipeline onNext={() => goTo(4)} />}
        {step === 4 && <Delivery onReset={() => goTo(0)} />}
      </div>

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
