import { Ship } from './ship.js';
import { Events } from './events.js';
import { em } from './eventemitter.js';
import { Loc } from './loc.js';

class GameBoard {
	#height;
	#width;
	#ships;
	#board;
	#hitBoard;
	#locked;

	constructor() {
		this.#height = 10;
		this.#width = 10;

		this.#ships = new Map();
		// TODO: consider getting these sizes and names in constants object and iterating through to set
		this.#ships.set('carrier', new Ship(5, 'carrier'));
		this.#ships.set('battleship', new Ship(4, 'battleship'));
		this.#ships.set('cruiser', new Ship(3, 'cruiser'));
		this.#ships.set('submarine', new Ship(3, 'submarine'));
		this.#ships.set('destroyer', new Ship(2, 'destroyer'));

		this.#board = [];
		this.#hitBoard = [];
		for (let i = 0; i < this.#height; i++) {
			this.#board.push(new Array(this.#width));
			this.#hitBoard.push(new Array(this.#width));
		}

		this.#locked = true;
	}

	get carrier() {
		return this.#ships.get('carrier');
	}
	get battleship() {
		return this.#ships.get('battleship');
	}
	get cruiser() {
		return this.#ships.get('cruiser');
	}
	get submarine() {
		return this.#ships.get('submarine');
	}
	get destroyer() {
		return this.#ships.get('destroyer');
	}

	lock() {
		this.#locked = true;
	}

	unlock() {
		this.#locked = false;
	}

	isLocked() {
		return this.#locked;
	}

	height() {
		return this.#height;
	}

	width() {
		return this.#width;
	}

	/**
	 * Returns a map of all ships
	 * @returns {Map<string, Ship>} - map ship names as strings to their corresponding ship object
	 */
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

	receiveAttack(x, y) {
		if (!this.#board[y][x]) {
			em.emit(Events.RECEIVED_ATTACK_MISS, x, y);
			return;
		}

		const ship = this.#board[y][x];
		const shipName = ship.name();
		ship.hit();

		if (this.allShipsSunk()) {
			em.emit(Events.GAME_OVER, x, y);
			return;
		}

		if (ship.isSunk()) {
			em.emit(Events.SHIP_SUNK, x, y, shipName);
		} else {
			em.emit(Events.RECEIVED_ATTACK_HIT, x, y, shipName);
		}
	}

	attack(x, y) {
		if (this.isLocked()) {
			throw new Error('cannot attack right now, must wait your turn');
		}

		if (this.#isOOB(new Loc(x, y))) {
			throw new Error('attack location is out of bounds');
		}

		if (this.#hitBoard[y][x] !== undefined) {
			throw new Error('already attacked this location');
		}

		this.#hitBoard[y][x] = true;

		em.emit(Events.ATTACK, x, y);
	}

	canPlaceShip(ship, start, end) {
		return (
			ship &&
			!this.isLocked() &&
			!ship.isPlaced() &&
			!this.#isOOB(start) &&
			!this.#isOOB(end) &&
			this.isEmptyBetween(start, end) &&
			GameBoard.isCorrectShipLength(ship, start, end)
		);
	}

	static isCorrectShipLength(ship, start, end) {
		const implicitShipLength = (Math.abs(start.x - end.x) || Math.abs(start.y - end.y)) + 1;
		const actualShipLength = ship.length();
		if (implicitShipLength !== actualShipLength) {
			return false;
		}
		return true;
	}

	placeShip(ship, start, end) {
		if (!ship) {
			throw new Error('is not a valid ship');
		}

		if (this.isLocked()) {
			throw new Error('cannot place ship, must wait your turn');
		}

		if (ship.isPlaced()) {
			throw new Error('ship is already placed');
		}

		if (this.#isOOB(start) || this.#isOOB(end)) {
			throw new Error('start or end point is out of bounds of board');
		}

		if (!GameBoard.isCorrectShipLength(ship, start, end)) {
			throw new Error(`implied ship length does not match actual`);
		}

		if (!this.isEmptyBetween(start, end)) {
			throw new Error('ships colliding at place ship path');
		}

		// place the ship
		const dX = GameBoard.cmp(end.x, start.x);
		const dY = GameBoard.cmp(end.y, start.y);
		let curs = start;

		this.#board[curs.y][curs.x] = ship;
		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			this.#board[curs.y][curs.x] = ship;
		}
		ship.place();

		// TODO: emit all ships placed?
		// if (ships.placed == this.ships().length)
	}

	static cmp(a, b) {
		if (a === b) {
			return 0;
		} else if (a > b) {
			return 1;
		}
		return -1;
	}

	isEmptyBetween(start, end) {
		const dX = GameBoard.cmp(end.x, start.x);
		const dY = GameBoard.cmp(end.y, start.y);

		let curs = start;
		if (this.#board[curs.y][curs.x] !== undefined) {
			return false;
		}

		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			if (this.#board[curs.y][curs.x] !== undefined) {
				return false;
			}
		}

		return true;
	}

	allShipsSunk() {
		const ships = this.ships().values();
		for (const ship of ships) {
			if (!ship.isSunk()) {
				return false;
			}
		}
		return true;
	}

	// printBoard() {
	// 	for (let i = 0; i < this.#height; i++) {
	// 		console.log(this.#board[i]);
	// 	}
	// }
}

export { GameBoard, Loc };
