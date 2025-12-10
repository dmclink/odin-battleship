import { Ship } from './ship.js';

class GameBoard {
	#height;
	#width;
	#ships;

	constructor() {
		this.#height = 10;
		this.#width = 10;

		this.#ships = {};
		this.#ships.carrier = new Ship(5);
		this.#ships.battleship = new Ship(4);
		this.#ships.cruiser = new Ship(3);
		this.#ships.submarine = new Ship(3);
		this.#ships.destroyer = new Ship(2);
	}
	height() {
		return this.#height;
	}
	width() {
		return this.#width;
	}
	ships() {
		return this.#ships();
	}
}

export { GameBoard };
