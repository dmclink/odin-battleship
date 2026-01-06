import { cylinder2D } from './shapes-3d.js';
export class Peg extends HTMLElement {
	constructor(blockSize, holeSize, color, hasBottom = true) {
		super();

		this.style.transformStyle = 'preserve-3d';
		this.style.display = 'grid';
		this.style.placeItems = 'center';

		const pegTop = cylinder2D(holeSize * 1.5, blockSize, color, color, '1px solid black');
		pegTop.classList.add('peg-top');

		pegTop.style.position = 'absolute';
		pegTop.style.transform = `translateZ(${blockSize / 2 + 1}px)`;
		this.appendChild(pegTop);

		if (hasBottom) {
			const pegBottom = cylinder2D(holeSize, blockSize / 2, color, color, '1px solid black');
			pegBottom.classList.add('peg-bottom');

			pegBottom.style.position = 'absolute';
			pegBottom.style.transform = `translateZ(${-blockSize / 4 - 1}px)`;
			this.appendChild(pegBottom);
		}
	}
}
