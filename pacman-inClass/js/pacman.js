'use strict'
var pacMan = 'ᗧ'
var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 6,
            j: 7
        },
        isSuper: false,
    }
    board[gPacman.location.i][gPacman.location.j] = pacMan
}

function movePacman(ev) {
    if (!gGame.isOn) return

    var nextLocation = getNextLocation(ev);

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // return if cannot move
    if (nextCell === WALL) return

    // hitting a ghost?  call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isInSuper) {
            killGhostInSuperMode({ i: nextLocation.i, j: nextLocation.j })
        } else {
            gameEnd('GameOver');
            return
        }
    } else if (nextCell === FOOD) {
        updateScore(1);
    } else if (nextCell === SUPER_FOOD) {
        if (gPacman.isInSuper) return
        gPacman.isInSuper = true
        superMode()
    } else if (nextCell === CHERRY) {
        updateScore(10);
        gCountFoodOnBoard += 10
    }

    // moving from corrent position:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY);

    // Move the pacman to new location
    // update the model
    gPacman.location.i = nextLocation.i;
    gPacman.location.j = nextLocation.j;
    gBoard[gPacman.location.i][gPacman.location.j] = pacMan
    // update the DOM
    renderCell(gPacman.location, pacMan)

    // ***** CHECK VICTORY! *****
    checkVictory()
}

function getNextLocation(eventKeyboard) {
    // console.log('eventKeyboard.code', eventKeyboard.code)
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            pacMan = 'ᗢ'
            nextLocation.i--;
            break;
        case 'ArrowDown':
            pacMan = 'ᗣ'
            nextLocation.i++
            break;
        case 'ArrowLeft':
            pacMan = 'ᗤ'
            nextLocation.j--
            break;
        case 'ArrowRight':
            pacMan = 'ᗧ'
            nextLocation.j++
            break;
        default: return null
    }
    return nextLocation;
}

function checkVictory() {
    console.log('gGame.score: ', gGame.score);
    console.log('gCountFoodOnBoard: ', gCountFoodOnBoard);
    if (gGame.score === gCountFoodOnBoard) return gameEnd('Winner');
}