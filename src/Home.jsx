import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // 1. ZONA PESERTA (Input Jawaban)
  const games = [
    { name: "Flash Calculator", path: "/flash-calculator", icon: "🔢", color: "from-orange-500" },
    { name: "Resistor Rush", path: "/resistor", icon: "⚡", color: "from-red-600" },
    { name: "Heavy Rotation", path: "/heavy-rotation", icon: "🔄", color: "from-blue-600" },
    { name: "Twenty Four", path: "/twenty", icon: "🃏", color: "from-purple-600" },
    { name: "Cryptarithm", path: "/cryptarithm", icon: "🧩", color: "from-yellow-600" },
  ];

  // 2. ZONA PANITIA (Monitoring & Control)
  const controls = [
    { name: "Cooldown Monitor", path: "/delay", icon: "⏳", color: "bg-red-500/20 text-red-500 border-red-500/50" },
    { name: "Master Timer", path: "/timer", icon: "⏱️", color: "bg-blue-500/20 text-blue-500 border-blue-500/50" },
    { name: "Grand Total", path: "/total", icon: "🏆", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" },
  ];

  // 3. ZONA LEADERBOARD (Live Score)
  const leaderboards = [
    { name: "L. Resistor", path: "/leaderboard-resistor" },
    { name: "L. Flash", path: "/leaderboard-flash" },
    { name: "L. Heavy", path: "/leaderboard-heavy" },
    { name: "L. Twenty", path: "/leaderboard-twenty" },
    { name: "L. Crypt", path: "/leaderboard-cryptarithm" },
    { name: "L. Pattern", path: "/leaderboard-pattern" },
    { name: "L. Decode", path: "/leaderboard-decodex" },
    { name: "L. Poly", path: "/leaderboard-polyomino" },
    { name: "L. Quiz", path: "/leaderboard-quiz" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-[#f97316] uppercase leading-none">
              MMC HUB
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-4 ml-1">
              Hasanuddin Techno Fest #9 • 2026
            </p>
          </div>
          
          {/* QUICK CONTROLS */}
          <div className="flex flex-wrap gap-3">
            {controls.map((ctrl, i) => (
              <button 
                key={i} 
                onClick={() => navigate(ctrl.path)}
                className={`flex items-center gap-3 px-6 py-4 rounded-3xl border transition-all hover:scale-105 active:scale-95 ${ctrl.color}`}
              >
                <span className="text-xl">{ctrl.icon}</span>
                <span className="font-black uppercase text-[10px] tracking-widest">{ctrl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* COLUMN 1 & 2: GAME SELECTION */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-4">
              <span className="w-12 h-1 bg-[#f97316]"></span> Active Competition Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(game.path)}
                  className="bg-[#0f172a] border border-slate-800 p-8 rounded-[3rem] hover:bg-slate-900 hover:border-slate-600 transition-all cursor-pointer group relative overflow-hidden shadow-2xl"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} to-transparent opacity-5 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} to-black/50 flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 transition-transform`}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-xl italic text-white tracking-tighter">{game.name}</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tap to Enter Submission</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: SIDEBAR LEADERBOARDS */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-4">
              <span className="w-8 h-1 bg-slate-800"></span> Live Boards
            </h2>
            <div className="bg-[#0f172a]/50 border border-slate-800 rounded-[3rem] p-6 space-y-2">
              {leaderboards.map((lb, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(lb.path)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-transparent hover:border-slate-700 hover:bg-slate-800 transition-all text-left group"
                >
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors tracking-tight">{lb.name}</span>
                  <span className="text-slate-700 group-hover:text-[#f97316]">→</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">Universitas Hasanuddin • Electrical Engineering</p>
          <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;