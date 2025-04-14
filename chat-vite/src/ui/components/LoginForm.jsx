import React, { useEffect } from 'react'
import { useLoginViewModel } from '../viewModels/useLoginViewModel'
import { useNavigate } from 'react-router-dom'

export const LoginForm = () => {
  const {
    email, setEmail,
    password, setPassword,
    response, loading, error, handleLogin
  } = useLoginViewModel()

  const navigate = useNavigate()

  useEffect(() => {
    if (response?.token) {
      const tokenEncoded = encodeURIComponent(response.token)
      navigate(`/chat?token=${tokenEncoded}`)
    }
  }, [response, navigate])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {loading ? 'Iniciando...' : 'Entrar'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}
