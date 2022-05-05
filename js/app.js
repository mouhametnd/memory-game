import { gameLogic } from './modules/game_logic.js';
import { setTheme, setPlayers, setGrid } from './modules/set_input_values.js';

window.addEventListener('DOMContentLoaded', () => {
  // This object contains the game settings as properties.
  const options = {
    theme: null,
    players: null,
    grid: null,
  };

  // This object contains every player with his moves and resolved pairs.
  let players = {
    playerActive: 1,
  };

  // This variable is for the reference of the setInterval. The minutes and seconds are for the time.
  let refInterval = null;
  let minutes = 0;
  let seconds = 0;
  
  // This function handles the time of the game. this function only will work if is playing one player
  const timer = () => {
    const $spanTime = document.getElementById('time-span');
    refInterval = setInterval(() => {
      seconds += 1;
      if (seconds > 60) {
        minutes += 1;
        seconds = 0;
      }
      $spanTime.textContent = `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
    }, 1000);
  };

  // This function resets the game with the same settings
  const reset = (start = true) => {
    clearInterval(refInterval);
    minutes = 0;
    seconds = 0;
    players.playerActive = 1;
    delete players.player1;
    delete players.player2;
    delete players.player3;
    document.querySelectorAll('.sect--game__cont-game-btn').forEach($element => $element.remove());
    document.querySelectorAll('.sect--game__info').forEach($element => $element.remove());
    document.querySelector('.modal').classList.remove('modal--show');
    try {
      document.querySelector('.modal__cont-bottom').remove();
      document.querySelector('.modal__ul').remove();
      document.querySelector('.modal__cont-top').remove();
    } catch (error) {}
    if (start) startGame();
  };

  // This function resets the game and also allow you to set again the game.
  const newGame = () => {
    reset(false);
    document.querySelector('.sect--game').classList.remove('sect--game--show');
    document.querySelector('.sect--set').classList.remove('hide');
    document.querySelector('.main').classList.remove('bg-white');
    try {
      document.querySelector('.modal__cont-top').remove();
      document.querySelector('.modal__ul').remove();
      document.querySelector('.modal__cont-bottom').remove();
    } catch (error) {}
  };

  // This function will start the game if the button start has been clicked
  const startGame = () => {
    const gameTemplate = document.getElementById('game-template').cloneNode(true).content;
    const gameTemplateInfo = document.getElementById('game-info-template').cloneNode(true).content;

    for (let i = 1; i <= 3; i++) {
      const inputs = [...document.getElementById(`sect-inputs${i}`).querySelectorAll('input')];
      if (i === 1) {
        options.theme = inputs.find(({ checked }) => checked).value;
        setTheme(options.theme, gameTemplate);
      } else if (i === 2) {
        options.players = +inputs.find(({ checked }) => checked).value;
        setPlayers(options.players, gameTemplateInfo, players);
      } else {
        options.grid = +inputs.find(({ checked }) => checked).value.slice(0, 1);
        setGrid(options.grid, gameTemplate);
      }
    }
    document.querySelector('.sect--set').classList.add('hide');
    document.querySelector('.sect--game').classList.remove('hide');
    document.querySelector('.sect--game').classList.add('sect--game--show');
    document.querySelector('.sect--game__cont-middle').append(gameTemplate);
    document.querySelector('.sect--game__cont-bottom').append(gameTemplateInfo);
    document.querySelector('main').classList.add('bg-white');
    document.getElementById('player1-moves').closest('div').classList.add('sect--game__info--active');
    if (options.players === 1) timer();
  };

  document.getElementById('btnStart').addEventListener('click', startGame);

  document.getElementById('sect--game__cont-sets').addEventListener('click', e => {
    if (e.target.matches('#rest')) reset();
    else if (e.target.matches('#new-game')) newGame();
  });

  document.querySelector('.sect--game__cont-middle').addEventListener('click', e => gameLogic(e, players, options, refInterval, reset, newGame));
});

