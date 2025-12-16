import { GameBoard, Loc } from './gameboard.js';
import { Events } from './events.js';
import { em } from './eventemitter.js';
import { jest } from '@jest/globals';

describe('GameBoard', () => {
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
	let g = new GameBoard();
	beforeEach(() => {
		g = new GameBoard();
	});

	describe('initializes correctly', () => {
		it('initializes to correct size', () => {
			expect(g.height()).toBe(10);
			expect(g.width()).toBe(10);
		});

		it('has all ships', () => {
			expect(g.ships().has('carrier')).toBe(true);
			expect(g.ships().has('submarine')).toBe(true);
			expect(g.ships().has('destroyer')).toBe(true);
			expect(g.ships().has('battleship')).toBe(true);
			expect(g.ships().has('cruiser')).toBe(true);
		});

		it('has correct ship lengths', () => {
			expect(g.ships().get('carrier').length()).toBe(5);
			expect(g.ships().get('battleship').length()).toBe(4);
			expect(g.ships().get('cruiser').length()).toBe(3);
			expect(g.ships().get('submarine').length()).toBe(3);
			expect(g.ships().get('destroyer').length()).toBe(2);
		});

		it('returns board', () => {
			expect(g.board()).not.toBeUndefined();
			expect(g.board().length).toBe(10);
			expect(g.board()[0].length).toBe(10);
		});

		it('returns hitBoard', () => {
			expect(g.hitBoard()).not.toBeUndefined();
			expect(g.hitBoard().length).toBe(10);
			expect(g.hitBoard()[0].length).toBe(10);
		});
	});

	describe('attack', () => {
		beforeEach(() => {
			g.unlock();
		});

		it('throw when gameboard locked', () => {
			g.lock();
			const attackThreeThree = () => g.attack(3, 3);
			expect(attackThreeThree).toThrow();
		});

		it('attacks empty spot', () => {
			const attackThreeThree = () => g.attack(3, 3);
			expect(attackThreeThree).not.toThrow();
			expect(g.hitBoard()[3][3]).toEqual(true);
		});

		it('throws when attacking same spot', () => {
			const attackThreeThree = () => g.attack(3, 3);
			expect(attackThreeThree).not.toThrow();
			expect(attackThreeThree).toThrow();
		});

		it('throws when attacking out of bounds', () => {
			const attackThreeTen = () => g.attack(3, 10);
			const attackTenThree = () => g.attack(10, 3);
			const attackNegX = () => g.attack(-2, 3);
			const attackNegY = () => g.attack(1, -2);

			expect(attackThreeTen).toThrow();
			expect(attackTenThree).toThrow();
			expect(attackNegX).toThrow();
			expect(attackNegY).toThrow();
		});

		it('emits attack', () => {
			const mockListener = jest.fn();
			em.on(Events.ATTACK, mockListener);
			const x = 4;
			const y = 7;
			g.attack(x, y);

			expect(mockListener).toHaveBeenCalledTimes(1);
			expect(mockListener).toHaveBeenCalledWith(x, y);
		});
	});

	describe('locks and unlocks', () => {
		it('defaluts to locked state', () => {
			expect(g.isLocked()).toBe(true);
		});

		// doesn't do anything if calling lock when already locked
		it("doesn't do anything if calling lock when already locked", () => {
			g.lock();
			expect(g.isLocked()).toBe(true);
		});

		it('unlocks when locked', () => {
			g.unlock();
			expect(g.isLocked()).toBe(false);
		});

		it('doesnt do anything when unlock called when already unlocked', () => {
			g.unlock();
			expect(g.isLocked()).toBe(false);
		});

		it('locks when unlocked', () => {
			g.lock();
			expect(g.isLocked()).toBe(true);
		});
	});

	describe('places ships', () => {
		beforeEach(() => {
			g.unlock();
		});
		it('throws error when invalid ship', () => {
			const ship = g.ships().get('bootleship');
			const placeUndefined = () => g.placeShip(ship, new Loc(0, 0), new Loc(0, 3));
			expect(placeUndefined).toThrow();
		});

		it('throw error when locked', () => {
			g.lock();
			const carrier = g.ships().get('carrier');
			const createPlaceFunc = function (start, end) {
				return () => {
					g.placeShip(carrier, start, end);
				};
			};
			expect(createPlaceFunc(new Loc(4, 4), new Loc(8, 4))).toThrow();
		});

		it('placeShip happy path', () => {
			const carrier = g.ships().get('carrier');
			const carrierY = 4;
			const carrierXStart = 4;
			const carrierXEnd = 8;
			g.placeShip(carrier, new Loc(carrierXStart, carrierY), new Loc(carrierXEnd, carrierY));

			let carrierCount = 0;
			for (let x = carrierXStart; x <= carrierXEnd; x++) {
				expect(g.board()[carrierY][x]).toBe(carrier);
				carrierCount++;
			}
			expect(carrierCount).toBe(carrier.length());

			const battleship = g.ships().get('battleship');
			const battleshipX = 5;
			const battleshipYStart = 8;
			const battleshipYEnd = 5;
			g.placeShip(battleship, new Loc(battleshipX, battleshipYStart), new Loc(battleshipX, battleshipYEnd));
			let battleshipCount = 0;
			for (let y = battleshipYStart; y >= battleshipYEnd; y--) {
				expect(g.board()[y][battleshipX]).toBe(battleship);
				battleshipCount++;
			}
			expect(battleshipCount).toBe(battleship.length());
		});

		it('placeShip throws error for start and end points implied ship length doesnt match ship', () => {
			const carrier = g.ships().get('carrier');
			const createPlaceFunc = function (start, end) {
				return () => {
					g.placeShip(carrier, start, end);
				};
			};
			expect(createPlaceFunc(new Loc(3, 4), new Loc(9, 4))).toThrow();
			expect(createPlaceFunc(new Loc(5, 4), new Loc(8, 4))).toThrow();
		});

		it('placeShip throws error for ship points out of bounds', () => {
			const carrier = g.ships().get('carrier');
			const createPlaceFunc = function (start, end) {
				return () => {
					g.placeShip(carrier, start, end);
				};
			};
			expect(createPlaceFunc(new Loc(-1, 4), new Loc(3, 4))).toThrow();
			expect(createPlaceFunc(new Loc(9, 4), new Loc(13, 4))).toThrow();
			expect(createPlaceFunc(new Loc(4, -1), new Loc(4, 3))).toThrow();
			expect(createPlaceFunc(new Loc(4, 6), new Loc(4, 10))).toThrow();
		});

		it('placeShip throws error when trying to place colliding ships', () => {
			const carrier = g.ships().get('carrier');
			g.placeShip(carrier, new Loc(4, 4), new Loc(8, 4));
			const battleship = g.ships().get('battleship');
			let placeFunc = () => g.placeShip(battleship, new Loc(5, 5), new Loc(5, 2));
			expect(placeFunc).toThrow();
			placeFunc = () => g.placeShip(battleship, new Loc(4, 4), new Loc(4, 1));
			expect(placeFunc).toThrow();
		});

		it('placeShip throws error when trying to place same ship twice', () => {
			const carrier = g.ships().get('carrier');
			g.placeShip(carrier, new Loc(4, 4), new Loc(8, 4));
			const placeFunc = () => g.placeShip(carrier, new Loc(3, 3), new Loc(7, 3));
			expect(placeFunc).toThrow();
		});
	});

	describe('receiveAttack', () => {
		it('receives attack on ship', () => {
			g.unlock();
			g.placeShip(g.carrier, new Loc(0, 0), new Loc(0, g.carrier.length() - 1));
			g.lock();

			let currentHits = g.carrier.hits();
			let expectedHits = 0;
			expect(currentHits).toBe(expectedHits);

			g.receiveAttack(0, 0);
			currentHits = g.carrier.hits();
			expectedHits++;
			expect(currentHits).toBe(expectedHits);

			g.receiveAttack(0, 1);
			currentHits = g.carrier.hits();
			expectedHits++;
			expect(currentHits).toBe(expectedHits);
		});

		it('receives miss attack', () => {
			g.unlock();
			g.placeShip(g.carrier, new Loc(0, 0), new Loc(0, g.carrier.length() - 1));
			g.lock();

			let currentHits = g.carrier.hits();
			const expectedHits = 0;
			expect(currentHits).toBe(expectedHits);

			g.receiveAttack(1, 0);
			currentHits = g.carrier.hits();

			expect(currentHits).toBe(expectedHits);
		});

		it('emits hit event', () => {
			const hitListener = jest.fn();
			const missListener = jest.fn();
			const sunkListener = jest.fn();
			em.on(Events.RECEIVED_ATTACK_HIT, hitListener);
			em.on(Events.RECEIVED_ATTACK_MISS, missListener);
			em.on(Events.SHIP_SUNK, sunkListener);

			g.unlock();
			g.placeShip(g.carrier, new Loc(0, 0), new Loc(0, g.carrier.length() - 1));
			g.lock();

			const x = 0;
			const y = 0;
			g.receiveAttack(x, y);
			expect(hitListener).toHaveBeenCalledTimes(1);
			expect(hitListener).toHaveBeenLastCalledWith(x, y, 'carrier');

			g.receiveAttack(0, 1);
			expect(hitListener).toHaveBeenCalledTimes(2);
			expect(missListener).toHaveBeenCalledTimes(0);
			expect(sunkListener).toHaveBeenCalledTimes(0);
		});

		it('emits miss event', () => {
			const hitListener = jest.fn();
			const missListener = jest.fn();
			const sunkListener = jest.fn();
			em.on(Events.RECEIVED_ATTACK_HIT, hitListener);
			em.on(Events.RECEIVED_ATTACK_MISS, missListener);
			em.on(Events.SHIP_SUNK, sunkListener);

			g.unlock();
			g.placeShip(g.carrier, new Loc(0, 0), new Loc(0, g.carrier.length() - 1));
			g.lock();

			const x = 1;
			const y = 0;
			g.receiveAttack(x, y);
			expect(missListener).toHaveBeenCalledTimes(1);
			expect(missListener).toHaveBeenLastCalledWith(x, y);

			g.receiveAttack(9, 9);
			expect(missListener).toHaveBeenCalledTimes(2);
			expect(hitListener).toHaveBeenCalledTimes(0);
			expect(sunkListener).toHaveBeenCalledTimes(0);
		});

		it('emits sunk event', () => {
			const sunkListener = jest.fn();
			em.on(Events.SHIP_SUNK, sunkListener);

			const col = 0;
			g.unlock();
			g.placeShip(g.carrier, new Loc(col, 0), new Loc(col, g.carrier.length() - 1));
			g.lock();

			// should hit every location but the last
			for (let row = 0; row < g.carrier.length() - 1; row++) {
				g.receiveAttack(col, row);
			}
			expect(sunkListener).toHaveBeenCalledTimes(0);

			g.receiveAttack(col, g.carrier.length() - 1);
			expect(sunkListener).toHaveBeenCalledTimes(1);
		});

		it('emits game over event', () => {
			const gameOverListener = jest.fn();
			const sunkListener = jest.fn();
			const hitListener = jest.fn();
			em.on(Events.GAME_OVER, gameOverListener);
			em.on(Events.SHIP_SUNK, sunkListener);
			em.on(Events.RECEIVED_ATTACK_HIT, hitListener);

			g.unlock();
			placeAllShips(g);
			hitAllShips(g);
			expect(gameOverListener).toHaveBeenCalledTimes(1);
			// 5 total ships but game over listener gets called instead of last sunk listener
			expect(sunkListener).toHaveBeenCalledTimes(g.ships().size - 1);
			const expectedShipHits =
				g
					.ships()
					.values()
					.reduce((acc, curr) => acc + curr.length(), 0) - g.ships().size;
			expect(hitListener).toHaveBeenCalledTimes(expectedShipHits);
		});
	});

	it('ships arent undefined', () => {
		expect(g.carrier).not.toBeUndefined();
		expect(g.battleship).not.toBeUndefined();
		expect(g.cruiser).not.toBeUndefined();
		expect(g.submarine).not.toBeUndefined();
		expect(g.destroyer).not.toBeUndefined();
	});

	it('returns allShipsSunk only after all ships have been hit max hits', () => {
		const ships = g.ships();
		for (const ship of ships.values()) {
			while (!ship.isSunk()) {
				expect(g.allShipsSunk()).toBe(false);
				ship.hit();
			}
		}
		expect(g.allShipsSunk()).toBe(true);
	});
});
