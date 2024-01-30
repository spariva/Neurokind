require('dotenv').config();

const express = require('express');
const fs = require('fs').promises;
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT;
const tareasFilePath = 'tasks.json';
//Paths:
const path = require('path');
const basePath = path.resolve(__dirname, '..');
const publicPath = path.join(basePath, 'public');
const indexPath = path.join(basePath, 'public/index.html');

app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); // Para que funcione correctamente el formulario
app.use(express.static(publicPath)); // Para servir archivos estáticos

// Servir el index.html cuando se solicite la ruta raíz
app.get('/', function(req, res) {
  res.sendFile(indexPath);
});

// 
app.get('/api/tareas', async (req, res) => {
  try {
    const data = await fs.readFile(tareasFilePath, 'utf-8');
    const tareas = JSON.parse(data); // Redundante, en todo caso comprueba que sea JSON válido, si no lo es, devuelve un error. Y la cosa es que paso de JSON a objeto y luego de objeto a JSON. Podría devolver directamente el JSON. 
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