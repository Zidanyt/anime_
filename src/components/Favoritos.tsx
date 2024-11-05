// src/components/Favoritos.tsx
import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

interface Anime {
  id: string
  title: string
  genre: string
  description: string
  year: number
}

const Favoritos: React.FC = () => {
  const [favoriteAnimes, setFavoriteAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get('/favorites')
        setFavoriteAnimes(response.data)
      } catch (error) {
        console.error('Error fetching favorite animes:', error)
        setError('Failed to fetch favorite animes.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Favoritos</h1>
      <ul>
        {favoriteAnimes.map(anime => (
          <li key={anime.id}>
            <h2>{anime.title}</h2>
            <p>Gênero: {anime.genre}</p>
            <p>descrição: {anime.description}</p>
            <p>Ano: {anime.year}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Favoritos
