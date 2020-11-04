//
// Lista de tareas
//

//
// M O D E L O
//
// Lista de tareas (Array).
let tareas = [];

fetch('https://js2-tareas-api.netlify.app/api/tareas?uid=28')
  .then((response) => response.json())
  .then((data) => {
    console.log ( 'fetch',data);
    tareas=data;
    for (let i = 0; i < tareas.length; i++) {
      appendTaskDOM(tareas[i]);
    }
  });

// Se lee el contador de tareas del localStorage.
const contadorLocalStorage = localStorage.getItem('contador');
console.log(contadorLocalStorage);

console.log(tareas);

if (contadorLocalStorage) {
  contadorTareas = parseInt(contadorLocalStorage,10);
}

// addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);

  const fetchoptions = {
    method:'POST', //Nombre de los metodos en mayusucla siempre/
    body:JSON.stringify(nuevaTarea),
  };
  fetch('https://js2-tareas-api.netlify.app/api/tareas?uid=28', fetchoptions)
    .then((response) => response.json())
    .then((data)=> {
    });
}
// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {
  let task = '';
  for(let i = 0; i < tareas.length; i++){
    if(tareas[i]._id === id){
    tareas[i].complete = complete;
    task = tareas[i];
    break
    }
  }
  const fetchoptions = {
    method:'PUT', //Nombre de los metodos en mayuscula siempre/
    body:JSON.stringify(task),
  };
  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=28`, fetchoptions)
    .then((response) => response.json())
    .then((data)=> {
      appendTaskDOM(data);
    });
}

// deleteTask(): Borra una tarea.
function deleteTask(id) {
  for(let i = 0; i < tareas.length; i++){
    if(tareas[i]._id === id){
      tareas.splice(i,1)
      break;
    }
  };
}
const fetchoptions = {
    method:'DELETE', //Nombre de los metodos en mayuscula siempre/
  };
fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=28`, fetchoptions)
    .then((response) => response.json())
    .then((data)=> {
      console.log(data);
    });

//
// V I S T A
//

// Lista de tareas (DOM).
const lista = document.getElementById('task-list');

function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  checkbox.dataset.taskId = tarea._id;
  // Label.
  const label = document.createElement('label');
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.dataset.taskId= tarea._id;
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  lista.appendChild(item);
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  // Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {
    const complete = event.currentTarget.checked;
    const taskId = event.currentTarget.dataset.taskId;
    taskStatus(taskId, complete);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const taskId = event.currentTarget.dataset.taskId;
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}


//
// C O N T R O L A D O R
//

// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');

// Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();

  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);

  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
})
