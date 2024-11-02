// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import RecentAnimeList from './components/RecentAnimeList';

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
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<AnimeList />} />
        <Route path="/recent" element={<RecentAnimeList />} />
      </Routes>
    </Router>
  );
};

export default App;
