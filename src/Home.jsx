import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // 1. GAME INPUT (Tempat Peserta Submit Jawaban)
  const gameInputs = [
    { name: "Flash Calculator", path: "/flash-calculator", icon: "🔢", color: "from-orange-500" },
    { name: "Resistor Rush", path: "/resistor", icon: "⚡", color: "from-red-600" },
    { name: "Heavy Rotation", path: "/heavy-rotation", icon: "🔄", color: "from-blue-600" },
    { name: "Twenty Four Card", path: "/twenty", icon: "🃏", color: "from-purple-600" },
    { name: "Cryptarithm", path: "/cryptarithm", icon: "🧩", color: "from-yellow-600" },
  ];

  // 2. LIVE LEADERBOARDS (Papan Peringkat Tiap Game)
  const scoreboards = [
    { name: "L. Resistor", path: "/leaderboard-resistor", icon: "📊" },
    { name: "L. Flash Calc", path: "/leaderboard-flash", icon: "📈" },
    { name: "L. Heavy Rot", path: "/leaderboard-heavy", icon: "📉" },
    { name: "L. Twenty Four", path: "/leaderboard-twenty", icon: "🧮" },
    { name: "L. Cryptarithm", path: "/leaderboard-cryptarithm", icon: "🔐" },
    { name: "L. Pattern Frenzy", path: "/leaderboard-pattern", icon: "🎯" },
    { name: "L. Decodex", path: "/leaderboard-decodex", icon: "🕵️" },
    { name: "L. Polyomino", path: "/leaderboard-polyomino", icon: "🧱" },
    { name: "L. Quiz", path: "/leaderboard-quiz", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      {/* Dekorasi Glow Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER & GRAND TOTAL SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#f97316] uppercase leading-none">
              MMC HUB <span className="text-white/20 text-3xl">2.0</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-3">
              Mathematics Modern Competition • Master Command
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* TOMBOL GRAND TOTAL (UTAMA) */}
            <button 
              onClick={() => navigate('/total')}
              className="flex items-center gap-4 bg-gradient-to-r from-yellow-600 to-yellow-700 p-5 pr-10 rounded-[2rem] shadow-xl shadow-yellow-900/20 hover:scale-105 transition-all group"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                🏆
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Final Ranking</p>
                <p className="font-black text-lg uppercase tracking-tight">Grand Total Score</p>
              </div>
            </button>

            {/* TOMBOL TIMER */}
            <button 
              onClick={() => navigate('/timer')}
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-5 pr-10 rounded-[2rem] hover:border-blue-500 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl group-hover:animate-spin-slow">
                ⏱️
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tool</p>
                <p className="font-black text-lg uppercase tracking-tight text-blue-400">Master Timer</p>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 1: GAME INPUTS */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-4">
            <span className="w-8 h-1 bg-[#f97316]"></span> Active Game Submissions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {gameInputs.map((game, i) => (
              <div 
                key={i} 
                onClick={() => navigate(game.path)}
                className="bg-[#0f172a] border border-slate-800 p-6 rounded-[2.5rem] hover:bg-slate-900 hover:border-slate-600 transition-all cursor-pointer group shadow-lg"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} to-black/30 flex items-center justify-center text-2xl mb-6 shadow-xl shadow-black/40 group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <h3 className="font-black uppercase text-xs tracking-tight italic text-slate-300 mb-3">{game.name}</h3>
                <div className="w-full py-2 bg-slate-800 rounded-xl text-[9px] font-black text-center text-slate-500 group-hover:bg-[#f97316] group-hover:text-white transition-colors uppercase">
                  Open Submission
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: LIVE SCOREBOARDS */}
        <div className="mb-20">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-4">
            <span className="w-8 h-1 bg-slate-800"></span> Live Game Leaderboards
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {scoreboards.map((lb, i) => (
              <button 
                key={i} 
                onClick={() => navigate(lb.path)}
                className="flex items-center gap-4 bg-[#0f172a]/40 border border-slate-800 p-4 rounded-3xl hover:bg-slate-800 hover:border-slate-500 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {lb.icon}
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase">Board</p>
                  <p className="font-bold text-[10px] uppercase tracking-tighter text-slate-300">{lb.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER STATUS */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
            © 2026 Mathematics Modern Competition • Makassar
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-600">
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               System Synchronized
             </span>
             <span>V2.5.1-Stable</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;