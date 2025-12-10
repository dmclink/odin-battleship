import { GameBoard } from './gameboard.js';

describe('GameBoard', () => {
	let g;
	beforeEach(() => (g = new GameBoard()));

	it('initializes to correct size', () => {
		expect(g.height()).toBe(10);
		expect(g.width()).toBe(10);
	});

	it('has all ships', () => {
		expect(g.ships()).toContain('carrier');
	});
});
