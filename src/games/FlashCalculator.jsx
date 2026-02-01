import React, { useState, useEffect } from 'react';
import { API_URL, SHEETS } from '../api/config';
import { Link } from 'react-router-dom';

const FlashCalculator = () => {
  const [step, setStep] = useState(1); // 1: Pilih Nama, 2: Keypad
  const [selectedNama, setSelectedNama] = useState('');
  const [jawabanInput, setJawabanInput] = useState('');
  const [loadingPeserta, setLoadingPeserta] = useState(true);
  
  const [listPeserta, setListPeserta] = useState([]);
  const [kunciJawaban, setKunciJawaban] = useState("");

  // 1. LOAD DATA PESERTA & KUNCI
  useEffect(() => {
    // Ambil daftar nama dari sheet Leaderboard utama
    fetch(`${API_URL}?name=${SHEETS.LEADERBOARD}`)
      .then(res => res.json())
      .then(json => { if (json.data) setListPeserta(json.data); })
      .catch(err => console.error("Gagal ambil peserta:", err))
      .finally(() => setLoadingPeserta(false));

    // Ambil Kunci Jawaban
    fetch(`${API_URL}?name=${SHEETS.KEY_FLASH_CALC}`)
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          setKunciJawaban(json.data[0].jawaban.toString().trim());
        }
      })
      .catch(err => console.error("Gagal ambil kunci jawaban:", err));
  }, []);

  const handleKeypad = (val) => {
    if (val === "DEL") setJawabanInput(prev => prev.slice(0, -1));
    else if (val === "CLR") setJawabanInput("");
    else if (jawabanInput.length < 8) setJawabanInput(prev => prev + val);
  };

  const handleValidasi = () => {
    if (!jawabanInput) return alert("Masukkan jawaban!");

    // Logika Penentuan Status
    const isCorrect = jawabanInput === kunciJawaban;
    const selisih = Math.abs(parseInt(jawabanInput) - parseInt(kunciJawaban));
    const TOLERANSI = 10; 

    let statusKirim = "SALAH";
    let poin = 0;

    if (isCorrect) {
      statusKirim = "BENAR";
      poin = 100;
    } else if (selisih <= TOLERANSI) {
      statusKirim = "MENDEKATI";
      poin = 0; 
    }

    // 2. FORMAT WAKTU SEBAGAI STRING MURNI (WITA)
    const waktuString = new Date().toLocaleTimeString('it-IT', {
      timeZone: 'Asia/Makassar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    alert(isCorrect ? "LUAR BIASA! Jawaban Benar." : `Tercatat! Jawaban: ${jawabanInput} (${statusKirim})`);
    
    const payload = {
      action: 'insert',
      name: SHEETS?.FLASH_CALC,
      nama: selectedNama,
      jawaban: jawabanInput, 
      poin: poin.toString(), 
      waktu: `'${waktuString}`,   // Tambahkan apostrof di depan agar Google Sheets simpan sebagai string
      result: jawabanInput, // Angka asli yang diinput user
    };

    // Post data ke Google Sheets
    fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) })
      .catch(err => console.error("Sync failed:", err));

    resetSistem();
  };

  const resetSistem = () => {
    setStep(1);
    setSelectedNama('');
    setJawabanInput('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden text-center">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

        <div className="mb-8">
          <Link to="/" className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase">Flash Calculator</Link>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">
            {step === 1 ? "Select Participant" : "Verification Phase"}
          </p>
        </div>

        {/* STEP 1: SELECTOR NAMA */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-left">
              {loadingPeserta ? (
                <div className="py-10 text-center text-slate-600 animate-pulse font-bold uppercase text-xs">Memuat Peserta...</div>
              ) : (
                listPeserta.map((p, i) => (
                  <button key={i} onClick={() => setSelectedNama(p.nama)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${
                      selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10' : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <p className="font-black text-sm uppercase">{p.nama}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">{p.sekolah || "PESERTA"}</p>
                  </button>
                ))
              )}
            </div>

            <button
              disabled={!selectedNama || !kunciJawaban}
              onClick={() => setStep(2)}
              className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${
                selectedNama && kunciJawaban ? 'bg-[#f97316] hover:bg-[#ea580c] shadow-xl' : 'bg-slate-800 text-slate-700 cursor-not-allowed'
              }`}
            >
              {!kunciJawaban && selectedNama ? "WAITING FOR KEY..." : "NEXT"}
            </button>
          </div>
        )}

        {/* STEP 2: KEYPAD */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-inner">
              <p className="text-[9px] font-black text-[#f97316] uppercase mb-2 italic tracking-widest">{selectedNama}</p>
              <div className="text-5xl font-black text-white h-12 flex items-center justify-center font-mono tracking-tighter">
                {jawabanInput || <span className="text-slate-800 tracking-widest">-----</span>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "DEL"].map((val) => (
                <button key={val} onClick={() => handleKeypad(val.toString())}
                  className="h-16 rounded-2xl bg-slate-800 border border-slate-700 font-black text-xl active:scale-95 active:bg-slate-700 transition-all shadow-md"
                >
                  {val === "DEL" ? "⌫" : val}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setStep(1)} className="py-4 bg-slate-900 border border-slate-800 rounded-2xl font-black text-slate-500 hover:text-white transition-colors">CANCEL</button>
              <button onClick={handleValidasi} disabled={!jawabanInput}
                className={`py-4 rounded-2xl font-black text-white transition-all ${!jawabanInput ? 'bg-slate-800 text-slate-700' : 'bg-[#f97316] hover:bg-[#ea580c] shadow-lg shadow-orange-900/20'}`}
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlashCalculator;