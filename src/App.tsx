import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import AnimeList from './pages/AnimeList/AnimeList'
import RecentAnimeList from './components/RecentAnimeList'
import Favoritos from './pages/Favoritos/Favoritos'
import Top10Animes from './pages/Top10Animes/Top10Animes'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Navbar from './components/NavBar/Navbar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userId')
    setIsLoggedIn(false)
  }

  return (
    <Router>
      
      {isLoggedIn && <Navbar handleLogout={handleLogout} />}
      
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
