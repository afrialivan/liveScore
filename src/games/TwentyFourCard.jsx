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

  const operators = ['+', '-', '*', '/'];

  // 1. AMBIL DATA PESERTA & SOAL ANGKA
  useEffect(() => {
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); })
      .catch(err => console.error("Gagal ambil peserta:", err));

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

  const handleInput = (val, type) => {
    // Validasi Angka: Tidak boleh dobel
    if (type === 'num') {
      const countUsed = inputExp.filter(x => x.val === val && x.type === 'num').length;
      const countInSource = soalAngka.filter(x => x === val).length;
      if (countUsed >= countInSource) return;
    }
    
    // Validasi Operator: Tidak boleh dobel (Aturan Baru)
    if (type === 'op') {
      const isOpUsed = inputExp.some(x => x.val === val && x.type === 'op');
      if (isOpUsed) return;
    }

    setInputExp([...inputExp, { val, type }]);
  };

  const handleSubmit = () => {
    if (inputExp.length === 0) return;

    let result = 0;
    try {
      const expression = inputExp.map(x => x.val).join('');
      result = eval(expression);
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return alert("Susunan operasi tidak valid!");
    }

    const isCorrect = result === 24;

    // 2. FEEDBACK INSTAN
    alert(isCorrect ? "TEPAT! Hasilnya 24." : `SALAH! Hasilnya: ${result}`);

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
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

        <div className="mb-8">
          <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase">24 Card</Link>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            {step === 1 ? "Select Player" : "No Double Operator Mode"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {listPeserta.map((p, i) => (
                <button key={i} onClick={() => setSelectedNama(p.nama)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10' : 'border-slate-800 bg-slate-900/50'}`}>
                  <p className="font-black text-sm uppercase">{p.nama}</p>
                </button>
              ))}
            </div>
            <button disabled={!selectedNama || fetching} onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg ${selectedNama && !fetching ? 'bg-[#f97316]' : 'bg-slate-800 text-slate-700'}`}>
              {fetching ? "FETCHING..." : "START"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 min-h-25 flex flex-wrap items-center justify-center gap-2 shadow-inner font-mono text-3xl font-black">
              {inputExp.length === 0 && <span className="text-slate-800 italic text-xl">0</span>}
              {inputExp.map((item, i) => (
                <span key={i} className={item.type === 'num' ? 'text-white' : 'text-[#f97316]'}>{item.val}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {soalAngka.map((num, i) => {
                const isUsed = inputExp.filter(x => x.val === num && x.type === 'num').length >= soalAngka.filter(x => x === num).length;
                return (
                  <button key={i} disabled={isUsed} onClick={() => handleInput(num, 'num')}
                    className={`h-14 rounded-xl font-black text-xl border ${isUsed ? 'bg-slate-800 text-slate-900 border-transparent' : 'bg-slate-800 text-white border-slate-700 active:scale-95'}`}>
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {operators.map((op) => {
                const isOpUsed = inputExp.some(x => x.val === op && x.type === 'op');
                return (
                  <button key={op} disabled={isOpUsed} onClick={() => handleInput(op, 'op')}
                    className={`h-14 rounded-xl font-black text-2xl transition-all ${isOpUsed ? 'bg-slate-900 text-slate-950' : 'bg-[#0f172a] border border-[#f97316]/40 text-[#f97316] active:scale-95'}`}>
                    {op}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setInputExp(inputExp.slice(0, -1))} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase">Hapus</button>
              <button onClick={() => setInputExp([])} className="flex-1 py-4 bg-slate-800 rounded-2xl font-black text-[10px] uppercase text-red-500">Reset</button>
            </div>

            <button onClick={handleSubmit} disabled={inputExp.length === 0}
              className={`w-full py-5 rounded-2xl font-black text-xl ${inputExp.length > 0 ? 'bg-[#f97316] shadow-xl' : 'bg-slate-800 text-slate-700'}`}>
              SUBMIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwentyFourCard;