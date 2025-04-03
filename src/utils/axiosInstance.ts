import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://anime-api-alpha-red.vercel.app/',
  // baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
