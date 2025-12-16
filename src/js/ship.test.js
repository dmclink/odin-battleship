import { Ship } from './ship.js';

describe('ship', () => {
	let s2 = new Ship(2, 'destroyer');
	beforeEach(() => (s2 = new Ship(2, 'destroyer')));

	let s5 = new Ship(5, 'carrier');
	beforeEach(() => (s5 = new Ship(5, 'carrier')));

	it('returns name', () => {
		expect(s2.name()).toBe('destroyer');
		expect(s5.name()).toBe('carrier');
	});

	it('has the right length', () => {
		expect(s2.length()).toBe(2);
		expect(s5.length()).toBe(5);
	});

	it('initializes with 0 hits', () => {
		expect(s2.hits()).toBe(0);

		expect(s5.hits()).toBe(0);
	});

	it('hits', () => {
		s2.hit();
		expect(s2.hits()).toBe(1);
		s2.hit();
		expect(s2.hits()).toBe(2);

		s5.hit();
		expect(s5.hits()).toBe(1);
	});

	it('throws error if hits over length()', () => {
		const hitS2 = () => s2.hit();
		for (let i = 0; i < s2.length(); i++) {
			expect(hitS2).not.toThrow();
		}
		expect(hitS2).toThrow();

		const hitS5 = () => s5.hit();
		for (let i = 0; i < s5.length(); i++) {
			expect(hitS5).not.toThrow();
		}
		expect(hitS5).toThrow();
	});

	it('returns sunk', () => {
		expect(s2.isSunk()).toBe(false);
		for (let i = 0; i < s2.length(); i++) {
			s2.hit();
		}
		expect(s2.isSunk()).toBe(true);

		expect(s5.isSunk()).toBe(false);
		for (let i = 0; i < s5.length(); i++) {
			s5.hit();
		}
		expect(s5.isSunk()).toBe(true);
	});

	it('places', () => {
		expect(s2.isPlaced()).toBe(false);
		s2.place();
		expect(s2.isPlaced()).toBe(true);
	});
});
