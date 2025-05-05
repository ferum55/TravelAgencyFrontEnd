import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';


export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://localhost:7181/api/auth/login', {
        username,
        password,
      })

      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user))
      login(user);
      navigate('/')
    } catch (err: any) {
      setError('Неправильний логін або пароль')
      console.error("Login error:", err.response?.data)

    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Вхід у систему</h2>
        <input
          className="border p-2 w-full rounded"
          type="text"
          placeholder="Логін"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="w-full bg-primary text-white py-2 rounded"
          onClick={handleLogin}
        >
          Увійти
        </button>
        <p className="text-sm text-center">
          Немає акаунта?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Зареєструватися
          </Link>
        </p>

      </div>
    </div>
  );
}