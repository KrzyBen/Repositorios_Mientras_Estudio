import React, { useState } from 'react';
import '@styles/Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: 'user', text: userInput }]);
      setUserInput('');
      
      // Simula una respuesta del bot
      setTimeout(() => {
        let botResponse = 'Gracias por tu mensaje. ¿Cómo puedo ayudarte hoy?';
        
        // Lógica para respuestas personalizadas
        if (userInput.toLowerCase().includes('hablar con alguien del personal')) {
          botResponse = 'Puedes contactar con alguien del personal al número +56984628530.';
        } else if (userInput.toLowerCase().includes('hacer una orden')) {
          botResponse = 'Para hacer una orden, por favor ve a nuestra página de órdenes.';
        } else if (userInput.toLowerCase().includes('actualizar el menu')) {
          botResponse = 'El menú se actualiza todos los días después de las 11 AM.';
        } else if (userInput.toLowerCase().includes('horarios de atención')) {
          botResponse = 'Nuestro horario de atención es de lunes a viernes, de 8 AM a 6 PM.';
        } else if (userInput.toLowerCase().includes('ubicación')) {
          botResponse = 'Nos encontramos en la calle Ficticia 123, en el centro de la ciudad.';
        } else if (userInput.toLowerCase().includes('información sobre ofertas')) {
          botResponse = '¡Estén atentos! Ofrecemos descuentos especiales los fines de semana. Visita nuestra página para más detalles.';
        } else if (userInput.toLowerCase().includes('contactar soporte')) {
          botResponse = 'Puedes contactar con nuestro soporte a través de soporte@empresa.com.';
        }

        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: botResponse }
        ]);
      }, 1000);
    }
  };

  const handleOptionClick = (option) => {
    setMessages([...messages, { sender: 'user', text: option }]);
    setShowMenu(false);
    setTimeout(() => {
      let botResponse = '';

      switch (option) {
        case 'Hablar con alguien del personal':
          botResponse = 'Puedes contactar con alguien del personal al número +56984628530.';
          break;
        case 'Hacer una orden':
          botResponse = 'Para hacer una orden, por favor ve a nuestra pestaña de órdenes.';
          break;
        case 'Actualizar el menú':
          botResponse = 'El menú se actualiza todos los días después de las 11 AM.';
          break;
        case 'Horarios de atención':
          botResponse = 'Nuestro horario de atención es de lunes a viernes, de 12 PM a 22 PM.';
          break;
        case 'Ubicación':
          botResponse = 'Nos encontramos en la calle Ficticia 123, en el centro de la ciudad.';
          break;
        case 'Información sobre ofertas':
          botResponse = '¡Estén atentos! Ofrecemos descuentos especiales los fines de semana. Visita nuestra página para más detalles.';
          break;
        case 'Contactar soporte':
          botResponse = 'Puedes contactar con nuestro soporte a través de soporte@empresa.com.';
          break;
        default:
          botResponse = 'Lo siento, no entiendo esa opción.';
      }

      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', text: botResponse }
      ]);
    }, 1000);
  };

  // Asegurarse de que el chatbot se cierre solo cuando se presiona la X
  const handleClose = () => {
    onClose(); // Llama la función de cierre cuando presionas la X
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <button className="close-btn" onClick={handleClose}>X</button>
      <div className="chatbot-header">Asistente Virtual</div>
      <div className="chatbox">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            {message.text}
          </div>
        ))}
        {showMenu && (
          <div className="option-menu">
            <button onClick={() => handleOptionClick('Hablar con alguien del personal')}>Hablar con alguien del personal</button>
            <button onClick={() => handleOptionClick('Hacer una orden')}>Hacer una orden</button>
            <button onClick={() => handleOptionClick('Actualizar el menú')}>Actualizar el menú</button>
            <button onClick={() => handleOptionClick('Horarios de atención')}>Horarios de atención</button>
            <button onClick={() => handleOptionClick('Ubicación')}>Ubicación</button>
            <button onClick={() => handleOptionClick('Información sobre ofertas')}>Información sobre ofertas</button>
            <button onClick={() => handleOptionClick('Contactar soporte')}>Contactar soporte</button>
          </div>
        )}
      </div>
      {!showMenu && (
        <div className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      )}
      <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? 'Cerrar opciones' : 'Mostrar opciones'}
      </button>
    </div>
  );
};

export default Chatbot;
