import { GameBoard } from './gameboard.js';
import { em } from './eventemitter.js';
import { Events } from './events.js';
import { Loc } from './loc.js';
import { Ships, GameTypes, Players } from './const.js';

const Phases = Object.freeze({
	SETUP: 0,
	ATTACK: 1,
});

function isValidGameType(input) {
	return Object.values(GameTypes).includes(input);
}

class Game {
	#gameType;
	#playerTurn;
	#phase;

	#player0Board;
	#player1Board;
	#playerBoards;

	init() {
		this.#player0Board = new GameBoard(0);
		this.#player1Board = new GameBoard(1);
		this.#playerTurn = Players.PLAYER_0;
		this.#phase = Phases.SETUP;
		this.#playerBoards = [];
		this.#playerBoards.push(this.#player0Board, this.#player1Board);

		// initialize game starting with player 0s turn
		this.#player0Board.unlock();

		em.emit(Events.GAME_START, this.#gameType);
	}

	playerTurn() {
		return this.#playerTurn;
	}

	changeTurn() {
		this.#playerBoards[this.#playerTurn].lock();
		this.#playerTurn ^= 1;
		this.#playerBoards[this.#playerTurn].unlock();
	}

	/**
	 * Sets the game type. This function is called when user interacts with the welcome screen to
	 * start a new game. Calls init() to setup/reset state for the new game
	 * @param {GameTypes} gameType - the game type to set the game board to
	 */
	setGameType(gameType) {
		if (this.#gameType !== undefined) {
			throw new Error('game type already set');
		}
		this.#gameType = gameType;

		// wipe the gameboard for a clean slate
		this.init();
	}

	unsetGameType() {
		this.#gameType = undefined;
	}

	gameType() {
		return this.#gameType;
	}

	isGameOver() {
		return this.#player0Board.allShipsSunk() || this.#player1Board.allShipsSunk();
	}

	produceWinner() {
		if (this.#player0Board.allShipsSunk()) {
			return Players.PLAYER_1;
		} else if (this.#player1Board.allShipsSunk()) {
			return Players.PLAYER_0;
		}
		return undefined;
	}

	currentPlayerBoard() {
		return this.#playerBoards[this.#playerTurn];
	}
	enemyPlayerBoard() {
		return this.#playerBoards[this.#playerTurn ^ 1];
	}

	player0Board() {
		return this.#player0Board;
	}

	player1Board() {
		return this.#player1Board;
	}

	phase() {
		return this.#phase;
	}

	nextPhase() {
		if (this.#phase === Phases.ATTACK) {
			throw new Error('already in attack phase');
		}

		em.emit(Events.PHASE_CHANGE);

		this.#phase = Phases.ATTACK;
	}

	tryPlaceShip(shipName, start, end) {
		const currentPlayerBoard = this.currentPlayerBoard();
		const ship = currentPlayerBoard.ships().get(shipName);

		if (!ship) {
			throw new Error('invalid ship name, does not exist in map');
		}

		if (currentPlayerBoard.canPlaceShip(ship, start, end)) {
			currentPlayerBoard.placeShip(ship, start, end);
			em.emit(Events.PLACE_SHIP_SUCCESS, shipName, start, end, this.playerTurn());
		} else {
			em.emit(Events.PLACE_SHIP_FAIL, shipName, start, end, this.playerTurn());
		}
	}

	unplaceShip(shipName) {
		const currentPlayerBoard = this.currentPlayerBoard();
		const ship = currentPlayerBoard.ships().get(shipName);

		if (!ship) {
			throw new Error('invalid ship name, does not exist in map');
		}

		currentPlayerBoard.unplaceShip(ship);
	}

	static randomMax9() {
		return Math.floor(Math.random() * 10);
	}

	static randomLoc() {
		return new Loc(Game.randomMax9(), Game.randomMax9());
	}

	static randomDir() {
		const idx = Math.floor(Math.random() * 4);
		const dirs = [
			{ dX: 1, dY: 0 },
			{ dX: -1, dY: 0 },
			{ dX: 0, dY: 1 },
			{ dX: 0, dY: -1 },
		];
		return dirs[idx];
	}

	static randomStartEnd(shipSize) {
		const dist = shipSize - 1;
		const { dX, dY } = Game.randomDir();
		const start = Game.randomLoc();
		const end = start.moveLoc(dX * dist, dY * dist);
		return [start, end];
	}

	randomPlaceShip(ship) {
		const size = ship.length();
		let [start, end] = Game.randomStartEnd(size);
		while (!this.currentPlayerBoard().canPlaceShip(ship, start, end)) {
			[start, end] = Game.randomStartEnd(size);
		}

		this.currentPlayerBoard().placeShip(ship, start, end);
	}

	computerPlaceShips() {
		if (this.#gameType !== GameTypes.COMPUTER) {
			return;
		}
		if (this.#playerTurn !== Players.PLAYER_1) {
			throw new Error('called computer place ships on player 0 (human) turn');
		}

		const board = this.player1Board();
		for (const shipConst of Object.values(Ships)) {
			const ship = board.ships().get(shipConst.name);
			this.randomPlaceShip(ship);
		}

		em.emit(Events.PLAYER1_READY);
	}

	attack(attackingPlayer, row, col) {
		if (attackingPlayer !== this.playerTurn()) {
			return;
		}

		const board = this.currentPlayerBoard();
		const enemyBoard = this.enemyPlayerBoard();

		if (board.canAttack(col, row)) {
			board.attack(col, row);
			enemyBoard.receiveAttack(col, row);
		}
	}

	computerAttack() {
		if (this.gameType() === GameTypes.COMPUTER && this.playerTurn() === Players.COMPUTER) {
			// timeout gives it a more realistic "feel" like the computer had to think for a split second
			setTimeout(() => {
				const board = this.currentPlayerBoard();
				const enemyBoard = this.enemyPlayerBoard();
				let attackLoc = Game.randomLoc();
				while (!board.canAttack(attackLoc.x, attackLoc.y)) {
					attackLoc = Game.randomLoc();
				}
				board.attack(attackLoc.x, attackLoc.y);
				enemyBoard.receiveAttack(attackLoc.x, attackLoc.y);
			}, 300);
		}
	}

	bindEvents() {
		em.on(Events.SELECT_GAME_TYPE, this.setGameType.bind(this));
		em.on(Events.GAME_OVER, this.unsetGameType.bind(this));

		em.on(Events.TRY_PLACE_SHIP, this.tryPlaceShip.bind(this));
		em.on(Events.UNPLACE_SHIP, this.unplaceShip.bind(this));

		em.on(Events.PLAYER0_READY, this.changeTurn.bind(this));
		// TODO: consider moving this and any other gametype specific events to a separate function
		// called after game type is chosen
		em.on(Events.PLAYER0_READY, this.computerPlaceShips.bind(this));
		em.on(Events.PLAYER1_READY, this.changeTurn.bind(this));
		em.on(Events.PLAYER1_READY, this.nextPhase.bind(this));

		em.on(Events.ATTACK, this.attack.bind(this));
		em.on(Events.RECEIVED_ATTACK, this.changeTurn.bind(this));
		em.on(Events.RECEIVED_ATTACK, this.computerAttack.bind(this));
	}
}

export { Game, isValidGameType, Phases, Players };
