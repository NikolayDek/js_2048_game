'use strict';

import '../styles/main.scss';
import Game from '../modules/Game.class';

const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const game = new Game();

button.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render(game.state);
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;
  }

  render(game.state);
});

function render(board) {
  button.classList.remove('start', 'restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  switch (game.status) {
    case 'idle':
      button.classList.add('start');
      button.textContent = 'Start';
      messageStart.classList.remove('hidden');
      break;

    case 'playing':
      button.classList.add('restart');
      button.textContent = 'Restart';
      break;

    case 'win':
      button.classList.add('restart');
      button.textContent = 'Restart';
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      button.classList.add('restart');
      button.textContent = 'Restart';
      messageLose.classList.remove('hidden');
      break;
  }

  score.textContent = game.score;

  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, j) => {
      const value = board[i][j];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}
