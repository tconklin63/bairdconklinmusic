var board; // 2D Array containing current game state
var canvas; // HTML canvas object, graphical representation of board
var turn; // 1=white, -1=black
var undoStack; // Array of game states
var redoStack; // Array of games states
var message;
var alertMessage;

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
  message = 'White, your move';
  alertMessage = '&nbsp;';
  undoStack = new Array();
  redoStack = new Array();
  drawBoard();
  updateScore();
  displayMessages();
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
  alertMessage = '&nbsp;';
  var x = Math.floor((event.pageX - canvas.offsetLeft - 3)/50);
  var y = Math.floor((event.pageY - canvas.offsetTop - 3)/50);
  if (legalMove(x, y)) {
    var currentGameState = {
      board:copyBoard(board),
      turn:turn,
      message:message,
      alertMessage:alertMessage
    };    
    undoStack.push(currentGameState);
    board[x][y] = turn;
    flipPieces(x, y);
    // check for valid moves before switching players
    turn = -turn;
    if (turn == 1) {
      message = 'White, your move.';
    } else {
      message = 'Black, your move.';
    }
    drawBoard();
  } else {
    alertMessage = 'Not a valid move!';
  }
  displayMessages();
}

function displayMessages() {
  document.getElementById('message').innerHTML = message;
  document.getElementById('alertMessage').innerHTML = alertMessage;
}

function flipPieces(x, y) {
  if (checkN(x, y)) {
    flipN(x, y);
  }
  if (checkNW(x, y)) {
    flipNW(x, y);
  }
  if (checkW(x, y)) {
    flipW(x, y);
  }
  if (checkSW(x, y)) {
    flipSW(x, y);
  }
  if (checkS(x, y)) {
    flipS(x, y);
  }
  if (checkSE(x, y)) {
    flipSE(x, y);
  }
  if (checkE(x, y)) {
    flipE(x, y);
  }
  if (checkNE(x, y)) {
    flipNE(x, y);
  }
  updateScore();
}

