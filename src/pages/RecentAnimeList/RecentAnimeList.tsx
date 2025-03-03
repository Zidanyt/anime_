import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import gif from '../../assets/R.gif';
import { useSearch } from '../../SearchContext';

import style from './recentAnime.module.css';

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  rating: number;
  imageUrl: string;
  userRating?: number | null;
}

const RecentAnimeList: React.FC = () => {
  const [recentAnimes, setRecentAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { searchTerm } = useSearch();

  const userId = sessionStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchRecentAnimes = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/recent', {
          params: { userId },
        });
        setRecentAnimes(response.data);
        setFilteredAnimes(response.data);
      } catch (error) {
        console.error('Erro ao buscar animes recentes:', error);
        setErrorMessage('Erro ao buscar animes recentes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnimes();
  }, [userId]);

  useEffect(() => {
    const filtered = recentAnimes.filter((anime) =>
      anime.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredAnimes(filtered);
  }, [searchTerm, recentAnimes]);

  if (loading)
    return (
      <div className={style.container__gif}>
        <img className={style.gif} src={gif} alt="Carregando..." />
      </div>
    );
  if (errorMessage) return <div>{errorMessage}</div>;
  if (!recentAnimes.length) return <div>No recent animes available.</div>;

  return (
    <div>
      <h1 className={style.titulo}>Animes Recentes</h1>
      <div className={style.container}>
        <ul className={style.cards}>
          {filteredAnimes.map((anime) => (
            <li className={style.anime_card} key={anime.id}>
              <h2 className={style.sub_titulo}>{anime.title}</h2>
              {anime.imageUrl && (
                <img
                  src={anime.imageUrl}
                  alt={anime.title}
                  className={style.animeImage}
                />
              )}
              <p>Gênero: {anime.genre}</p>
              <p>descrição: {anime.description}</p>
              <p>Ano: {anime.year}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentAnimeList;
