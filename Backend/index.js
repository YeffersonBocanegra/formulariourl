import express, { json } from 'express';
import { connect, model } from 'mongoose';
const app = express();

// Conectar a la base de datos MongoDB
connect('mongodb://127.0.0.1:27017/FormularioURL', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un modelo para los datos del formulario
const Formulario = model('Formulario', {
  url: String,
  comentario: String,
});

// Configura el middleware para procesar JSON
app.use(json());

// Definir una ruta para guardar datos en la base de datos
app.post('/api/guardar', async (req, res) => {
  try {
    const { url, comentario } = req.body;
    console.log('Datos recibidos:', url, comentario); // Agregar esta línea
    const nuevoDato = new Formulario({ url, comentario });
    await nuevoDato.save();
    res.status(201).json({ mensaje: 'Dato guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el dato:', error); // Agregar esta línea
    res.status(500).json({ mensaje: 'Error al guardar el dato' });
  }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});