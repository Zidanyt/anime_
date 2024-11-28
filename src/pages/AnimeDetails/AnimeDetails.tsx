import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import style from './AnimeDetails.module.css';

const AnimeDetails: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axiosInstance.get(`/animes/${animeId}`);
        setAnime(response.data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={style.container}>
      <h1>{anime.title}</h1>
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} className={style.image} />}
      <p>Gênero: {anime.genre}</p>
      <p>Descrição: {anime.description}</p>
      <p>Ano: {anime.year}</p>
      <p>Nota média: {anime.averageRating}</p>
    </div>
  );
};

export default AnimeDetails;
