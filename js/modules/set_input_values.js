// this function sets the content of the buttons depending on the value of the inputs, if there are going to be numbers or icons.
export const setTheme = (theme, gameTemplate) => {
  [...gameTemplate.children].forEach($element => {
    const $child = $element.querySelector(`[data-${theme}]`);
    $element.dataset.value = $child.dataset.icon || $child.dataset.number;
    $child.classList.replace('hide', 'show');
  });
};

// this function sets the the numbers of grid columns and also does a random order for the elements
export const setGrid = (num, gameTemplate) => {
  if (num === 4) {
    for (let i = 17; i > 7; i--) gameTemplate.removeChild(gameTemplate.children[i]);
  }
  [...gameTemplate.children].forEach($element => gameTemplate.append($element.cloneNode(true)));
  document.querySelector('.sect--game__cont-middle').classList.add(`sect--game__cont-middle--${num}-columns`);
   const elements = [...gameTemplate.children];
    for (let i = elements.length - 1; i > 0; i--) {
      const randNumber = Math.floor(Math.random() * (i + 1));
      [elements[i], elements[randNumber]] = [elements[randNumber], elements[i]];
    }
    gameTemplate.replaceChildren(...elements);
};

// This function creates the number of li tags and players.
export const setPlayers = (num, gameTemplateInfo, players) => {
  const contInfo = gameTemplateInfo.querySelector('.sect--game__info');
  players['player1'] = {
    id: 1,
    pairs: 0,
    moves: 0,
  };
  if (num === 1) {
    contInfo.querySelector('span:first-child').textContent = 'Time';
    contInfo.querySelector('span:last-child').textContent = '00: 00';
    contInfo.querySelector('span:last-child').id = 'time-span';

    const newContInfo = contInfo.cloneNode(true);
    newContInfo.querySelector('span:first-child').textContent = 'Moves';
    newContInfo.querySelector('span:last-child').textContent = '0';
    newContInfo.querySelector('span:last-child').id = 'player1-moves';
    gameTemplateInfo.append(newContInfo);
  } else {
    for (let i = 2; i <= num; i++) {
      contInfo.querySelector('span:first-child').textContent = 'Player 1';
      contInfo.querySelector('span:last-child').textContent = '0';
      contInfo.querySelector('span:last-child').id = 'player1-moves';
      const newContInfo = contInfo.cloneNode(true);
      newContInfo.querySelector('span:first-child').textContent = `Player ${i}`;
      newContInfo.querySelector('span:last-child').id = `player${i}-moves`;
      gameTemplateInfo.append(newContInfo);
      players[`player${i}`] = {
        id: i,
        pairs: 0,
        moves: 0,
      };
    }
  }
};
