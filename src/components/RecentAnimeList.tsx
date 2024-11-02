interface Anime {
    id: number; // ou o tipo correto
    title: string;
    // adicione outras propriedades conforme necessário
}

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const RecentAnimeList: React.FC = () => {
    const [recentAnimes, setRecentAnimes] = useState<Anime[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentAnimes = async () => {
        try {
            const response = await axiosInstance.get('/recent') // Altere para o endpoint correto
            console.log('Dados recebidos:', response.data); // Log dos dados recebidos
            setRecentAnimes(response.data);
        } catch (err) {
            console.error('Erro ao buscar animes recentes:', err); // Log de erro
            setError('Erro ao buscar animes recentes.');
        }
    };

    useEffect(() => {
        fetchRecentAnimes();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!recentAnimes.length) {
        return <div>No recent animes available.</div>;
    }

    return (
        <div>
            <h1>Animes Recentes</h1>
            <ul>
                {recentAnimes.map((anime) => (
                    <li key={anime.id}>{anime.title}</li> // Altere para a propriedade correta
                ))}
            </ul>
        </div>
    );
};

export default RecentAnimeList;
