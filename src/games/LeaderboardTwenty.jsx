import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardTwenty = () => {
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
        const response = await fetch(`${API_URL}?name=${SHEETS.TWENTY_FOUR}&v=${Date.now()}`);
        const json = await response.json();

        if (json.data) {
          const processedData = {};

          json.data.forEach((item) => {
            if (!item.nama) return;
            const namaKey = item.nama.trim().toUpperCase();
            const poinMasuk = parseInt(item.poin) || 0;

            if (!processedData[namaKey]) {
              // Jika nama belum ada, buat entri baru
              processedData[namaKey] = {
                ...item,
                poin: poinMasuk
              };
            } else {
              // JIKA NAMA SUDAH ADA, JUMLAHKAN POINNYA
              processedData[namaKey].poin += poinMasuk;
              
              // Opsional: Update waktu ke waktu terakhir dia menjawab
              processedData[namaKey].waktu = item.waktu;
            }
          });

          const finalEntries = Object.values(processedData);

          // Sorting: Total Poin Terbanyak -> Waktu Terakhir Tercepat
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
          <Link to="/" className="text-4xl font-black text-[#f97316] italic uppercase tracking-tighter">
            TWENTY FOUR CARD
          </Link>
          <p className="text-slate-500 text-[10px] font-bold uppercase mt-3 tracking-[0.4em]">
            System: Accumulated Points
          </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase">
                <th className="py-7 px-8 text-center w-24">Rank</th>
                <th className="py-7 px-8">Participant</th>
                <th className="py-7 px-8 text-center">Total Score</th>
                <th className="py-7 px-8 text-right">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {dataLeaderboard.map((item, index) => (
                <tr key={index} className={`hover:bg-white/5 transition-colors ${index === 0 ? 'bg-[#f97316]/5' : ''}`}>
                  <td className="py-6 px-8 text-center">
                    <div className={`w-10 h-10 leading-10 rounded-xl mx-auto font-black text-sm ${index === 0 ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-8 uppercase font-black text-sm">
                    {item.nama}
                  </td>
                  <td className="py-6 px-8 text-center text-3xl font-black italic text-[#f97316]">
                    {item.poin}
                  </td>
                  <td className="py-6 px-8 text-right font-mono text-sm font-bold text-slate-500">
                    {getJamMurni(item.waktu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dataLeaderboard.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic text-sm">
              Waiting for live submissions...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTwenty;