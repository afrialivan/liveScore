import React, { useState, useEffect, useCallback } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbxpPH1eF4u9rw_Lcf4g9RdiOMj5ZUmXc-I9gIPHWwA5-VeOsflYb9vtQVJcllfdcklr/exec";

const Testing = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSheet, setCurrentSheet] = useState("leaderboard");
  
  // State untuk Form (Tambah & Edit)
  const [formData, setFormData] = useState({ nama: '', skor: '', sekolah: '' });
  const [editRow, setEditRow] = useState(null); // Menyimpan rowNumber yang sedang diedit

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?name=${currentSheet}`);
      const json = await response.json();
      if (json.data) {
        // Sort & Limit 10
        const sorted = json.data.sort((a, b) => b.skor - a.skor).slice(0, 10);
        setData(sorted);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, [currentSheet]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // Fungsi Simpan (Insert atau Update)
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      action: editRow ? 'update' : 'insert', // Jika ada editRow, maka update
      name: currentSheet,
      rowNumber: editRow,
      ...formData
    };

    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Reset Form
    setFormData({ nama: '', skor: '', sekolah: '' });
    setEditRow(null);
    fetchLeaderboard();
  };

  // Fungsi untuk mengisi form saat tombol Edit diklik
  const startEdit = (item) => {
    setEditRow(item.rowNumber);
    setFormData({
      nama: item.nama,
      skor: item.skor,
      sekolah: item.sekolah
    });
  };

  const handleDelete = async (rowNum) => {
    if (!window.confirm("Hapus data ini?")) return;
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', name: currentSheet, rowNumber: rowNum })
    });
    fetchLeaderboard();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#d32f2f' }}>🏆 MMC Leaderboard Manager</h1>
      
      {/* Switcher Hari */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {["leaderboard hari 1", "leaderboard hari 2"].map(sheet => (
          <button 
            key={sheet}
            onClick={() => setCurrentSheet(sheet)}
            style={{ 
              padding: '8px 15px', 
              margin: '0 5px',
              backgroundColor: currentSheet === sheet ? '#d32f2f' : '#eee',
              color: currentSheet === sheet ? 'white' : 'black',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
          >
            {sheet.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form Tambah/Edit */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editRow ? "📝 Edit Data Peserta" : "➕ Tambah Peserta Baru"}</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            placeholder="Nama" style={{ padding: '8px', flex: 1 }}
            value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required 
          />
          <input 
            type="number" placeholder="Skor" style={{ padding: '8px', width: '80px' }}
            value={formData.skor} onChange={e => setFormData({...formData, skor: e.target.value})} required 
          />
          <input 
            placeholder="Sekolah" style={{ padding: '8px', flex: 1 }}
            value={formData.sekolah} onChange={e => setFormData({...formData, sekolah: e.target.value})} 
          />
          <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px' }}>
            {editRow ? "Update" : "Simpan"}
          </button>
          {editRow && <button onClick={() => {setEditRow(null); setFormData({nama:'', skor:'', sekolah:''})}} type="button">Batal</button>}
        </form>
      </div>

      {/* Tabel */}
      <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px' }}>Pos</th>
            <th style={{ padding: '10px' }}>Nama</th>
            <th style={{ padding: '10px' }}>Skor</th>
            <th style={{ padding: '10px' }}>Sekolah</th>
            <th style={{ padding: '10px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading Data...</td></tr> : 
            data.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{item.nama}</td>
                <td style={{ padding: '10px', color: '#e67e22', fontWeight: 'bold' }}>{item.skor}</td>
                <td style={{ padding: '10px', fontSize: '0.9em' }}>{item.sekolah}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => startEdit(item)} style={{ marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(item.rowNumber)} style={{ color: 'red', cursor: 'pointer' }}>Hapus</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Testing;