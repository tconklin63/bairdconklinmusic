var board; // 2D Array containing current game state
var canvas; // HTML canvas object, graphical representation of board
var turn; // 1=white, -1=black
var undoStack; // Array of game states
var redoStack; // Array of games states
var message;
var alertMessage;
var lastX; // X coordinate of last piece placed for highlighting
var lastY; // Y coordinate of last piece placed for highlighting
var whiteScore;
var blackScore;

function initReversi() {
  canvas = document.getElementById("myCanvas");
  canvas.addEventListener("mousedown", processMouseClick, false);
  turn = 1;
  board = new Array(8);
  newGame();
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
    // dots
    ctx.beginPath();
    ctx.arc(100,100,3,0,2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100,300,3,0,2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300,100,3,0,2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300,300,3,0,2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
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
  updateScore(true);
  displayMessages();
  drawBoard();
  drawBoard(); // To fix the phantom circle problem
}

function drawPiece(ctx,x,y,color) {
  // Highlight last piece plahed
  if (x == lastX && y == lastY) {
    var highlightColor = '#060';
    if (color == '#000') highlightColor = '#0C0';
    ctx.fillStyle = highlightColor;
    ctx.fillRect(1+x*50,1+y*50,48,48);
  }
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
  var x = Math.floor((event.pageX - canvas.offsetLeft - 3)/50);
  var y = Math.floor((event.pageY - canvas.offsetTop - 3)/50);
  makeMove(x, y);
}

function makeMove(x, y) {
  alertMessage = '&nbsp;';
  if (legalMove(x, y)) {
    var currentGameState = {
      board:copyBoard(board),
      turn:turn,
      message:message,
      lastX:lastX,
      lastY:lastY
    };    
    undoStack.push(currentGameState);
    // For highlighting last move
    lastX = x;
    lastY = y;
    board[x][y] = turn;
    flipPieces(x, y);
    updateScore(true);
    turn = -turn;
    var samePlayerAgain = false;
    if (!hasMoves()) {
      turn = -turn;
      if (!hasMoves()) {
        message = 'Game over,';
        updateScore(true);
        if (whiteScore > blackScore) {
          message += ' white wins!';
        } else if (blackScore > whiteScore) {
          message += ' black wins!';
        } else {
          message += " it's a draw!";
        }
        displayMessages();
        drawBoard();
        return;
      } else {
        samePlayerAgain = true;
      }
    }
    if (turn == 1) {
      message = 'White, your move.';
      if (samePlayerAgain) alertMessage = 'Black has no moves!';
    } else {
      message = 'Black, your move.';
      if (samePlayerAgain) alertMessage = 'White has no moves!';
    }
    drawBoard();
  } else {
    alertMessage = 'Not a valid move!';
  }
  displayMessages();
}

function hasMoves() {
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (legalMove(i, j)) {
        return true;
      }
    }
  }
  return false;
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

function updateScore(print) {
  whiteScore = 0;
  blackScore = 0;
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
	if (print) {
    document.getElementById('score').innerHTML = 'White='+whiteScore+', Black='+blackScore;
  }
}

function undo() {
  if (undoStack.length == 0) {
    alertMessage = "Can't undo";
    displayMessages();
  } else {
    alertMessage = '&nbsp;';
    var currentGameState = {
      board:copyBoard(board),
      turn:turn,
      message:message,
      lastX:lastX,
      lastY:lastY
    };    
    redoStack.push(currentGameState);
    var previousGameState = undoStack.pop();
    board = previousGameState.board;
    turn = previousGameState.turn;
    message = previousGameState.message;
    lastX = previousGameState.lastX;
    lastY = previousGameState.lastY;
    displayMessages();
    updateScore();
    drawBoard();
    drawBoard(); // To fix the phantom circle problem
  }
}

function redo() {
  if (redoStack.length == 0) {
    alertMessage = "Can't redo";
    displayMessages();
  } else {
    alertMessage = '&nbsp;';
    var currentGameState = {
      board:copyBoard(board),
      turn:turn,
      message:message,
      lastX:lastX,
      lastY:lastY
    };    
    undoStack.push(currentGameState);
    var nextGameState = redoStack.pop();
    board = nextGameState.board;
    turn = nextGameState.turn;
    message = nextGameState.message;
    lastX = nextGameState.lastX;
    lastY = nextGameState.lastY;
    displayMessages();
    updateScore();
    drawBoard();
  }
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

function getValidMoves() {
  var validMoves = new Array();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (legalMove(i, j)) {
        validMoves.push([i,j]);
      }
    }
  }
  return validMoves;
}

function randomMove() {
  var validMoves = getValidMoves();
  var move = Math.floor((Math.random() * validMoves.length)); 
  makeMove(validMoves[move][0], validMoves[move][1]);
}

function maxFlips() {
  var validMoves = getValidMoves();
  var bestMoves = new Array();
  // Store current game state in order to restore it before actually making the move
  var currentScoreDiff = whiteScore - blackScore;
  var currentBoard = copyBoard(board);
  var maxFlips = 0;
  // First get numFlips for each move and maxFlips
  for (var i=0; i<validMoves.length; i++) {
    // try each valid move
    flipPieces(validMoves[i][0], validMoves[i][1]);
    updateScore(false);
    scoreDiff = whiteScore - blackScore;
    var numFlips = (scoreDiff*turn - currentScoreDiff*turn)/2;
    validMoves[i][2] = numFlips; // store numFlips with each validMove
    maxFlips = Math.max(maxFlips, numFlips);
    // Reset board
    board = copyBoard(currentBoard);
    updateScore(false);
  }
  // Now store all moves that equal maxFlips
  for (var i=0; i<validMoves.length; i++) {
    if (validMoves[i][2] == maxFlips) {
      bestMoves.push(validMoves[i]);
    }
  }
  // Randomly select a move in the case of a tie
  var move = Math.floor((Math.random() *bestMoves.length)); 
  makeMove(bestMoves[move][0], bestMoves[move][1]);
}

