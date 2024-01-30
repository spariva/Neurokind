const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Para poder leer los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio actual
app.use(express.static(__dirname));

// Ruta para manejar las solicitudes GET a la ruta raíz ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Nueva ruta para enviar los datos de las tareas al cliente
app.get('/tareas', (req, res) => {
    fs.readFile('tareas.json', (err, data) => {
        if (err) throw err;
        const tareas = JSON.parse(data);
        res.send(tareas);
    });
});

// Ruta para añadir una tarea
app.post('/anadirTarea', (req, res) => {
    const tarea = {
        nombre: req.body.tarea,
        categoria: req.body.categoria,
        fecha: req.body.fecha,
        color: req.body.color
    };

    // Leer el archivo JSON existente
    fs.readFile('tareas.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Si el archivo no existe, crea uno nuevo
            return fs.writeFile('tareas.json', JSON.stringify([tarea]), error => {
                if (error) throw error;
                res.send('Tarea añadida y archivo creado!');
                //res.redirect('/');
            });
        } else if (err) {
            throw err;
        }

        // Si el archivo existe, añade la tarea a la lista existente
        let tareas = [];    
        if (data.toString()) {
            tareas = JSON.parse(data);
        }
        tareas.push(tarea);

        fs.writeFile('tareas.json', JSON.stringify(tareas), error => {
            if (error) throw error;
            res.send('Tarea añadida!');
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
