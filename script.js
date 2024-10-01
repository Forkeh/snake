"use strict";

window.addEventListener("load", start);

// ****** CONTROLLER ******
// #region controller
// GAME SETTINGS
const GRID_ROWS = 20;
const GRID_COLS = 20;

function start() {
    console.log(`Javascript kører`);

    document.addEventListener("keydown", keyPress);

    createModel(GRID_ROWS, GRID_COLS);

    createVisualBoard();

    // start ticking
    tick();
}

function keyPress(event) {
    console.log(event);
    switch (event.key) {
        case "ArrowLeft":
            {
                direction = "left";
            }
            break;
        case "ArrowRight":
            direction = "right";
            break;
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;

        default:
            break;
    }
}

function tick() {
    // setup next tick
    setTimeout(tick, 500);

    // remove player from model
    for (const part of queue) {
        writeToCell(part.row, part.col, 0);
    }

    const head = {
        row: queue[queue.length - 1].row,
        col: queue[queue.length - 1].col,
    };

    switch (direction) {
        case "left":
            {
                head.col--;
                if (head.col < 0) {
                    head.col = GRID_COLS - 1;
                }
            }
            break;
        case "right":
            {
                head.col++;
                if (head.col > GRID_COLS - 1) {
                    head.col = 0;
                }
            }

            break;
        case "up":
            {
                head.row--;
                if (head.row < 0) {
                    head.row = GRID_ROWS - 1;
                }
            }
            break;
        case "down":
            {
                head.row++;
                if (head.row > GRID_ROWS - 1) {
                    head.row = 0;
                }
            }
            break;

        default:
            break;
    }

    // Indsæt nyt hoved på slange
    queue.push(head);

    // Fjern sidste del af slange
    queue.shift();

    // re-add player to model
    for (const part of queue) {
        writeToCell(part.row, part.col, 1);
    }

    // display the model in full
    updateDisplayBoard();
}

// #endregion controller

// ****** MODEL ******
// #region model
let model;

const queue = [
    {
        row: 5,
        col: 7,
    },
    {
        row: 5,
        col: 6,
    },
    {
        row: 5,
        col: 5,
    }, // <- End of queue (snake's head)
];

let direction = "left";

function createModel(rows, cols) {
    const newGrid = new Array(rows);

    for (let row = 0; row < newGrid.length; row++) {
        newGrid[row] = new Array(cols).fill(0);
    }
    model = newGrid;
    console.log(model);
}

function writeToCell(row, col, value) {
    model[row][col] = value;
}

function readFromCell(row, col) {
    return model[row][col];
}

// #endregion model

// ****** VIEW ******
// #region view
function createVisualBoard() {
    const grid = document.querySelector("#grid");
    console.log(grid);

    grid.style.setProperty("--GRID_COLUMNS", GRID_COLS);

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            grid.appendChild(cell);
        }
    }
}

function updateDisplayBoard() {
    const cells = document.querySelectorAll("#grid .cell");
    console.log(cells);

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const index = row * GRID_COLS + col;

            switch (readFromCell(row, col)) {
                case 0:
                    cells[index].classList.remove("player", "goal");
                    break;
                case 1: // Note: doesn't remove goal if previously set
                    cells[index].classList.add("player");
                    break;
                case 2: // Note: doesn't remove player if previously set
                    cells[index].classList.add("goal");
                    break;
            }
        }
    }
}

// #endregion view
