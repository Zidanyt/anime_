import React, { useState } from 'react';
// import axios from '../../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import style from './login.module.css';
import axiosInstance from '../../utils/axiosInstance';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await axiosInstance.post('/login', { email, password });
    const data = response.data;
    console.log('Resposta do backend no login:', data);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userId', data.userId); // Salve o userId
    onLogin(data.userId); // Se você tiver um callback para atualizar o estado de login no App
    navigate('/anime-list');
  } catch (error: any) {
    setError(error.response?.data?.error || 'Erro ao fazer login.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={style.conteiner}>
      <form className={style.formulario} onSubmit={handleSubmit}>
        <h2 translate="no">Login</h2>
        <input
          className={style.formulario_input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={style.formulario_input}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className={`${style.formulario_button} ${isLoading ? style.loading : ''}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <span className={style.spinner}></span> : 'Entrar'}
        </button>
        <p>Não tem uma conta? <Link className={style.formulario_link} to="/">Cadastre-se</Link></p>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;

function setError(_arg0: any) {
  throw new Error('Function not implemented.');
}
