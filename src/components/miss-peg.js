import { Peg } from './peg.js';

export class MissPeg extends Peg {
	constructor(blockSize, holeSize, hasBottom = true) {
		super(blockSize, holeSize, 'white', hasBottom);
	}
}

customElements.define('miss-peg', MissPeg);
