import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import gif from '../../assets/R.gif';
import { useSearch } from '../../SearchContext';
import style from './favoritos.module.css';

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  rating: number;
  imageUrl: string;
  isFavorite: boolean;
  userRating?: number;
}

const Favoritos: React.FC = () => {
  const [favoriteAnimes, setFavoriteAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { searchTerm } = useSearch();

  const userId = sessionStorage.getItem('userId'); // Pegue o userId corretamente

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const favResponse = await axiosInstance.get(`/api/animes/favorites/${userId}`);

        console.log('Favorites response:', favResponse.data);
        setFavoriteAnimes(favResponse.data);
        setFilteredAnimes(favResponse.data);
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

  useEffect(() => {
    const filtered = favoriteAnimes.filter((anime) =>
      anime.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredAnimes(filtered);
  }, [searchTerm, favoriteAnimes]);

  const toggleFavorite = async (animeId: string) => {
    if (!userId) {
      setErrorMessage('Usuário não autenticado.');
      return;
    }

    try {
      if (favorites.includes(animeId)) {
        await axiosInstance.delete(`/api/animes/favorites/${userId}/${animeId}`);
        setFavorites((prev) => prev.filter((id) => id !== animeId));
        setFavoriteAnimes((prevAnimes) =>
          prevAnimes.filter((anime) => anime.id !== animeId)
        );
      } else {
        const response = await axiosInstance.post(`/api/animes/favorites/${animeId}`, {
          userId,
        });
        const anime = response.data;
        setFavorites((prev) => [...prev, animeId]);
        setFavoriteAnimes((prevAnimes) => [...prevAnimes, { ...anime, isFavorite: true }]);
      }
    } catch (error) {
      console.error('Falha ao atualizar favorito:', error);
      setErrorMessage('Falha ao atualizar o status de favorito.');
    }
  };

  if (loading)
    return (
      <div className={style.container__gif}>
        <img className={style.gif} src={gif} alt="" />
      </div>
    );
  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div>
      <h1 className={style.titulo}>Favoritos</h1>
      <div className={style.container}>
        <ul className={style.cards}>
          {filteredAnimes.map((anime) => (
            <li className={style.anime_card} key={anime.id}>
              <h2 translate="no" className={style.sub_titulo}>{anime.title}</h2>
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
              <p>
                Avaliação sua:{' '}
                {anime.userRating !== undefined
                  ? `${anime.userRating} / 5`
                  : 'Sem Avaliação'}
              </p>
              <button
                className={style.button}
                onClick={() => toggleFavorite(anime.id)}
              >
                {favorites.includes(anime.id)
                  ? 'Remover dos Favoritos'
                  : 'Favoritar'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Favoritos;