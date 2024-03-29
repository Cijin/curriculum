//canvas to draw the drag rectangle
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let rect = {},
drag = false;
//array to store object instances of grid
let squares = [];
let rows = 5;
//50 for block width, 14 for borders and marins on either sides
const containerWidth = rows * (50 + 14);
const container = document.querySelector('.container');
container.style.width = containerWidth;
container.style.height = containerWidth;

const render = (blocks, i = 0) => {
  if (i === blocks) {
    return;
  }
  squares.push(new Block());
  return render (blocks, i + 1);
}
//block class
function Block () {
  const block = document.createElement('div');
  block.className = 'square';
  container.appendChild(block);

  this.removeSelected = () => {
    block.classList.remove('selected');
  }

  this.addSelected = () => {
    block.classList.add('selected');
  }
}

const stopSelection = (i = 0, j = 0) => {
  squares.forEach((square) => square.removeSelected());
};

//hightlights all boxes that come inside the selection rectangle
const highlight = (xPos, yPos, lastXPos, lastYPos, i = xPos, j = yPos) => {
  if (i > lastXPos) {
    return;
  }
  if (j > lastYPos) {
    return highlight (xPos, yPos, lastXPos, lastYPos, i + 1, yPos);
  }
  //gets single value as i goes from 0 - 24
  //will make sense if you try it on a 3 x 3 array on paper
  squares[i + (j * rows)].addSelected();  
  return highlight (xPos, yPos, lastXPos, lastYPos, i, j + 1);
};

canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mousemove', mouseMove);

//starting coordinates for the rectangle
function mouseDown(e) {
  rect.startX = e.pageX;
  rect.startY = e.pageY;
  drag = true;
};

function mouseUp() {
  drag = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
//based on mouses current position and initial position
//calculate width and height of rectangle
function mouseMove(e) {
  if (drag) {
    rect.w = e.pageX - rect.startX;
    rect.h = e.pageY - rect.startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }
};

//draws a filled rectangle using
//start positions and dimensions we have calculated 
//with the help of the funcitons above
function draw() {
  ctx.fillStyle = "rgba(0, 128, 255, 0.3)";
  ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);

  stopSelection();
  //50 block width + 10 for margins + 4 for the border
  let xPos = Math.floor(rect.startX / 64);
  let yPos = Math.floor(rect.startY / 64);
  let lastXPos = Math.floor((rect.startX + rect.w) / 64);
  let lastYPos = Math.floor((rect.startY + rect.h) / 64);
  //for instances where scrolling from bottom to top
  if (xPos > lastXPos && yPos > lastYPos) {
    highlight(lastXPos, lastYPos, xPos, yPos);
  }
  //bottom left to top right
  if(yPos > lastYPos) {
    highlight(xPos, lastYPos, lastXPos, yPos);
  }
  //top right to bottom left
  if(xPos > lastXPos) {
    highlight(lastXPos, yPos, xPos, lastYPos);
  }
  //from top left to bottom right
  highlight(xPos, yPos, lastXPos, lastYPos);
};

render(rows * rows);
