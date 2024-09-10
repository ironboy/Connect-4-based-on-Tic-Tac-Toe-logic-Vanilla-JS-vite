import Cell from './Cell.js';
import WinCombo from './WinCombo.js';

export default class WinChecker {

  constructor(board) {
    this.board = board;
    this.matrix = board.matrix;
    // 69 different ones, calculate ONCE! (memoization)
    this.winCombos = [];
    this.calculateWinCombos();
  }

  calculateWinCombos() {
    // m - a short alias for this.matrix
    let m = this.matrix;
    // represent ways you can win as offset from ONE position on the board
    let offsets = [
      [[0, 0], [0, 1], [0, 2], [0, 3]],   // horizontal win
      [[0, 0], [1, 0], [2, 0], [3, 0]],   // vertical win
      [[0, 0], [1, 1], [2, 2], [3, 3]],   // diagonal 1 win
      [[0, 0], [1, -1], [2, -2], [3, -3]] // diagonal 2 win
    ];
    // r = row, c = column
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[0].length; c++) {
        // ro = row offset, co = column offset
        for (let winType of offsets) {
          const combo = [];
          for (let offset of winType) {
            let row = r + offset[0];
            let column = c + offset[1];
            if (row < 0 || row >= m.length) { continue; }
            if (column < 0 || column >= m[0].length) { continue; }
            combo.push(this.matrix[row][column]);
          }
          if (combo.length === 4) { this.winCombos.push(new WinCombo(combo)) }
        }
      }
    }
  }

  winCheck() {
    // since we memoized all winning combinations at the start of the game
    // the actual win check can be made really short and effective...
    for (let combo of this.winCombos) {
      if (combo.isWin('X')) { this.board.winningCombo = combo.cells; return 'X'; }
      if (combo.isWin('O')) { this.board.winningCombo = combo.cells; return 'O'; }
    }
    return false;
  }

}