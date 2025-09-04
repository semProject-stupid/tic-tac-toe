//query selectors
const p1Name = document.querySelector("#p1-name");
const p1Mark = document.querySelector("#p1-mark");
const p2Name = document.querySelector("#p2-name");
const p2Mark = document.querySelector("#p2-mark");

const playerInfo = document.querySelector("#player-info");
const main = document.querySelector("#main");
const gameButtons = document.querySelector("#game-buttons");
const gameboardDiv = document.querySelector("#gameboard-div");
const gameTextDiv = document.querySelector("#game-text");
const player1Score = document.querySelector("#player-1-score");
const player2Score = document.querySelector("#player-2-score");
const currentPlayerDiv = document.querySelector("#current-player");
const numberOfGamesDiv = document.querySelector("#number-of-games");
const player1Symbol = document.querySelector("#player-1-symbol");
const player2Symbol = document.querySelector("#player-2-symbol");

const startButton = document.querySelector("#start-game");
const backButton = document.querySelector("#go-back");
const resetButton = document.querySelector("#reset");
const resetScoreButton = document.querySelector("#reset-score"); //resets the entire game
const continueButton = document.querySelector("#continue");
const themeButton = document.querySelector("#theme");

//functions
let themeState = true; //true for dark, false for light
function toggleTheme() {
    document.body.classList.toggle("light");
    themeState ? themeButton.style.backgroundImage = 'url("./images/moon.png")' : themeButton.style.backgroundImage = 'url("./images/sun.png")';
    themeState = !themeState;
    
}
let proceed = false; //false -> incorrect input, true -> correct input
function startGame() {
    proceed = inputValidation();
    if (proceed) {
        playerInfo.style.display = "none"; 
        gameButtons.style.display = "flex"; 
        gameboardDiv.style.display = "grid"; 
        gameTextDiv.style.display = "flex"; 
        resetButton.style.display = "block";
        main.style.display = "flex";
        // gameLogic.resetGame();
        resetScore();
        gameLogic.initPlayers();
        gameboard.createBoard();
        gameboard.scoreBoard(0,0);
    }
    else {
        alert("Both marks cannot be the same");
    }
}

function inputValidation() {
    if (p1Name.value.length > 10) {
        p1Name.value = p1Name.value.substring(0,10);
    }
    if (p2Name.value.length > 10) {
        p2Name.value = p2Name.value.substring(0,10);
    }
    if (p1Mark.value.length > 1) {
        p1Mark.value = p1Mark.value.substring(0,1);
    }
    if (p2Mark.value.length > 1) {
        p2Mark.value = p2Mark.value.substring(0,1);
    }
    if (p1Mark.value == p2Mark.value && p1Mark.value != "") {
        return false;
    }
    else {
        return true;
    }
}
function goBack(event) {
    const answer = confirmation(event);
    if (!answer) return;

    p1Name.value = "";
    p1Mark.value = "";
    p2Name.value = "";
    p2Mark.value = "";

    playerInfo.style.display = "flex";
    gameButtons.style.display = "none"; 
    gameboardDiv.style.display = "none"; 
    gameTextDiv.style.display = "none"; 
    continueButton.style.display = "none";
    main.style.display = "none";
    gameboard.resetGameNumber();
}

function confirmation(event) {
   const answer = confirm("Are you sure you want to go back? All your progress will be lost.");
   if(!answer) {
        event.preventDefault();
   }
    return answer;
}

function reset() {
    gameboard.createBoard();
    gameLogic.resetGame();
}  

function resetScore() {
    gameboard.scoreBoard(0,0);
    gameboard.resetGameNumber();
    gameboard.setWinner("reset");
    gameboard.enableBoard();
    reset();
}

function continueGame() {
    gameboard.increaseGameNumber();
    reset();
    gameboard.enableBoard();
}

//factory function to create player
function createPlayer(name, symbol) {
   let score = 0;
   let playerMarks = [];
   const addNumber = (number) => {
        playerMarks.push(number);
   }
   const increaseScore = () => score++;
   const getScore = () => score;
   const returnNumber = () => playerMarks;
   const setNumber = () => playerMarks = [];
   return {name, symbol, playerMarks, increaseScore, addNumber, returnNumber, setNumber, getScore};
}

