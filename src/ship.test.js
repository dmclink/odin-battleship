import { Ship } from './ship.js';

describe('ship', () => {
	let s2 = new Ship(2);
	beforeEach(() => (s2 = new Ship(2)));

	let s5 = new Ship(5);
	beforeEach(() => (s5 = new Ship(5)));

	it('hits', () => {
		expect(s2.hits).toBe(0);
		s2.hit();
		expect(s2.hits).toBe(1);
		s2.hit();
		expect(s2.hits).toBe(2);

		expect(s5.hits).toBe(0);
		s5.hit();
		expect(s5.hits).toBe(1);
	});

	it('throws error if hits over length', () => {
		expect(() => s2.hit()).not.toThrow();
		expect(() => s2.hit()).not.toThrow();

		expect(() => s2.hit()).toThrow();

		expect(() => s5.hit()).not.toThrow();
		expect(() => s5.hit()).not.toThrow();
		expect(() => s5.hit()).not.toThrow();
		expect(() => s5.hit()).not.toThrow();
		expect(() => s5.hit()).not.toThrow();

		expect(() => s5.hit()).toThrow();
	});
});
