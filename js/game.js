'use strict'
const WALL = '🟦'
const FOOD = '.';
const EMPTY = ' ';
const SUPER_FOOD = '💊'
const CHERRY = '🍒'
const FOOD_COUNT_START = 56
const DEAD = '💀'

var gBoard;
var gCountFoodOnBoard = FOOD_COUNT_START
var addCherryInterval;
var gEmptyCells = []
var gIntervalGhosts;

var gGame = {
    score: 0,
    isOn: false
}

function init() {
    console.log('hello')
    gCountFoodOnBoard = FOOD_COUNT_START
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    addCherryInterval = setInterval(() => addRandomCherry(), 15000);
    gGame.isOn = true;
    gGame.score = 0
    updateScore(gGame.score)
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
            if (i === 1 & (j === 1 || j === SIZE - 2) ||
                (i === SIZE - 2 & (j === 1 || j === SIZE - 2))) {
                board[i][j] = SUPER_FOOD;
            }
        }
    }
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;

}

function addRandomCherry() {
    gEmptyCells = getEmptyCellsBoard(gBoard)
    if (gEmptyCells.length > 0) {
        var randomNum = getRandomInt(0, gEmptyCells.length)
        gBoard[gEmptyCells[randomNum].i][gEmptyCells[randomNum].j] = CHERRY;
        renderCell(gEmptyCells[randomNum], CHERRY)
    }
}

function gameEnd(status) {
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(addCherryInterval)
    if (status === 'GameOver') {
        gBoard[gPacman.location.i][gPacman.location.j] = DEAD;
        renderCell(gPacman.location, DEAD);
        modalPopEndGame('GameOver')
    } else {
        modalPopEndGame('Winner')
    }
}

function modalPopEndGame(status) {
    var elModal = document.querySelector('.modal-end-game')
    var elModalSpan = elModal.querySelector('span')
    elModal.style.display = 'block'

    if (status === 'GameOver') elModalSpan.innerText = 'Game Over!'
    else if (status === 'Winner') elModalSpan.innerText = 'Winner!'
}

function gameRestart() {
    var elModal = document.querySelector('.modal-end-game')
    elModal.style.display = 'none'
    init()
}


