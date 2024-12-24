

//factory function for gameBoard
const GameBoard = () => {
let board = Array(9).fill(null); //3x3 grid

const getBoard = () => board;
const setCell = (index, Value) => {
    if (index >= 0 && index < 9 && !board[index]) {
        board[index] = Value;
        return  true;
    }
    return false; //when an occupied space has been called
}
const resetBoard = () => {
    board = Array(9).fill(null);
};

return {getBoard, setCell, resetBoard };


} //end of gameBoard factory function

//factory function for players
const Players = (name, symbol) => {
 let moves = []; //stores players moves

 const getName = () => name;
 const getSymbol = () => symbol;
 const addMove = (index) => moves.push(index);
 const getMoves = () => moves;
 const resetMoves = () => {
    moves = [];
 };
   return { getName, getSymbol, addMove, getMoves, resetMoves };

}

//factory function for game
const Game = (player1, player2) => {
const gameBoard = GameBoard();
let currentPlayer = player1;
let winner = null;

const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    //Computer automatically make move after player1
    if (currentPlayer === player2 && !winner) {
        computerMove();
    }

};

const makeMove = (index) => {
    if (gameBoard.setCell(index,currentPlayer.getSymbol())) {
        currentPlayer.addMove(index);
        if (checkWinner(currentPlayer.getMoves())) {
            winner = currentPlayer;
        }
        switchTurn();
        return true;
    }
    return false //not a valid move
}
// Function to simulate the computer's move
const computerMove = () => {
    // Get all empty spots on the board
    const emptyIndices = gameBoard.getBoard()
      .map((value, index) => value === null ? index : null)
      .filter(index => index !== null);
    
    // Pick a random empty spot
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    if (randomIndex !== undefined) {
      makeMove(randomIndex);
    }
  };

const checkWinner = (moves) => {
    const winningCombinations = [
        [0, 1, 2], [3,4,5], [6,7,8], //left to right
        [0,3,6], [1,4,7], [2,5,8], //up and down
        [0,4,8], [2,4,6], //diagonal 
    ];
return winningCombinations.some((combination) =>
    combination.every((index) => moves.includes(index))
);
};

const getWinner = () => winner;
const resetGame = () => {
    gameBoard.resetBoard();
    player1.resetMoves();
    player2.resetMoves();
    winner = null;
    currentPlayer = player1;
};
const getCurrentPlayer = () => currentPlayer;
const getGameBoard = () => gameBoard.getBoard();

return { makeMove, getWinner, resetGame, getCurrentPlayer, getGameBoard}

}; //end of game factory function 

//game display  

const displayScreen = () => {
    const player1 = Players("player 1", "X");
    const player2 = Players("computer", "O")
    const game = Game(player1, player2);

    const boardDiv = document.getElementById("board");
    const player1Div = document.getElementById("player1");
    const player2Div = document.getElementById("player2");
    const startButton = document.getElementById("start");
    const resetButton = document.getElementById("reset");

    // Display the current player's symbol on the board
    const updateBoardDisplay = () => {
        const cells = boardDiv.querySelectorAll(".cell");
        const board = game.getGameBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index] ? board[index] : '';
            cell.disabled = board[index] !== null; // Disable already filled cells
        });
    };

// Event listener for making moves
boardDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
        const index = e.target.getAttribute("data-index");
        if (game.makeMove(Number(index))) {
            updateBoardDisplay();
            const winner = game.getWinner();
            if (winner) {
                alert(`${winner.getName()} wins!`);
            }
            else if (game.getGameBoard().every(cell => cell != null)) {
                alert("No winner")
            }
        }
    }
});

// Event listener for the reset button
resetButton.addEventListener("click", () => {
    game.resetGame();
    updateBoardDisplay();
});

 // Event listener for the start button
 startButton.addEventListener("click", () => {
    game.resetGame();
    updateBoardDisplay();
    player1Div.textContent = `Player 1: ${player1.getSymbol()}`;
    player2Div.textContent = `Computer: ${player2.getSymbol()}`;
});

// Initial setup
updateBoardDisplay();

    
};
displayScreen();


/*
const player1 = Players("Jolie", "X");
const player2 = Players("Uwezo", "O");
const game = Game(player1, player2);

game.makeMove(0); //Jolie marks cell 0
game.makeMove(1); // uwezo marks cell 1
game.makeMove(3);//jolie marks cell 3
game.makeMove(4);
game.makeMove(6);

console.log("Winner", game.getWinner()?.getName()); //winner is jolie!
console.log("Game Board", game.getGameBoard())

*/

