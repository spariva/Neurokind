const express = require('express');
const fs = require('fs').promises;
const cors = require('cors'); // Agregamos la librería 'cors'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Habilitamos CORS

const tareasFilePath = 'tareas.json';

app.get('/api/tareas', async (req, res) => {
  try {
    const data = await fs.readFile(tareasFilePath, 'utf-8');
    const tareas = JSON.parse(data);
    res.json(tareas);
  } catch (error) {
    console.error('Error al leer el archivo de tareas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

app.post('/api/tareas', async (req, res) => {
  try {
    const nuevaTarea = {
      id: Date.now(),
      descripcion: req.body.descripcion,
      completada: false,
    };

    const data = await fs.readFile(tareasFilePath, 'utf-8');
    const tareas = JSON.parse(data);

    tareas.push(nuevaTarea);

    await fs.writeFile(tareasFilePath, JSON.stringify(tareas, null, 2), 'utf-8');

    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error('Error al escribir en el archivo de tareas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});