export default class PerfectSolverBridge {

  static async makeMove(board, shuffleArray) {

    // convert board.moveLog to a format the perfect solver api understands
    let history = board.moveLog.map(x => x.column).join('');

    // call the perfect solver api att connect4.gamesolver.org
    // -> this will return a score array where the best move has the highest score
    //    (but full columns have score 100 and can not be played)
    let { score: scores } = await (await fetch('https://connect4.gamesolver.org/solve?pos=' + history)).json();

    // 1) convert the score array so that we have score and columns for each possibility
    // 2) remove full columns 
    // 3) sort by score (high to low)
    scores = scores
      .map((x, column) => ({ score: x, column }))
      .filter(x => x.score !== 100)
      .sort((a, b) => a.score > b.score ? -1 : 1);

    // only keep the columns with the highest score
    // we can have several columns with same score (the highest score)
    scores = scores.filter(x => x.score === scores[0].score);

    // randomize which of the equally good moves we'll make
    shuffleArray(scores);

    // return the move
    return scores[0].column;
  }

}