import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardFlashCalc = () => {
  const [dataLeaderboard, setDataLeaderboard] = useState([]);
  // const [loading, setLoading] = useState(true);

  // --- KONFIGURASI SESI ---
  const JAWABAN_BENAR = 12345; 
  const TOLERANSI = 10; 

  // Fungsi untuk membersihkan string waktu menjadi format HH:mm:ss
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
        // Cache buster (&v=...) memaksa browser mengambil data terbaru dari server
        const response = await fetch(`${API_URL}?name=${SHEETS.FLASH_CALC}&v=${Date.now()}`);
        const json = await response.json();

        if (json.data && Array.isArray(json.data)) {
          
          // 1. MENGAMBIL DATA TERBARU PER NAMA
          const uniqueParticipants = new Map();

          // Membalik urutan data (Reverse) agar baris paling bawah diproses duluan
          const dataReversed = [...json.data].reverse();

          dataReversed.forEach((item) => {
            if (!item.nama) return;
            const namaKey = item.nama.trim().toUpperCase();

            // Jika nama belum ada di Map, artinya ini adalah entri terbaru (karena sudah di-reverse)
            if (!uniqueParticipants.has(namaKey)) {
              const jawabanUser = String(item.jawaban || "0");
              const angkaUser = parseInt(jawabanUser) || 0;
              const selisih = Math.abs(angkaUser - JAWABAN_BENAR);

              let statusVal = 1; // Default: SALAH
              let label = "SALAH";

              if (angkaUser === JAWABAN_BENAR) {
                statusVal = 3;
                label = "BENAR";
              } else if (selisih <= TOLERANSI) {
                statusVal = 2;
                label = "MENDEKATI";
              }

              uniqueParticipants.set(namaKey, {
                nama: item.nama,
                jawaban: jawabanUser,
                waktu: item.waktu || "00:00:00",
                poin: item.poin || 0,
                statusCode: statusVal,
                statusLabel: label,
                diff: selisih // Disimpan untuk sorting kedekatan nilai
              });
            }
          });

          const finalEntries = Array.from(uniqueParticipants.values());

          // 2. LOGIKA SORTING BERLAPIS
          const sorted = finalEntries.sort((a, b) => {
            // A. Prioritas 1: Status (BENAR > MENDEKATI > SALAH)
            if (b.statusCode !== a.statusCode) {
              return b.statusCode - a.statusCode;
            }
            
            // B. Prioritas 2: Jika sama-sama MENDEKATI, urutkan yang SELISIHNYA PALING KECIL
            if (a.statusCode === 2 && a.diff !== b.diff) {
              return a.diff - b.diff;
            }

            // C. Prioritas 3: Jika status & kedekatan sama, urutkan WAKTU (Cepat ke Lambat)
            const waktuA = getJamMurni(a.waktu);
            const waktuB = getJamMurni(b.waktu);
            return waktuA.localeCompare(waktuB);
          });

          setDataLeaderboard(sorted);
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000); // Sinkronisasi setiap 3 detik (Real-time)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans text-[13px]">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10">
          <Link to="/" className="text-5xl font-black text-[#f97316] italic uppercase tracking-tighter leading-none mb-2">
            FLASH CALCULATOR
          </Link>
          {/* <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            LATEST ATTEMPT TRACKER • WITA ZONE
          </p> */}
        </div>

        <div className="bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-8 px-10 text-center w-24">RANK</th>
                <th className="py-8 px-4">PARTICIPANT</th>
                <th className="py-8 px-4 text-center">SCORE</th>
                <th className="py-8 px-10 text-right">TIME (WITA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {dataLeaderboard.map((item, index) => (
                <tr key={index} className={`transition-all duration-300 hover:bg-white/2 ${index === 0 ? 'bg-[#f97316]/5' : ''}`}>
                  <td className="py-6 px-10 text-center">
                    <div className={`w-12 h-12 leading-12 rounded-2xl mx-auto font-black text-lg shadow-inner
                      ${index === 0 ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="font-black uppercase tracking-tight text-sm">{item.nama}</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">Live Submission</p>
                  </td>
                  <td className="py-6 px-4 text-center text-4xl font-black italic text-white tracking-tighter">
                    {item.poin}
                  </td>
                  <td className="py-6 px-10 text-right font-mono text-sm font-bold text-slate-400 italic">
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

export default LeaderboardFlashCalc;