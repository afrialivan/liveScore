import React, { useState, useEffect, useCallback } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const LeaderboardDecodex = () => {
  const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
  
  
    const fetchLeaderboard = useCallback(async () => {
      try {
        const response = await fetch(`${API_URL}?name=${SHEETS.DECODEX}`);
        const json = await response.json();
  
        if (json.data) {
          // Urutkan dari skor tertinggi
          const sorted = json.data.sort((a, b) => b.poin - a.poin).slice(0, 10);
          setData(sorted);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Gagal update data:", err);
      } finally {
        // setLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [API_URL]);
  
    useEffect(() => {
      fetchLeaderboard();
  
      const interval = setInterval(() => {
        fetchLeaderboard();
        console.log("Data diperbarui...");
      }, 10000);
  
      return () => clearInterval(interval);
    }, [fetchLeaderboard]);
  
    // if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Inisialisasi Data...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <Link to="/" className="text-6xl font-black text-[#f97316] italic uppercase tracking-tighter leading-none mb-3">
            DECODEX
          </Link>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Live Performance Tracking • WITA
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-[#0f172a]/80 backdrop-blur-md rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-8 px-10 text-center w-24">Rank</th>
                <th className="py-8 px-4">Nama</th>
                <th className="py-8 px-4">Sekolah</th>
                <th className="py-8 px-10 text-right">Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {data.map((item, index) => (
                <tr key={index} className={`transition-all duration-300 hover:bg-white/2 ${index === 0 ? 'bg-[#f97316]/5' : ''}`}>
                  <td className="py-6 px-10 text-center">
                    <div className={`w-12 h-12 leading-12 rounded-2xl mx-auto font-black text-lg 
                      ${index === 0 ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="font-black text-sm uppercase tracking-tight">{item.nama}</p>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {item.Institusi}
                    </p>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <span className="text-5xl font-black italic text-white tracking-tighter">
                      {item.poin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic">
              Waiting for live submissions...
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-between items-center px-4">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Auto-update every 5 seconds
          </p>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            Last Sync: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardDecodex;