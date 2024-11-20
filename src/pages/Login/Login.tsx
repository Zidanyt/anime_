import React, { useState } from 'react'
import axios from '../../utils/axiosInstance'
import { useNavigate, Link  } from 'react-router-dom'

import style from './login.module.css';

interface LoginProps {
  onLogin: () => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/login', { email, password })
      sessionStorage.setItem('token', response.data.token)
      sessionStorage.setItem('userId', response.data.userId)
      onLogin()
      navigate('/anime-list')
    } catch (error) {
      console.error('Erro no login:', error)
      setErrorMessage('Email ou senha incorretos.')
    }
  }

  return (
    <div className={style.conteiner}>
      <form className={style.formulario} onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button className={style.formulario_button} type="submit">Entrar</button>
        <p>Não tem uma conta? <Link className={style.formulario_link} to="/">Cadastre-se</Link></p>
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  )
}

export default Login
