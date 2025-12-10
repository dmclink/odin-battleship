import { GameBoard, Loc } from './gameboard.js';

describe('GameBoard', () => {
	let g;
	beforeEach(() => (g = new GameBoard()));

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
	});

	describe('places ships', () => {
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
});
