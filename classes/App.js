import Dialog from './Dialog.js';
import Board from './Board.js';
import Player from './Player.js';
import sleep from './helpers/sleep.js';

export default class App {

  constructor(playerX, playerO, whoStarts = 'X') {
    this.dialog = new Dialog();
    this.board = new Board(this);
    this.board.currentPlayerColor = whoStarts;
    this.whoStarts = whoStarts;
    this.setPlayAgainGlobals();
    if (playerX && playerO) {
      this.playerX = playerX;
      this.playerX.board = this.board; // update to new board
      this.playerO = playerO;
      this.playerO.board = this.board; // update to new board
      this.namesEntered = true;
      this.board.initiateBotMove();
    }
    else { this.askForNamesAndTypes(); }
    this.render();
  }

  async askForNamesAndTypes(color = 'X') {
    const okName = name => name.match(/[a-zåäöA-ZÅÄÖ]{2,}/);
    let playerName = '', playerType = '';
    while (!okName(playerName)) {
      playerName = await this.dialog.ask(
        /*html*/`<div class="name-info ${color}">Enter the name of the 
          ${color === 'X' ? 'red' : 'yellow'} player:</div>`);
      await sleep(500);
      playerType = await this.dialog.ask(
          /*html*/`<div class="name-info ${color}">Which type of player is 
         ${playerName} ?</div>`,
        ['Human', 'A dumb bot', 'A smart bot']
      );
    }
    this['player' + color] = new Player(playerName, color, playerType, this.board);
    if (color === 'X') { this.askForNamesAndTypes('O'); return; }
    this.namesEntered = true;
    this.render();
    this.board.initiateBotMove();
  }

  namePossesive(name) {
    // although not necessary, it's nice with a traditional
    // possesive form of the name when it ends with an "s":
    // i.e. "Thomas'" rather than "Thomas's" but "Anna's" :)
    return name + (name.slice(-1).toLowerCase() !== 's' ? `'s` : `'`)
  }

  render() {
    if (this.destroyed) { return; }
    let color = this.board.currentPlayerColor;
    let player = color === 'X' ? this.playerX : this.playerO;
    let name = player?.name || '';

    document.querySelector('main').innerHTML = /*html*/`
      <h1>${[...'CONNECT  4'].map(char => `<span>${char}</span>`).join('')}</h1>
      ${!this.board.gameOver && player ?
        `<p class="name-info ${color}">${this.namePossesive(name)} turn...</p>`
        : (this.namesEntered ? '' : '<p>Enter names</p>')}
      ${!this.board.gameOver ? '' : /*html*/`
        ${!this.board.isADraw ? '' : `<p>It's a tie...</p>`}
        ${!this.board.winner ? '' : `<p class="name-info ${color}">${name} won!</p>`}
      `}
      ${this.board.render()}
       <div class="buttons">
        ${!this.board.gameOver ?
        this.renderquitButton() :
        this.renderPlayAgainButtons()}
      </div>
    `;
  }

  renderquitButton() {
    if (!this.namesEntered) { return ''; }

    globalThis.quitGame = async () => {
      let answer = await this.dialog.ask(
        'What do you want to do?',
        ['Continue the game', 'Play again', 'Enter new players']
      );
      answer === 'Play again' && globalThis.playAgain();
      answer === 'Enter new players' && globalThis.newPlayers();
    };

    return /*html*/`
      <div class="button" onclick="quitGame()">
        Quit this game
      </div>
    `
  }

  setPlayAgainGlobals() {
    // play again 
    globalThis.playAgain = async () => {
      let playerToStart = this.whoStarts === 'X' ? this.playerO : this.playerX;
      await this.dialog.ask(
        `It's ${this.namePossesive(playerToStart.name)} turn to start!`, ['OK']);
      new App(this.playerX, this.playerO, playerToStart.color);
    }
    // start a-fresh with new players
    globalThis.newPlayers = () => { this.destroyed = true; new App(); }
  }

  renderPlayAgainButtons() {
    // why not use the button element? 
    // div tags are easier to style in a cross-browser-compatible way
    return /*html*/`
      <div class="button" href="#" onclick="playAgain()">Play again</div>
      <div class="button" href="#" onclick="newPlayers()">New players</div>
    `;
  }

}