function legalMove(x, y) {
  if (board[x][y] != 0) {
    return false;
  }
  return checkN(x, y) ||
         checkNW(x, y) ||
         checkW(x, y) ||
         checkSW(x, y) ||
         checkS(x, y) ||
         checkSE(x, y) ||
         checkE(x, y) ||
         checkNE(x, y);
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

function checkSW(x, y) {
  if ((x < 2) || (y > 5)) {
    return false;
  }
  if (board[(x - 1)][(y + 1)] != -turn) {
    return false;
  }
  if (x < 7 - y) {
    var i = 2;
    while (i < x + 1) {
      if (board[(x - i)][(y + i)] == turn) {
        return true;
      }
      if (board[(x - i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < 8 - y) {
      if (board[(x - i)][(y + i)] == turn) {
        return true;
      }
      if (board[(x - i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkS(x, y) {
  if (y > 5) {
    return false;
  }
  if (board[x][(y + 1)] != -turn) {
    return false;
  }
  var i = 2;
  while (i < 8 - y) {
    if (board[x][(y + i)] == turn) {
      return true;
    }
    if (board[x][(y + i)] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkSE(x, y) {
  if ((x > 5) || (y > 5)) {
    return false;
  }
  if (board[(x + 1)][(y + 1)] != -turn) {
    return false;
  }
  if (x > y) {
    var i = 2;
    while (i < 8 - x) {
      if (board[(x + i)][(y + i)] == turn) {
        return true;
      }
      if (board[(x + i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < 8 - y) {
      if (board[(x + i)][(y + i)] == turn) {
        return true;
      }
      if (board[(x + i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkE(x, y) {
  if (x > 5) {
    return false;
  }
  if (board[(x + 1)][y] != -turn) {
    return false;
  }
  var i = 2;
  while (i < 8 - x) {
    if (board[(x + i)][y] == turn) {
      return true;
    }
    if (board[(x + i)][y] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkNE(x, y) {
  if ((x > 5) || (y < 2)) {
    return false;
  }
  if (board[(x + 1)][(y - 1)] != -turn) {
    return false;
  }
  if (7 - x < y) {
    var i = 2;
    while (i < 8 - x) {
      if (board[(x + i)][(y - i)] == turn) {
        return true;
      }
      if (board[(x + i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < y + 1) {
      if (board[(x + i)][(y - i)] == turn) {
        return true;
      }
      if (board[(x + i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function flipN(x, y) {
  var i = y - 1;
  while (i > 0) {
    if (board[x][i] == turn) {
      break;
    }
    if (board[x][i] == -turn) {
      board[x][i] = turn;
    }
    i--;
  }
}

function flipNW(x, y) {
  if (x < y) {
    var i = 1;
    while (i < x) {
      if (board[(x - i)][(y - i)] == turn) {
        break;
      }
      if (board[(x - i)][(y - i)] == -turn) {
        board[(x - i)][(y - i)] = turn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < y) {
      if (board[(x - i)][(y - i)] == turn) {
        break;
      }
      if (board[(x - i)][(y - i)] == -turn) {
        board[(x - i)][(y - i)] = turn;
      }
      i++;
    }
  }
}

function flipW(x, y) {
  var i = x - 1;
  while (i > 0) {
    if (board[i][y] == turn) {
      break;
    }
    if (board[i][y] == -turn) {
      board[i][y] = turn;
    }
    i--;
  }
}

function flipSW(x, y) {
  if (x < 7 - y) {
    var i = 1;
    while (i < x) {
      if (board[(x - i)][(y + i)] == turn) {
        break;
      }
      if (board[(x - i)][(y + i)] == -turn) {
        board[(x - i)][(y + i)] = turn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < 8 - y) {
      if (board[(x - i)][(y + i)] == turn) {
        break;
      }
      if (board[(x - i)][(y + i)] == -turn) {
        board[(x - i)][(y + i)] = turn;
      }
      i++;
    }
  }
}

function flipS(x, y) {
  var i = y + 1;
  while (i < 8) {
    if (board[x][i] == turn) {
      break;
    }
    if (board[x][i] == -turn) {
      board[x][i] = turn;
    }
    i++;
  }
}

function flipSE(x, y) {
  if (x > y) {
    var i = 1;
    while (i < 8 - x) {
      if (board[(x + i)][(y + i)] == turn) {
        break;
      }
      if (board[(x + i)][(y + i)] == -turn) {
        board[(x + i)][(y + i)] = turn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < 8 - y) {
      if (board[(x + i)][(y + i)] == turn) {
        break;
      }
      if (board[(x + i)][(y + i)] == -turn) {
        board[(x + i)][(y + i)] = turn;
      }
      i++;
    }
  }
}

function flipE(x, y) {
  var i = x + 1;
  while (i < 8) {
    if (board[i][y] == turn) {
      break;
    }
    if (board[i][y] == -turn) {
      board[i][y] = turn;
    }
    i++;
  }
}

function flipNE(x, y) {
  if (7 - x < y) {
    var i = 1;
    while (i < 8 - x) {
      if (board[(x + i)][(y - i)] == turn) {
        break;
      }
      if (board[(x + i)][(y - i)] == -turn) {
        board[(x + i)][(y - i)] = turn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < y) {
      if (board[(x + i)][(y - i)] == turn) {
        break;
      }
      if (board[(x + i)][(y - i)] == -turn) {
        board[(x + i)][(y - i)] = turn;
      }
      i++;
    }
  }
}

function updateScore() {
  var whiteScore = 0;
  var blackScore = 0;
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (board[i][j] == 1) {
        whiteScore++;
      }
      if (board[i][j] == -1) {
        blackScore++;
      }
    }
	}
	document.getElementById('score').innerHTML = 'White='+whiteScore+', Black='+blackScore;
}

function undo() {
  if (undoStack.length == 0) {
    alertMessage = "Can't undo";
    displayMessages();
  } else {
    var previousGameState = undoStack.pop();
    board = previousGameState.board;
    turn = previousGameState.turn;
    message = previousGameState.message;
    alertMessage = previousGameState.alertMessage;
    drawBoard();
    displayMessages();
  }
}

function redo() {
	
}

function copyBoard(b) {
  var newBoard = new Array(8);
  for (var i=0; i<8; i++) {
    newBoard[i] = new Array(8);
    for (var j=0; j<8; j++) {
      newBoard[i][j] = b[i][j];
    }
  }
  return newBoard;
}
