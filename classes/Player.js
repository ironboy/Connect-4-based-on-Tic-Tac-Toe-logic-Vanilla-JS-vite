import sleep from './helpers/sleep.js';

export default class Player {

  constructor(name, color, type, board) {
    this.name = name;
    this.color = color;
    this.opponent = this.color === 'X' ? 'O' : 'X';
    this.board = board;
    this.type = type;
    window['player' + color] = this;
  }

  async makeBotMove() {
    await sleep(500);
    this.type === 'A dumb bot' && await this.board.makeMove(this.color, this.dumbBotMove());
    this.type === 'A smart bot' && await this.board.makeMove(this.color, this.smartBotMove());
  }

  dumbBotMove() {
    // choose among legal moves (columns) randomnly
    return this.shuffleArray(this.legalMoves).shift();
  }

  smartBotMove() {
    let orgState = this.state();
    let scores = [];
    for (let column of this.legalMoves) {
      let cellToRestore = this.tempMove(column);
      scores.push({ column, score: this.score(column, orgState, this.state()) });
      cellToRestore.content = ' ';
    }
    scores = this.shuffleArray(scores).sort((a, b) => a.score > b.score ? -1 : 1);
    return scores[0].column;
  }

  get legalMoves() {
    let m = this.board.matrix;
    return m[0].map((x, column) => x.content === ' ' && column).filter(x => x !== false);
  }

  shuffleArray(arr) {
    return arr.slice()
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  state() {
    const state = [];
    for (let combo of this.board.winChecker.winCombos) {
      state.push({ me: combo.colorCount(this.color), opp: combo.colorCount(this.opponent) });
    }
    return state;
  }

  tempMove(column, color = this.color) {
    for (let row = this.board.matrix.length - 1; row >= 0; row--) {
      let cell = this.board.matrix[row][column];
      if (cell.content === ' ') {
        cell.content = color;
        return cell;
      }
    }
  }

  score(column, stateBefore, stateAfter) {
    let priorities = [
      // best with 4 in a row, then blocking opponents 3 in a row and so on...
      { me: 4 }, { opp: 3 }, { me: 3 }, { opp: 2 }, { me: 2 }, { me: 1 }, { opp: 1 }
    ].reverse();
    let score = 0;
    for (let i = 0; i < stateBefore.length; i++) {
      let b = stateBefore[i], a = stateAfter[i];
      // no change in combo
      if (b.me === a.me && b.opp === a.opp) { continue; }
      // combo can't be won by either player
      if (b.me > 0 && b.opp > 0) { continue; }
      // there has been a change, so i must have added one piece
      for (let j = 0; j < priorities.length; j++) {
        let key = Object.keys(priorities[j])[0];
        let val = priorities[j][key];
        // (separate each step in the priority ladder to the power of 100)
        if (a[key] === val) { score += 10 ** ((j + 1) * 2) }
      }
    }
    // extra check if this is not a move that wins the game: 
    // ithe opponent can win by playing on top of this move
    // in the same column then set the score to < 0 -> bad move!
    if (!this.board.winCheck() && this.legalMoves.includes(column)) {
      let cellToRestore = this.tempMove(column, this.opponent);
      if (this.board.winCheck()) { score = -1; }
      cellToRestore.content = ' ';
    }
    this.board.winningCombo = [];

    return score;
  }

}