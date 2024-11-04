import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa qualquer mensagem de erro anterior
    setSuccessMessage(null); // Limpa qualquer mensagem de sucesso anterior

    try {
      const response = await axiosInstance.post('/register', { email, password });
      console.log('Registro bem-sucedido:', response.data);
      setSuccessMessage('Cadastro realizado com sucesso!'); // Mensagem de sucesso
      // Redirecionar para a tela de login após o registro
      setTimeout(() => {
        navigate('/login'); // Redireciona para a página de login após 2 segundos
      }, 2000);
    } catch (error) {
      console.error('Erro no registro:', error);
      setError('Erro ao realizar o cadastro.'); // Mensagem de erro
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Cadastrar</button>
      </form>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Register;
