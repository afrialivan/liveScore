/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/unsupported-syntax */
import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const TwentyFourCard = () => {
  const [step, setStep] = useState(1);
  const [selectedNama, setSelectedNama] = useState('');
  const [inputExp, setInputExp] = useState([]);
  const [listPeserta, setListPeserta] = useState([]);
  const [soalAngka, setSoalAngka] = useState([]);
  const [fetching, setFetching] = useState(true);

  const mathOperators = ['+', '-', '*', '/'];
  const brackets = ['(', ')'];

  useEffect(() => {
    // Ambil daftar peserta
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); })
      .catch(err => console.error("Gagal ambil peserta:", err));

    // Ambil angka soal dari Sheets
    fetch(`${API_URL}?name=key-24-card`)
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          const data = json.data[0];
          setSoalAngka([
            parseInt(data.n1), parseInt(data.n2),
            parseInt(data.n3), parseInt(data.n4)
          ]);
        }
      })
      .catch(err => console.error("Gagal ambil soal:", err))
      .finally(() => setFetching(false));
  }, []);

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

  const handleInput = (val, type) => {
    // Validasi Angka: Harus sesuai ketersediaan di soal
    if (type === 'num') {
      const countUsed = inputExp.filter(x => x.val === val && x.type === 'num').length;
      const countInSource = soalAngka.filter(x => x === val).length;
      if (countUsed >= countInSource) return;
    }

    // Validasi Operator (+ - * /): Tidak boleh dobel
    if (type === 'op') {
      const isOpUsed = inputExp.some(x => x.val === val && x.type === 'op');
      if (isOpUsed) return;
    }

    // Tipe 'bracket' tidak memiliki validasi isUsed (boleh berkali-kali)
    setInputExp([...inputExp, { val, type }]);
  };

  const handleSubmit = () => {
    if (inputExp.length === 0) return;

    let result = 0;
    try {
      // 1. Gabungkan input menjadi string
      let rawExpression = inputExp.map(x => x.val).join('');

      // 2. LOGIKA AUTO-MULTIPLICATION (Injeksi '*' otomatis)
      // Pola: Angka( -> Angka*( | )Angka -> )*Angka | )( -> )*(
      const formattedExpression = rawExpression
        .replace(/(\d)\(/g, '$1*(')
        .replace(/\)(\d)/g, ')*$1')
        .replace(/\)\(/g, ')*(');

      // 3. Hitung hasil
      result = eval(formattedExpression);

      if (result === undefined || isNaN(result)) throw new Error();
    } catch (e) {
      return alert("Susunan tidak valid! Periksa kembali letak angka dan tanda kurung Anda.");
    }

    const isCorrect = result === 24;

    playSound(isCorrect);
    // alert(isCorrect ? "TEPAT! Hasilnya 24." : `SALAH! Hasilnya: ${result}`);

    const waktuString = new Date().toLocaleTimeString('it-IT', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });

    const payload = {
      action: 'insert',
      name: SHEETS?.TWENTY_FOUR,
      nama: selectedNama,
      poin: isCorrect ? "100" : "0",
      waktu: `'${waktuString}`,
    };

    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .catch(err => console.error("Sync failed:", err));

    resetSistem();
  };

  const resetSistem = () => {
    setStep(1);
    setSelectedNama('');
    setInputExp([]);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

        <div className="mb-8">
          <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase">24 Card</Link>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 italic">
            {step === 1 ? "Select Participant" : "Implicit Multiplication Enabled"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-left">
              {listPeserta.map((p, i) => (
                <button key={i} onClick={() => setSelectedNama(p.nama)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10 shadow-lg shadow-orange-500/10' : 'border-slate-800 bg-slate-900/50'}`}>
                  <p className="font-black text-sm uppercase tracking-tight">{p.nama}</p>
                </button>
              ))}
            </div>
            <button disabled={!selectedNama || fetching} onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${selectedNama && !fetching ? 'bg-[#f97316]' : 'bg-slate-800 text-slate-700'}`}>
              {fetching ? "LOADING DATA..." : "CONTINUE"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right">
            {/* Expression Screen */}
            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 min-h-30 flex flex-wrap items-center justify-center gap-2 shadow-inner font-mono text-4xl font-black">
              {inputExp.length === 0 && <span className="text-slate-800 italic text-xl tracking-widest">-- -- -- --</span>}
              {inputExp.map((item, i) => (
                <span key={i} className={item.type === 'num' ? 'text-white' : item.type === 'bracket' ? 'text-cyan-400' : 'text-[#f97316]'}>
                  {item.val}
                </span>
              ))}
            </div>

            {/* Input Row: Numbers */}
            <div className="grid grid-cols-4 gap-3">
              {soalAngka.map((num, i) => {
                const countUsed = inputExp.filter(x => x.val === num && x.type === 'num').length;
                const countInSource = soalAngka.filter(x => x === num).length;
                const isUsed = countUsed >= countInSource;
                return (
                  <button key={i} disabled={isUsed} onClick={() => handleInput(num, 'num')}
                    className={`h-14 rounded-xl font-black text-xl border transition-all ${isUsed ? 'bg-slate-900 text-slate-950 border-transparent scale-95' : 'bg-slate-800 text-white border-slate-700 active:scale-90 hover:border-[#f97316]'}`}>
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Input Row: Operators & Brackets */}
            <div className="grid grid-cols-3 gap-3">
              {mathOperators.map((op) => {
                const isOpUsed = inputExp.some(x => x.val === op && x.type === 'op');
                return (
                  <button key={op} disabled={isOpUsed} onClick={() => handleInput(op, 'op')}
                    className={`h-14 rounded-xl font-black text-2xl transition-all ${isOpUsed ? 'bg-slate-900 text-slate-950' : 'bg-[#0f172a] border border-[#f97316]/40 text-[#f97316] active:scale-90'}`}>
                    {op}
                  </button>
                );
              })}
              {brackets.map((br) => (
                <button key={br} onClick={() => handleInput(br, 'bracket')}
                  className="h-14 rounded-xl font-black text-2xl bg-slate-900 border border-cyan-500/30 text-cyan-400 active:scale-90">
                  {br}
                </button>
              ))}
            </div>

            {/* Control Bar */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setStep(1)} className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-black text-[10px] uppercase text-slate-500">BACK</button>
              <button onClick={() => setInputExp(inputExp.slice(0, -1))} className="py-4 bg-slate-800 rounded-xl font-black text-[10px] uppercase text-slate-200">DELETE</button>
              <button onClick={() => setInputExp([])} className="py-4 bg-red-900/10 border border-red-900/20 rounded-xl font-black text-[10px] uppercase text-red-500">CLEAR</button>
            </div>

            {/* Final Action */}
            <button onClick={handleSubmit} disabled={inputExp.length === 0}
              className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${inputExp.length > 0 ? 'bg-[#f97316] shadow-xl shadow-orange-950/20' : 'bg-slate-800 text-slate-700'}`}>
              VALIDATE & SUBMIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwentyFourCard;