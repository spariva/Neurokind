document.getElementById('mostrarFormulario').addEventListener('click', function() {
    const form = document.querySelector('.formulario');
    form.classList.toggle('hidden'); 
});

// Cuando se envía el formulario de edición
document.querySelector('#editTareaForm').addEventListener('submit', function (event) {
    // Evita el comportamiento de envío de formulario predeterminado
    event.preventDefault();

    const idTarea = document.querySelector('#editId').value;

    const tareaActualizada = {
        id: document.querySelector('#editId').value,
        nombre: document.querySelector('#editNombre').value,
        categoria: document.querySelector('#editCategoria').value,
        fecha: document.querySelector('#editFecha').value,
        color: document.querySelector('#editColor').value
    };

    /*fetch(`/editarTarea/${idTarea}`, { method: 'PUT' })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, oculta el formulario de edición y recarga las tareas
            document.querySelector('#editForm').style.display = 'none';
            window.location.href = 'index.html?mensaje=Tarea editada :)';
        } else {
            console.error('Error al actualizar la tarea');
            window.location.href = 'index.html?error=Problema al editar la tarea';
        }*/

    //Envio de una solicitud PUT 
    console.log(fetch);
    console.log(idTarea, tareaActualizada);
    fetch(`/actualizarTarea/${idTarea}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tareaActualizada),
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, oculta el formulario de edición y recarga las tareas
            document.querySelector('#editForm').style.display = 'none';
            window.location.href = 'index.html?mensaje=Tarea editada :)';
        } else {
            console.error('Error al actualizar la tarea');
            window.location.href = 'index.html?error=Problema al editar la tarea';
        }
    });
});