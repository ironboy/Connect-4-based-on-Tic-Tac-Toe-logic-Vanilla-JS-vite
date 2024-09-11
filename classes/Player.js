export default class Player {

  constructor(name, color, board) {
    this.name = name;
    this.color = color;
    this.board = board;
  }

  smartBotMove() {
    let m = this.board.matrix;
    let legalMoves = m[0].map((x, column) => x.content === ' ' && column).filter(x => x !== false);
    let scores
  }

}