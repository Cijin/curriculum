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

//following function removes previous values and the board
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

//directions to look for possible bomb locations
//or empty blocks depending on function use
const directions = [
  [(-1 * rows) - 1], [(-1 * rows)], [(-1 * rows) + 1],
  [-1], [+1],
  [rows - 1], [rows], [rows + 1]
];

//function to check how many if any bombs surrounding a block
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
  directions.forEach((dir) => {
    let index = curPos + parseInt(dir);
    //had to do this otherwise the right end numbers were revealed
    //when they were not supposed to
    if (curPos % rows === 0 && (index + 1) % rows !== 0 && board[index] && !board[index].isBomb) {
      return board[index].select ();
    }
    if (curPos % rows !== 0 && (index % rows) !== 0 && board[index] && !board[index].isBomb) {
      return board[index].select ();
    }
  });
};

function Block (isBomb, pos) {
  const element = document.createElement ('div');
  element.id = pos;
  this.revealed = false;
  element.className = 'block';
  this.value = 0;
  this.isBomb = isBomb;

  element.oncontextmenu = (e) => {
    if (!this.revealed) {
      element.classList.toggle ('flagged');
      e.preventDefault ();
    }
  }

  element.onclick = () => {
    if (this.revealed) {
      return;
    }
    this.revealed = true;
    this.reveal ();

    if (isGameOver ()) {
      if (confirm ("You Win. Play Again?")) {
        return startGame ();
      }
    }
    if (this.isBomb) {
      element.innerHTML = 'B';
      if (confirm ("You Lose. Play Again?")) {
        return startGame ();
      }
    }

    if (this.value) {
      element.innerHTML = this.value;
    }

    if (!this.value && !this.isBomb) {
      revealNeighbours (pos);
    }
  };

  this.reveal = () => {
    element.classList.remove ('flagged');
    return element.classList.add ('reveal');
  };

  this.delete = () => {
    return element.remove ();
  };

  this.select = () => {
    return element.onclick ();
  };

  container.appendChild(element);
};

startGame ();
