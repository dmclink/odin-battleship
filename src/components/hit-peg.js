import { Peg } from './peg.js';

export class HitPeg extends Peg {
	constructor(blockSize, holeSize, hasBottom = true) {
		super(blockSize, holeSize, 'red', hasBottom);
	}
}

customElements.define('hit-peg', HitPeg);
