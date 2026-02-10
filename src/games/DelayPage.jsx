import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const DelayPage = () => {
  const [listPeserta, setListPeserta] = useState([]);
  const [activeDelays, setActiveDelays] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data peserta dari Leaderboard Utama
  useEffect(() => {
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setListPeserta(json.data);
      })
      .catch(err => console.error("Gagal ambil peserta:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Cek status delay semua orang setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const currentDelays = [];

      // Scan semua data di localStorage yang berawalan 'delay_'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('delay_')) {
          const expiry = parseInt(localStorage.getItem(key));
          const nama = key.replace('delay_', '');
          const remaining = Math.round((expiry - now) / 1000);

          if (remaining > 0) {
            currentDelays.push({ nama, remaining });
          } else {
            // Hapus otomatis jika waktu sudah habis
            localStorage.removeItem(key);
          }
        }
      }
      // Urutkan berdasarkan waktu tersisa paling lama
      setActiveDelays(currentDelays.sort((a, b) => b.remaining - a.remaining));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAddDelay = (nama) => {
    const expiryTime = Date.now() + 2 * 60 * 1000; // 2 Menit
    localStorage.setItem(`delay_${nama.toUpperCase()}`, expiryTime);
  };

  const clearDelay = (nama) => {
    localStorage.removeItem(`delay_${nama.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link to="/" className="text-3xl font-black text-[#f97316] italic uppercase tracking-tighter">
              COOLDOWN MONITOR
            </Link>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Multi-Participant System</p>
          </div>
          <div className="bg-slate-900 px-6 py-2 rounded-full border border-slate-800">
            <span className="text-[#f97316] font-black">{activeDelays.length}</span> <span className="text-[10px] font-bold text-slate-500 uppercase ml-2">Active Delays</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Daftar Nama untuk Ditambahkan (Panitia Klik Ini) */}
          <div className="bg-[#0f172a] rounded-[2rem] border border-slate-800 p-6">
            <h2 className="text-xs font-black uppercase text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Tap to Delay (2 Min)
            </h2>
            <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {listPeserta.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => handleAddDelay(p.nama)}
                  className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-[#f97316] transition-all group"
                >
                  <span className="font-black text-xs uppercase text-slate-400 group-hover:text-white">{p.nama}</span>
                  <span className="text-[9px] bg-slate-800 px-3 py-1 rounded-lg text-slate-500 group-hover:bg-[#f97316] group-hover:text-white">+ 2m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Daftar Yang Sedang Kena Delay */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Currently Restricted
            </h2>
            
            {activeDelays.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem] text-slate-700 font-black uppercase text-[10px] italic">
                No active delays
              </div>
            ) : (
              activeDelays.map((d, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/50 p-6 rounded-[2rem] flex justify-between items-center animate-in slide-in-from-right duration-300">
                  <div className="text-left">
                    <p className="font-black text-sm uppercase text-white tracking-tight">{d.nama}</p>
                    <button 
                      onClick={() => clearDelay(d.nama)}
                      className="text-[9px] font-black text-red-500 uppercase mt-1 hover:text-white"
                    >
                      [ Force Unlock ]
                    </button>
                  </div>
                  <div className="text-3xl font-mono font-black text-red-500">
                    {formatTime(d.remaining)}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DelayPage;