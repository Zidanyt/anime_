// informaçõas sobre os autores(a).

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import gif from '../../assets/R.gif';
import axios from 'axios';
import { useSearch } from '../../SearchContext';
import style from './AnimeList.module.css';

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  imageUrl: string;
  ratings: Rating[];
  currentRating?: number;
}

interface Rating {
  id: string;
  userId: string;
  animeId: string;
  stars: number;
}

interface AnimeListProps {
  showGenres: boolean;
}

const AnimeList: React.FC<AnimeListProps> = ({ showGenres }) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<{ [genre: string]: number }>({});
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId') || ''; // Pegue o userId aqui para outras partes do componente
  console.log('UserId ao montar AnimeList (inicial):', userId);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log('UserId dentro do useEffect:', userId);

    if (!userId) {
      console.warn('UserId não encontrado, abortando busca de animes e favoritos.');
      setLoading(false);
      return;
    }

    fetchAnimes(userId);
    fetchFavorites(userId);
  }, []);

  const fetchAnimes = async (currentUserId: string) => {
    if (!currentUserId) {
      console.error('Tentativa de buscar animes sem UserId.');
      setLoading(false);
      return;
    }
    console.log('fetchAnimes chamado com userId:', currentUserId);
    try {
      const response = await axiosInstance.get('/animes', { params: { userId: currentUserId } });
      console.log('Animes carregados:', response.data);
      setAnimes(response.data);
      setFilteredAnimes(response.data);
      const initialPages: { [genre: string]: number } = {};
      response.data.forEach((anime: Anime) => {
        const normalizedGenre = anime.genre.split(',')[0].trim().toLowerCase();
        if (!(normalizedGenre in initialPages)) {
          initialPages[normalizedGenre] = 0;
        }
      });
      setPages(initialPages);
    } catch (error) {
      console.error('Error fetching animes:', error);
      setError('Failed to fetch animes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async (currentUserId: string) => {
    try {
      const response = await axiosInstance.get(`/favorites/${currentUserId}`);
      setFavorites(response.data.map((anime: Anime) => anime.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchAnimes(userId);
    fetchFavorites(userId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 900) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1200) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newPages: { [genre: string]: number } = {};
    animes.forEach((anime) => {
      const normalizedGenre = anime.genre.split(',')[0].trim().toLowerCase();
      newPages[normalizedGenre] = 0;
    });
    setPages(newPages);
  }, [itemsPerPage, animes]);

  useEffect(() => {
    const filtered = animes.filter((anime) =>
      anime.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    console.log("Filtered Animes with IDs:", filtered.map(anime => ({ id: anime.id, title: anime.title })));
    setFilteredAnimes(filtered);
}, [searchTerm, animes]);

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

      setAnimes(prevAnimes =>
        prevAnimes.map(anime =>
          anime.id === animeId ? { ...anime, currentRating: rating } : anime
        )
      );
      console.log('Estado animes após avaliação:', animes.find(a => a.id === animeId));
      
      setFilteredAnimes(prevFilteredAnimes =>
        prevFilteredAnimes.map(anime =>
          anime.id === animeId ? { ...anime, currentRating: rating } : anime
        )
      );
      console.log('Estado filteredAnimes após avaliação:', filteredAnimes.find(a => a.id === animeId));
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

  const handleCardClick = (animeId: string) => {
    console.log("Anime ID clicked:", animeId);
    navigate(`/animes/${animeId}`);
};

useEffect(() => {
  console.log('Estado animes após atualização:', animes.find(a => a.id === '6745ed69e79fff27b7bb02e4')?.currentRating);
}, [animes]);

useEffect(() => {
  console.log('Estado filteredAnimes após atualização:', filteredAnimes.find(a => a.id === '6745ed69e79fff27b7bb02e4')?.currentRating);
}, [filteredAnimes]);

if (loading)
  return (
    <div className={style.container__gif}>
      <img className={style.gif} src={gif} alt="Carregando..." />
      <p className={style.gif__carregando} translate="no">Carregando...</p>
    </div>
  );
if (error) return <div translate="no">{error}</div>;

const groupedAnimes = filteredAnimes.reduce(
  (acc: { [key: string]: { display: string; items: Anime[] } }, anime) => {
    const rawGenre = anime.genre.split(',')[0].trim();
    const normalizedGenre = rawGenre.toLowerCase();
    if (!acc[normalizedGenre]) {
      acc[normalizedGenre] = { display: rawGenre, items: [] };
    }
    acc[normalizedGenre].items.push(anime);
    return acc;
  },
  {}
);

if (showGenres) {
  return (
    <div translate="no">
      <h1 className={style.titulo} translate="no"></h1>
      {Object.entries(groupedAnimes).map(([normalizedGenre, group]) => {
        const currentPage = pages[normalizedGenre] || 0;
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedAnimes = group.items.slice(startIndex, endIndex);
        const totalPages = Math.ceil(group.items.length / itemsPerPage);

        return (
          <div key={normalizedGenre} translate="no">
            <h2 className={style.sub_titulo} translate="no">{group.display}</h2>
            <div className={style.container}>
            <ul className={`${style.cards} ${paginatedAnimes.length === 1 ? style.centered : ''}`}>
                {paginatedAnimes.map(anime => (
                  <li
                    className={`${style.anime_card} ${style[normalizedGenre]}`}
                    key={anime.id}
                    onClick={() => handleCardClick(anime.id)}
                    translate="no"
                  >
                    <h3 translate="no">{anime.title}</h3>
                    {anime.imageUrl && (
                      <img src={anime.imageUrl} alt={anime.title} className={style.animeImage} />
                    )}
                    <span className={style.conteudo_anime} translate="no">
                      <p>Gênero: {anime.genre}</p>
                      <p>Descrição: {anime.description}</p>
                      <p>Ano: {anime.year}</p>
                    </span>
                    <p translate="no">
                      Sua avaliação:{' '}
                      {anime.currentRating ? anime.currentRating.toFixed(1) : 'Sem Avaliação'}
                    </p>
                    <div translate="no">
                      <span translate="no">Avaliar: </span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={(e) => {
                            e.stopPropagation();
                            rateAnime(anime.id, star);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            color: anime.currentRating && anime.currentRating >= star ? 'gold' : 'gray'
                          }}
                          translate="no"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button
                      className={style.button}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(anime.id);
                      }}
                      translate="no"
                    >
                      {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={style.pagination} translate="no">
              <button
                className={style.skip_button}
                onClick={() =>
                  setPages({ ...pages, [normalizedGenre]: currentPage - 1 })
                }
                disabled={currentPage === 0}
                translate="no"
              >
                Anterior
              </button>
              <span translate="no">
                {currentPage + 1} de {totalPages}
              </span>
              <button
                className={style.skip_button}
                onClick={() =>
                  setPages({ ...pages, [normalizedGenre]: currentPage + 1 })
                }
                disabled={currentPage + 1 >= totalPages}
                translate="no"
              >
                Próximo
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const allAnimes = filteredAnimes.sort((a, b) => a.title.localeCompare(b.title));

return (
  <div translate="no">
    <h1 className={style.titulo} translate="no">Lista de Animes</h1>
    <div className={style.container}> 
      <ul className={`${style.cards} ${allAnimes.length === 1 ? style.centered : ''}`}>
        {allAnimes.map(anime => (
          <li
            className={`${style.anime_card} ${style[anime.genre.split(',')[0].trim().toLowerCase()]}`}
            key={anime.id}
            onClick={() => handleCardClick(anime.id)}
            translate="no"
          >
            <h3 translate="no">{anime.title}</h3>
            {anime.imageUrl && (
              <img src={anime.imageUrl} alt={anime.title} className={style.animeImage} />
            )}
            <span className={style.conteudo_anime} translate="no">
              <p>Gênero: {anime.genre}</p>
              <p>Descrição: {anime.description}</p>
              <p>Ano: {anime.year}</p>
            </span>
            <p translate="no">
              Sua avaliação:{' '}
              {anime.currentRating ? anime.currentRating.toFixed(1) : 'Sem Avaliação'}
            </p>
            <div translate="no">
              <span translate="no">Avaliar: </span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={(e) => {
                    e.stopPropagation();
                    rateAnime(anime.id, star);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    color: anime.currentRating && anime.currentRating >= star ? 'gold' : 'gray'
                  }}
                  translate="no"
                >
                  ★
                </button>
              ))}
            </div>
            <button
              className={style.button}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(anime.id);
              }}
              translate="no"
            >
              {favorites.includes(anime.id) ? 'Remover dos Favoritos' : 'Favoritar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default AnimeList;