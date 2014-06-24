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
var positionScore;
var opponent = -1; // 1=white, -1=black, 0=human
var level = 1; // 1=random, 2=maxFlips, 3=best position, 4=minimax level 3, 4=minimax level 5

function initReversi() {
  canvas = document.getElementById("myCanvas");
  canvas.addEventListener("mousedown", processMouseClick, false);
  turn = 1;
  board = new Array(8);
  newGame();
  positionScore = new Array(8);
  for (var i=0; i<8; i++) {
    positionScore[i] = new Array(8);
  }
  positionScore[0][0] = 10.0;
  positionScore[1][0] = 0.1;
  positionScore[2][0] = 0.5;
  positionScore[3][0] = 0.25;
  positionScore[4][0] = 0.25;
  positionScore[5][0] = 0.5;
  positionScore[6][0] = 0.1;
  positionScore[7][0] = 10.0;
  positionScore[0][1] = 0.1;
  positionScore[1][1] = 0.01;
  positionScore[2][1] = 0.03;
  positionScore[3][1] = 0.05;
  positionScore[4][1] = 0.05;
  positionScore[5][1] = 0.03;
  positionScore[6][1] = 0.01;
  positionScore[7][1] = 0.1;
  positionScore[0][2] = 0.5;
  positionScore[1][2] = 0.03;
  positionScore[2][2] = 0.2;
  positionScore[3][2] = 0.15;
  positionScore[4][2] = 0.15;
  positionScore[5][2] = 0.2;
  positionScore[6][2] = 0.03;
  positionScore[7][2] = 0.5;
  positionScore[0][3] = 0.25;
  positionScore[1][3] = 0.05;
  positionScore[2][3] = 0.15;
  positionScore[3][3] = 0.0;
  positionScore[4][3] = 0.0;
  positionScore[5][3] = 0.15;
  positionScore[6][3] = 0.05;
  positionScore[7][3] = 0.25;
  positionScore[0][4] = 0.25;
  positionScore[1][4] = 0.05;
  positionScore[2][4] = 0.15;
  positionScore[3][4] = 0.0;
  positionScore[4][4] = 0.0;
  positionScore[5][4] = 0.15;
  positionScore[6][4] = 0.05;
  positionScore[7][4] = 0.25;
  positionScore[0][5] = 0.5;
  positionScore[1][5] = 0.03;
  positionScore[2][5] = 0.2;
  positionScore[3][5] = 0.15;
  positionScore[4][5] = 0.15;
  positionScore[5][5] = 0.2;
  positionScore[6][5] = 0.03;
  positionScore[7][5] = 0.5;
  positionScore[0][6] = 0.1;
  positionScore[1][6] = 0.01;
  positionScore[2][6] = 0.03;
  positionScore[3][6] = 0.05;
  positionScore[4][6] = 0.05;
  positionScore[5][6] = 0.03;
  positionScore[6][6] = 0.01;
  positionScore[7][6] = 0.1;
  positionScore[0][7] = 10.0;
  positionScore[1][7] = 0.1;
  positionScore[2][7] = 0.5;
  positionScore[3][7] = 0.25;
  positionScore[4][7] = 0.25;
  positionScore[5][7] = 0.5;
  positionScore[6][7] = 0.1;
  positionScore[7][7] = 10.0;
  if (document.getElementById("white").checked) opponent = 1;
  if (document.getElementbyId("black").checked) opponent = -1;
  if (document.getElementbyId("human").checked) opponent = 0;
  selectLevel();
}

function disableClicks() {
  canvas = document.getElementById("myCanvas");
  canvas.removeEventListener("mousedown", processMouseClick);
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
  if (opponent == 1) {
    message = 'White is thinking...';
  } else {
    message = 'White, your move';
  }
  alertMessage = '&nbsp;';
  undoStack = new Array();
  redoStack = new Array();
  updateScore(board, true);
  displayMessages();
  drawBoard();
  drawBoard(); // To fix the phantom circle problem
  setInterval(function(){
    if (opponent == 0) {
      return false;
    }
    if (turn == opponent) {
      switch(level) {
        case 1:
          randomMove();
          break;
        case 2:
          maxFlips();
          break;
        case 3:
          bestPosition();
          break;
        case 4:
          minimax(4);
          break;
        case 5:
          minimax(5);
          break;
        default:
          return false;
      }
    }
  },
  2000);
}

