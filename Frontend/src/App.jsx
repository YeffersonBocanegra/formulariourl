import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Hook personalizado para gestionar campos dinámicos
function useDynamicFields(initialField) {
  const [fields, setFields] = useState([initialField]);

  const addField = () => {
    setFields([...fields, initialField]);
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const updateField = (index, fieldName, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [fieldName]: value,
    };
    setFields(updatedFields);
  };

  return { fields, addField, removeField, updateField };
}

function App() {
  const initialField = {
    url: '',
    comentario: '',
  };

  const { fields, addField, removeField, updateField } = useDynamicFields(initialField);

  const [isUrlValid, setIsUrlValid] = useState(true);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    updateField(index, name, value);

    if (name === 'url') {
      try {
        if (value.trim() === '') {
          setIsUrlValid(true); // Si el campo está vacío, no muestra el mensaje de error.
        } else {
          new URL(value);
          setIsUrlValid(true);
        }
      } catch (error) {
        setIsUrlValid(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isUrlValid) {
        console.error('Al menos una de las URLs no es válida');
        return;
      }

      // Enviar cada conjunto de datos uno por uno al servidor
      for (const field of fields) {
        const response = await axios.post('/api/guardar', field);

        if (response.status === 201) {
          console.log('Dato guardado exitosamente');
          console.log('Respuesta del servidor:', response.data);
        } else {
          console.error('Error al guardar el dato');
        }
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div>
      <h1>Formulario Urls & Comentarios</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <label htmlFor={`url-${index}`}>URL:</label>
            <input
              type="text"
              id={`url-${index}`}
              name="url"
              value={field.url}
              onChange={(e) => handleChange(e, index)}
              required
            />
            {!isUrlValid && field.url.trim() !== '' && <p className="error-message">URL ¡No válida!</p>}
            <label htmlFor={`comentario-${index}`}>Comentario:</label>
            <textarea
              id={`comentario-${index}`}
              name="comentario"
              value={field.comentario}
              onChange={(e) => handleChange(e, index)}
              required
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => removeField(index)}>
                Eliminar Campo
              </button>
            )}
          </div>
        ))}
        <div>
          <button type="submit">Enviar Todos</button>
        </div>
      </form>
      <button onClick={addField}>Agregar Campo</button>
    </div>
  );
}

export default App;