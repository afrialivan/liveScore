import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const gameList = [
    { title: "Flash Calculator", path: "/flash-calculator", lb: "/leaderboard-flash", color: "from-orange-500", icon: "🔢" },
    { title: "Resistor Rush", path: "/resistor", lb: "/leaderboard-resistor", color: "from-red-500", icon: "⚡" },
    { title: "Heavy Rotation", path: "/heavy-rotation", lb: "/leaderboard-heavy", color: "from-blue-500", icon: "🔄" },
    { title: "Twenty Four", path: "/twenty", lb: "/leaderboard-twenty", color: "from-purple-500", icon: "🃏" },
    { title: "Cryptarithm", path: "/cryptarithm", lb: "/leaderboard-cryptarithm", color: "from-yellow-500", icon: "🧩" },
  ];

  const additionalLeaderboards = [
    { title: "Pattern Frenzy", lb: "/leaderboard-pattern", icon: "🎯" },
    { title: "Decodex", lb: "/leaderboard-decodex", icon: "🔐" },
    { title: "Polyomino", lb: "/leaderboard-polyomino", icon: "🧱" },
    { title: "Quiz Challenge", lb: "/leaderboard-quiz", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f97316]/10 blur-[120px] rounded-full"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase text-[#f97316] mb-4">
            MIND MASTER COMPETITION
          </h1>
        </div>

        {/* Main Games Section */}
        <div className="mb-12">
          <h2 className="text-xl font-black uppercase italic mb-8 border-l-4 border-[#f97316] pl-4">
            Main Competition Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameList.map((game, i) => (
              <div key={i} className="bg-[#0f172a] border border-slate-800 rounded-4xl p-6 hover:border-[#f97316]/50 transition-all group shadow-xl">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${game.color} to-black/20 flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                  {game.icon}
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6">{game.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate(game.path)}
                    className="py-3 bg-[#f97316] hover:bg-[#ea580c] rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Play
                  </button>
                  <button 
                    onClick={() => navigate(game.lb)}
                    className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors border border-slate-700"
                  >
                    Rank
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Leaderboards Section */}
        <div>
          <h2 className="text-xl font-black uppercase italic mb-8 border-l-4 border-slate-700 pl-4 text-slate-400">
            Special Leaderboards
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalLeaderboards.map((lb, i) => (
              <button 
                key={i}
                onClick={() => navigate(lb.lb)}
                className="bg-[#0f172a]/50 border border-slate-800 p-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-4 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{lb.icon}</span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-slate-500">View Rank</p>
                  <p className="font-bold text-xs uppercase tracking-tight">{lb.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center">
          <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 A. Muh. Afrial Ivan Pratama • South Sulawesi
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;