export default class Cell {

  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.content = ' ';
  }

  toString() {
    return this.content;
  }
}