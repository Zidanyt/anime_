// src/components/AnimeList.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  recent: boolean;
}

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axiosInstance.get('/animes');
        setAnimes(response.data);
      } catch (error) {
        console.error('Error fetching animes:', error);
        setError('Failed to fetch animes.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get('/favorites');
        setFavorites(response.data.map((anime: Anime) => anime.id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchAnimes();
    fetchFavorites();
  }, []);

  const toggleFavorite = async (animeId: string) => {
    try {
      if (favorites.includes(animeId)) {
        await axiosInstance.delete(`/favorites/${animeId}`);
        setFavorites(favorites.filter(id => id !== animeId));
      } else {
        await axiosInstance.post(`/favorites/${animeId}`);
        setFavorites([...favorites, animeId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lista de Animes</h1>
      <ul>
        {animes.map(anime => (
          <li key={anime.id}>
            <h2>{anime.title}</h2>
            <p>Gênero: {anime.genre}</p>
            <p>{anime.description}</p>
            <p>Ano: {anime.year}</p>
            <button onClick={() => toggleFavorite(anime.id)}>
              {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimeList;
