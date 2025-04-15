import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [file, setFile] = useState(null);
  const chatLog = useRef(null);
  const ws = useRef(null);
  const roomId = "67f68247912e873bec58ca8d";

  const generateFileId = (file) => {
    return `${file.name}_${Date.now()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get("token");

    if (!rawToken) {
      alert("Token no proporcionado en la URL.");
      return;
    }

    try {
      const token = decodeURIComponent(rawToken);
      const parts = token.split('.');
      if (parts.length !== 3) {
        alert("Token JWT inválido.");
        return;
      }

      const payloadBase64 = parts[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const username = payload.sub?.split("@")[0] || "Usuario";
      setCurrentUser(username);

      ws.current = new WebSocket(`ws://localhost:8080/chat/${roomId}?token=${encodeURIComponent("Bearer " + token)}`);

      ws.current.onopen = () => console.log("🟢 Conectado como", username);
      ws.current.onerror = (e) => console.error("❌ Error WebSocket", e);
      ws.current.onclose = () => console.warn("🔴 Conexión cerrada");

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message && data.sender) {
            setMessages((prevMessages) => [...prevMessages, data]);
          }
        } catch (err) {
          console.error("❌ Error procesando mensaje:", err);
        }
      };
    } catch (err) {
      console.error("❌ Error procesando el token:", err);
    }

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (chatLog.current) {
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput || file) {
      let fileId = null;
  
      if (file) {
        fileId = generateFileId(file);
  
        // Subir el archivo
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileId", fileId);
  
        try {
          await fetch(`http://localhost:8080/upload`, {
            method: 'POST',
            body: formData,
          });
          console.log("📁 Archivo subido correctamente");
        } catch (error) {
          console.error("❌ Error al subir el archivo:", error);
          return;
        }
      }
  
      // Enviar mensaje con fileId
      const messagePayload = {
        sender: currentUser.trim(),
        message: trimmedInput,
        timestamp: Date.now(),
        chatRoomId: roomId,
        fileId: fileId,
      };
  
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(messagePayload));
        setInput('');  // Limpiar el input
        setFile(null);  // Limpiar el archivo
      } else {
        console.error("❌ WebSocket no está conectado");
      }
    } else {
      console.warn("❌ No hay mensaje o archivo para enviar.");
    }
  };

  const renderMessages = () =>
    messages.map((data, index) => {
      const isSender = data.sender === currentUser;
      const time = new Date(data.timestamp).toLocaleTimeString();

      return (
        <div
          key={index}
          className={`message p-3 rounded-lg mb-2 max-w-[80%] ${isSender ? 'bg-[#dcf8c6] self-end text-right' : 'bg-white self-start'}`}
        >
          {!isSender && (
            <div className="font-semibold text-xs text-gray-500 mb-1">{data.sender}</div>
          )}
          <div>{data.message}</div>
          {data.fileId && (
            <div className="mt-2">
              <a
                href={`/path/to/files/${data.fileId}`} // Ajustá la ruta según tu backend
                download
                className="text-blue-600 hover:underline"
              >
                Descargar archivo
              </a>
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">{time}</div>
        </div>
      );
    });

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-[#f0f2f5]">
      <div className="chat bg-white w-full max-w-md h-[600px] rounded-lg shadow-lg flex flex-col">
        <div className="header bg-[#075e54] text-white text-center py-4 font-semibold">
          👤 {currentUser || 'Cargando usuario...'}
        </div>

        <div className="messages flex-1 overflow-y-auto p-4 bg-[#e5ddd5] flex flex-col" ref={chatLog}>
          {renderMessages()}
        </div>

        <div className="input-group flex items-center p-2 border-t border-gray-300 gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg border-gray-300"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-[#128c7e] text-white px-4 py-2 rounded-lg hover:bg-[#0b5f53]"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
