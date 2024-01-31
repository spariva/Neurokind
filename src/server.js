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
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT;

// Para poder leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio actual
app.use(express.static(__dirname));

app.put('/editarTarea/:id', (req, res) => {
    const id = req.params.id;
    const tareaActualizada = req.body;

    fs.readFile('tareas.json', (err, data) => {
        if (err) throw err;

        let tareas = JSON.parse(data);

        // Encontrar el índice de la tarea con el ID correspondiente
        const index = tareas.findIndex(tarea => tarea.id == id);

        // Si la tarea no se encuentra, enviar un error
        if (index === -1) {
            res.status(404).send('Tarea no encontrada');
            return;
        }

        // Actualizar la tarea en el array (solo campos cambiados)
        tareas[index] = {...tareas[index], ...tareaActualizada};

        fs.writeFile('tareas.json', JSON.stringify(tareas), (err) => {
            if (err) throw err;
            res.sendStatus(200); 
        });
    });
});

app.delete('/eliminarTarea/:id', (req, res) => {
    const id = req.params.id; 

    fs.readFile('tareas.json', (err, data) => {
        if (err) throw err;

        let tareas = JSON.parse(data);

        // Encontrar el índice de la tarea con el ID correspondiente
        const index = tareas.findIndex(tarea => tarea.id == id);

        // Si la tarea no se encuentra, enviar un error
        if (index === -1) {
            res.status(404).send('Tarea no encontrada');
            return;
        }

        // Eliminar la tarea del array
        tareas.splice(index, 1);

        fs.writeFile('tareas.json', JSON.stringify(tareas), (err) => {
            if (err) throw err;
            res.sendStatus(200); 
        });
    });
});

app.post('/anadirTarea', (req, res) => {
    const tarea = {
        id: Date.now(), //su id sera unico segun la hora de creacion
        nombre: req.body.tarea,
        categoria: req.body.categoria,
        fecha: req.body.fecha,
        color: req.body.color
    };

    fs.readFile('tareas.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Si el archivo no existe, crea uno nuevo
            return fs.writeFile('tareas.json', JSON.stringify([tarea]), error => {
                if (error) throw error;
                res.redirect('/index.html?mensaje=¡Tarea%20añadida y fichero JSON creado!');
            });
        } else if (err) {
            throw err;
        }

        let tareas = [];
        if (data.toString()) {
            tareas = JSON.parse(data);
        }
        tareas.push(tarea);

        fs.writeFile('tareas.json', JSON.stringify(tareas), error => {
            if (error) res.redirect('/index.html?error=Error al añadir la tarea');

            res.redirect('/index.html?mensaje=¡Tarea%20añadida!');
        });
    });
});

// Nueva ruta para enviar los datos de las tareas al cliente
app.get('/tareas', (req, res) => {
    fs.readFile('tareas.json', (err, data) => {
        if (err) throw err;
        let tareas = [];
        if (data.toString()) {
            tareas = JSON.parse(data);
        }
        res.send(tareas);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el http://localhost:${PORT}`);
});
