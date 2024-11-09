import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate, Link } from 'react-router-dom'

import style from './Register.module.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await axiosInstance.post('/register', { email, password })
      console.log('Registro bem-sucedido:', response.data)
      setSuccessMessage('Cadastro realizado com sucesso!')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error('Erro no registro:', error)
      setError('Erro ao realizar o cadastro.')
    }
  }

  return (
    <div className={style.conteiner}>
      <form className={style.formulario} onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
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
        <button className={style.formulario_button} type="submit">Cadastrar</button>
        <p>Já tem uma conta? <Link className={style.formulario_link} to="/login">Faça login</Link></p>
      </form>

      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    
    </div>
  )
}

export default Register
