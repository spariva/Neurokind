document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formAgregarTarea');
    const listaTareas = document.getElementById('listaTareas');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const descripcion = document.getElementById('descripcion').value;
  
      fetch('http://localhost:3000/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descripcion }),
      })
      .then(response => response.json())
      .then(data => {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = `${data.descripcion} (ID: ${data.id})`;
        listaTareas.appendChild(nuevaTarea);
      })
      .catch(error => console.error('Error al agregar tarea:', error));
    });
  
    fetch('http://localhost:3000/api/tareas')
      .then(response => response.json())
      .then(data => {
        data.forEach(tarea => {
          const nuevaTarea = document.createElement('li');
          nuevaTarea.textContent = `${tarea.descripcion} (ID: ${tarea.id})`;
          listaTareas.appendChild(nuevaTarea);
        });
      })
      .catch(error => console.error('Error al obtener tareas:', error));
  });