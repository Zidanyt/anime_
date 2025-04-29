import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import style from './AnimeDetails.module.css';
import axios, { AxiosError } from 'axios';

interface Character {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Anime {
  id: string;
  title: string;
  genre: string;
  description: string;
  year: number;
  averageRating: number;
  imageUrl?: string;
  characters: Character[];
}

interface Comment {
  id: string;
  text: string;
  user: {
    email: string;
  };
}

const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const userId = sessionStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) {
        setError('ID do anime não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get<Anime>(`/animes/${id}`);
        setAnime(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          if (axiosError.response) {
            const errorMessage = (axiosError.response.data as { message?: string })?.message || 'Erro ao carregar os detalhes do anime.';
            setError(`Erro ${axiosError.response.status}: ${errorMessage}`);
          } else if (axiosError.request) {
            setError('Não foi possível conectar ao servidor.');
          } else {
            setError('Ocorreu um erro inesperado.');
          }
        } else {
          setError('Ocorreu um erro desconhecido.');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/animes/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    };

    fetchAnime();
    if (id) {
      fetchComments();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment || !userId) return;

    try {
      const response = await axiosInstance.post(`/animes/${id}/comments`, {
        userId: userId,
        text: newComment,
      });

      if (!comments.find((comment) => comment.id === response.data.id)) {
        setComments([response.data, ...comments]);
      }
      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log('Apagando comentário com ID:', commentId);
    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`, {
        data: { userId: userId },
      });
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else if (response.status === 404) {
        alert('Comentário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao apagar comentário:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        alert('Comentário não encontrado.');
      } else {
        alert('Erro ao apagar comentário.');
      }
    }
  };

  const AnimeInfo: React.FC<{ anime: Anime }> = ({ anime }) => (
    <div className={style.details}>
      <p><strong>Gênero:</strong> {anime.genre}</p>
      <p><strong>Descrição:</strong> {anime.description}</p>
      <p><strong>Ano:</strong> {anime.year}</p>
      <p><strong>Nota média:</strong> {anime.averageRating}</p>
      <p><strong>"sinopse"</strong></p>
    </div>
  );

  const AnimeCharacters: React.FC<{ characters: Character[] }> = ({ characters }) => (
    <div className={style.characters}>
      <h2>Personagens</h2>
      {characters && characters.length > 0 ? (
        <ul className={style.charactersList}>
          {characters.map((character) => (
            <li key={character.id} className={style.characterItem}>
              {character.imageUrl && (
                <img src={character.imageUrl} alt={character.name} className={style.characterImage} />
              )}
              <span className={style.span__name}>{character.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum personagem encontrado.</p>
      )}
    </div>
  );

  if (loading) return <div className={style.loader}>Carregando...</div>;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 translate="no" className={style.title}>{anime?.title}</h1>
        {anime && <AnimeInfo anime={anime} />}
      </div>
      <div>
        {anime?.imageUrl && (
          <img src={anime.imageUrl} alt={anime.title} className={style.image} />
        )}
      </div>
      {anime && <AnimeCharacters characters={anime.characters} />}
      <div className={style.comments}>
        <div className={style.commentSection}>
          <h2>Comentários</h2>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Digite seu comentário..."
          />
        </div>
        <button onClick={handleAddComment}>Adicionar Comentário</button>
        <ul className={style.commentsList}>
          {comments.map((comment) => (
            <li className={style.space} key={comment.id}>
              <strong>{comment.user.email}:</strong> {comment.text}
              <button className={style.apagar} onClick={() => handleDeleteComment(comment.id)}>Apagar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnimeDetails;
