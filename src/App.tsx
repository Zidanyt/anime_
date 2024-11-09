import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import AnimeList from './components/AnimeList'
import RecentAnimeList from './components/RecentAnimeList'
import Favoritos from './components/Favoritos'
import Top10Animes from './components/Top10Animes'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
  }

  return (
    <Router>
      {isLoggedIn && (
        <nav>
          <ul>
            <li>
              <Link to="/recent">Animes Recentes</Link>
            </li>
            <li>
              <Link to="/favoritos">Favoritos</Link>
            </li>
            <li>
              <Link to="/Top10Animes">Top 10</Link>
            </li>
            <li>
              <Link to="/anime-list">Lista de Animes</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Sair</button>
            </li>
          </ul>
        </nav>
      )}
      
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/anime-list" /> : <Register />} />
        
        <Route path="/login" element={isLoggedIn ? <Navigate to="/anime-list" /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        
        <Route path="/recent" element={isLoggedIn ? <RecentAnimeList /> : <Navigate to="/login" />} />
        <Route path="/favoritos" element={isLoggedIn ? <Favoritos /> : <Navigate to="/login" />} />
        <Route path="/Top10Animes" element={isLoggedIn ? <Top10Animes /> : <Navigate to="/login" />} />
        <Route path="/anime-list" element={isLoggedIn ? <AnimeList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
