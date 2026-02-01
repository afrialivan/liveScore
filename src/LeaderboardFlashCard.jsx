import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, SHEETS } from './api/config';

const LeaderboardFlashCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Data
  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?name=${SHEETS.FLASH_CALC}`);
      const json = await response.json();
      
      if (json.data) {
        // LOGIKA SORTING:
        // 1. Urutkan Jawaban (Poin) dari yang TERBESAR (b - a)
        // 2. Jika Jawaban sama, Urutkan Waktu dari yang TERKECIL (a - b)
        const sorted = json.data.sort((a, b) => {
          if (Number(b.poin) !== Number(a.poin)) {
            return Number(b.poin) - Number(a.poin);
          }
          return Number(b.waktu) - Number(a.waktu); 
        });
        
        setData(sorted.slice(0, 10)); // Menampilkan Top 10 saja
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh setiap 5 detik untuk suasana kompetisi yang kompetitif
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const formatWaktu = (isoString) => {
  if (!isoString) return "-";
  
  // Jika formatnya adalah 1899-12-30T10:02:56.000Z
  if (isoString.toString().includes('T')) {
    return isoString.split('T')[1].split('.')[0]; // Hasil: 10:02:56
  }
  
  return isoString; // Jika sudah format biasa, kembalikan apa adanya
};

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            FLASH CALCULATOR
          </h1>
          <div className="h-1 w-32 bg-yellow-400 mx-auto mt-2"></div>
          <p className="text-gray-400 mt-4 font-bold tracking-[0.4em] text-xs uppercase">
            Hasanuddin Techno Fest Leaderboard
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                <th className="p-6 text-center">Rank</th>
                <th className="p-6">Peserta & Sekolah</th>
                <th className="p-6 text-center">Poin</th>
                <th className="p-6 text-center">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-500 font-medium">
                    Menghubungkan ke server...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-500 font-medium">
                    Belum ada data pertandingan hari ini.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`group transition-all hover:bg-slate-700/30 ${
                      index === 0 ? 'bg-yellow-500/5' : ''
                    }`}
                  >
                    {/* Rank Column */}
                    <td className="p-6 text-center">
                      <div className={`
                        inline-flex items-center justify-center w-10 h-10 rounded-full font-black
                        ${index === 0 ? 'bg-yellow-400 text-black scale-110' : 
                          index === 1 ? 'bg-slate-300 text-black' : 
                          index === 2 ? 'bg-orange-400 text-black' : 'bg-slate-800 text-slate-400'}
                      `}>
                        {index + 1}
                      </div>
                    </td>

                    {/* Participant Info */}
                    <td className="p-6">
                      <div className="font-black text-lg group-hover:text-yellow-400 transition-colors">
                        {item.nama?.toUpperCase()}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {item.sekolah || "UMUM"}
                      </div>
                    </td>

                    {/* Points Column */}
                    <td className="p-6 text-center">
                      <span className="text-2xl font-mono font-black text-green-400">
                        {item.poin}
                      </span>
                    </td>

                    {/* Time Column */}
                    <td className="p-6 text-center">
                      <span className="text-xl font-mono font-bold text-slate-300">
                        {formatWaktu(item.waktu)}<span className="text-xs ml-1 text-slate-500">s</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex justify-between items-center text-[9px] text-slate-600 font-black tracking-[0.2em] px-2">
          <span>REAL-TIME ENGINE v2.0</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>SERVER CONNECTED</span>
          </div>
          <span>CONTROL PEMINATAN UNHAS</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardFlashCard;