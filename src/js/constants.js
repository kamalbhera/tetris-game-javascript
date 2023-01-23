// MAIN
const MAIN_CONTAINER = utils.getById('mainContainer');
const GAME_OVER_SCREEN = utils.getById('gameOverScreen');
const START_SCREEN = utils.getById('startScreen');
const NEXT_ELEMENT_WINDOW = utils.getById('nextElementWindow');
const HEADER_LOGO = utils.getById('logo');

// SPEED
const SPEED_INPUT = utils.getById('speedInput');

// SCORE
const CURRENT_SCORE = utils.getById('currentScore');
const CURRENT_SCORE_MOBILE = utils.getById('currentScoreMobile');
const CURRENT_BEST = utils.getById('currentBest');
const USER_BEST = utils.getById('userBest');

// KEYS
const KEYS = {
	up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  space: ' ',
  escape: 'Escape',
  w: 'w',
  a: 'a',
  s: 's',
  d: 'd'
};

// SETTINGS
const SETTINGS = {
  height: 25,
  width: 15,
  speed: 0,
  isGameOver: false,
  points: 0,
  currentBest: 0,
  userBest: 0
};