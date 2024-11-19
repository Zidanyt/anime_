import React, { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'

interface Anime {
  id: string
  title: string
  genre: string
  description: string
  year: number
  rating: number
  isTopTen: boolean
  userRating?: number
  globalRating?: number
}

const Top10Animes: React.FC = () => {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const userId = localStorage.getItem('userId') || ''

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        const [topResponse, favResponse] = await Promise.all([
          axiosInstance.get('/top10', { params: { userId } }), 
          axiosInstance.get(`/favorites/${userId}`)
        ])

        console.log('Top 10 response:', topResponse.data)
        setTopAnimes(topResponse.data)

        console.log('Favorites response:', favResponse.data)
        setFavorites(favResponse.data.map((anime: Anime) => anime.id))
      } catch (error) {
        console.error('Erro ao carregar os dados:', error)
        setErrorMessage('Erro ao carregar os dados.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const toggleFavorite = async (animeId: string) => {
    try {
      if (favorites.includes(animeId)) {
        await axiosInstance.delete(`/favorites/${animeId}`, { params: { userId } })
        setFavorites(prev => prev.filter(id => id !== animeId))
      } else {
        await axiosInstance.post(`/favorites/${animeId}`, { userId })
        setFavorites(prev => [...prev, animeId])
      }
    } catch (error) {
      console.error('Falha ao atualizar favorito:', error)
      setErrorMessage('Falha ao atualizar o status de favorito.')
    }
  }

  const rateAnime = async (animeId: string, rating: number) => {
    if (rating < 1 || rating > 5) {
      setErrorMessage('A avaliação deve estar entre 1 e 5.')
      return
    }

    try {
      const response = await axiosInstance.post(`/animes/${animeId}/rate`, { userId, stars: rating })

      console.log('Resposta após enviar avaliação:', response.data)

      setTopAnimes(prevAnimes =>
        prevAnimes.map(anime =>
          anime.id === animeId ? { ...anime, userRating: rating } : anime
        )
      )
    } catch (error) {
      console.error('Falha ao submeter avaliação:', error)
      setErrorMessage('Falha ao submeter avaliação.')
    }
  }

  if (loading) return <div>Carregando...</div>
  if (errorMessage) return <div>{errorMessage}</div>

  return (
    <div>
      <h1>Top 10 Animes</h1>
      <ul>
        {topAnimes.map(anime => (
          <li key={anime.id}>
            <h2>{anime.title}</h2>
            <p>Gênero: {anime.genre}</p>
            <p>{anime.description}</p>
            <p>Ano: {anime.year}</p>
            <p>
              Avaliação global: {anime.globalRating ? `${anime.globalRating.toFixed(1)} / 5` : 'Sem Avaliação'}
            </p>
            <p>
              Avaliação sua: {anime.userRating !== undefined ? `${anime.userRating} / 5` : 'Sem Avaliação'}
            </p>
            <button onClick={() => toggleFavorite(anime.id)}>
              {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
            </button>

            <div>
              <span>Avaliar: </span>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => rateAnime(anime.id, star)}>
                  {star}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Top10Animes
