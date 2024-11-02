import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Importando a instância do axios

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axiosInstance.get('/animes'); // Usando a instância do axios
        setAnimes(response.data);
      } catch (error) {
        console.error('Error fetching animes:', error);
        setError('Failed to fetch animes.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimeList;