function selectOpponent(value) {
  opponent = value;
}

function selectLevel() {
  level = document.getElementById("level").selectedIndex + 1;
}

function drawPiece(ctx,x,y,color) {
  // Highlight board where last piece was placed
  if (x == lastX && y == lastY) {
    var highlightColor = '#060';
    if (color == '#000') highlightColor = '#0C0';
    ctx.fillStyle = highlightColor;
    ctx.fillRect(1+x*50,1+y*50,48,48);
  }
  // Draw piece
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

// This method is only used for the actual move.  To test a move with one of the strategy algorithms, call flipPieces directly
function makeMove(x, y) {
  alertMessage = '&nbsp;';
  if (legalMove(x, y, board, turn)) {
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
    flipPieces(x, y, board, turn);
    updateScore(board, true);
    turn = -turn;
    var samePlayerAgain = false;
    if (!hasMoves(board, turn)) {
      turn = -turn;
      if (!hasMoves(board, turn)) {
        message = 'Game over,';
        updateScore(board, true);
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
      if (opponent == 1) {
        message = 'White is thinking...';
      } else {
        message = 'White, your move.';
      }
      if (samePlayerAgain) alertMessage = 'Black has no moves!';
    } else {
      if (opponent == -1) {
        message = 'Black is thinking...';
      } else {
        message = 'Black, your move.';
      }
      if (samePlayerAgain) alertMessage = 'White has no moves!';
    }
    drawBoard();
  } else {
    alertMessage = 'Not a valid move!';
  }
  displayMessages();
}

function hasMoves(tmpBoard, tmpTurn) {
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (legalMove(i, j, tmpBoard, tmpTurn)) {
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

// For actual moves, call makeMove(x, y)
function flipPieces(x, y, tmpBoard, tmpTurn) {
  tmpBoard[x][y] = tmpTurn;
  if (checkN(x, y, tmpBoard, tmpTurn)) {
    flipN(x, y, tmpBoard, tmpTurn);
  }
  if (checkNW(x, y, tmpBoard, tmpTurn)) {
    flipNW(x, y, tmpBoard, tmpTurn);
  }
  if (checkW(x, y, tmpBoard, tmpTurn)) {
    flipW(x, y, tmpBoard, tmpTurn);
  }
  if (checkSW(x, y, tmpBoard, tmpTurn)) {
    flipSW(x, y, tmpBoard, tmpTurn);
  }
  if (checkS(x, y, tmpBoard, tmpTurn)) {
    flipS(x, y, tmpBoard, tmpTurn);
  }
  if (checkSE(x, y, tmpBoard, tmpTurn)) {
    flipSE(x, y, tmpBoard, tmpTurn);
  }
  if (checkE(x, y, tmpBoard, tmpTurn)) {
    flipE(x, y, tmpBoard, tmpTurn);
  }
  if (checkNE(x, y, tmpBoard, tmpTurn)) {
    flipNE(x, y, tmpBoard, tmpTurn);
  }
}

function legalMove(x, y, tmpBoard, tmpTurn) {
  if (tmpBoard[x][y] != 0) {
    return false;
  }
  return checkN(x, y, tmpBoard, tmpTurn) ||
         checkNW(x, y, tmpBoard, tmpTurn) ||
         checkW(x, y, tmpBoard, tmpTurn) ||
         checkSW(x, y, tmpBoard, tmpTurn) ||
         checkS(x, y, tmpBoard, tmpTurn) ||
         checkSE(x, y, tmpBoard, tmpTurn) ||
         checkE(x, y, tmpBoard, tmpTurn) ||
         checkNE(x, y, tmpBoard, tmpTurn);
}

function checkN(x, y, tmpBoard, tmpTurn) {
  if (y < 2) {
    return false;
  }
  if (tmpBoard[x][(y - 1)] != -tmpTurn) {
    return false;
  }
  var i = 2;
  while (i < y + 1) {
    if (tmpBoard[x][(y - i)] == tmpTurn) {
      return true;
    }
    if (tmpBoard[x][(y - i)] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkNW(x, y, tmpBoard, tmpTurn) {
  if ((x < 2) || (y < 2)) {
    return false;
  }
  if (tmpBoard[(x - 1)][(y - 1)] != -tmpTurn) {
    return false;
  }
  if (x < y) {
    var i = 2;
    while (i < x + 1) {
      if (tmpBoard[(x - i)][(y - i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x - i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < y + 1) {
      if (tmpBoard[(x - i)][(y - i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x - i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkW(x, y, tmpBoard, tmpTurn) {
  if (x < 2) {
    return false;
  }
  if (tmpBoard[(x - 1)][y] != -tmpTurn) {
    return false;
  }
  var i = 2;
  while (i < x + 1) {
    if (tmpBoard[(x - i)][y] == tmpTurn) {
      return true;
    }
    if (tmpBoard[(x - i)][y] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkSW(x, y, tmpBoard, tmpTurn) {
  if ((x < 2) || (y > 5)) {
    return false;
  }
  if (tmpBoard[(x - 1)][(y + 1)] != -tmpTurn) {
    return false;
  }
  if (x < 7 - y) {
    var i = 2;
    while (i < x + 1) {
      if (tmpBoard[(x - i)][(y + i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x - i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < 8 - y) {
      if (tmpBoard[(x - i)][(y + i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x - i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkS(x, y, tmpBoard, tmpTurn) {
  if (y > 5) {
    return false;
  }
  if (tmpBoard[x][(y + 1)] != -tmpTurn) {
    return false;
  }
  var i = 2;
  while (i < 8 - y) {
    if (tmpBoard[x][(y + i)] == tmpTurn) {
      return true;
    }
    if (tmpBoard[x][(y + i)] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkSE(x, y, tmpBoard, tmpTurn) {
  if ((x > 5) || (y > 5)) {
    return false;
  }
  if (tmpBoard[(x + 1)][(y + 1)] != -tmpTurn) {
    return false;
  }
  if (x > y) {
    var i = 2;
    while (i < 8 - x) {
      if (tmpBoard[(x + i)][(y + i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x + i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < 8 - y) {
      if (tmpBoard[(x + i)][(y + i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x + i)][(y + i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function checkE(x, y, tmpBoard, tmpTurn) {
  if (x > 5) {
    return false;
  }
  if (tmpBoard[(x + 1)][y] != -tmpTurn) {
    return false;
  }
  var i = 2;
  while (i < 8 - x) {
    if (tmpBoard[(x + i)][y] == tmpTurn) {
      return true;
    }
    if (tmpBoard[(x + i)][y] == 0) {
      return false;
    }
    i++;
  }
  return false;
}

function checkNE(x, y, tmpBoard, tmpTurn) {
  if ((x > 5) || (y < 2)) {
    return false;
  }
  if (tmpBoard[(x + 1)][(y - 1)] != -tmpTurn) {
    return false;
  }
  if (7 - x < y) {
    var i = 2;
    while (i < 8 - x) {
      if (tmpBoard[(x + i)][(y - i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x + i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  } else {
    var i = 2;
    while (i < y + 1) {
      if (tmpBoard[(x + i)][(y - i)] == tmpTurn) {
        return true;
      }
      if (tmpBoard[(x + i)][(y - i)] == 0) {
        return false;
      }
      i++;
    }
  }
  return false;
}

function flipN(x, y, tmpBoard, tmpTurn) {
  var i = y - 1;
  while (i > 0) {
    if (tmpBoard[x][i] == tmpTurn) {
      break;
    }
    if (tmpBoard[x][i] == -tmpTurn) {
      tmpBoard[x][i] = tmpTurn;
    }
    i--;
  }
}

function flipNW(x, y, tmpBoard, tmpTurn) {
  if (x < y) {
    var i = 1;
    while (i < x) {
      if (tmpBoard[(x - i)][(y - i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x - i)][(y - i)] == -tmpTurn) {
        tmpBoard[(x - i)][(y - i)] = tmpTurn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < y) {
      if (tmpBoard[(x - i)][(y - i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x - i)][(y - i)] == -tmpTurn) {
        tmpBoard[(x - i)][(y - i)] = tmpTurn;
      }
      i++;
    }
  }
}

function flipW(x, y, tmpBoard, tmpTurn) {
  var i = x - 1;
  while (i > 0) {
    if (tmpBoard[i][y] == tmpTurn) {
      break;
    }
    if (tmpBoard[i][y] == -tmpTurn) {
      tmpBoard[i][y] = tmpTurn;
    }
    i--;
  }
}

function flipSW(x, y, tmpBoard, tmpTurn) {
  if (x < 7 - y) {
    var i = 1;
    while (i < x) {
      if (tmpBoard[(x - i)][(y + i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x - i)][(y + i)] == -tmpTurn) {
        tmpBoard[(x - i)][(y + i)] = tmpTurn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < 8 - y) {
      if (tmpBoard[(x - i)][(y + i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x - i)][(y + i)] == -tmpTurn) {
        tmpBoard[(x - i)][(y + i)] = tmpTurn;
      }
      i++;
    }
  }
}

function flipS(x, y, tmpBoard, tmpTurn) {
  var i = y + 1;
  while (i < 8) {
    if (tmpBoard[x][i] == tmpTurn) {
      break;
    }
    if (tmpBoard[x][i] == -tmpTurn) {
      tmpBoard[x][i] = tmpTurn;
    }
    i++;
  }
}

function flipSE(x, y, tmpBoard, tmpTurn) {
  if (x > y) {
    var i = 1;
    while (i < 8 - x) {
      if (tmpBoard[(x + i)][(y + i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x + i)][(y + i)] == -tmpTurn) {
        tmpBoard[(x + i)][(y + i)] = tmpTurn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < 8 - y) {
      if (tmpBoard[(x + i)][(y + i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x + i)][(y + i)] == -tmpTurn) {
        tmpBoard[(x + i)][(y + i)] = tmpTurn;
      }
      i++;
    }
  }
}

function flipE(x, y, tmpBoard, tmpTurn) {
  var i = x + 1;
  while (i < 8) {
    if (tmpBoard[i][y] == tmpTurn) {
      break;
    }
    if (tmpBoard[i][y] == -tmpTurn) {
      tmpBoard[i][y] = tmpTurn;
    }
    i++;
  }
}

function flipNE(x, y, tmpBoard, tmpTurn) {
  if (7 - x < y) {
    var i = 1;
    while (i < 8 - x) {
      if (tmpBoard[(x + i)][(y - i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x + i)][(y - i)] == -tmpTurn) {
        tmpBoard[(x + i)][(y - i)] = tmpTurn;
      }
      i++;
    }
  } else {
    var i = 1;
    while (i < y) {
      if (tmpBoard[(x + i)][(y - i)] == tmpTurn) {
        break;
      }
      if (tmpBoard[(x + i)][(y - i)] == -tmpTurn) {
        tmpBoard[(x + i)][(y - i)] = tmpTurn;
      }
      i++;
    }
  }
}

function updateScore(tmpBoard, print) {
  whiteScore = 0;
  blackScore = 0;
  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      if (tmpBoard[i][j] == 1) {
        whiteScore++;
      }
      if (tmpBoard[i][j] == -1) {
        blackScore++;
      }
    }
	}
	if (print) {
    document.getElementById('score').innerHTML = 'White='+whiteScore+', Black='+blackScore;
  }
}

function undo2() {
  undo();
  undo();
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
    updateScore(board, true);
    drawBoard();
    drawBoard(); // To fix the phantom circle problem
  }
}

function redo2() {
  redo();
  redo();
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
    updateScore(board, true);
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

function getValidMoves(tmpBoard, tmpTurn) {
  var validMoves = new Array();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (legalMove(i, j, tmpBoard, tmpTurn)) {
        validMoves.push([i,j]);
      }
    }
  }
  return validMoves;
}

function randomMove() {
  var validMoves = getValidMoves(board, turn);
  var move = Math.floor((Math.random() * validMoves.length)); 
  makeMove(validMoves[move][0], validMoves[move][1]);
}

function maxFlips() {
  var validMoves = getValidMoves(board, turn);
  maxFlipsMove(validMoves);
}

function maxFlipsMove(validMoves) {
  var bestMoves = new Array();
  var currentScoreDiff = whiteScore - blackScore;
  var maxFlips = 0;
  // First get numFlips for each move and maxFlips
  for (var i=0; i<validMoves.length; i++) {
    // try each valid move
    var tmpBoard = copyBoard(board);
    flipPieces(validMoves[i][0], validMoves[i][1], tmpBoard, turn);
    updateScore(tmpBoard, false);
    var scoreDiff = whiteScore - blackScore;
    var numFlips = (scoreDiff*turn - currentScoreDiff*turn)/2;
    validMoves[i][2] = numFlips; // store numFlips with each validMove
    maxFlips = Math.max(maxFlips, numFlips);
  }
  // Now store all moves that equal maxFlips
  for (var i=0; i<validMoves.length; i++) {
    if (validMoves[i][2] == maxFlips) {
      bestMoves.push(validMoves[i]);
    }
  }
  // Randomly select a move in the case of a tie
  var move = Math.floor(Math.random()*bestMoves.length);
  makeMove(bestMoves[move][0], bestMoves[move][1]);
}

function bestPosition() {
  var validMoves = getValidMoves(board, turn);
  var bestMoves = new Array();
  var bestPositionScore = 0.0;
  // Get position scores for all valid moves
  for (var i=0; i<validMoves.length; i++) {
    var x = validMoves[i][0];
    var y = validMoves[i][1];
    var ps = positionScore[x][y];
    bestPositionScore = Math.max(bestPositionScore, ps);
    validMoves[i][2] = ps;
  }
  // Build array of best position moves
  for (var i=0; i<validMoves.length; i++) {
    if (validMoves[i][2] == bestPositionScore) {
      bestMoves.push(validMoves[i]);
    }
  }
  // Choose the maxFlips among the ties for best position
  maxFlipsMove(bestMoves);
}

function minimax(depth) {
  var validMoves = getValidMoves(board, turn);
  if (validMoves.length > 8) {
    depth--;
  }
  if (validMoves.length > 15) {
    depth--;
  }
  var bestMoves = new Array();
  var bestScore = -1000000;
  // Call recursive minimax function on each move to get best scores for each valid move
  for (var i=0; i<validMoves.length; i++) {
    var tmpBoard = copyBoard(board);
    flipPieces(validMoves[i][0], validMoves[i][1], tmpBoard, turn);
    var score = -1000000;
    score = -minimaxRecursive(tmpBoard, -turn, depth, -1000000, 1000000, validMoves[i][0], validMoves[i][1]);
    console.log(validMoves[i][0] + ',' + validMoves[i][1] + '=' + score);
    bestScore = Math.max(score, bestScore);
    validMoves[i][2] = score;
  }
  // Store all moves within 0.2 of bestScore
  for (var i=0; i<validMoves.length; i++) {
    if (validMoves[i][2] >= (bestScore - 0.2)) {
      bestMoves.push(validMoves[i]);
    }
  }
  // Randomly select from among the best moves
  var move = Math.floor(Math.random()*bestMoves.length);
  console.log('selected move: ' + bestMoves[move][0] + ',' + bestMoves[move][1]);
  makeMove(bestMoves[move][0], bestMoves[move][1]);
}

function minimaxRecursive(tmpBoard, tmpTurn, depth, alpha, beta, x, y) {
  // Terminal condition: reached maxDepth or no valid moves
  var validMoves = getValidMoves(tmpBoard, tmpTurn);
  if ((depth == 0) || (validMoves.length == 0)) {
    var score = calculateHeuristic(tmpBoard, tmpTurn, x, y);
    if (validMoves.length == 0) score += 100.0;
    return score;
  }
  for (var i=0; i<validMoves.length; i++) {
    var nextBoard = copyBoard(tmpBoard);
    flipPieces(validMoves[i][0], validMoves[i][1], nextBoard, tmpTurn);
    alpha = Math.max(alpha, -minimaxRecursive(nextBoard, -tmpTurn, depth - 1, -beta, -alpha, validMoves[i][0], validMoves[i][1]));
    // Pruning
    if (alpha >= beta) {
      break;
    }
  }
  return alpha;
}

function calculateHeuristic(tmpBoard, tmpTurn, x, y) {
  var value = 0.0;
  var numEmpty = 0;
  var playerCount = 0;
  var opponentCount = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (tmpBoard[i][j] == -tmpTurn) {
        opponentCount++;
      } else if (tmpBoard[i][j] == tmpTurn) {
        playerCount++
      } else {
        numEmpty++
      }
    }
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (tmpBoard[i][j] == tmpTurn) {
        value += positionScore[i][j]*numEmpty/32.0 + 1.0;
      } else if (tmpBoard[i][j] == -tmpTurn) {
        value -= positionScore[i][j]*numEmpty/32.0 + 1.0;
      }
    }
  }
  if (opponentCount == 0) {
    value += 1000.0;
  }
  if (playerCount == 0) {
    value -= 1000.0;
  }
  return value + positionScore[x][y]*numEmpty/16.0;
}

