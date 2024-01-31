//Paths:
const path = require('path');
const basePath = path.resolve(__dirname, '..');
const publicPath = path.join(basePath, 'public');
const indexPath = path.join(basePath, 'public/index.html');
const envPath = path.join(basePath, '.env');
//Dotenv:
require('dotenv').config({path: envPath});
//Express:
const express = require('express');
const fs = require('fs').promises;
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT;
const tareasFilePath = 'tasks.json';

app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({ extended: true })); // Para que funcione correctamente el formulario
app.use(express.static(publicPath)); // Para servir archivos estáticos

// Servir el index.html cuando se solicite la ruta raíz
app.get('/', function(req, res) {
  res.sendFile(indexPath);
});

// 
app.get('/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(tareasFilePath, 'utf-8');
    let tasks = [];
    tasks = JSON.parse(data); // Redundante, en todo caso comprueba que sea JSON válido, si no lo es, devuelve un error. Y la cosa es que paso de JSON a objeto y luego de objeto a JSON. Podría devolver directamente el JSON. 
    res.json(tasks);
  } catch (error) {
    console.error('Error al leer el archivo de tasks:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor en el get' });
  }
});
// A lo mejor tengo que cambiar la ruta de get y post. 
app.post('/addTask', async (req, res) => {
  try {
    const newTask = {
      id: Date.now(),
      descripcion: req.body.descripcion,
      completada: false,
    };

    let taskList = [];
    const data = await fs.readFile(tareasFilePath, 'utf-8');
    if (data.toString()) {
      taskList = JSON.parse(data);
    }

    taskList.push(newTask);

    await fs.writeFile(tareasFilePath, JSON.stringify(taskList, null, 2), 'utf-8');

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al escribir en el archivo de tasks añadiendo tarea:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});