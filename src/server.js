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
app.use(bodyParser.json());

// Servir archivos estáticos desde el directorio actual
app.use(express.static(publicPath));

// Servir el index.html cuando se solicite la ruta raíz, PERO parece que si lo quito no pasa nada.
app.get('/', function(req, res) {
    res.sendFile(indexPath);
  });

// Obtener todas las tareas. Si quito este no pinta nada en el navegador.
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

// Obtener tareas por su color
app.get('/tareas/:color', (req, res) => {
    const color = req.params.color;

    fs.readFile('tareas.json', (err, data) => {
        if (err) throw err;

        let tareas = [];
        let tareasColor = [];
        if (data.toString()) {
            tareas = JSON.parse(data);
        }
        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].color === color) {
                tareasColor.push(tareas[i]);
            }
        }
        res.send(tareasColor);
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
        if (err) {
            throw err;
        }

        let tareas = [];
        if (data.toString()) {
            tareas = JSON.parse(data);
        }
        tareas.push(tarea);

        fs.writeFile('tareas.json', JSON.stringify(tareas), error => {
            if (error) res.redirect('/index.html?error=Error al añadir la tarea');

            res.redirect('/index.html?mensaje=¡Success =)!');
        });
    });
});

app.put('/editarTarea/:id', (req, res) => {
    const idTarea = Number(req.params.id);
    const tareaActualizada = {
        id: idTarea,
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        fecha: req.body.fecha,
        color: req.body.color
    };


    fs.readFile('tareas.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo');
            res.status(500).send('Error al leer el archivo');
        } else {
            let tareas = [];
            if (data.toString()) {
                tareas = JSON.parse(data);
            }

            const index = tareas.findIndex(tarea => Number(tarea.id) === idTarea);
            if (index !== -1) {
                // Reemplazar la tarea actual por la tarea actualizada
                // tareas[index] = { ...tareaActualizada };
                tareas.splice(index, 1);
                tareas.push(tareaActualizada);
                fs.writeFile('tareas.json', JSON.stringify(tareas), 'utf8', err => {
                    if (err) {
                        console.error('Error al escribir en el archivo');
                        res.status(500).send('Error al escribir en el archivo');
                    } else {
                        res.send('Tarea editada :)');
                    }
                });
            } else {
                res.status(404).send('Tarea no encontrada');
            }
        }
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

app.delete('/eliminarTodasLasTareas', (req, res) => {
    fs.writeFile('tareas.json', JSON.stringify([]), 'utf8', err => {
        if (err) {
            console.error('Error al escribir en el archivo');
            res.status(500).send('Error al escribir en el archivo');
        } else {
            res.send('Todas las tareas han sido eliminadas');
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el http://localhost:${PORT}`);
});
