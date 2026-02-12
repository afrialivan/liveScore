import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const HeavyRotation = () => {
  const [step, setStep] = useState(1); // 1: Pilih Nama, 2: Pilih Warna, 3: Keypad Nilai
  const [selectedNama, setSelectedNama] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [jawabanInput, setJawabanInput] = useState('');

  const [listPeserta, setListPeserta] = useState([]);
  const [kunciData, setKunciData] = useState({ warna: "", nilai: "" });
  const [fetching, setFetching] = useState(true);

  // Daftar 6 Warna yang Tersedia
  const colorOptions = [
    { name: 'Biru', hex: '#0000FF' },
    { name: 'Oranye', hex: '#FFA500' },
    { name: 'Hijau', hex: '#008000' },
    { name: 'Kuning', hex: '#FFFF00' },
    { name: 'Merah', hex: '#FF0000' },
    { name: 'Ungu', hex: '#B17AEA' },
  ];

  // 1. AMBIL DATA PESERTA & KUNCI JAWABAN SAAT LOAD
  useEffect(() => {
    // Ambil Peserta dari Leaderboard
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); })
      .catch(err => console.error("Gagal ambil peserta:", err));

    // Ambil Kunci Jawaban dari sheet: key-heavy-rotation
    fetch(`${API_URL}?name=key-heavy-rotation`)
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          // Mengambil warna dan nilai dari baris pertama
          setKunciData({
            warna: json.data[0].warna.toLowerCase().trim(),
            nilai: json.data[0].nilai.toString().trim()
          });
        }
      })
      .catch(err => console.error("Gagal ambil kunci:", err))
      .finally(() => setFetching(false));
  }, []);

  const handleKeypad = (val) => {
    if (val === "DEL") setJawabanInput(prev => prev.slice(0, -1));
    else if (val === "CLR") setJawabanInput("");
    else if (jawabanInput.length < 6) setJawabanInput(prev => prev + val);
  };

  const playSound = (isCorrect) => {
    // Path langsung mengarah ke folder public
    const audio = new Audio(isCorrect ? '/sounds/benar.m4a' : '/sounds/salah.m4a');

    // Kecilkan sedikit volumenya agar tidak mengagetkan peserta (0.0 - 1.0)
    audio.volume = 1.0;

    audio.play().catch(err => {
      // Browser biasanya memblokir suara jika belum ada interaksi user
      console.warn("Suara diblokir browser atau file tidak ditemukan:", err);
    });
  };

  const handleValidasiFinal = () => {
    if (!jawabanInput) return alert("Masukkan nilai!");

    const warnaBenar = selectedColor === kunciData.warna;
    const nilaiBenar = jawabanInput === kunciData.nilai;
    const isCorrect = warnaBenar && nilaiBenar;

    // if (isCorrect) {
    //   alert("BERHASIL! Warna dan Nilai Tepat.");
    // } else {
    //   alert(`GAGAL! \nWarna: ${warnaBenar ? '✅' : '❌'} \nNilai: ${nilaiBenar ? '✅' : '❌'}`);
    // }

    playSound(isCorrect);

    const waktuString = new Date().toLocaleTimeString('it-IT', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // 3. KIRIM DATA DI BACKGROUND
    const payload = {
      action: 'insert',
      name: SHEETS?.HEAVY_ROTATION,
      nama: selectedNama,
      poin: isCorrect ? "50" : "0",
      waktu: `'${waktuString}`,
    };

    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .catch(err => console.error("Background Sync Failed:", err));

    // Langsung kembali ke pilih user
    resetSistem();
  };

  const resetSistem = () => {
    setStep(1);
    setSelectedNama('');
    setSelectedColor(null);
    setJawabanInput('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase leading-tight">
            Heavy Rotation
          </Link>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">
            {step === 1 ? "Select Participant" : step === 2 ? "Pick 1 Color" : "Input Value"}
          </p>
        </div>

        {/* STEP 1: PILIH PESERTA */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {listPeserta.map((p, i) => (
                <button key={i} onClick={() => setSelectedNama(p.nama)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10' : 'border-slate-800 bg-slate-900/50'}`}>
                  <p className="font-black text-sm uppercase tracking-tight">{p.nama}</p>
                </button>
              ))}
            </div>
            <button disabled={!selectedNama || fetching} onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${selectedNama && !fetching ? 'bg-[#f97316] hover:bg-[#ea580c] shadow-xl' : 'bg-slate-800 text-slate-700 cursor-not-allowed'}`}>
              {fetching ? "SYNCING..." : "NEXT"}
            </button>
          </div>
        )}

        {/* STEP 2: PILIH 1 WARNA */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name.toLowerCase())}
                  className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all active:scale-95 ${selectedColor === c.name.toLowerCase() ? 'border-white bg-white/10 shadow-lg' : 'border-slate-800 bg-slate-900'}`}
                >
                  <div className="w-full h-12 rounded-xl mb-2 shadow-inner" style={{ backgroundColor: c.hex }}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{c.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-xs">BACK</button>
              <button disabled={!selectedColor} onClick={() => setStep(3)} className={`flex-1 py-4 rounded-2xl font-black tracking-widest ${selectedColor ? 'bg-[#f97316] shadow-lg' : 'bg-slate-800 text-slate-700'}`}>NEXT</button>
            </div>
          </div>
        )}

        {/* STEP 3: KEYPAD NILAI */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center shadow-inner">
              <p className="text-[9px] font-bold text-slate-600 uppercase mb-2">Color Picked: <span className="text-[#f97316]">{selectedColor?.toUpperCase()}</span></p>
              <div className="text-5xl font-black text-white font-mono tracking-tighter h-12 flex items-center justify-center">
                {jawabanInput || <span className="text-slate-800">000</span>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "DEL"].map((val) => (
                <button key={val} onClick={() => handleKeypad(val.toString())}
                  className="h-14 rounded-xl bg-slate-800 border border-slate-700 font-black text-xl active:scale-90 transition-all hover:bg-slate-700">
                  {val === "DEL" ? "⌫" : val}
                </button>
              ))}
            </div>
            <button onClick={handleValidasiFinal} disabled={!jawabanInput}
              className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter transition-all ${!jawabanInput ? 'bg-slate-800 text-slate-700' : 'bg-[#f97316] hover:bg-[#ea580c] shadow-xl'}`}>
              SUBMIT DATA
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HeavyRotation;