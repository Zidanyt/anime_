// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import RecentAnimeList from './components/RecentAnimeList';
import Favoritos from './components/Favoritos';
import Top10Animes from './components/Top10Animes';
const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Todos os Animes</Link>
          </li>
          <li>
            <Link to="/recent">Animes Recentes</Link>
          </li>
          <li>
            <Link to="/favoritos">Favoritos</Link>
          </li>
          <li>
            <Link to="/Top10Animes">Top10</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<AnimeList />} />
        <Route path="/recent" element={<RecentAnimeList />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/Top10Animes" element={<Top10Animes />} />
      </Routes>
    </Router>
  );
};

export default App;
