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

}