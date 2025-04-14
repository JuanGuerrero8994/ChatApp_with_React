import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const chatLog = useRef(null);
  const ws = useRef(null);

  // Obtener token de la URL y decodificar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get("token");

    if (!rawToken) {
      alert("Token no proporcionado en la URL.");
      throw new Error("Falta el token en la URL");
    }

    const token = decodeURIComponent(rawToken);
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    setCurrentUser(payload.sub.split("@")[0]); // Obtener el nombre del usuario

    const roomId = "67f68247912e873bec58ca8d"; // ID de la sala
    ws.current = new WebSocket(`ws://localhost:8080/chat/${roomId}?token=${encodeURIComponent("Bearer " + token)}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onopen = () => console.log("🟢 Conectado como", currentUser);
    ws.current.onerror = (e) => console.error("❌ Error WebSocket", e);
    ws.current.onclose = () => console.warn("🔴 Conexión cerrada");

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Enviar mensaje
  const sendMessage = () => {
    if (input.trim()) {
      const messagePayload = {
        sender: currentUser,
        message: input.trim(),
        timestamp: Date.now(),
      };
      ws.current.send(JSON.stringify(messagePayload));
      setInput(''); // Limpiar el campo de entrada
    }
  };

  // Renders los mensajes en el chat
  const renderMessages = () => {
    return messages.map((data, index) => {
      const isSender = data.sender === currentUser;
      return (
        <div key={index} className={`message p-3 rounded-lg mb-2 ${isSender ? 'bg-[#dcf8c6] self-end' : 'bg-white self-start'}`}>
          {!isSender && (
            <div className="font-semibold text-xs text-gray-500 mb-1">{data.sender}</div>
          )}
          <div>{data.message}</div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-[#f0f2f5]">
      {/* Chat Box */}
      <div className="chat bg-white w-full max-w-md h-[600px] rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="header bg-[#075e54] text-white text-center py-4 font-semibold">
          👤 {currentUser || 'Cargando usuario...'}
        </div>

        {/* Messages Area */}
        <div className="messages flex-1 overflow-y-auto p-4 bg-[#e5ddd5]" ref={chatLog}>
          {renderMessages()}
        </div>

        {/* Input Area */}
        <div className="input-group flex items-center p-2 border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg border-gray-300"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-[#128c7e] text-white px-4 py-2 rounded-lg"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
