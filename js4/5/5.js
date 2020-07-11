const container = document.querySelector('.container');
let max = 3;
let boards = [];

let local = localStorage.getItem('kanban');
let savedData;
if (local) {
  savedData = JSON.parse(local);
}
const initialData = [
  {title: 'To-Do', color: '#07038C', savedTasks: []},
  {title: 'Doing', color: '#0439D9', savedTasks: []},
  {title: 'Done', color: '#056CF2', savedTasks: []},
  {title: 'Approved', color: '#F20505', savedTasks: []}
];
let data = savedData || initialData;
data.forEach((todo, idx) => {
  boards.push(new Todo (idx, todo.title, todo.color, todo.savedTasks));
});

const move = (direction, parentId, todo) => {
  let moveIdx = (direction === 'left') ? parentId - 1 : parentId + 1;
  boards[moveIdx].addNewTask(todo);  
};

//this class contains all the elements of a single
//board
function Todo (id, name, color, savedTasks) {
  let tasks = [];
  let taskId = 0;

  const element = document.createElement('div');
  element.className = 'todoContainer';
  element.id = id;
  //create all the other elements of the todo
  const todoHeader = document.createElement('div');
  todoHeader.className = 'todoHeader';
  todoHeader.style.backgroundColor = color;
  todoHeader.innerHTML = `<h3>${name}</h3>`;
  
  const tasksContainer = document.createElement('div');
  tasksContainer.className = 'tasksContainer';
  
  const textArea = document.createElement('textarea');
  textArea.className = 'todoInput';
  textArea.placeholder = 'Enter new todo here...';
  
  const submitTodo = document.createElement('button');
  submitTodo.className = 'submitButton';  
  submitTodo.innerText = 'Submit';
  submitTodo.addEventListener('click', () => {
    let newTask = textArea.value;
    if (!newTask) {
      return;
    }
    textArea.value = '';  
    this.addNewTask(newTask);    
  });

  this.addNewTask = (todo) => {    
    tasks.push(new Task(taskId++, todo, id, tasksContainer));
    data[id].savedTasks.push(todo);
    localStorage.setItem('kanban', JSON.stringify(data));
  }

  if (savedTasks) {
    savedTasks.forEach((task) => {      
      tasks.push(new Task(taskId++, task, id, tasksContainer));
    });
  }

  element.appendChild(todoHeader);
  element.appendChild(tasksContainer);
  element.appendChild(textArea);
  element.appendChild(submitTodo);
  container.appendChild(element);
};

//this class creates the individual tasks to
//be completed, with the move left and right buttons
function Task (taskId, taskTitle, parentId, tasksContainer) {
  const task = document.createElement('div');
  task.className = 'todo';
  task.id = taskId; 

  if (parentId !== 0) {    
    const leftButton = document.createElement('button');
    leftButton.className = 'leftButton';
    leftButton.innerText = '<';
    leftButton.onclick = () => {
      move('left', parentId, taskTitle);
      this.removeTask();     
    };
    task.appendChild(leftButton);
  }

  const item = document.createElement('p');
  item.className = 'todoText';
  item.innerText = taskTitle;
  item.addEventListener('click', () => {
    if (!confirm(`Are you sure you want to remove ${item.innerText}?`)) {
      return;
    }
    this.removeTask();
  });
  task.appendChild(item);
  
  if (parentId !== max) {
    const rightButton = document.createElement('button');
    rightButton.className = 'rightButton';
    rightButton.innerText = '>';
    rightButton.onclick = () => {      
      move('right', parentId, taskTitle);
      this.removeTask();           
    };
    task.appendChild(rightButton);
  }

  this.removeTask = () => {    
    task.remove();
    let removeIdx = data[parentId].savedTasks.findIndex((task) => task.title === taskTitle);
    data[parentId].savedTasks.splice(removeIdx, 1);
    localStorage.setItem('kanban', JSON.stringify(data));
  }

  tasksContainer.appendChild(task);
};
