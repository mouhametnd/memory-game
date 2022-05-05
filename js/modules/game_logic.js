// This function sets a class name to the active player
const drawPlayerActive = players => {
  let $fatherElement = document.getElementById(`player${players.playerActive}-moves`).closest('div');
  [...document.querySelector('.sect--game__cont-bottom').children].forEach($child => $child.classList.toggle('sect--game__info--active', $child === $fatherElement));
};

// This function updates to the DOM the number of moves for the active player
const drawMovesInfo = players => (document.getElementById(`player${players.playerActive}-moves`).textContent = players[`player${players.playerActive}`].moves);

//This function draws the result of the game and will be executed when all the elements have been resolved.
const showResult = (players, options, refInterval, reset, newGame) => {
  let checker = [...document.querySelector('.sect--game__cont-middle').children].filter($child => !$child.classList.contains('sect--game__cont-game-btn--resolved'));

  if (checker.length === 1) {
    clearInterval(refInterval);
    document.querySelector('.modal').classList.add('modal--show');
    const $gameResultTemplate = document.getElementById('modal-span').cloneNode(true).content;
    const $modaLi = $gameResultTemplate.querySelector('.modal__li');
    const $modalLiElements = [...$modaLi.children];
    const $modalContTopElements = [...$gameResultTemplate.querySelector('.modal__cont-top').children];

    const setNewModalLi = (value1, value2) => {
      const $newModalLi = $modaLi.cloneNode(true);
      const $newModalLiElements = [...$newModalLi.children];
      $newModalLiElements[0].textContent = value1;
      $newModalLiElements[1].textContent = value2;
      if (!value1.includes('(winner)')) $newModalLi.classList.remove('modal__li--winner');
      $gameResultTemplate.querySelector('.modal__ul').append($newModalLi);
    };

    if (options.players === 1) {
      $modalContTopElements[0].textContent = 'You did it';
      $modalContTopElements[1].textContent = 'Game over! Here are the results';
      $modalLiElements[0].textContent = 'Time Elapsed';
      $modalLiElements[1].textContent = `${minutes}:${seconds}`;

      setNewModalLi('Mova Taken', players.player1.moves);
    } else {
      $modalContTopElements[1].textContent = 'Game over! Here are the results';

      const allPlayers = [];
      let playersPairs = [];
      for (let i = 1; i <= options.players; i++) {
        allPlayers.push(players[`player${i}`]);
        playersPairs.push(players[`player${i}`].pairs);
      }

      playersPairs = [...new Set([...playersPairs])].sort((a, b) => b - a);
      for (let i = 0; i < allPlayers.length; i++) {
        const contPlayers = allPlayers.filter(({ pairs }) => pairs === playersPairs[i]);

        if (i === 0) {
          contPlayers.length === 1 ? ($modalContTopElements[0].textContent = `Player ${contPlayers[0].id} Wins!`) : ($modalContTopElements[0].textContent = 'it is a tie!');
          $modalContTopElements[1].textContent = 'Game over! Here are the results';

          for (let j = 0; j < contPlayers.length; j++) {
            if (j === 0) {
              $modaLi.classList.add('modal__li--winner');
              $modalLiElements[0].textContent = `Player ${contPlayers[0].id} (winner)`;
              $modalLiElements[1].textContent = `Pairs ${contPlayers[0].pairs}`;
            } else setNewModalLi(`Player ${contPlayers[j].id} (winner)`, `Pairs ${contPlayers[j].pairs}`);
          }
        } else {
          for (const { id, pairs } of contPlayers) setNewModalLi(`Player ${id}`, `Pairs ${pairs}`);
        }
      }
    }
    document.querySelector('.modal__content').append($gameResultTemplate);
    document.querySelector('.modal__cont-bottom').addEventListener('click', e => {
      if (e.target.matches('.modal__btn--reset')) reset();
      else if (e.target.matches('.modal__btn--new-game')) newGame();
    });
  }
};

// This function contains the logic of the game when an element is clicked.
export const gameLogic = (e, players, options, refInterval, reset, newGame) => {
  if (!e.target.matches('.sect--game__cont-middle')) {
    const $posibleElement = document.querySelector('.sect--game__cont-game-btn--selected');

    if ($posibleElement && e.target !== $posibleElement) {
      e.target.classList.add('sect--game__cont-game-btn--selected');
      players[`player${players.playerActive}`].moves += 1;
      drawMovesInfo(players);

      if (e.target.dataset.value === $posibleElement.dataset.value) {
        setTimeout(() => {
          $posibleElement.classList.remove('sect--game__cont-game-btn--selected');
          e.target.classList.remove('sect--game__cont-game-btn--selected');

          $posibleElement.classList.add('sect--game__cont-game-btn--resolved');
          e.target.classList.add('sect--game__cont-game-btn--resolved');
          showResult(players, options, refInterval, reset, newGame);
        }, 700);
        players[`player${players.playerActive}`].pairs += 1;
      } else {
        drawMovesInfo(players);
        players.playerActive === options.players ? (players.playerActive = 1) : players.playerActive++;
        drawPlayerActive(players);

        setTimeout(() => {
          $posibleElement.classList.remove('sect--game__cont-game-btn--selected');
          e.target.classList.remove('sect--game__cont-game-btn--selected');
        }, 700);
      }
    } else e.target.classList.add('sect--game__cont-game-btn--selected');
  }
};
