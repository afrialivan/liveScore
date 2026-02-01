// import React, { useState, useEffect } from 'react';
// import { API_URL, SHEETS } from '../api/config';

// const Decodex = () => {
//   const [step, setStep] = useState(1); // 1: Pilih Nama, 2: Pilih Kode Soal, 3: Input Jawaban
//   const [selectedNama, setSelectedNama] = useState('');
//   const [kodeSoal, setKodeSoal] = useState('');
//   const [jawabanInput, setJawabanInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   // List Peserta Dummy
//   const [listPeserta] = useState([
//     { nama: "Ahmad Hidayat", sekolah: "SMK Negeri 1" },
//     { nama: "Siti Aminah", sekolah: "SMA Terbuka" },
//     { nama: "Budi Santoso", sekolah: "MAN Model" },
//     { nama: "Dewi Sartika", sekolah: "SMK Telkom" },
//     { nama: "Fajri Pratama", sekolah: "SMA 2 Makassar" }
//   ]);

//   // Daftar Kode Soal & Kunci Jawaban (Simbol ke Huruf atau sebaliknya)
//   const daftarSoal = [
//     { kode: "DX1", kunci: "TEKNIK" },
//     { kode: "DX2", kunci: "ELEKTRO" },
//     { kode: "DX3", kunci: "UNHAS" },
//     { kode: "DX4", kunci: "ROBOT" },
//     { kode: "DX5", kunci: "SENSOR" },
//     { kode: "DX6", kunci: "KABEL" }
//   ];

//   const handleKeypad = (char) => {
//     if (char === "DEL") setJawabanInput(prev => prev.slice(0, -1));
//     else if (char === "CLR") setJawabanInput("");
//     else if (jawabanInput.length < 12) setJawabanInput(prev => prev + char);
//   };

//   const handleValidasi = async () => {
//     if (!jawabanInput) return alert("Masukkan jawaban!");
//     setLoading(true);

//     const dataSoal = daftarSoal.find(s => s.kode === kodeSoal);
//     const isCorrect = jawabanInput.toUpperCase() === dataSoal?.kunci.toUpperCase();

//     try {
//       if (isCorrect) {
//         alert(`DECODED! Jawaban ${kodeSoal} Benar.`);
//       } else {
//         alert(`FAILED! Jawaban ${kodeSoal} Salah.`);
//       }
//     } finally {
//       setLoading(false);
//       resetSistem();
//     }
//   };

//   const resetSistem = () => {
//     setStep(1);
//     setSelectedNama('');
//     setKodeSoal('');
//     setJawabanInput('');
//   };

//   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   return (
//     <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-6 relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-1.5 bg-[#f97316]"></div>

//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-black text-[#f97316] italic tracking-tighter uppercase leading-tight">
//             Decodex
//           </h2>
//           <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">
//             {step === 1 ? "Select Participant" : step === 2 ? "Select Question Code" : "Decryption Phase"}
//           </p>
//         </div>

//         {/* STEP 1: PILIH NAMA */}
//         {step === 1 && (
//           <div className="space-y-6 animate-in fade-in duration-300">
//             <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
//               {listPeserta.map((p, i) => (
//                 <button key={i} onClick={() => setSelectedNama(p.nama)}
//                   className={`w-full p-4 rounded-2xl text-left border-2 transition-all ${selectedNama === p.nama ? 'border-[#f97316] bg-[#f97316]/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
//                   <p className="font-black text-xs uppercase tracking-tight">{p.nama}</p>
//                 </button>
//               ))}
//             </div>
//             <button disabled={!selectedNama} onClick={() => setStep(2)}
//               className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all ${selectedNama ? 'bg-[#f97316]' : 'bg-slate-800 text-slate-700'}`}>
//               NEXT
//             </button>
//           </div>
//         )}

//         {/* STEP 2: OPSI KODE SOAL */}
//         {step === 2 && (
//           <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center">
//             <div className="grid grid-cols-3 gap-3">
//               {daftarSoal.map((soal) => (
//                 <button key={soal.kode} onClick={() => setKodeSoal(soal.kode)}
//                   className={`py-4 rounded-xl font-black text-lg border-2 transition-all ${kodeSoal === soal.kode ? 'border-[#f97316] bg-[#f97316]' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
//                   {soal.kode}
//                 </button>
//               ))}
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold uppercase text-[10px]">Back</button>
//               <button disabled={!kodeSoal} onClick={() => setStep(3)} className={`flex-1 py-4 rounded-2xl font-black ${kodeSoal ? 'bg-[#f97316]' : 'bg-slate-800 text-slate-700'}`}>NEXT</button>
//             </div>
//           </div>
//         )}

//         {/* STEP 3: ALPHABET KEYPAD */}
//         {step === 3 && (
//           <div className="space-y-4 animate-in slide-in-from-right duration-300">
//             <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center shadow-inner">
//               <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Decryption Input ({kodeSoal})</p>
//               <div className="text-3xl font-black text-white h-10 flex items-center justify-center tracking-widest break-all">
//                 {jawabanInput || <span className="text-slate-800">......</span>}
//               </div>
//             </div>

//             {/* Keypad Alfabet */}
//             <div className="grid grid-cols-7 gap-1.5">
//               {alphabet.map((char) => (
//                 <button key={char} onClick={() => handleKeypad(char)}
//                   className="h-10 rounded-lg bg-slate-800 border border-slate-700 font-black text-sm hover:bg-slate-700 active:scale-90">
//                   {char}
//                 </button>
//               ))}
//               <button onClick={() => handleKeypad("CLR")} className="col-span-3 h-10 rounded-lg bg-red-900/20 text-red-500 font-black text-[10px] border border-red-900/30">CLEAR</button>
//               <button onClick={() => handleKeypad("DEL")} className="col-span-4 h-10 rounded-lg bg-slate-800 text-yellow-500 font-black text-[10px] border border-slate-700">DELETE</button>
//             </div>

//             <button onClick={handleValidasi} disabled={loading || !jawabanInput}
//               className={`w-full py-5 rounded-2xl font-black text-xl tracking-tighter shadow-lg transition-all ${!jawabanInput || loading ? 'bg-slate-800 text-slate-700' : 'bg-[#f97316] hover:bg-[#ea580c]'}`}>
//               {loading ? "SAVING..." : "SUBMIT DECODEX"}
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Decodex;