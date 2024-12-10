let board = [];
let currentPlayer = 'X';
let gameActive = false;
let mode = '';

function startGame(selectedMode) {
    mode = selectedMode;
    gameActive = true;
    currentPlayer = 'X';
    board = Array.from({ length: 30 }, () => Array(30).fill(''));
    document.getElementById('status').innerText = `Lượt: ${currentPlayer}`;
    renderBoard();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${board[i][j] === 'X' ? 'x' : board[i][j] === 'O' ? 'o' : ''}`;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.innerText = board[i][j];
            cell.addEventListener('click', () => handleCellClick(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (!gameActive || board[row][col]) return;

    board[row][col] = currentPlayer;
    renderBoard();

    if (checkWin(row, col)) {
        showResult(`Người chơi ${currentPlayer} đã thắng!`);
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = `Lượt: ${currentPlayer}`;

    if (mode === 'computer' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let move = findBestMove();
    if (!move) {
        showResult("Hòa!");
        return;
    }
    handleCellClick(move.row, move.col);
}

function findBestMove() {
    // Ưu tiên chặn người chơi sắp thắng
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            if (!board[i][j]) {
                board[i][j] = currentPlayer;
                if (checkWin(i, j)) {
                    board[i][j] = '';
                    return { row: i, col: j };
                }
                board[i][j] = '';
            }
        }
    }

    // Nếu không cần chặn, chọn ô trống ngẫu nhiên
    let emptyCells = [];
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            if (!board[i][j]) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) ||
        checkDirection(row, col, 0, 1) ||
        checkDirection(row, col, 1, 1) ||
        checkDirection(row, col, 1, -1)
    );
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;

    count += countDirection(row, col, rowDir, colDir);
    count += countDirection(row, col, -rowDir, -colDir);

    return count >= 5;
}

function countDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;

    while (r >= 0 && r < 30 && c >= 0 && c < 30 && board[r][c] === currentPlayer) {
        count++;
        r += rowDir;
        c += colDir;
    }
    return count;
}

function showResult(message) {
    const modal = document.getElementById('resultModal');
    const resultText = document.getElementById('resultText');
    resultText.innerText = message;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

function restartGame() {
    closeModal(); // Đóng modal kết quả
    startGame(mode); // Khởi động lại trò chơi với chế độ đã chọn
}
