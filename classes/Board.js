import sleep from './helpers/sleep.js';

export default class Board {

  constructor(app) {
    this.app = app;
    this.matrix = [...new Array(6)].map(row =>
      [...new Array(7)].map(column => ' ')
    );
    // currentPlayer, whose turn is it?
    this.currentPlayerColor = 'X';
    // status of game (updated after each move)
    this.winner = false;
    this.isADraw = false;
    this.gameOver = false;
    this.winningCombo = [];
    this.latestMove = [];
  }

  render() {
    // create the event handler called on click:
    // makeMove and if makeMove returns true
    // then call the app render method
    globalThis.makeMoveOnClick = async (column) =>
      (await this.makeMove(this.currentPlayerColor, column))
      && this.app.render();

    // set some statuses as attributes to the body
    // so we can apply different styling depending on them
    document.body.setAttribute('currentPlayerColor',
      this.gameOver ? '' : this.currentPlayerColor);
    document.body.setAttribute('gameInProgress',
      this.app.namesEntered && !this.gameOver);

    // render the board as html
    return /*html*/`<div class="board">
      ${this.matrix.map((row, rowIndex) =>
      row.map((cell, columnIndex) =>/*html*/`
        <div
          class="cell ${cell
        + (this.latestMove[0] === rowIndex && this.latestMove[1] === columnIndex
          ? ' latest-move' : '')
        + (cell === ' ' && this.matrix[rowIndex + 1]?.[columnIndex] !== ' '
          ? ' first-free' : '')
        + (this.winningCombo.includes('row' + rowIndex + 'column' + columnIndex)
          ? ' in-win' : '')
        }"
          onclick="makeMoveOnClick(${columnIndex})">
        </div>
      `).join('')).join('')}
    </div>`;
  }

  async makeMove(color, column) {
    // don't make a move if there is another move in progress
    if (document.body.getAttribute('moveInProgress') === 'true') { return; }
    // don't make any move if the game is over
    if (this.gameOver) { return false; }
    // check that the color is X or O - otherwise don't make the move
    if (color !== 'X' && color !== 'O') { return false; }
    // check that the color matches the player's turn - otherwise don't make the move
    if (color !== this.currentPlayerColor) { return false; }
    // check that the column is a number - otherwise don't make the move
    if (isNaN(column)) { return false; }
    // check that the column is between 0 and 6 - otherwise don't make the move
    if (column < 0 || column >= this.matrix[0].length) { return false; }
    // check that the column is not full - otherwise don't make the move
    if (this.matrix[0][column] !== ' ') { return false; }

    // make the move and animate it at the same time
    document.body.setAttribute('moveInProgress', true);
    this.latestMove = [];
    let row = 0;
    while (row < 6 && this.matrix[row][column] === ' ') {
      this.matrix[row][column] = this.currentPlayerColor;
      this.app.render();
      await sleep(50);
      this.matrix[row][column] = ' ';
      row++;
    }
    this.latestMove = [row - 1, column];
    this.matrix[row - 1][column] = this.currentPlayerColor;

    // check if someone has won or if it's a draw/tie and update properties
    this.winner = this.winCheck();
    this.isADraw = this.drawCheck();
    // the game is over if someone has won or if it's a draw
    this.gameOver = this.winner || this.isADraw;
    // change the current player color, if the game is not over
    !this.gameOver
      && (this.currentPlayerColor = this.currentPlayerColor === 'X' ? 'O' : 'X');
    // return true if the move could be made
    document.body.setAttribute('moveInProgress', false);
    return true;
  }

  winCheck() {
    // m - a short alias for this.matrix
    let m = this.matrix;
    // represent ways you can win as offset from ONE position on the board
    let offsets = [
      [[0, 0], [0, 1], [0, 2], [0, 3]],   // horizontal win
      [[0, 0], [1, 0], [2, 0], [3, 0]],   // vertical win
      [[0, 0], [1, 1], [2, 2], [3, 3]],   // diagonal 1 win
      [[0, 0], [1, -1], [2, -2], [3, -3]] // diagonal 2 win
    ];
    // loop through each player color, each position (row + column),
    // each winType/offsets and each offset coordinate added to the position
    // to check if someone has won :)
    for (let color of 'XO') {
      // r = row, c = column
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[0].length; c++) {
          // ro = row offset, co = column offset
          for (let winType of offsets) {
            let colorsInCombo = '', combo = [];
            for (let [ro, co] of winType) {
              colorsInCombo += (m[r + ro] || [])[c + co];
              combo.push('row' + (r + ro) + 'column' + (c + co));
            }
            if (colorsInCombo === color.repeat(4)) {
              this.winningCombo = combo; // remember the winning combo
              return color;
            }
          }
        }
      }
    }
    return false;
  }

  // check for a draw/tie
  drawCheck() {
    // if no one has won and no empty positions then it's a draw
    return !this.winCheck() && !this.matrix.flat().includes(' ');
  }

}