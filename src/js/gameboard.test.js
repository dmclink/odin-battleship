import { GameBoard, Loc } from './gameboard.js';

describe('GameBoard', () => {
	let g;
	beforeEach(() => (g = new GameBoard()));

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
		expect(g.ships().get('carrier').length).toBe(5);
		expect(g.ships().get('battleship').length).toBe(4);
		expect(g.ships().get('cruiser').length).toBe(3);
		expect(g.ships().get('submarine').length).toBe(3);
		expect(g.ships().get('destroyer').length).toBe(2);
	});

	it('places ship', () => {
		const carrier = g.ships().get('carrier');
		g.placeShip(carrier, new Loc(4, 4), new Loc(9, 4));
		const battleship = g.ships().get('battleship');
		g.placeShip(battleship, new Loc(5, 9), new Loc(5, 5));

		// TODO: test that the ships got placed
	});

	it('placeShip throws error for start and end points implied ship length doesnt match ship', () => {
		const carrier = g.ships().get('carrier');
		const createPlaceFunc = function (start, end) {
			return () => {
				g.placeShip(carrier, start, end);
			};
		};
		expect(createPlaceFunc(new Loc(3, 4), new Loc(9, 4))).toThrow();
		expect(createPlaceFunc(new Loc(5, 4), new Loc(9, 4))).toThrow();
	});

	it('placeShip throws error for ship points out of bounds', () => {
		const carrier = g.ships().get('carrier');
		const createPlaceFunc = function (start, end) {
			return () => {
				g.placeShip(carrier, start, end);
			};
		};
		expect(createPlaceFunc(new Loc(-1, 4), new Loc(4, 4))).toThrow();
		expect(createPlaceFunc(new Loc(9, 4), new Loc(14, 4))).toThrow();
		expect(createPlaceFunc(new Loc(4, -1), new Loc(4, 4))).toThrow();
		expect(createPlaceFunc(new Loc(4, 5), new Loc(4, 10))).toThrow();
	});

	it('placeShip throws error when trying to place colliding ships', () => {
		const carrier = g.ships().get('carrier');
		g.placeShip(carrier, new Loc(4, 4), new Loc(9, 4));
		const battleship = g.ships().get('battleship');
		let placeFunc = () => g.placeShip(battleship, new Loc(5, 5), new Loc(5, 1));
		expect(placeFunc).toThrow();
		placeFunc = () => g.placeShip(battleship, new Loc(4, 4), new Loc(4, 0));
		expect(placeFunc).toThrow();
	});

	it('placeShip throws error when trying to place same ship twice', () => {
		const carrier = g.ships().get('carrier');
		g.placeShip(carrier, new Loc(4, 4), new Loc(9, 4));
		const placeFunc = () => g.placeShip(carrier, new Loc(3, 3), new Loc(8, 3));
		expect(placeFunc).toThrow();
	});

	// it('placeShip throws error for start point negative x', () => {
	// 	const carrier = g.ships().get('carrier');
	// 	const placeFunc = () => g.placeShip(carrier, new Loc(-1, 4), new Loc(4, 4));
	// 	expect(placeFunc).toThrow();
	// });
	//
	// it('placeShip throws error for start point over x', () => {
	// 	const carrier = g.ships().get('carrier');
	// 	const placeFunc = () => g.placeShip(carrier, new Loc(5, 4), new Loc(10, 4));
	// 	expect(placeFunc).toThrow();
	// });
	//
	// it('placeShip throws error for start point negative y', () => {
	// 	const carrier = g.ships().get('carrier');
	// 	const placeFunc = () => g.placeShip(carrier, new Loc(4, 4), new Loc(4, 4));
	// 	expect(placeFunc).toThrow();
	// });
});
