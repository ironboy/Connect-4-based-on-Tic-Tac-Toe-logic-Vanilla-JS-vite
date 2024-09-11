import Cell from "./Cell.js";

export default class WinCombo {

  constructor(cells) {
    cells = cells.filter(x => x instanceof Cell);
    if (cells.length !== 4) { throw new Error('Each win combo must have 4 cells!') }
    this.cells = cells;
  }

  numberOfColor(color) {
    return this.cells.filter(cell => cell.content === color).length;
  }

  isWin(color) {
    return this.numberOfColor(color) === 4;
  }

  score(color) {
    if (this.numberOfColor('X') > 0 && this.numberOfColor('O') > 0) {
      return 0; // noone can win this combo, both players have pieces in it
    }
    let oppponentColor = color === 'X' ? 'O' : 'X';
    // offense
    for (let pieces of [4, 3, 2, 1, 0]) {
      if (this.numberOfColor(color) === pieces) {
        return pieces ** 100;
      }
    }
    // defence
    for (let pieces of [4, 3, 2, 1, 0]) {
      if (this.numberOfColor(oppponentColor) === pieces) {
        return pieces ** 100;
      }
    }
  }

}