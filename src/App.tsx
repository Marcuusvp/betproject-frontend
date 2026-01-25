import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChampionsLeague from './pages/ChampionsLeague';
import League from './pages/League';

// Placeholder pages (você vai criar depois)
const Match = () => <div>Match Page - Em construção</div>;
const Live = () => <div>Live Page - Em construção</div>;
const Statistics = () => <div>Statistics Page - Em construção</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/league/ChampionsLeague" element={<ChampionsLeague />} />
        <Route path="/league/:slug" element={<League />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/live" element={<Live />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;