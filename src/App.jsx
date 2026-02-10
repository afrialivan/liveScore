import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Testing from './Testing';
import ExApp from './ExApp';
import Inputan from './Inputan';
import TesInput from './TesInput';
import LeaderboardFlashCard from './LeaderboardFlashCard';
import ResistorRush from './games/ResistorRush';
import FlashCalculator from './games/FlashCalculator';
import HeavyRotation from './games/HeavyRotation';
import TwentyFourCard from './games/TwentyFourCard';
import Cryptarithm from './games/Cryptarithm';
import LeaderboardResistor from './games/LeaderboardResistor';
import LeaderboardFlashCalc from './games/LeaderboardFlashCalc';
import LeaderboardHeavy from './games/LeaderboardHeavy';
import LeaderboardTwenty from './games/LeaderboardTwenty';
import LeaderboardCryptarithm from './games/LeaderboardCryptarithm';
import Home from './Home';
import LeaderboardPatternFrenzy from './games/LeaderboardPatternFrenzy';
import LeaderboardDecodex from './games/LeaderboardDecodex';
import LeaderboardPolyomino from './games/LeaderboardPolyomino';
import LeaderboardQuiz from './games/LeaderboardQuiz';
import TimerControl from './TimerControl';
import LeaderboardGrandTotal from './games/LeaderboardGrandTotal';
// import Decodex from './games/Decodex';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Halaman utama untuk peserta */}
          <Route path="/" element={<Home />} />
          
          {/* Halaman dashboard untuk panitia */}
          {/* <Route path="/admin" element={<ExApp />} /> */}

          {/* <Route path="/tes" element={<TesInput />} />
          <Route path="/input" element={<Inputan />} /> */}
          {/* <Route path="/leaderboard-flash" element={<LeaderboardFlashCard />} /> */}
          {/* <Route path="/flash-calculator" element={<FlashCalculator />} /> */}
          <Route path="/flash-calculator" element={<FlashCalculator />} />
          <Route path="/timer" element={<TimerControl />} />
          <Route path="/resistor" element={<ResistorRush />} />
          <Route path="/heavy-rotation" element={<HeavyRotation />} />
          <Route path="/twenty" element={<TwentyFourCard />} />
          <Route path="/total" element={<LeaderboardGrandTotal />} />
          <Route path="/cryptarithm" element={<Cryptarithm />} />
          <Route path="/leaderboard-resistor" element={<LeaderboardResistor />} />
          <Route path="/leaderboard-flash" element={<LeaderboardFlashCalc />} />
          <Route path="/leaderboard-heavy" element={<LeaderboardHeavy />} />
          <Route path="/leaderboard-twenty" element={<LeaderboardTwenty />} />
          <Route path="/leaderboard-cryptarithm" element={<LeaderboardCryptarithm />} />
          <Route path="/leaderboard-pattern" element={<LeaderboardPatternFrenzy />} />
          <Route path="/leaderboard-decodex" element={<LeaderboardDecodex />} />
          <Route path="/leaderboard-polyomino" element={<LeaderboardPolyomino />} />
          <Route path="/leaderboard-quiz" element={<LeaderboardQuiz />} />
          {/* <Route path="/decodex" element={<Decodex />} /> */}
          
          {/* Opsional: Halaman 404 */}
          <Route path="*" element={<div className="p-10 text-center">Halaman Tidak Ditemukan</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;