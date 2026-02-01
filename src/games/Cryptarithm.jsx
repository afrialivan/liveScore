import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const Cryptarithm = () => {
  const [step, setStep] = useState(1); 
  const [selectedNama, setSelectedNama] = useState('');
  const [kodeSoal, setKodeSoal] = useState('');
  const [jawabanInput, setJawabanInput] = useState('');
  
  // State untuk data yang hanya diambil sekali di awal
  const [listPeserta, setListPeserta] = useState([]);
  const [daftarSoal, setDaftarSoal] = useState([]); 
  
  // State untuk data yang perlu sinkronisasi (soal yang sudah terjawab)
  const [soalTerpakai, setSoalTerpakai] = useState([]); 
  const [fetching, setFetching] = useState(true);

  // 1. PENGAMBILAN DATA AWAL (HANYA SEKALI SAAT LOAD)
  useEffect(() => {
    const fetchDataAwal = async () => {
      setFetching(true);
      try {
        const [resPeserta, resKunci] = await Promise.all([
          fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`),
          fetch(`${API_URL}?name=key-cryptarithm`)
        ]);

        const jsonPeserta = await resPeserta.json();
        const jsonKunci = await resKunci.json();

        if (jsonPeserta.data) setListPeserta(jsonPeserta.data);
        if (jsonKunci.data) setDaftarSoal(jsonKunci.data);
        
        // Setelah data statis beres, ambil data dinamis (soal terpakai)
        await syncSoalTerpakai();
      } catch (err) {
        console.error("Gagal ambil data awal:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchDataAwal();
  }, []); // [] memastikan hanya jalan sekali di awal

  // 2. FUNGSI KHUSUS CEK SOAL TERPAKAI (DIPANGGIL SAAT PINDAH STEP ATAU SETELAH SUBMIT)
  const syncSoalTerpakai = async () => {
    try {
      const resPost = await fetch(`${API_URL}?name=${SHEETS.CRYPTARITHM}`);
      const jsonPost = await resPost.json();
      
      if (jsonPost.data) {
        const usedCodes = jsonPost.data
          .filter(item => parseInt(item.poin) > 0) 
          .map(item => item.kode?.toUpperCase());
        setSoalTerpakai(usedCodes);
      }
    } catch (err) {
      console.error("Gagal sync soal terpakai:", err);
    }
  };

  const handleKeypad = (val) => {
    if (val === "DEL") setJawabanInput(prev => prev.slice(0, -1));
    else if (val === "CLR") setJawabanInput("");
    else if (jawabanInput.length < 8) setJawabanInput(prev => prev + val);
  };

  const handleValidasi = () => {
    if (!jawabanInput) return alert("Masukkan jawaban!");

    const dataSoal = daftarSoal.find(s => s.kode.toUpperCase() === kodeSoal.toUpperCase());
    const isCorrect = jawabanInput === dataSoal?.kunci?.toString();
    const poinDinamis = isCorrect ? (dataSoal?.poin || 100) : 0;

    alert(isCorrect ? `BENAR! +${poinDinamis} Poin.` : "SALAH! Coba lagi.");

    const waktuString = new Date().toLocaleTimeString('it-IT', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const payload = {
      action: 'insert',
      name: SHEETS?.CRYPTARITHM,
      nama: selectedNama,
      poin: poinDinamis.toString(),
      kode: kodeSoal.toUpperCase(),
      waktu: `'${waktuString}`,
      testing: isCorrect ? "BENAR" : `SALAH`
    };

    // Kirim background
    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(() => syncSoalTerpakai()) // Hanya sync soal terjawab, bukan peserta
      .catch(err => console.error("Post failed:", err));

    resetSistem();
  };

  const resetSistem = () => {
    setStep(1);
    setSelectedNama('');
    setKodeSoal('');
    setJawabanInput('');
  };

  const soalTersedia = daftarSoal.filter(s => !soalTerpakai.includes(s.kode.toUpperCase()));

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase">Cryptarithm</Link>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">
            {step === 1 ? "Select Participant" : "Question Phase"}
          </p>
        </div>

        {/* STEP 1: PILIH PESERTA (Instan setelah load awal) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-left">
              {fetching && listPeserta.length === 0 ? (
                <div className="py-10 text-slate-600 animate-pulse text-center">Initializing Data...</div>
              ) : (
                listPeserta.map((p, i) => (
                  <button key={i} onClick={() => setSelectedNama(p.nama)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10' : 'border-slate-800 bg-slate-900/50'}`}>
                    <p className="font-black text-xs uppercase">{p.nama}</p>
                  </button>
                ))
              )}
            </div>
            <button disabled={!selectedNama} onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg ${selectedNama ? 'bg-[#f97316] shadow-xl' : 'bg-slate-800 text-slate-700'}`}>
              NEXT
            </button>
          </div>
        )}

        {/* STEP 2: PILIH KODE SOAL */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-3 gap-3">
              {soalTersedia.map((soal) => (
                <button key={soal.kode} onClick={() => setKodeSoal(soal.kode)}
                  className={`py-4 rounded-xl font-black text-xl border-2 transition-all flex flex-col items-center justify-center ${kodeSoal === soal.kode ? 'border-[#f97316] bg-[#f97316] text-white' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                  <span>{soal.kode}</span>
                  <span className="text-[8px] opacity-60">{soal.poin} PTS</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-xs text-slate-400">Back</button>
              <button disabled={!kodeSoal} onClick={() => setStep(3)} className={`flex-1 py-4 rounded-2xl font-black ${kodeSoal ? 'bg-[#f97316]' : 'bg-slate-800 text-slate-700'}`}>NEXT</button>
            </div>
          </div>
        )}

        {/* STEP 3: KEYPAD */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-inner">
              <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Code: {kodeSoal}</p>
              <div className="text-5xl font-black text-white font-mono h-12 flex items-center justify-center">
                {jawabanInput || <span className="text-slate-800">----</span>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "DEL"].map((val) => (
                <button key={val} onClick={() => handleKeypad(val.toString())}
                  className="h-14 rounded-xl bg-slate-800 border border-slate-700 font-black text-xl active:scale-90"
                >
                  {val === "DEL" ? "⌫" : val}
                </button>
              ))}
            </div>
            <button onClick={handleValidasi} disabled={!jawabanInput}
              className={`w-full py-5 rounded-2xl font-black text-xl ${!jawabanInput ? 'bg-slate-800 text-slate-700' : 'bg-[#f97316] shadow-xl'}`}>
              SUBMIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cryptarithm;