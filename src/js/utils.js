const utils = (() => {
  const getById = (id) => {
    return document.getElementById(id);
  };

  const getBestScore = () => {
    return JSON.parse(localStorage.getItem('tetris')).bestScore;
  };

  const setBestScore = (score) => {
    localStorage.setItem('tetris', JSON.stringify({ bestScore: score }));
  };

  const getRandomFigure = () => {
    const randomFigureIndex = Math.floor(figures.length * Math.random());
    const randomSideIndex = Math.floor(figures[randomFigureIndex].length * Math.random());
    let figure = JSON.parse(JSON.stringify(figures[randomFigureIndex]))

    for (let i = 0; i < randomSideIndex; i++) {
      figure.unshift(figure.pop());
    }

    return figure;
  };

  const getRandomSide = (figure) => {
    const index = Math.floor(figure.length * Math.random());
    return figure[index];
  };

  const checkAndDestroyFullRows = (gameBox, lastRowIndex) => {
    let destroyedRows = 0;

    for (let row = lastRowIndex; row >= 0; row--) {
      const currentRow = gameBox[row];

      if (currentRow.includes(0)) {
        continue;
      }

      if (!currentRow.includes(1) && !currentRow.includes(2)) {
        break;
      }

      currentRow.map((el, col) => currentRow[col] = 0);
      destroyedRows++;
    }

    return destroyedRows;
  };

  const moveDownRows = (gameBox, rowIndex, destroyedRows) => {
    const upperDotIndex = getUpperDotRowIndex(gameBox);
    
    for (let row = rowIndex; row >= upperDotIndex; row--) {
      gameBox[row] = JSON.parse(JSON.stringify(gameBox[row - destroyedRows]));
    }
  };

  const getUpperDotRowIndex = (gameBox) => {
    for (let row = 0; row < gameBox.length; row++) {
      if (gameBox[row].includes(2)) {
        return row;
      }
    }
  };

  const isGameOver = (currentFigure, gameBox) => {
    for (let i = 0; i < currentFigure.length; i++) {
      const dot = currentFigure[i];

      if (gameBox[dot.x][dot.y] === 2 || gameBox[dot.x + 1][dot.y] === 2) {
        return true;
      }
    }

    return false;
  };

  const getTouches = (event) => {
    return event.touches || event.originalEvent.touches;
  };

  return {
    getById,
    getBestScore,
    setBestScore,
    getRandomFigure,
    getRandomSide,
    checkAndDestroyFullRows,
    moveDownRows,
    isGameOver,
    getTouches
  }
})();