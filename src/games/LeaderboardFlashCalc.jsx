import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardFlashCalc = () => {
  const [dataLeaderboard, setDataLeaderboard] = useState([]);

  // --- KONFIGURASI SESI ---
  const JAWABAN_BENAR = 2023; // Sesuaikan dengan kunci jawaban sesi ini
  const TOLERANSI = 10; 

  const getJamMurni = (rawTime) => {
    if (!rawTime) return "23:59:59";
    let timeStr = String(rawTime);
    if (timeStr.includes('T')) return timeStr.split('T')[1].substring(0, 8);
    const match = timeStr.match(/(\d{2}:\d{2}:\d{2})/);
    return match ? match[1] : timeStr.substring(0, 8);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_URL}?name=${SHEETS.FLASH_CALC}&v=${Date.now()}`);
        const json = await response.json();

        if (json.data && Array.isArray(json.data)) {
          const participantMap = {};

          // 1. FILTER: AMBIL DATA TERBAIK DARI SETIAP PESERTA
          json.data.forEach((item) => {
            if (!item.nama) return;
            const namaKey = item.nama.trim().toUpperCase();
            const angkaUser = parseInt(item.jawaban) || 0;
            const selisih = Math.abs(angkaUser - JAWABAN_BENAR);

            // TENTUKAN KASTA (STATUS CODE)
            // 3: BENAR (Sama persis)
            // 2: MENDEKATI (Selisih <= TOLERANSI)
            // 1: SALAH (Selisih > TOLERANSI)
            let currentStatus = 1;
            if (angkaUser === JAWABAN_BENAR) currentStatus = 3;
            else if (selisih <= TOLERANSI) currentStatus = 2;

            const currentEntry = {
              ...item,
              statusCode: currentStatus,
              diff: selisih,
              jam: getJamMurni(item.waktu)
            };

            if (!participantMap[namaKey]) {
              participantMap[namaKey] = currentEntry;
            } else {
              const existing = participantMap[namaKey];
              // UPDATE JIKA: Kasta lebih tinggi ATAU (Kasta sama DAN selisih lebih kecil)
              if (currentStatus > existing.statusCode || 
                 (currentStatus === existing.statusCode && selisih < existing.diff)) {
                participantMap[namaKey] = currentEntry;
              }
            }
          });

          const finalEntries = Object.values(participantMap);

          // 2. SORTING BERLAPIS (LOGIKA KASTA MUTLAK)
          const sorted = finalEntries.sort((a, b) => {
            // PRIORITAS 1: Status Code (3 > 2 > 1)
            // Yang Benar (3) WAJIB di atas yang Mendekati (2) dan Salah (1)
            if (b.statusCode !== a.statusCode) {
              return b.statusCode - a.statusCode;
            }
            
            // PRIORITAS 2: Jika sama-sama Mendekati (2) atau Salah (1)
            // Urutkan berdasarkan SELISIH terkecil (Paling presisi)
            if (a.statusCode !== 3 && a.diff !== b.diff) {
              return a.diff - b.diff;
            }

            // PRIORITAS 3: Jika kasta sama & presisi sama (atau sama-sama Benar)
            // Urutkan berdasarkan WAKTU (Siapa yang tercepat)
            return a.jam.localeCompare(b.jam);
          });

          setDataLeaderboard(sorted);
        }
      } catch (error) {
        console.error("Gagal sinkron data:", error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Link to="/" className="text-5xl font-black text-[#f97316] italic uppercase tracking-tighter">
            FLASH CALCULATOR
          </Link>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
             Ranking: Correct & Fast {'>'} Precise {'>'} Time
          </p>
        </div>

        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-8 px-10 text-center w-24">RANK</th>
                <th className="py-8 px-4">PARTICIPANT</th>
                <th className="py-8 px-4 text-center">GUESS</th>
                <th className="py-8 px-4 text-center">SCORE</th>
                <th className="py-8 px-10 text-right">TIME (WITA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {dataLeaderboard.map((item, index) => (
                <tr key={index} className={`transition-all duration-300 ${index === 0 ? 'bg-[#f97316]/10' : 'hover:bg-white/5'}`}>
                  <td className="py-6 px-10 text-center">
                    <div className={`w-10 h-10 leading-10 rounded-xl mx-auto font-black text-sm 
                      ${index === 0 ? 'bg-[#f97316] text-white' : 
                        item.statusCode === 3 ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="font-black uppercase tracking-tight text-sm">{item.nama}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest italic 
                      ${item.statusCode === 3 ? 'text-green-500' : item.statusCode === 2 ? 'text-yellow-500' : 'text-slate-600'}`}>
                      {item.statusCode === 3 ? '• Perfect' : item.statusCode === 2 ? '• Near' : '• Incorrect'}
                    </p>
                  </td>
                  <td className="py-6 px-4 text-center font-mono font-bold text-slate-400">
                    {item.jawaban}
                  </td>
                  <td className="py-6 px-4 text-center text-4xl font-black italic text-white tracking-tighter">
                    {item.poin}
                  </td>
                  <td className="py-6 px-10 text-right font-mono text-sm font-bold text-slate-500 italic">
                    {item.jam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dataLeaderboard.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic">
              Loading Ranking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardFlashCalc;