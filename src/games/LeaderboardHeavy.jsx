import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardHeavy = () => {
  const [dataLeaderboard, setDataLeaderboard] = useState([]);
  // const [loading, setLoading] = useState(true);

  // FUNGSI MEMBERSIHKAN JAM (Mengambil HH:mm:ss murni)
  const getJamMurni = (rawTime) => {
    if (!rawTime) return "--:--:--";
    let timeStr = String(rawTime);
    
    // Jika Google Sheets mengirim format ISO
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].substring(0, 8);
    }
    
    // Mencari pola 00:00:00
    const match = timeStr.match(/(\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : timeStr.substring(0, 8);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // setLoading(true);
        const response = await fetch(`${API_URL}?name=${SHEETS.HEAVY_ROTATION}`);
        const json = await response.json();

        if (json.data) {
          const processedData = {};

          json.data.forEach((item) => {
            if (!item.nama) return;
            const namaKey = item.nama.trim().toUpperCase();
            const poinSekarang = parseInt(item.poin) || 0;

            if (!processedData[namaKey]) {
              processedData[namaKey] = item;
            } else {
              const poinLama = parseInt(processedData[namaKey].poin) || 0;
              // Aturan: Ambil waktu pertama jika salah, ambil terbaru jika poin naik
              if (poinSekarang > poinLama) {
                processedData[namaKey] = item;
              }
            }
          });

          const finalEntries = Object.values(processedData);

          // Sorting: Poin Terbanyak -> Waktu Tercepat (WITA)
          const sorted = finalEntries.sort((a, b) => {
            const poinA = parseInt(a.poin) || 0;
            const poinB = parseInt(b.poin) || 0;
            if (poinB !== poinA) return poinB - poinA;
            
            return getJamMurni(a.waktu).localeCompare(getJamMurni(b.waktu));
          });

          setDataLeaderboard(sorted);
        }
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black text-[#f97316] italic uppercase tracking-tighter">
            HEAVY ROTATION
          </Link>
          {/* <p className="text-slate-500 text-[10px] font-bold uppercase mt-3 tracking-[0.4em]">
            Time Zone: WITA (Central Indonesia Time)
          </p> */}
        </div>

        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase">
                <th className="py-7 px-8 text-center w-24">Rank</th>
                <th className="py-7 px-8">Participant</th>
                <th className="py-7 px-8 text-center">Score</th>
                <th className="py-7 px-8 text-right">Finish Time (WITA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {dataLeaderboard.map((item, index) => (
                <tr key={index} className={`hover:bg-white/2 ${index === 0 ? 'bg-[#f97316]/5' : ''}`}>
                  <td className="py-6 px-8 text-center">
                    <div className={`w-10 h-10 leading-10 rounded-xl mx-auto font-black text-sm ${index === 0 ? 'bg-[#f97316] text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-8 uppercase font-black text-sm">
                    {item.nama}
                  </td>
                  <td className="py-6 px-8 text-center text-3xl font-black italic">
                    {item.poin}
                  </td>
                  <td className="py-6 px-8 text-right font-mono text-sm font-bold text-slate-400">
                    {getJamMurni(item.waktu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dataLeaderboard.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic">
              Waiting for live submissions...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeavy;