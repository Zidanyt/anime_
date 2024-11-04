// src/components/Top10Animes.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  isTopTen: boolean;
  rating: number; // Adicionando o campo rating
}

const Top10Animes: React.FC = () => {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop10Animes = async () => {
      try {
        const response = await axiosInstance.get('/top10');
        setTopAnimes(response.data);
      } catch (error) {
        console.error('Error fetching Top 10 animes:', error);
        setError('Failed to fetch Top 10 animes.');
      }
    };

    fetchTop10Animes();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Top 10 Animes</h1>
      <ul>
        {topAnimes.map((anime) => (
          <li key={anime.id}>
            <h2>{anime.title}</h2>
            <p>Gênero: {anime.genre}</p>
            <p>{anime.description}</p>
            <p>Ano: {anime.year}</p>
            <p>Avaliação: {anime.rating.toFixed(1)} / 5</p> {/* Exibindo rating */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top10Animes;
