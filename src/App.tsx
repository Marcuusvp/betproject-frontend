import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChampionsLeague from './pages/ChampionsLeague';

// Placeholder pages (você vai criar depois)
const League = () => <div>League Page - Em construção</div>;
const Match = () => <div>Match Page - Em construção</div>;
const Live = () => <div>Live Page - Em construção</div>;
const Statistics = () => <div>Statistics Page - Em construção</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/league/champions-league" element={<ChampionsLeague />} />
        <Route path="/league/:slug" element={<League />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/live" element={<Live />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;