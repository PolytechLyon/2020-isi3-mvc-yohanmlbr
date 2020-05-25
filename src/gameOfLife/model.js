import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";
//import { drawGame } from "./view";

export class Model {
  constructor(callback) {
    this.callback = callback;
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        var tmpState = Array.from(new Array(this.height), () =>
          Array.from(new Array(this.width), () => CELL_STATES.NONE)
        );
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            tmpState[i][j] = this.state[i][j];
          }
        }
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAliveN = this.aliveNeighbours(i, j);
            const isAlive = this.isCellAlive(i, j);
            if (
              (isAlive && (nbAliveN === 2 || nbAliveN === 3)) ||
              (!isAlive && nbAliveN === 3)
            ) {
              tmpState[j][i] = CELL_STATES.ALIVE;
            } else if (this.state[j][i] === CELL_STATES.NONE) {
              tmpState[j][i] = CELL_STATES.NONE;
            } else {
              tmpState[j][i] = CELL_STATES.DEAD;
            }
          }
        }
        this.state = tmpState;
        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (this.isCellAlive(x + i, y + j)) {
          number++;
        }
      }
    }
    return number;
  }

  updated() {
    this.callback(this);
  }

  setSize(n) {
    this.width = n;
    this.height = n;
    this.stop();
    this.init();
  }
}
