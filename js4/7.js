const rows = 10;
const board = [];
let isBomb = false;

const container = document.querySelector ('.container');
container.style.width = `${rows * 52}px`;
container.style.height = `${rows * 52}px`;

const render = (blocks, i = 0) => {
  if (i === blocks) {
    return;
  }
  isBomb = Math.random (1) > 0.9;
  board.push(new Block (isBomb, i));
  return render (blocks, i + 1);
};

const cleanUp = () => {
  container.innerHTML = '';
  board.forEach(block => {
    block.delete ();
  });  
};

const isGameOver = (i = 0) => {
  if (i === (rows * rows)) {
    return true;
  }
  if (!board[i].revealed && !board[i].isBomb) {
    return false;
  }
  return isGameOver (i + 1);
};

const startGame = () => {
  cleanUp ();
  render (rows * rows);
  insertVal ();
};

const directions = [
  [(-1 * rows) - 1], [(-1 * rows)], [(-1 * rows) + 1],
  [-1], [+1],
  [rows - 1], [rows], [rows + 1]
];

const insertVal = (i = 0, val = 0) => {
  if (i === (rows * rows)) {
    return;
  }
  if (board[i].isBomb) {
    return insertVal (i + 1, val = 0);
  }
  directions.forEach ((dir) => {
    let index = i + parseInt(dir); 
    if (board[index] && board[index].isBomb) {       
      val += 1;
    }
  });
  board[i].value = val;
  return insertVal (i + 1, val = 0);
};

const revealNeighbours = (curPos) => {
  //use i, j to check for walls
};

function Block (isBomb, pos) {
  const element = document.createElement ('div');
  this.revealed = false;
  element.className = 'block';
  this.value = 0;
  this.isBomb = isBomb; 

  element.onclick = () => {
    if (this.revealed) {
      return;
    }
    this.revealed = true;
    if (isGameOver ()) {
      this.reveal ();
      if (confirm ("You Win. Play Again?")) {
        return startGame ();
      }
    }
    if (this.isBomb) {        
      element.innerHTML = 'B';
      this.reveal ();
      if (confirm ("You Lose. Play Again?")) {
        return startGame ();
      }      
    }
    if (this.value) {
      element.innerHTML = this.value;
      this.reveal ();
    }
    if (!this.value && !this.isBomb) {
      this.reveal ();
      revealNeighbours (pos);
    }  
  };

  this.reveal = () => {
    return element.classList.add ('reveal');
  };

  this.delete = () => {
    return element.remove ();
  };

  this.select = () => {
    return element.onclick ();
  }

  container.appendChild(element);
};

startGame ();