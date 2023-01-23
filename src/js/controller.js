const controller = (() => {
  START_SCREEN.style.display = 'block';
  let currentGameBox, figure, currentFigure, nextFigure, xDown, yDown;

  if (localStorage.getItem('tetris')) {
    const bestScore = utils.getBestScore();
    USER_BEST.innerHTML = bestScore;
    SETTINGS.userBest = bestScore;
  } else {
    utils.setBestScore(0);
    USER_BEST.innerHTML = 0;
  }

  const reset = () => {
    START_SCREEN.style.display = 'block';
    // set points rendering
    if (SETTINGS.points > SETTINGS.currentBest) {
      SETTINGS.currentBest = SETTINGS.points;
      CURRENT_BEST.innerHTML = SETTINGS.points;
    }

    if (SETTINGS.points > SETTINGS.userBest) {
      SETTINGS.userBest = SETTINGS.points;
      utils.setBestScore(SETTINGS.points);
      USER_BEST.innerHTML = SETTINGS.userBest;
    }

    // clear the initial data to start from the beginning
    clearInterval(timer);
    timer = null;
    currentGameBox = null;
    SETTINGS.isGameOver = false;
    SETTINGS.points = 0;
    figure = utils.getRandomFigure();
    nextFigure = utils.getRandomFigure();
    gameModel.showNextElement(nextFigure[0]);
    GAME_OVER_SCREEN.style.display = 'none';
    MAIN_CONTAINER.style.opacity = 1;
    CURRENT_SCORE.innerHTML = SETTINGS.points;
    CURRENT_SCORE_MOBILE.innerHTML = SETTINGS.points;

    figure.forEach(side => {
      side.forEach(dot => {
        dot.y += middleY;
      });
    });
  };

  reset();

  const makeFigureLastMove = () => {
    let lastRowIndex = 0;

    currentFigure.forEach(dot => {
      if (dot.x > lastRowIndex) {
        lastRowIndex = dot.x;
      }

      gameBox[dot.x][dot.y] = 2;
    });

    SETTINGS.points += 2;
    CURRENT_SCORE.innerHTML = SETTINGS.points;

    return lastRowIndex;
  };

  const newFigure = () => {
    figure = nextFigure;

    figure.forEach(side => {
      side.forEach(dot => {
        dot.y += middleY;
      });
    });

    const currentFigure = figure[0];

    if (utils.isGameOver(currentFigure, gameBox)) {
      gameModel.gameOver();
      return;
    }

    nextFigure = utils.getRandomFigure();
    gameModel.showNextElement(nextFigure[0]);
  };

  const placeFigure = () => {
    currentFigure = figure[0];

    currentFigure.forEach(dot => {
      gameBox[dot.x][dot.y] = 1;
    });
  };

  // Render the whole tetris box
  const render = () => {
    MAIN_CONTAINER.innerHTML = '';

    // make game field
    gameBox = [];

    for (let row = 0; row < SETTINGS.height; row++) {
      let arr = [];

      if (!currentGameBox) {
        arr = new Array(SETTINGS.width).fill(0);
      } else {
        for (let col = 0; col < SETTINGS.width; col++) {
          arr[col] = currentGameBox[row][col];
        }
      }

      gameBox.push(arr);
    }

    placeFigure();

    // render
    gameBox.forEach(row => {
      const newRow = document.createElement('div');
      newRow.className = 'row';

      row.forEach(el => {
        const cell = document.createElement('div');
        cell.className = 'cell';

        if (el === 1 || el === 2) {
          cell.className += ' tetris-cell';
        } else {
          cell.className += ' empty-cell';
        }

        newRow.append(cell);
      });

      MAIN_CONTAINER.append(newRow);
    });
  };

  render();

  const start = () => {
    START_SCREEN.style.display = 'none';

    timer = setInterval(() => {
      if (gameModel.moveDown(figure)) {
        render();
      } else {
        currentGameBox = gameBox;
        const lastRowIndex = makeFigureLastMove();
        const destroyedRows = utils.checkAndDestroyFullRows(currentGameBox, lastRowIndex);

        if (destroyedRows > 0) {
          utils.moveDownRows(currentGameBox, lastRowIndex, destroyedRows);

          for (let i = 0; i < destroyedRows; i++) {
            SETTINGS.points += 20;
            SETTINGS.speed += 2 * 3.5;
            clearInterval(timer);
            start();
          }

          CURRENT_SCORE.innerHTML = SETTINGS.points;
        }

        newFigure();
      }
    }, 400 - SETTINGS.speed);
  };

  const handleTouchStart = (event) => {
    const firstTouch = utils.getTouches(event)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  const handleTouchMove = (event) => {
    if (!xDown || !yDown || SETTINGS.isGameOver || !timer) {
      return;
    }

    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;


    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        if (gameModel.moveLeft(figure)) {
          render();
        }
      } else {
        /* right swipe */
        if (gameModel.moveRight(figure)) {
          render();
        }
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        gameModel.rotate(figure);
        render();
      } else {
        /* down swipe */
        if (gameModel.moveDown(figure)) {
          render();
        }
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };

  // EVENT LISTENERS
  document.body.addEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === KEYS.space) {
      reset();
      render();
      start();
    } else if (e.key === KEYS.escape) {
      reset();
      render();
      SETTINGS.speed = 0;
      SPEED_INPUT.value = 0;
    }

    if (SETTINGS.isGameOver || !timer) {
      return;
    }

    if (e.key === KEYS.up || e.key === KEYS.w) {
      gameModel.rotate(figure);
      render();
    } else if (e.key === KEYS.right || e.key === KEYS.d) {
      if (gameModel.moveRight(figure)) {
        render();
      }
    } else if (e.key === KEYS.down || e.key === KEYS.s) {
      if (gameModel.moveDown(figure)) {
        render();
      }
    } else if (e.key === KEYS.left || e.key === KEYS.a) {
      if (gameModel.moveLeft(figure)) {
        render();
      }
    }
  });

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  SPEED_INPUT.addEventListener('change', (e) => {
    SETTINGS.speed = e.target.value * 3.5;

    if (SETTINGS.isGameOver || !timer) {
      return;
    }

    clearInterval(timer);
    start()
  });

  START_SCREEN.addEventListener('click', () => {
    reset();
    render();
    start();
  });

  HEADER_LOGO.addEventListener('click', () => {
    reset();
    render();
    SETTINGS.speed = 0;
    SPEED_INPUT.value = 0;
  });
})();