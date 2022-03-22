'use strict'
const GHOST = '円';

var gGhosts;
var gDeadGhost = []

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        ghostColor: '#7FFF00'
    }
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST
}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []
    createGhost(board)
    createGhost(board)
    createGhost(board)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // figure out moveDiff, nextLocation, nextCell
    var moveDiff = getMoveDiff()

    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === SUPER_FOOD) return

    // hitting a pacman?  call gameOver
    if (nextCell === pacMan) {
        if (gPacman.isInSuper) {
            killGhostInSuperMode({ i: nextLocation.i, j: nextLocation.j })
        } else {
            gameEnd('GameOver');
            return
        }
    }

    // moving from corrent position:
    // update the model

    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location
    // update the model
    ghost.location.i = nextLocation.i;
    ghost.location.j = nextLocation.j;
    ghost.currCellContent = nextCell;
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    if (gPacman.isInSuper) return `<span style="color: ${ghost.ghostColor}">${GHOST}</span>`
    else return `<span style="color: ${ghost.color}">${GHOST}</span>`
}

function killGhostInSuperMode(nextCell) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextCell.i && gGhosts[i].location.j === nextCell.j) {
            if (gGhosts[i].currCellContent === FOOD) {
                gGhosts[i].currCellContent = EMPTY
                updateScore(1)
            }
            gDeadGhost.push(gGhosts[i])
            gGhosts.splice(i, 1)
        }
    }
}

function superMode() {
    for (var i = 0; i < gGhosts.length; i++) {
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
    setTimeout(() => {
        gPacman.isInSuper = false;
        gGhosts = gGhosts.concat(gDeadGhost)
        gDeadGhost = []
        for (var i = 0; i < gGhosts.length; i++) {
            renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
        }
    }, 5000);
}
