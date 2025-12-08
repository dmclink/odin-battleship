import { Ship } from './ship.js';

describe('ship', () => {
	let s = new Ship();
	beforeEach(() => (s = new Ship()));

	it('hits', () => {
		const beforeHits = s.hits;
		s.hit();
		expect(s.hits).toBe(beforeHits + 1);
	});
});
