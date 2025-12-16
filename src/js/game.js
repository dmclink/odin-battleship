import { GameBoard } from './gameboard.js';
import { em } from './eventemitter.js';
import { Events } from './events.js';

const GameTypes = Object.freeze({
	PLAYER: 0,
	COMPUTER: 1,
});

const Players = Object.freeze({
	PLAYER_0: 0,
	PLAYER_1: 1,
});

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
		this.#player0Board = new GameBoard();
		this.#player1Board = new GameBoard();
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
	 * @param {GameType} gameType - the game type to set the game board to
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

	bindEvents() {
		em.on(Events.SELECT_GAME_TYPE, this.setGameType.bind(this));
		em.on(Events.GAME_OVER, this.unsetGameType.bind(this));
	}
}

export { Game, isValidGameType, Phases, GameTypes, Players };
