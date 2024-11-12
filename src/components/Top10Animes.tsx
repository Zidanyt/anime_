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
  userRating?: number  // Avaliação específica do usuário
  globalRating?: number // Avaliação global calculada (média)
}

const Top10Animes: React.FC = () => {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Obtenha o ID do usuário armazenado no localStorage
  const userId = localStorage.getItem('userId') || ''

  // Função para carregar os dados dos animes e favoritos
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return // Não faz nada se não houver um usuário logado
      
      try {
        setLoading(true)
        // Requisições para obter os animes e favoritos com base no userId
        const [topResponse, favResponse] = await Promise.all([
          axiosInstance.get('/top10', { params: { userId } }), // Passando o userId para a API
          axiosInstance.get('/favorites', { params: { userId } }) // Passando o userId para a API de favoritos
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
  }, [userId]) // Recarregar sempre que o userId mudar

  // Função para adicionar ou remover anime dos favoritos
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

  // Função para avaliar um anime
  const rateAnime = async (animeId: string, rating: number) => {
    if (rating < 1 || rating > 5) {
      setErrorMessage('A avaliação deve estar entre 1 e 5.')
      return
    }

    try {
      // Enviar a avaliação para o backend
      const response = await axiosInstance.post(`/animes/${animeId}/rate`, { userId, stars: rating })

      console.log('Resposta após enviar avaliação:', response.data)

      // Atualizar o estado com a nova avaliação
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

  // Exibir mensagem de carregamento ou erro
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