//iife for gameboard ui 
const gameboard = (function () {
   const createBoard = () => {
        removeLine();
        updateGameNumberText();
        continueButton.style.display = "none";
        resetButton.style.display = "block";

        if (gameboardDiv.children.length == 8) {
            for (let i = 1; i < 10; i++) {
                let gameButton = document.createElement("button");
                gameButton.id = "btn-"+ i;
                gameButton.classList.add("board-button");
                gameboardDiv.appendChild(gameButton);
                gameButton.addEventListener("click", () => {
                gameLogic.playTurn(i);
            });
        }
        }
        else {
            index = 1;
            for (let child of gameboardDiv.children) {
                child.textContent = "";
            }
        }
        setTurnName(p1Name.value);
   };

   const disableBoard = () => {
        for (let child of gameboardDiv.children) {
            child.disabled = true;
            child.style.backgroundColor = "#2b2929ff";
            child.style.color = "#1f1d1dff";
        }
   };

   const enableBoard = () => {
        for (let child of gameboardDiv.children) {
            child.disabled = false;
            child.style.backgroundColor = "transparent";
            child.style.color = "var(--font)";
        }
   }
   const scoreBoard = (p1Score, p2Score) => {
        if (p1Score == null) {
            player2Score.textContent = p2Name.value + "'s score: " + p2Score;
        }
        else if (p2Score == null) {
            player1Score.textContent = p1Name.value + "'s score: " + p1Score;

        }
        else {
            player1Score.textContent = p1Name.value + "'s score: " + p1Score;
            player2Score.textContent = p2Name.value + "'s score: " + p2Score;
        }
   };

   const setTurnName = (name) => {
        currentPlayerDiv.textContent = `${name}'s turn`;
   }

   const setWinner = (name) => {
        if(name === undefined) {
            currentPlayerDiv.textContent = "Draw! :(";
            continueButton.style.display = "block";
            resetButton.style.display = "none";
            disableBoard();
        }
        else if (name === "reset") {
            currentPlayerDiv.textContent = "";
        }
        else {
           currentPlayerDiv.textContent = `${name} wins!`;
           continueButton.style.display = "block";
           resetButton.style.display = "none";
           disableBoard();
        }
   }
   
   let gameNumber = 1;
   const increaseGameNumber = () => {
        gameNumber++
        updateGameNumberText();
    };
   const getGameNumber = () => gameNumber;
   const resetGameNumber = () => {
        gameNumber = 1;
        updateGameNumberText();
    };
   const updateGameNumberText = () => {
        let tempGameNumber = getGameNumber();
        numberOfGamesDiv.textContent = "Game Number: " + tempGameNumber;
   };

   const setLine = (id) => {
        let tempSelector = document.querySelector(id);
        tempSelector.style.display = "block";
   };
   const removeLine = () => {
        const lines = document.querySelectorAll('.line');

        lines.forEach(line => {
        if (getComputedStyle(line).display === 'block') {
            line.style.display = 'none';
        }
});
   }
   return {createBoard, scoreBoard, setTurnName, setWinner, increaseGameNumber, resetGameNumber, enableBoard, setLine, removeLine};
})();

//iife for game logic
const gameLogic = (function () {
    let currentPlayer;
    let player1;
    let player2;
    let markedNumbers = [];
    
    const resetGame = () => {
        currentPlayer = player1;
        
        if (player1 != undefined) {
            player1.setNumber();
        }
        if (player2 != undefined) {
            player2.setNumber();
        }
        markedNumbers = []
   }

   const initPlayers = () => {
        if (p1Name.value == "") {p1Name.value = "Sabrina";}
        if (p1Mark.value == "") {p1Mark.value = "X";}
        if (p2Name.value == "") {p2Name.value = "Carpenter";}
        if (p2Mark.value == "") {p2Mark.value = "O";}

        player1 = createPlayer(p1Name.value, p1Mark.value);
        player2 = createPlayer(p2Name.value, p2Mark.value);

        player1Symbol.textContent = p1Name.value + "'s symbol: " + p1Mark.value;
        player2Symbol.textContent = p2Name.value + "'s symbol: " + p2Mark.value;

        currentPlayer = player1;
   }
   
   const getCurrentPlayer = () => currentPlayer.name;

   const playTurn = (number) => {
      if (markedNumbers.includes(number)) {
            
      } else {
        currentPlayer.addNumber(number);
        let currentButton = document.querySelector(`#btn-${number}`);
        currentButton.textContent = currentPlayer.symbol;
        markedNumbers.push(number);
        currentPlayer.name == p1Name.value ? gameboard.setTurnName(p2Name.value) : gameboard.setTurnName(p1Name.value); 

        if (currentPlayer.returnNumber().length >= 3) {
            checkWin();
        }
        if (markedNumbers.length == 9 && !checkWin()) {
            gameboard.setWinner();
        }
        switchTurn();
      } 
   }

   const switchTurn = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1
   };

   const checkWin = () => {
        const winningPairs = [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [1,4,7],
            [2,5,8],
            [3,6,9],
            [1,5,9],
            [3,5,7]
        ]
        const tempMarks = currentPlayer.returnNumber();
        let pairMatch = 0;
        let pairFlag = false;
        let winnerFlag = false;
        for (let i = 0; i < winningPairs.length; i++) {
           if (pairFlag) {console.log("reaching end, index 7"); break;}
           pairMatch = 0;
           for (let j = 0; j < 3; j++) {
                if (tempMarks.includes(winningPairs[i][j])) {
                    pairMatch = pairMatch + 1;                    
                    if (pairMatch == 3) {
                        pairMatch = 0;
                        pairFlag = true;
                        winnerFlag = true;
                        gameboard.setWinner(currentPlayer.name);
                        currentPlayer.increaseScore();
                        //setLineId(i);
                        if (currentPlayer.name == p1Name.value) {
                            gameboard.scoreBoard(currentPlayer.getScore(), null);
                        }
                        else {
                            gameboard.scoreBoard(null, currentPlayer.getScore());
                        }
                    } 
                }
           }
        }
        return winnerFlag;
   };

   const setLineId = (i) => {
        switch (i) {
            case 0:
                gameboard.setLine("#line-3");
                break;
            case 1:
                gameboard.setLine("#line-4");
                break;
            case 2:
                gameboard.setLine("#line-5");
                break;
            case 3:
                gameboard.setLine("#line-8");
                break;
            case 4:
                gameboard.setLine("#line-7");
                break;
            case 5:
                gameboard.setLine("#line-6");
                break;
            case 6:
                gameboard.setLine("#line-1");
                break;
            case 7:
                gameboard.setLine("#line-2");
                break;
            default:
                console.log("val of i: ", i);
        }
   }
   return {initPlayers, getCurrentPlayer, playTurn, resetGame};
})();

//event listeners
startButton.addEventListener("click", startGame);
backButton.addEventListener("click", (event) => goBack(event));
resetButton.addEventListener("click", reset);
resetScoreButton.addEventListener("click", resetScore);
continueButton.addEventListener("click", continueGame);

themeButton.addEventListener("click", toggleTheme);
