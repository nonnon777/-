const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let score = 0;
let gameInterval;

const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
];

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'rgb(200, 0, 0)';
                context.fillRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale);
                context.strokeRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale);
            }
        });
    });
}

function merge(board, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + piece.position.y][x + piece.position.x] = value;
            }
        });
    });
}

function collide(board, piece) {
    const [m, o] = [piece.matrix, piece.position];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function rotate(matrix) {
    return matrix[0].map((_, index) => matrix.map(row => row[index])).reverse();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(piece.matrix, piece.position);
}

function dropPiece() {
    piece.position.y++;
    if (collide(board, piece)) {
        piece.position.y--;
        merge(board, piece);
        resetPiece();
        sweep();
    }
    draw();
}

function resetPiece() {
    piece.matrix = shapes[Math.floor(Math.random() * shapes.length)];
    piece.position.y = 0;
    piece.position.x = (columns / 2 | 0) - (piece.matrix[0].length / 2 | 0);
    if (collide(board, piece)) {
        clearInterval(gameInterval);
        alert('ゲームオーバー！');
        initGame();
    }
}

function sweep() {
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        board.splice(y, 1);
        board.unshift(new Array(columns).fill(0));
        score += 10;
        scoreElement.innerText = score;
    }
}

function movePiece(dir) {
    piece.position.x += dir;
    if (collide(board, piece)) {
        piece.position.x -= dir;
    }
}

function initGame() {
    board = createMatrix(columns, rows);
    piece = { position: { x: 0, y: 0 }, matrix: shapes[0] };
    score = 0;
    scoreElement.innerText = score;
    resetPiece();
    draw();
}

startButton.addEventListener('click', () => {
    clearInterval(gameInterval);
    initGame();
    gameInterval = setInterval(dropPiece, 1000);
});

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        movePiece(-1);
    } else if (event.keyCode === 39) {
        movePiece(1);
    } else if (event.keyCode === 40) {
        dropPiece();
    } else if (event.keyCode === 38) {
        piece.matrix = rotate(piece.matrix);
        if (collide(board, piece)) {
            piece.matrix = rotate(piece.matrix);
            piece.matrix = rotate(piece.matrix);
            piece.matrix = rotate(piece.matrix);
        }
    }
});
