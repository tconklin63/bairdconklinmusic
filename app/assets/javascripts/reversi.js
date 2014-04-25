var board; // 2D Array containing current game state
var canvas; // HTML canvas object, graphical representation of board
var turn; // 1=white, -1=black

function initReversi() {
  canvas = document.getElementById("myCanvas");
  canvas.addEventListener("mousedown", processMouseClick, false);
  turn = 1;
  board = new Array(8);
  clearBoard();
  drawBoard();
}

function drawBoard() {
  var ctx = canvas.getContext("2d");
  // board
  ctx.fillStyle = "#090";
  ctx.fillRect(0,0,400,400);
  for (var i=1; i<8; i++) {
    // horizontal board lines
    ctx.moveTo(0,50*i);
    ctx.lineTo(400,50*i);
    ctx.stroke();
    // vertical board lines
    ctx.moveTo(50*i,0);
    ctx.lineTo(50*i,400);
    ctx.stroke();
  }
  // pieces
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (board[i][j] == 1) {
        drawPiece(ctx,i,j,'#FFF');
      } else if (board[i][j] == -1) {
        drawPiece(ctx,i,j,'#000');
      }
    }
  }
}

function newGame() {
  clearBoard();
  board[3][3] = 1;
  board[4][4] = 1;
  board[3][4] = -1;
  board[4][3] = -1;
  turn = 1;
  displayMessage('White, your move.');
  drawBoard();
}

function drawPiece(ctx,x,y,color) {
  ctx.beginPath();
  ctx.arc(25+x*50,25+y*50,23,0,2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function clearBoard() {
  for (var i=0; i<8; i++) {
    board[i] = new Array(8);
    for (var j=0; j<8; j++) {
      board[i][j] = 0;
    }
  }
}


function processMouseClick(event) {
  displayAlertMessage('&nbsp;');
  var x = Math.floor((event.pageX - canvas.offsetLeft - 3)/50);
  var y = Math.floor((event.pageY - canvas.offsetTop - 3)/50);
  if (board[x][y] != 0) {
    displayAlertMessage('Not a valid move!');
  } else {
    board[x][y] = turn;
    turn = -turn;
    if (turn == 1) {
      displayMessage('White, your move.');
    } else {
      displayMessage('Black, your move.');
    }
    drawBoard();
  }
}

function displayMessage(text) {
  document.getElementById('message').innerHTML = text;
}

function displayAlertMessage(text) {
  document.getElementById('alertMessage').innerHTML = text;
}

function checkN(x, y) {
  if (y < 2) {
    return false;
  }
  if (board[x][(y - 1)] != -turn) {
    return false;
  }
  var i = 2;
  while (i < y + 1) {
    if (board[x][(y - i)] == turn) {
      return true;
    }
    if (board[x][(y - i)] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkNW(x, y) {
  if ((x < 2) || (y < 2)) {
    return false;
  }
  if (board[(x - 1)][(y - 1)] != -turn) {
    return false;
  }
  if (x < y) {
    var i = 2;
    while (i < x + 1) {
      if (board[(x - i)][(y - i)] == turn) {
        return true;
      }
      if (board[(x - i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < y + 1) {
      if (board[(x - i)][(y - i)] == turn) {
        return true;
      }
      if (board[(x - i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkW(x, y) {
  if (x < 2) {
    return false;
  }
  if (board[(x - 1)][y] != -turn) {
    return false;
  }
  var i = 2;
  while (i < x + 1) {
    if (board[(x - i)][y] == turn) {
      return true;
    }
    if (board[(x - i)][y] == 0) {
      return false;
    }
    i++;
  }
  return false;
}



