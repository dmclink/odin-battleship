import { Ship } from './ship.js';

class Loc {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal(loc2) {
		return this.x === loc2.x && this.y === loc2.y;
	}

	moveLoc(dX, dY) {
		return new Loc(this.x + dX, this.y + dY);
	}
}

class GameBoard {
	#height;
	#width;
	#ships;
	#board;

	constructor() {
		this.#height = 10;
		this.#width = 10;

		this.#ships = new Map();
		this.#ships.set('carrier', new Ship(5));
		this.#ships.set('battleship', new Ship(4));
		this.#ships.set('cruiser', new Ship(3));
		this.#ships.set('submarine', new Ship(3));
		this.#ships.set('destroyer', new Ship(2));

		this.#board = [];
		for (let i = 0; i < this.#height; i++) {
			this.#board.push(new Array(this.#width));
		}
	}
	height() {
		return this.#height;
	}
	width() {
		return this.#width;
	}
	ships() {
		return this.#ships;
	}

	placeShip(ship, start, end) {
		if (ship.isPlaced()) {
			throw new Error('ship is already placed');
		}

		if (
			start.x < 0 ||
			end.x < 0 ||
			start.y < 0 ||
			end.y < 0 ||
			start.x >= this.#width ||
			end.x >= this.#width ||
			start.y >= this.#height ||
			end.y >= this.#height
		) {
			throw new Error('start or end point is out of bounds of board');
		}

		const implicitShipLength = Math.abs(start.x - end.x) || Math.abs(start.y - end.y);
		const actualShipLength = ship.length;
		if (implicitShipLength !== actualShipLength) {
			throw new Error(
				`implied ship length does not match actual. got ${implicitShipLength} want ${actualShipLength}`,
			);
		}

		const cmp = function (a, b) {
			if (a === b) {
				return 0;
			} else if (a > b) {
				return 1;
			}
			return -1;
		};
		const dX = cmp(end.x, start.x);
		const dY = cmp(end.y, start.y);

		// check for collisions along ship path first before placing
		let curs = start;
		if (this.#board[curs.y][curs.x] !== undefined) {
			throw new Error('ships colliding at place ship path');
		}
		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			if (this.#board[curs.y][curs.x] !== undefined) {
				throw new Error('ships colliding at place ship path');
			}
		}

		// place the ship
		curs = start;
		this.#board[curs.y][curs.x] = ship;
		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			this.#board[curs.y][curs.x] = ship;
		}
		ship.place();
	}

	// printBoard() {
	// 	for (let i = 0; i < this.#height; i++) {
	// 		console.log(this.#board[i]);
	// 	}
	// }
}

export { GameBoard, Loc };
