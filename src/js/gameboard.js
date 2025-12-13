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
	#hitBoard;

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
		this.#hitBoard = [];
		for (let i = 0; i < this.#height; i++) {
			this.#board.push(new Array(this.#width));
			this.#hitBoard.push(new Array(this.#width));
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

	board() {
		return this.#board.map((row) => row.slice());
	}

	hitBoard() {
		return this.#hitBoard.map((row) => row.slice());
	}

	#isOOB(loc) {
		return loc.x < 0 || loc.x >= this.#width || loc.y < 0 || loc.y >= this.#height;
	}

	attack(x, y) {
		if (this.#isOOB(new Loc(x, y))) {
			throw new Error('attack location is out of bounds');
		}

		if (this.#hitBoard[y][x] !== undefined) {
			throw new Error('already attacked this location');
		}

		this.#hitBoard[y][x] = true;
	}

	placeShip(ship, start, end) {
		if (ship.isPlaced()) {
			throw new Error('ship is already placed');
		}

		if (this.#isOOB(start) || this.#isOOB(end)) {
			throw new Error('start or end point is out of bounds of board');
		}

		let implicitShipLength = Math.abs(start.x - end.x) || Math.abs(start.y - end.y);
		// [start,end] are inclusive
		implicitShipLength++;
		const actualShipLength = ship.length();
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
