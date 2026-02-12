export default class Game {
  constructor() {
    this.state = this.createInitialState();
    this.score = 0;
    this.status = 'idle';
  }

  createInitialState() {
    return (this.state = Array.from({ length: 4 }, () => Array(4).fill(0)));
  }

  moveLeft() {
    const { board: newBoard, score } = this.slideCells(this.state);

    this.state = newBoard;
    this.score += score;
    this.addRandomTile();
    this.getStatus();

    return newBoard;
  }

  moveRight() {
    const reversed = this.reverse(this.state);
    const { board: newBoard, score } = this.slideCells(reversed);
    const resBoard = this.reverse(newBoard);

    this.state = resBoard;
    this.score += score;
    this.addRandomTile();
    this.getStatus();

    return resBoard;
  }

  moveUp() {
    const rotated = this.rotate(this.state, 'back');
    const { board: newBoard, score } = this.slideCells(rotated);
    const resBoard = this.rotate(newBoard);

    this.state = resBoard;
    this.score += score;
    this.addRandomTile();
    this.getStatus();

    return resBoard;
  }

  moveDown() {
    const rotated = this.rotate(this.state);
    const { board: newBoard, score } = this.slideCells(rotated);
    const resBoard = this.rotate(newBoard, 'back');

    this.state = resBoard;
    this.score += score;
    this.addRandomTile();
    this.getStatus();

    return resBoard;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    const canMove = this.canMoveCells(this.state);
    const isYouWin = this.state.some((row) => {
      return row.some((cell) => cell === 2048);
    });

    if (isYouWin) {
      this.status = 'win';
    } else if (!canMove) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }

    return this.status;
  }

  start() {
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile(this.state);
    this.addRandomTile(this.state);
  }

  restart() {
    this.state = this.createInitialState();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile(this.state);
    this.addRandomTile(this.state);
  }

  canMoveCells(board) {
    const size = board.length;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const current = board[i][j];

        if (current === 0) {
          return true;
        }

        if (j < size - 1 && current === board[i][j + 1]) {
          return true;
        }

        if (i < size - 1 && current === board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  getEmptyCells(board) {
    const emptyCells = [];

    board.forEach((row, i) => {
      row.forEach((elem, j) => {
        if (elem === 0) {
          emptyCells.push({
            i: i,
            j: j,
          });
        }
      });
    });

    return emptyCells;
  }

  slideCells(board) {
    const newBoard = { board: [], score: 0 };

    board.forEach((row) => {
      const filtered = row.filter((x) => x !== 0);
      const newRow = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          const merged = filtered[i] * 2;

          newRow.push(merged);
          newBoard.score += merged;
          i++;
        } else {
          newRow.push(filtered[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newBoard.board.push(newRow);
    });

    return newBoard;
  }

  reverse(board) {
    return board.map((row) => [...row].reverse());
  }

  rotate(board, direction = '') {
    const size = board.length;
    const newBoard = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (direction) {
          newBoard[size - 1 - j][i] = board[i][j];
        } else {
          newBoard[j][size - 1 - i] = board[i][j];
        }
      }
    }

    return newBoard;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells(this.state);

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { i, j } = emptyCells[randomIndex];

    const randomValue = Math.random() < 0.9 ? 2 : 4;

    this.state[i][j] = randomValue;
  }
}
