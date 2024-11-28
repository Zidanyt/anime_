import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import gif from '../../assets/R.gif'

import style from './Top10Animes.module.css' 

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  rating: number;
  isTopTen: boolean;
  userRating?: number;
  globalRating?: number;
  imageUrl: string
}

const Top10Animes: React.FC = () => {
  const [topAnimes, setTopAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userId = sessionStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const [topResponse, favResponse] = await Promise.all([
          axiosInstance.get('/top10', { params: { userId } }),
          axiosInstance.get(`/favorites/${userId}`),
        ]);

        const sortedAnimes = topResponse.data.sort(
          (a: Anime, b: Anime) =>
            (b.globalRating ?? 0) - (a.globalRating ?? 0) || a.title.localeCompare(b.title)
        );

        setTopAnimes(sortedAnimes);
        setFavorites(favResponse.data.map((anime: Anime) => anime.id));
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        setErrorMessage('Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const toggleFavorite = async (animeId: string) => {
    try {
      if (favorites.includes(animeId)) {
        await axiosInstance.delete(`/favorites/${animeId}`, { params: { userId } });
        setFavorites((prev) => prev.filter((id) => id !== animeId));
      } else {
        await axiosInstance.post(`/favorites/${animeId}`, { userId });
        setFavorites((prev) => [...prev, animeId]);
      }
    } catch (error) {
      console.error('Falha ao atualizar favorito:', error);
      setErrorMessage('Falha ao atualizar o status de favorito.');
    }
  };

  if (loading) return <div className={style.container__gif}><img className={style.gif} src={gif} alt="" /></div>
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div>
      <h1 className={style.titulo}>Top 10 Animes</h1>
      <div className={style.container}>
        <ul className={style.cards}>
          {topAnimes.map((anime) => (
            <li className={style.anime_card} key={anime.id}>
              <h2 className={style.sub_titulo}>{anime.title}</h2>
              {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} className={style.animeImage} />}
              <p>Gênero: {anime.genre}</p>
              <p>descrição: {anime.description}</p>
              <p>Ano: {anime.year}</p>
              <p>
                Avaliação global:{' '}
                {anime.globalRating ? `${anime.globalRating.toFixed(1)} / 5` : 'Avalie'}
              </p>
              <p>
                Avaliação sua:{' '}
                {anime.userRating !== undefined ? `${anime.userRating} / 5` : 'Sem Avaliação'}
              </p>
              <button className={style.button} onClick={() => toggleFavorite(anime.id)}>
                {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Top10Animes;
