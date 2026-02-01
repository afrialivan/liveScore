import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbxQ0Gak9VWrIaugisvCldawkm-1mphOv4DwwkVqUrOuC_7prgSIplUNCtdM7XHbk7Kn/exec"; // Ganti dengan URL exec kamu

const TesInput = () => {
  const [listPeserta, setListPeserta] = useState([]);
  const [selectedNama, setSelectedNama] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [waktu, setWaktu] = useState('');
  const [testing, setTesting] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil data nama dari sheet (misal dari sheet utama)
  useEffect(() => {
    fetch(`${API_URL}?name=flash-calculator`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); });
  }, []);

  const handleKeypad = (val) => {
    if (val === 'DEL') setJawaban(prev => prev.slice(0, -1));
    else if (val === 'CLR') setJawaban('');
    else if (jawaban.length < 8) setJawaban(prev => prev + val);
  };

  const handleKirim = async () => {
    if (!selectedNama || !jawaban) return alert("Nama dan Jawaban wajib diisi!");
    
    setLoading(true);
    const payload = {
      action: 'insert',
      name: 'flash-calculator',
      nama: selectedNama,
      jawaban: jawaban,
      waktu: waktu || new Date().toLocaleTimeString(), // Otomatis waktu sekarang jika kosong
      testing: testing
    };

    try {
      await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
      alert("Data Terkirim!");
      setJawaban('');
      setWaktu('');
      setTesting('');
    } catch (err) {
      alert("Gagal mengirim data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <div className="bg-white p-4 border-t-8 border-indigo-700 shadow-sm text-center">
        <h1 className="text-2xl font-black text-gray-800">FLASH CALCULATOR PANEL</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 p-6 max-w-6xl mx-auto w-full flex-1">
        
        {/* SISI KIRI: DATA PESERTA & INPUT TEXT */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">1. Identitas & Info</h2>
            
            <label className="block text-xs font-bold mb-1">Pilih Peserta</label>
            <select 
              className="w-full p-3 bg-gray-50 border rounded-xl mb-4 outline-none focus:border-indigo-500"
              value={selectedNama}
              onChange={(e) => setSelectedNama(e.target.value)}
            >
              <option value="">-- Pilih Nama --</option>
              {listPeserta.map((p, i) => <option key={i} value={p.nama}>{p.nama} ({p.sekolah})</option>)}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Waktu (s)</label>
                <input 
                  type="text" className="w-full p-3 bg-gray-50 border rounded-xl" 
                  placeholder="Contoh: 12.5" 
                  value={waktu} onChange={e => setWaktu(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Testing Note</label>
                <input 
                  type="text" className="w-full p-3 bg-gray-50 border rounded-xl" 
                  placeholder="Catatan..." 
                  value={testing} onChange={e => setTesting(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-xs opacity-70 uppercase font-bold">Preview Kiriman:</p>
            <p className="text-lg font-bold mt-2">Nama: {selectedNama || '-'}</p>
            <p className="text-lg font-bold">Jawaban: {jawaban || '-'}</p>
          </div>
        </div>

        {/* SISI KANAN: KEYPAD JAWABAN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">2. Input Jawaban Angka</h2>
          
          <div className="bg-gray-100 rounded-xl p-8 mb-6 text-center border-2 border-dashed border-gray-300">
            <span className="text-6xl font-black text-indigo-700 tracking-tighter">
              {jawaban || "0"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, 'DEL'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypad(num.toString())}
                className="py-4 rounded-xl bg-gray-50 text-gray-700 font-bold text-2xl active:bg-indigo-600 active:text-white transition-all shadow-sm border border-gray-100"
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={handleKirim}
            disabled={loading || !selectedNama || !jawaban}
            className={`w-full mt-6 py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
              selectedNama && jawaban ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            {loading ? "PROSES..." : "SUBMIT FLASH DATA"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TesInput;