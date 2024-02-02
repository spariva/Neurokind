document.addEventListener('DOMContentLoaded', function () {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');
  
    addTaskForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const taskName = document.getElementById('taskName').value;
  
      fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskName }),
      })
      .then(response => response.json())
      .then(data => {
        const newTask = document.createElement('li');
        newTask.textContent = `${data.taskName} (ID: ${data.id})`;
        taskList.appendChild(newTask);
      })
      .catch(error => console.error('Error al agregar tarea:', error));
    });
  
    fetch('/tasks')
      .then(response => response.json())
      .then(data => {
        data.forEach(task => {
          const newTask = document.createElement('li');
          newTask.textContent = `${task.taskName} (ID: ${task.id})`;
          taskList.appendChild(newTask);
        });
      })
      .catch(error => console.error('Error al obtener tareas:', error));
  });