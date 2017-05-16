!function() {

// UserInterface responsible for views and UI behavior
let UserInterface = {
  start: '<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><a href="#" class="button" id="one-player">One Player</a><a href="#" class="button" id="two-player">Two Players</a></header></div>',
  oWins: '<div class="screen screen-win screen-win-one" id="finish"><header><h1>Tic Tac Toe</h1><p class="message">Winner!</p><a href="#" class="button" id="one-player">One Player</a><a href="#" class="button" id="two-player">Two Players</a></header></div>',
  xWins: '<div class="screen screen-win screen-win-two" id="finish"><header><h1>Tic Tac Toe</h1><p class="message">Winner!</p><a href="#" class="button" id="one-player">One Player</a><a href="#" class="button" id="two-player">Two Players</a></header></div>',
  draw: '<div class="screen screen-win screen-win-tie" id="finish"><header><h1>Tic Tac Toe</h1><p class="message">Draw!</p><a href="#" class="button" id="one-player">One Player</a><a href="#" class="button" id="two-player">Two Players</a></header></div>',
};

// loadPage function is called when the games starts and finishes
UserInterface.loadPage = (page) => {

  // Adds player's name to winning screen
  if (page === UserInterface.oWins) {
    page = '<div class="screen screen-win screen-win-one" id="finish"><header><h1>Tic Tac Toe</h1><p class="message">Winner!<br>' + player + '</p><a href="#" class="button" id="one-player">One Player</a><a href="#" class="button" id="two-player">Two Players</a></header></div>';
  }
  // Append the appropriate page to the body
  let body = document.querySelector('body');
  body.innerHTML += page;
  let div = document.querySelector('div.screen');
  let startButtons = div.querySelectorAll('.button');

  // Create start game buttons and set their event handlers
  for (let i = 0; i < startButtons.length; i += 1) {
    startButtons[i].addEventListener('click', (e) => {
        console.log('Start Game');
        document.querySelector('body').removeChild(div);
        Game = new GameController();

        // If one-player game, prompt for player's name
        if (e.target.id === 'one-player') {
          Game.start('one');
        } else {
          Game.start();
        }
        if (page === UserInterface.start) {
          player = prompt('What\'s your name?');
          let playerName = document.querySelector('#player1');
          if(player) {
          playerName.innerHTML = player;
          }
        }
    });
  }
}

// Set UI game board
UserInterface.setGrid = () => {
  UserInterface.showActivePlayer('player1');
  let allCells = document.querySelectorAll('li.box');

  // Add mouseover, mouseout, and click handlers to cells
  for(let i = 0; i < allCells.length; i += 1) {
    allCells[i].id = [i];
    allCells[i].style.backgroundImage = null;
    allCells[i].className ='box';

    allCells[i].addEventListener('mouseover', (e) => {
      if (e.target.className === 'box' || e.target.className === 'box') {
        if (Game.currentPlayer === 'player1') {
          e.target.style.backgroundImage = "url('img/o.svg')";
        } else {
          e.target.style.backgroundImage = "url('img/x.svg')";
        }
      } else {
        e.preventDefault();
      }
    });

    allCells[i].addEventListener('mouseout', (e) => {
      e.target.style.backgroundImage = '';
    });

    allCells[i].addEventListener('click', (e) => {
      if (e.target.className === 'box' || e.target.className === 'box') {
        Game.updateBoard(e.target.id);
      } else {
        e.preventDefault();
      }
    });
  }
}

// Inserts X or O image in chosen cell in UI
UserInterface.insert = (move, player) => {
  let chosenSpot = document.getElementById(move);

  if (Game.currentPlayer === 'player1') {
    chosenSpot.style.backgroundImage = "url('img/o.svg')";
    chosenSpot.className = 'box box-filled-1';
  } else {
    chosenSpot.style.backgroundImage = "url('img/x.svg')";
    chosenSpot.className = 'box box-filled-2';
  }
}

// Indicates active player in UI
UserInterface.showActivePlayer = (player) => {
  let players = document.querySelectorAll('.players');
  players[0].className = 'players';
  players[1].className = 'players';
  activePlayer = document.querySelector('#' + player);
  activePlayer.className = 'players active';
}

// Show start page upon page load
UserInterface.loadPage(UserInterface.start);




// Game Controller controls game functionality, updates game state and user interface
let GameController = function() {
    this.board = [0,1,2,3,4,5,6,7,8];
    this.currentPlayer = 'player1';
    this.numOfPlayers;
    this.currentState;
    this.AIPlayer;

  // Start Game
  this.start = (_numOfPlayers) => {
    UserInterface.setGrid();
    this.numOfPlayers = _numOfPlayers;
    this.currentState = new State();

    // If one-player game, activate AI
    if (this.numOfPlayers === 'one') {
      this.AIPlayer = new AIPlayer(this);
    }
  }

  // Update board, state, and insert X or O in chosen spot
  this.updateBoard = (move) => {
    this.board[move] = this.currentPlayer;
    this.currentState.update(this.board, this.currentPlayer);
    UserInterface.insert(move, this.currentPlayer);
    let emptySpots = this.currentState.checkEmpty(this.currentState.boardState);

    // Check for terminal state
    if (this.currentState.checkTerminalState(this.currentState.boardState)) {
      if (this.currentPlayer === 'player1') {
        UserInterface.loadPage(UserInterface.oWins);
      } else {
        UserInterface.loadPage(UserInterface.xWins);
      }
    } else {
      if (emptySpots.length === 0) {
        UserInterface.loadPage(UserInterface.draw);
      } else {
        this.changeCurrentPlayer();
      }
    }
  }

  // Change current player
  this.changeCurrentPlayer = () => {
    this.currentPlayer = this.currentPlayer === 'player1' ? 'player2': 'player1';
    UserInterface.showActivePlayer(this.currentPlayer);
    if (this.numOfPlayers === 'one' && this.currentPlayer === 'player2') this.AIPlayer.makeMove();
  }
}





// AIPlayer controls AI functions
let AIPlayer = function(_game) {
  let game = _game;

  this.makeMove = () => {
    // AI chooses a random spot
    let emptySpots = game.currentState.checkEmpty(game.currentState.boardState);
    let randomMove = Math.floor(Math.random() * emptySpots.length);
    game.updateBoard(emptySpots[randomMove]);

    // AI calls Minimax function
    // let best = this.getMinimax(game.currentState.boardState, game.currentPlayer);
    // game.updateBoard(best.index);
  }
  // AI runs through all game possibilities from the last move to terminal state to determine the next best move
  // this.getMinimax = (nextBoard, player) => {
  //
  //   // Check for empty spots on the board
  //   let emptySpots = nextBoard.filter(s => s != 'player1' && s != 'player2');
  //
  //   // Check for terminal state of return appropriate value
  //   if (game.currentState.checkTerminalState(nextBoard) && player == 'player1') {
  //     return { score: -10 };
  //   }
  //   else if (game.currentState.checkTerminalState(nextBoard) && player == 'player2') {
  //     return { score: 10 };
  //   }
  //   else if (emptySpots.length === 0 ) {
  //     return { score: 0 };
  //   }
  //
  //   let movesList = [];
  //
  //   // Loop through empty spots
  //   for (let i = 0; i < emptySpots.length; i += 1) {
  //     // Create a move object for each spot
  //     let move = {};
  //     move.index = nextBoard[emptySpots[i]];
  //
  //     // Set the empty spot to the current player
  //     nextBoard[emptySpots[i]] = player;
  //
  //     // Collect score resulted from recursive calls passing next player
  //     if (player == 'player2') {
  //       let result = this.getMinimax(nextBoard, 'player1');
  //       move.score = result.score;
  //     } else {
  //       let result = this.getMinimax(nextBoard, 'player2');
  //       move.score = result.score;
  //     }
  //
  //     // Reset the spot
  //     nextBoard[emptySpots[i]] = move.index;
  //     // Add the move to the movesList
  //     movesList.push(move);
  //   }
  //
  //   // If AI turn, find highest score
  //   let bestMove;
  //   if (player === 'player2') {
  //     let bestScore = -10000;
  //     for (let i = 0; i < movesList.length; i += 1) {
  //       if(movesList[i].score > bestScore) {
  //         bestScore = movesList[i].score;
  //         bestMove = i;
  //       }
  //     }
  //   // If Player 1 turn, find lowest score
  //   } else {
  //     let bestScore = 10000;
  //     for (let i = 0; i < movesList.length; i += 1) {
  //       if (movesList[i].score < bestScore) {
  //         bestScore = movesList[i].score;
  //         bestMove = i;
  //       }
  //     }
  //   }
  //   // Return the best move to makeMove() function
  //   return movesList[bestMove];
  // }
}




// Keep track of game state, and check for a terminal state
let State = function() {
  this.boardState = [];
  this.player = '';

  // Update State
  this.update = (newState, currentPlayer) => {
    this.boardState = newState;
    this.player = currentPlayer;
  }

  // Check for empty cells
  this.checkEmpty = (board) => {
    return board.filter(s => s != 'player1' && s != 'player2');
  }

  // Check for terminal State
  this.checkTerminalState = (board) => {
    let terminalStateReached = false;

    if (board[0] === this.player && board[0] === board[4] && board[0] === board[8] ||
        board[2] === this.player && board[2] === board[4] && board[2] === board[6] ) {
        terminalStateReached = true;
      }
    for (let i = 0; i < 3; i += 1) {
      if (board[i] === this.player && board[i] === board[i+3] && board[i] === board[i+6]) {
        terminalStateReached = true;
      }
    }
    for (let i = 0; i < board.length; i += 3) {
      if (board[i] === this.player && board[i] === board[i+1] && board[i] === board[i+2]) {
        terminalStateReached = true;
      }
    }
    if (terminalStateReached) {
      return true;
    } else {
      return false;
    }
  }
}

}();
