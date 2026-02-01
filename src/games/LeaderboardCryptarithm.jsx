import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardCryptarithm = () => {
  const [dataLeaderboard, setDataLeaderboard] = useState([]);

  const getJamMurni = (rawTime) => {
    if (!rawTime) return "--:--:--";
    let timeStr = String(rawTime);
    if (timeStr.includes('T')) return timeStr.split('T')[1].substring(0, 8);
    const match = timeStr.match(/(\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : timeStr.substring(0, 8);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Tambahkan cache buster agar data tidak tersangkut di cache browser
        const response = await fetch(`${API_URL}?name=${SHEETS.CRYPTARITHM}&v=${Date.now()}`);
        const json = await response.json();

        if (json.data) {
          const processedData = {};

          json.data.forEach((item) => {
            if (!item.nama) return;
            const namaKey = item.nama.trim().toUpperCase();
            const poinMasuk = parseInt(item.poin) || 0;

            if (!processedData[namaKey]) {
              // Jika nama belum ada, masukkan data baru
              processedData[namaKey] = {
                ...item,
                poin: poinMasuk, // Pastikan jadi number
              };
            } else {
              // JIKA NAMA SUDAH ADA, JUMLAHKAN POINNYA
              processedData[namaKey].poin += poinMasuk;
              
              // Untuk Waktu: Biasanya diambil waktu terakhir dia menjawab (update waktu)
              processedData[namaKey].waktu = item.waktu;
            }
          });

          const finalEntries = Object.values(processedData);

          // Sorting: Poin Terbanyak -> Jika sama, Waktu Tercepat
          const sorted = finalEntries.sort((a, b) => {
            if (b.poin !== a.poin) return b.poin - a.poin;
            return getJamMurni(a.waktu).localeCompare(getJamMurni(b.waktu));
          });

          setDataLeaderboard(sorted);
        }
      } catch (error) {
        console.error("Sync Error:", error);
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
          <Link to="/" className="text-5xl font-black text-[#f97316] italic uppercase tracking-tighter">
            Cryptarithm
          </Link>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-3 tracking-[0.4em]">
             Total Points System • Real-Time Update
          </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-7 px-8 text-center w-24">Rank</th>
                <th className="py-7 px-8">Participant</th>
                <th className="py-7 px-8 text-center">Total Score</th>
                <th className="py-7 px-8 text-right">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {dataLeaderboard.map((item, index) => (
                <tr key={index} className={`transition-all duration-300 hover:bg-white/2 ${index === 0 ? 'bg-[#f97316]/5' : ''}`}>
                  <td className="py-6 px-8 text-center">
                    <div className={`w-10 h-10 leading-10 rounded-xl mx-auto font-black text-sm ${index === 0 ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-8 uppercase font-black text-sm tracking-tight">
                    {item.nama}
                  </td>
                  <td className="py-6 px-8 text-center text-4xl font-black italic text-[#f97316]">
                    {item.poin}
                  </td>
                  <td className="py-6 px-8 text-right font-mono text-xs font-bold text-slate-500">
                    {getJamMurni(item.waktu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dataLeaderboard.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic">
              Synchronizing data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCryptarithm;