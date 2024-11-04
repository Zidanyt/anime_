import React, { useState } from 'react';
import axios from '../utils/axiosInstance'; // Importando a instância do axios
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password });
      console.log('Login bem-sucedido:', response.data);
  
      // Armazenar o token e o userId no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // Armazenando o userId
  
      // Redirecionar para a rota dos Anime Lists
      navigate('/anime-list'); // Atualize para a rota correta dos anime lists
    } catch (error) {
      console.error('Erro no login:', error);
      setErrorMessage('Email ou senha incorretos.'); // Atualiza a mensagem de erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Exibe mensagem de erro */}
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
