import React, { useState } from 'react';

const Inputan = () => {
  // Dummy Data
  const listPeserta = [
    { nama: "Udin", sekolah: "SMK Telkom" },
    { nama: "Budi", sekolah: "SMA 1 Makassar" },
    { nama: "Siti", sekolah: "MAN 2 Model" },
    { nama: "Andi", sekolah: "SMA 2" },
    { nama: "Irfan", sekolah: "SMK 2" },
  ];

  const [selectedNama, setSelectedNama] = useState('');
  const [jawaban, setJawaban] = useState('');

  const handleKeypad = (val) => {
    if (val === 'DEL') {
      setJawaban(prev => prev.slice(0, -1));
    } else if (val === 'CLR') {
      setJawaban('');
    } else {
      if (jawaban.length < 5) setJawaban(prev => prev + val);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ebf8] flex flex-col font-sans">
      {/* 1. Nama Game / Header */}
      <div className="bg-white p-4 shadow-sm border-t-8 border-purple-800 text-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          MIND MASTER COMPETITION <span className="text-purple-700">#9</span>
        </h1>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-widest">Hasanuddin Techno Fest</p>
      </div>

      {/* 2. Main Content Split Screen */}
      <div className="flex flex-1 flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        
        {/* Kolom Kiri: Daftar Peserta */}
        <div className="flex-[.5] bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
            Pilih Peserta
          </h2>
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
            {listPeserta.map((p, i) => (
              <label 
                key={i} 
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedNama === p.nama 
                  ? 'border-purple-600 bg-purple-50 shadow-sm' 
                  : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <input 
                  type="radio" 
                  name="peserta" 
                  className="hidden"
                  value={p.nama}
                  onChange={(e) => setSelectedNama(e.target.value)}
                />
                <div className="flex flex-col">
                  <span className={`font-bold ${selectedNama === p.nama ? 'text-purple-800' : 'text-gray-700'}`}>
                    {p.nama.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{p.sekolah}</span>
                </div>
                {selectedNama === p.nama && <span className="ml-auto text-purple-600">✔</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Keypad Jawaban */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
            Input Skor/Jawaban
          </h2>
          
          {/* Display Jawaban Besar */}
          <div className="bg-gray-50 border-b-4 border-gray-200 p-6 mb-6 rounded-lg">
            <div className="text-center text-5xl font-mono font-black text-gray-800 tracking-widest">
              {jawaban || <span className="text-gray-200">0</span>}
            </div>
          </div>

          {/* Keypad Layout */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, 'DEL'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypad(num.toString())}
                className="h-full min-h-15 rounded-xl bg-gray-100 text-gray-700 font-bold text-2xl active:scale-95 active:bg-purple-600 active:text-white transition-all shadow-sm flex items-center justify-center"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Tombol Kirim */}
          <button
            disabled={!selectedNama || !jawaban}
            className={`w-full mt-6 py-5 rounded-xl font-bold text-lg shadow-lg transition-all ${
              selectedNama && jawaban 
              ? 'bg-purple-700 text-white hover:bg-purple-800' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            KIRIM DATA
          </button>
        </div>

      </div>

      <div className="p-4 text-center text-[10px] text-gray-400 font-bold tracking-[0.3em]">
        CONTROL PANEL v1.0
      </div>
    </div>
  );
};

export default Inputan;