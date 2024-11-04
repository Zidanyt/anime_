import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import RecentAnimeList from './components/RecentAnimeList';
import Favoritos from './components/Favoritos';
import Top10Animes from './components/Top10Animes';
import Login from './components/Login';
import Register from './components/Register';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Registrar</Link> {/* Rota inicial */}
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
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Register />} /> {/* Rota inicial para registro */}
        <Route path="/recent" element={<RecentAnimeList />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/Top10Animes" element={<Top10Animes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anime-list" element={<AnimeList />} /> {/* Rota para a lista de animes */}
      </Routes>
    </Router>
  );
};

export default App;
