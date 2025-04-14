import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from './ui/components/LoginForm'
import ChatPage from './ui/pages/ChatPage'  // Importación por defecto

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
