import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TimerControl = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalInitial, setTotalInitial] = useState(0); // Untuk hitung persentase
  const [customInput, setCustomInput] = useState(""); // State untuk input manual

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
      if (isActive) {
        // Efek sederhana saat waktu habis
        alert("WAKTU HABIS!"); 
      }
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (seconds > 0) setIsActive(true);
  };

  const setTimerPreset = (m) => {
    const s = Math.floor(m * 60);
    setSeconds(s);
    setTotalInitial(s);
    setIsActive(false);
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    const val = parseInt(customInput);
    if (!isNaN(val) && val > 0) {
      const totalS = val * 60; // Mengonversi menit input ke detik
      setSeconds(totalS);
      setTotalInitial(totalS);
      setIsActive(false);
      setCustomInput(""); // Reset field input
    }
  };

  const percentage = totalInitial > 0 ? (seconds / totalInitial) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black text-[#f97316] italic uppercase tracking-tighter hover:opacity-80 transition-all">
            MMC TIMER MASTER
          </Link>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-2 tracking-[0.4em]">
            Central Command • WITA Zone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Visual Timer Display */}
          <div className="relative flex items-center justify-center">
            <svg className="w-80 h-80 transform -rotate-90">
              {/* <circle
                cx="160" cy="160" r="145"
                stroke="currentColor" strokeWidth="15"
                fill="transparent" className="text-slate-900"
              /> */}
              {/* <circle
                cx="160" cy="160" r="145"
                stroke="currentColor" strokeWidth="15"
                fill="transparent"
                strokeDasharray={911}
                strokeDashoffset={911 - (911 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-linear ${
                  seconds < 10 ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
                  seconds < 30 ? 'text-orange-500' : 'text-[#f97316]'
                }`}
              /> */}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-8xl font-black font-mono tracking-tighter tabular-nums leading-none">
                {formatTime(seconds)}
              </span>
              {/* <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mt-4 bg-slate-900/50 px-3 py-1 rounded-full">
                {isActive ? "Status: Active" : "Status: Paused"}
              </span> */}
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-[#0f172a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl space-y-8">
            
            {/* Quick Presets */}
            <div>
              <h3 className="text-[10px] font-black uppercase mb-4 text-slate-500 tracking-widest italic">Quick Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1, 2, 3, 5, 10].map((m) => (
                  <button key={m} onClick={() => setTimerPreset(m)}
                    className="py-3 bg-slate-800/50 hover:bg-[#f97316] hover:text-white rounded-xl font-black text-[10px] transition-all uppercase border border-slate-800">
                    {m < 1 ? '30s' : `${m}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input Field */}
            <div>
              <h3 className="text-[10px] font-black uppercase mb-4 text-slate-500 tracking-widest italic">Manual Setup (Minutes)</h3>
              <form onSubmit={handleManualInput} className="flex gap-2">
                <input 
                  type="number"
                  placeholder="Enter minutes..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-[#f97316] transition-all"
                />
                <button type="submit" className="px-6 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-[10px] uppercase transition-all">
                  Set
                </button>
              </form>
            </div>

            {/* Main Actions */}
            <div className="space-y-4 pt-4 border-t border-slate-800/50">
              <button onClick={handleStart} disabled={isActive || seconds === 0}
                className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${
                  isActive || seconds === 0 ? 'bg-slate-900 text-slate-700' : 'bg-[#f97316] hover:bg-[#ea580c] shadow-lg shadow-orange-900/20 active:scale-95'
                }`}>
                {isActive ? 'Live Running' : 'Start Timer'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsActive(false)}
                  className="py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest">
                  Pause
                </button>
                <button onClick={() => { setIsActive(false); setSeconds(0); setTotalInitial(0); }}
                  className="py-4 bg-red-900/10 border border-red-900/20 text-red-500 hover:bg-red-900/20 rounded-2xl font-black text-xs uppercase tracking-widest">
                  Reset
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-20 text-center flex flex-col items-center gap-2">
          <div className="h-[1px] w-20 bg-slate-800"></div>
          <p className="text-slate-700 font-black text-[9px] uppercase tracking-[0.5em]">
            Mathematics Modern Competition Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimerControl;