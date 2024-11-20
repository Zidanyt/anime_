import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import gif from '../../assets/R.gif'

import style from './AnimeList.module.css';
import axios from 'axios';

interface Anime {
  id: string
  title: string
  genre: string
  description: string
  year: number
  imageUrl: string
  ratings: Rating[]
  currentRating?: number
}

interface Rating {
  id: string
  userId: string
  animeId: string
  stars: number
}

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const userId = sessionStorage.getItem('userId') || ''

  const fetchAnimes = async () => {
    try {
      const response = await axiosInstance.get('/animes', {
        params: { userId }
      })
      console.log('Animes carregados:', response.data)
      setAnimes(response.data)
    } catch (error) {
      console.error('Error fetching animes:', error)
      setError('Failed to fetch animes.')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`/favorites/${userId}`)
      setFavorites(response.data.map((anime: Anime) => anime.id))
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  useEffect(() => {
    fetchAnimes()
    fetchFavorites()
  }, [])


  const toggleFavorite = async (animeId: string) => {
    try {
      if (favorites.includes(animeId)) {
        await axiosInstance.delete(`/favorites/${userId}/${animeId}`)
        setFavorites(favorites.filter(id => id !== animeId))
      } else {
        await axiosInstance.post(`/favorites/${animeId}`, { userId })
        setFavorites([...favorites, animeId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const rateAnime = async (animeId: string, rating: number): Promise<void> => {
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1 and 5.')
      return
    }
    
    try {
      const response = await axiosInstance.post(`/animes/${animeId}/rate`, { userId, stars: rating })
      console.log('Anime rated successfully:', response.data)
  
      await fetchAnimes()
  
    } catch (error: unknown) {
      console.error('Error rating anime:', error)
      if (axios.isAxiosError(error)) {
        console.error('Server Response:', error.response?.data)
        console.error('Error Message:', error.message)
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }
  
  if (loading) return <div className={style.container__gif}><img className={style.gif} src={gif} alt="" /></div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1 className={style.titulo}>Lista de Animes</h1>
      <div className={style.container}>
        <ul className={style.cards}>
          {animes.map(anime => (
            <li className={style.anime_card} key={anime.id}>
              <h2 className={style.sub_titulo}>{anime.title}</h2>
              {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} className={style.animeImage} />}
              <p>Gênero: {anime.genre}</p>
              <p>descrição: {anime.description}</p>
              <p>Ano: {anime.year}</p>
              <p>Sua avaliação: {anime.currentRating ? anime.currentRating.toFixed(1) : 'Sem Avaliação'}</p>
              <div>
                <span>Avaliar: </span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => rateAnime(anime.id, star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      color: anime.currentRating && anime.currentRating >= star ? 'gold' : 'gray'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button className={style.button} onClick={() => toggleFavorite(anime.id)}>
                {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AnimeList
