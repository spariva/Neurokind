document.getElementById('mostrarFormulario').addEventListener('click', function() {
    const form = document.querySelector('.formulario');
    form.classList.toggle('hidden'); 
});

document.querySelector('#eliminarTodasLasTareas').addEventListener('click', function() {
    fetch('/eliminarTodasLasTareas', { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                const listaTareas = document.querySelector('.listaTareas');
                while (listaTareas.firstChild) {
                    listaTareas.firstChild.remove();
                }
            } else {
                console.error('Error al eliminar todas las tareas');
            }
        });
});


document.querySelector('#editForm').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const id = document.querySelector('#editId').value;
    const nombre = document.querySelector('#editNombre').value;
    const categoria = document.querySelector('#editCategoria').value;
    const fecha = document.querySelector('#editFecha').value;
    const color = document.querySelector('#editColor').value;

    const tareaActualizada = { nombre, categoria, fecha, color };

    fetch(`/editarTarea/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tareaActualizada),
    })
    .then(response => {
        if (response.ok) {

            document.querySelector('#editForm').style.display = 'none';
            window.location.href = 'index.html?mensaje=Tarea editada';
        } else {
            console.error('Error al actualizar la tarea');
            window.location.href = 'index.html?error=Problema al editar la tarea';
        }
    });
});