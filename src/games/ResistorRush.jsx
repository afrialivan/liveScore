/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const ResistorRush = () => {
  const waktuDefault = 300;

  const [selectedNama, setSelectedNama] = useState('');
  const [currentNo, setCurrentNo] = useState(1);
  const [inputBands, setInputBands] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(waktuDefault);
  const [step, setStep] = useState(1);
  const [listPeserta, setListPeserta] = useState([]);
  const [kunciJawaban, setKunciJawaban] = useState([[]]); // State untuk kunci jawaban dari Sheets
  const timerRef = useRef(null);

  const colorOptions = [
    { name: 'Hitam', hex: '#000000' }, { name: 'Cokelat', hex: '#8B4513' },
    { name: 'Merah', hex: '#FF0000' }, { name: 'Oranye', hex: '#FFA500' },
    { name: 'Kuning', hex: '#FFFF00' }, { name: 'Hijau', hex: '#008000' },
    { name: 'Biru', hex: '#0000FF' }, { name: 'Ungu', hex: '#800080' },
    { name: 'Abu-abu', hex: '#808080' }, { name: 'Putih', hex: '#FFFFFF' },
    { name: 'Emas', hex: '#FFD700' }, { name: 'Perak', hex: '#C0C0C0' },
  ];

  // 1. MENGAMBIL DATA PESERTA & KUNCI JAWABAN
  useEffect(() => {
    // Ambil Peserta
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); })
      .catch(err => console.error("Gagal ambil peserta:", err));

    // Ambil Kunci Jawaban dari sheet: key-resistor-rush
    fetch(`${API_URL}?name=key-resistor-rush`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          // Asumsi format di Sheets: Kolom 1-4 berisi warna (merah, merah, dst)
          // Kita ubah data array dari sheet menjadi format yang dikenali sistem
          const formattedKeys = [
            [], // Index 0 placeholder
            ...json.data.map(row => [
              row.warna1?.toLowerCase().trim(),
              row.warna2?.toLowerCase().trim(),
              row.warna3?.toLowerCase().trim(),
              row.warna4?.toLowerCase().trim()
            ])
          ];
          setKunciJawaban(formattedKeys);
        }
      })
      .catch(err => console.error("Gagal ambil kunci jawaban:", err));
  }, []);

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 2) {
      handleFinish("WAKTU HABIS");
    }
    return () => clearInterval(timerRef.current);
  }, [step, timeLeft]);

  const handleColorClick = (colorName) => {
    if (inputBands.length < 4) setInputBands([...inputBands, colorName.toLowerCase()]);
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

  const checkJawaban = () => {
    const kunciSekarang = kunciJawaban[currentNo];
    const jawabanBenar = JSON.stringify(inputBands) === JSON.stringify(kunciSekarang);

    // Total kartu dinamis berdasarkan panjang kunci yang ditarik (dikurang 1 karena placeholder)
    const TOTAL_KARTU = kunciJawaban.length - 1;

    if (jawabanBenar) {
      if (currentNo < TOTAL_KARTU) {
        setScore(prev => prev + 4);
        setCurrentNo(prev => prev + 1);
        setInputBands([]);
      } else {
        playSound(true);
        handleFinish("MISI SELESAI");
      }
    } else {
      playSound(false);
      handleFinish(`SALAH PADA KARTU #${currentNo}`);
    }
  };

  const handleFinish = (reason) => {
    clearInterval(timerRef.current);
    const finalScore = score + (reason.includes("SELESAI") ? 4 : 0);

    // alert(`${reason}!\nSkor Akhir: ${finalScore}`);

    const waktuString = new Date().toLocaleTimeString('it-IT', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });



    const payload = {
      action: 'insert',
      name: SHEETS.RESISTOR_RUSH,
      nama: selectedNama,
      poin: finalScore.toString(),
      waktu: `'${waktuString}`,
    };

    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .catch(err => console.error("Background Send Error:", err));

    resetSistem();
  };

  const resetSistem = () => {
    setStep(1);
    setSelectedNama('');
    setCurrentNo(1);
    setInputBands([]);
    setScore(0);
    setTimeLeft(waktuDefault);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden">

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase">Pilih Peserta</Link>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {listPeserta.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedNama(p.nama)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${selectedNama === p.nama
                    ? 'border-[#f97316] bg-[#f97316]/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                >
                  <p className="font-black text-sm uppercase">{p.nama}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{p.sekolah || "PESERTA"}</p>
                </button>
              ))}
            </div>

            <button
              disabled={!selectedNama || kunciJawaban.length <= 1}
              onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${selectedNama
                ? 'bg-[#f97316] hover:bg-[#ea580c] shadow-xl'
                : 'bg-slate-800 text-slate-700 cursor-not-allowed'
                }`}
            >
              {kunciJawaban.length <= 1 ? "LOADING KEYS..." : "MULAI SEKARANG"}
            </button>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Time Left</p>
                <p className="text-3xl font-mono font-black text-orange-500">{formatTime(timeLeft)}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Points</p>
                <p className="text-3xl font-black text-green-400">{score}</p>
              </div>
            </div>

            <div className="mb-6 text-center">
              <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest text-right italic">{selectedNama}</p>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] border-b-8 border-orange-600 flex justify-center items-center shadow-2xl relative">
                <div className="w-48 h-12 bg-[#D9C491] rounded-lg flex items-center justify-between px-4 overflow-hidden shadow-inner">
                  {inputBands.map((color, i) => (
                    <div key={i} className="w-4 h-full shadow-sm" style={{ backgroundColor: colorOptions.find(c => c.name.toLowerCase() === color)?.hex }}></div>
                  ))}
                  {[...Array(4 - inputBands.length)].map((_, i) => (
                    <div key={i} className="w-4 h-full border-x border-black/5 opacity-20"></div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase mt-4 tracking-widest">
                Kartu #{currentNo} / {kunciJawaban.length - 1}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorClick(color.name)}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                  <div className={`w-full h-12 rounded-xl border-2 border-slate-700`} style={{ backgroundColor: color.hex }}></div>
                  <span className="text-[8px] font-bold uppercase text-slate-500">{color.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setInputBands([])} className="text-[20px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-500">
                Reset Colors
              </button>
              <button
                onClick={checkJawaban}
                disabled={inputBands.length < 4}
                className={`w-full py-5 rounded-3xl font-black text-xl tracking-tighter transition-all ${inputBands.length === 4 ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-800 text-slate-700'}`}
              >
                VERIFY COLORS
              </button>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResistorRush;