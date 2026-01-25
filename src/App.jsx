import React, { useState, useEffect, useCallback } from 'react';
import aset from "./assets/aset"

const App = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const API_URL = "https://script.google.com/macros/s/AKfycbzYoukgY9Fupwl85sT9bzNt1Tl5ruWA12kv4NnZqMqTyY70zTp5ILQWfKHGz20JE5Ip/exec";

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      if (json.data) {
        // Urutkan dari skor tertinggi
        const sorted = json.data.sort((a, b) => b.skor - a.skor).slice(0, 60);
        setData(sorted);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Gagal update data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(() => {
      fetchLeaderboard();
      console.log("Data diperbarui...");
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Inisialisasi Data...</div>;

  return (
    <div>
      <div style={{ maxWidth: '900px', margin: '20px auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <img src={aset.bg} className='w-screen absolute -z-20 left-0 top-0' alt="" />

        <div className='mt-32 text-center text-4xl font-bold text-red-400 mb-10'>Leaderboard Hari ke-2 MMC</div>


        <div className='' style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th className='w-32 text-center' style={{ padding: '15px', textAlign: 'left' }}>Peringkat</th>
                <th className='w-52'style={{ padding: '15px', textAlign: 'left' }}>Nama</th>
                <th className='w-32'style={{ padding: '15px', textAlign: 'left' }}>Sekolah</th>
                <th className='w-32 pr-10'style={{ textAlign: 'right' }}>Skor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td className='pl-10' style={{ fontWeight: 'bold' }}>{index + 1}</td>
                  <td style={{ padding: '12px 15px' }}>{player.nama}</td>
                  <td style={{ padding: '12px 15px' }}>{player.sekolah}</td>
                  <td className='pr-10' style={{  textAlign: 'right', color: '#e67e22', fontWeight: 'bold' }}>
                    {player.skor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className='text-black font-bold' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', marginTop: '10px' }}>
            Data otomatis diperbarui setiap 10 detik
          </p>
          <span style={{ fontSize: '12px' }}>
            Update terakhir: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

      </div>
    </div>
  );
};

export default App;