import { Game, isValidGameType, Players, Phases, GameTypes } from './game.js';
import { Loc } from './gameboard.js';
import { jest } from '@jest/globals';
import { em } from './eventemitter.js';
import { Events } from './events.js';

describe('isValidGameType', () => {
	it('shows valid game types', () => {
		expect(isValidGameType(0)).toBe(true);
		expect(isValidGameType(1)).toBe(true);
	});

	it('prevents invalid game types', () => {
		expect(isValidGameType(-1)).toBe(false);
		expect(isValidGameType(2)).toBe(false);
	});
});

describe('Game', () => {
	// helper functions
	const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];
	const placeShip = function (board, ship, start, end) {
		board.placeShip(ship, start, end);
	};

	const placeAllShips = function (board) {
		const ships = board.ships();
		board.unlock();

		for (let col = 0; col < shipNames.length; col++) {
			const shipName = shipNames[col];
			const ship = ships.get(shipName);
			placeShip(board, ship, new Loc(col, 0), new Loc(col, ship.length() - 1));
		}
	};
	const hitAllShips = function (board) {
		const ships = board.ships();

		for (let col = 0; col < shipNames.length; col++) {
			const shipName = shipNames[col];
			const ship = ships.get(shipName);
			for (let row = 0; row < ship.length(); row++) board.receiveAttack(col, row);
		}
	};

	let g = new Game();
	beforeEach(() => {
		g = new Game();
		g.init();
	});

	describe('init', () => {
		it('emits game start', () => {
			const mockListener = jest.fn();
			em.on(Events.GAME_START, mockListener);

			g.init();
			expect(mockListener).toHaveBeenCalledTimes(1);
		});

		it('emits the game type', () => {
			g.bindEvents();
			const mockListener = jest.fn();
			em.on(Events.GAME_START, mockListener);

			g.setGameType(GameTypes.COMPUTER);

			expect(mockListener).toHaveBeenCalledWith(GameTypes.COMPUTER);

			// triggers an unset of the game type, otherwise causes an error for double setting
			em.emit(Events.GAME_OVER);

			g.setGameType(GameTypes.PLAYER);

			expect(mockListener).toHaveBeenCalledWith(GameTypes.PLAYER);
		});
	});

	describe('unsetGameType', () => {
		g.setGameType(GameTypes.COMPUTER);
		g.unsetGameType();

		expect(g.gameType()).toBeUndefined();
	});

	describe('setGameType', () => {
		it('sets game type to play against computer', () => {
			g.setGameType(GameTypes.COMPUTER);
			expect(g.gameType()).toBe(GameTypes.COMPUTER);
		});

		it('sets game type to play against another player', () => {
			g.setGameType(GameTypes.PLAYER);
			expect(g.gameType()).toBe(GameTypes.PLAYER);
		});

		it('throws error setting game type twice', () => {
			const setGameTypePlayer = () => g.setGameType(GameTypes.PLAYER);
			expect(setGameTypePlayer).not.toThrow();
			expect(setGameTypePlayer).toThrow();
		});
	});

	it('changes turns', () => {
		expect(g.playerTurn()).toBe(Players.PLAYER_0);
		expect(g.player0Board().isLocked()).toBe(false);
		expect(g.player1Board().isLocked()).toBe(true);
		g.changeTurn();
		expect(g.playerTurn()).toBe(Players.PLAYER_1);
		expect(g.player0Board().isLocked()).toBe(true);
		expect(g.player1Board().isLocked()).toBe(false);
		g.changeTurn();
		expect(g.playerTurn()).toBe(Players.PLAYER_0);
		expect(g.player0Board().isLocked()).toBe(false);
		expect(g.player1Board().isLocked()).toBe(true);
	});

	it('returns the correct current players board', () => {
		expect(g.currentPlayerBoard()).toEqual(g.player0Board());
		g.changeTurn();
		expect(g.currentPlayerBoard()).toEqual(g.player1Board());
	});

	describe('isGameOver', () => {
		beforeEach(() => {
			placeAllShips(g.player0Board());
			placeAllShips(g.player1Board());
		});

		it('returns undefined winner before any winner', () => {
			expect(g.produceWinner()).toBeUndefined();
		});

		it('returns game over for player 0', () => {
			expect(g.isGameOver()).toBe(false);
			hitAllShips(g.player0Board());
			expect(g.isGameOver()).toBe(true);
			expect(g.produceWinner()).toBe(Players.PLAYER_1);
		});

		it('returns game over for player 1', () => {
			expect(g.isGameOver()).toBe(false);
			hitAllShips(g.player1Board());
			expect(g.isGameOver()).toBe(true);
			expect(g.produceWinner()).toBe(Players.PLAYER_0);
		});
	});

	describe('gamePhases', () => {
		it('initializes with correct game phase', () => {
			expect(g.phase()).toBe(Phases.SETUP);
		});

		it('sets next game phase', () => {
			g.nextPhase();
			expect(g.phase()).toBe(Phases.ATTACK);
		});

		it('emits message when changing game phase', () => {
			const mockListener = jest.fn();
			em.on(Events.PHASE_CHANGE, mockListener);
			g.nextPhase();
			expect(mockListener).toHaveBeenCalledTimes(1);
		});

		it('throws error when trying to go to invalid phase', () => {
			const nextPhase = () => g.nextPhase();
			expect(nextPhase).not.toThrow();
			expect(nextPhase).toThrow();
		});
	});
});
