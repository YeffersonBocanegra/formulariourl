import React, { useState } from 'react';
import axios from 'axios'; // Importar Axios
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    url: '',
    comentario: '',
  });

  const [isUrlValid, setIsUrlValid] = useState(true); // Estado para rastrear la validez de la URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validación de URL en tiempo real
  if (url === 'url') {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    const isValid = urlPattern.test(value);
    setIsUrlValid(isValid);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isUrlValid) {
      console.error('La URL ingresada no es válida');
      return;
    }

    try {
      const response = await axios.post('/api/guardar', formData);

      if (response.status === 201) {
        console.log('Dato guardado exitosamente');
        // Puedes verificar la respuesta del servidor si necesitas más información.
        console.log('Respuesta del servidor:', response.data);
      } else {
        console.error('Error al guardar el dato');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div>
      <h2>Formulario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="comentario">Comentario:</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default App;
