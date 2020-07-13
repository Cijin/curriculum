const userInput = document.querySelector('.userInput');
const squaresContainer = document.querySelector('.squaresContainer');
const startButton = document.querySelector('.start');
let squaresArr = [];
let isGameOver = false;
// n x n matrix, sqaures is n
let squares = 0;
let totalSquares = 0;

userInput.focus();

const renderSquares = (n, i = 0) => {
  if (i === n || n < 2) {
    return;
  }
  squaresArr.push(new Square (i));
  return renderSquares(n, i + 1);
};

const turnRandomLightOn = () => {
  let random = Math.floor(Math.random() * squares);
  squaresArr[random].toggleElementLight();
};

const cleanUp = () => {
  squaresContainer.innerHTML = '';  
  squaresArr.forEach((square) => {
    square.delete();
  });
  squaresArr = [];
}

startButton.onclick = () => {
  squares = +userInput.value;
  totalSquares = squares * squares;
  userInput.value = '';

  //removing all previous blocks
  //& deleting old object instances
  if (squaresArr.length) {
    cleanUp();
  }

  const divProportions = squares * 50;
  squaresContainer.style.width = `${divProportions}px`;
  squaresContainer.style.height = `${divProportions}px`;
  
  renderSquares(totalSquares);
  turnRandomLightOn();
};

const gameOver = (i = 0) => {
  if (i === totalSquares) {
    isGameOver = true;    
    alert('You won!');    
    return;
  }
  if (squaresArr[i].isOn()) {
    return;
  }    
  return gameOver(i + 1);
};

const toggleLights = (currentId) => {
  currentId = +currentId;
  squaresArr[currentId].toggleElementLight();
  //left
  if (currentId - 1 >= 0) {
    squaresArr[currentId - 1].toggleElementLight();
  }
  //right
  if (currentId + 1 < totalSquares && ((currentId + 1) % squares) !== 0) {
    squaresArr[currentId + 1].toggleElementLight();
  }
  //top
  if (currentId - squares >= 0) {
    squaresArr[currentId - squares].toggleElementLight();
  }
  //down
  if (currentId + squares < totalSquares) {
    squaresArr[currentId + squares].toggleElementLight();
  }
  //check if gameOver
  gameOver();
};

function Square (id) {
  this.element = document.createElement('div');
  this.element.className = 'square';
  this.element.id = id;

  squaresContainer.appendChild(this.element);

  this.element.addEventListener ('click', () => {
    toggleLights (this.element.id);
  });

  this.toggleElementLight = () => {
    this.element.classList.toggle('on');
  };

  this.isOn = () => {
    return this.element.classList.contains('on');
  };

  this.delete = () => {
    this.element.remove();
  }
};
