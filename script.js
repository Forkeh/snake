"use strict";

import { Queue } from "./queue.js";

window.addEventListener("load", start);

// ****** CONTROLLER ******
// #region controller
// GAME SETTINGS
const GRID_ROWS = 20;
const GRID_COLS = 20;

function start() {
    console.log(`Javascript kører`);

    document.addEventListener("keydown", keyPress);

    createSnake();

    createModel(GRID_ROWS, GRID_COLS);

    insertFoodInRandomCell();

    createVisualBoard();

    // start ticking
    tick();
}

function keyPress(event) {
    switch (event.key) {
        case "ArrowLeft":
            {
                if (direction === "right") return;
                direction = "left";
            }
            break;
        case "ArrowRight":
            {
                if (direction === "left") return;
                direction = "right";
            }
            break;
        case "ArrowUp":
            {
                if (direction === "down") return;
                direction = "up";
            }
            break;
        case "ArrowDown":
            {
                if (direction === "up") return;
                direction = "down";
            }
            break;

        default:
            break;
    }
}

function tick() {
    // setup next tick
    setTimeout(tick, 500);

    let curr = snake.head;

    // Remove snake from model
    while (curr) {
        writeToCell(curr.data.row, curr.data.col, 0);
        curr = curr.next;
    }

    const head = {
        row: snake.tail.data.row,
        col: snake.tail.data.col,
    };

    console.log("ACTUAL HEAD:",snake.tail.data);
    console.log("SELECTED HEAD:",head);
    

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

    const cellValue = readFromCell(head.row, head.col);
    console.log(cellValue);

    // Insert new head on snake
    snake.enqueue(head);

    // Remove last part of snake
    if (cellValue === 2) {
        // writeToCell(head.row, head.col, 1);
        insertFoodInRandomCell();
    } else {
        snake.dequeue();
    }

    // re-add snake to model
    curr = snake.head;

    while (curr) {
        writeToCell(curr.data.row, curr.data.col, 1);
        curr = curr.next;
    }

    // display the model in full
    updateDisplayBoard();
}

function insertFoodInRandomCell() {
    const randomRow = Math.floor(Math.random() * GRID_ROWS);
    const randomCol = Math.floor(Math.random() * GRID_COLS);
    writeToCell(randomRow, randomCol, 2);
}

// #endregion controller

// ****** MODEL ******
// #region model
let model;

let snake;

let direction = "left";

function createSnake() {
    let newSnake = new Queue();
    newSnake.enqueue({
        row: 1,
        col: 7,
    });
    newSnake.enqueue({
        row: 1,
        col: 6,
    });
    newSnake.enqueue({
        row: 1,
        col: 5,
    });
    console.log("SNAKE:", newSnake);
    

    snake = newSnake;
}

function createModel(rows, cols) {
    const newGrid = new Array(rows);

    for (let row = 0; row < newGrid.length; row++) {
        newGrid[row] = new Array(cols).fill(0);
    }
    model = newGrid;
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
