import BoardTray from './tray.js';
import { cylinder2D } from './shapes-3d.js';

export default class ShipBoard extends BoardTray {
	constructor(blockSize, holeSize, colorPrimary, colorSecondary, gridSize) {
		super(blockSize, colorPrimary, colorSecondary, gridSize);

		const trayFaceFront = this.querySelector('.tray-face.front');

		const rowLength = gridSize || 10;
		const numItems = rowLength * rowLength;
		const blockWidth = blockSize;
		const depth = blockSize;
		const width = blockWidth * 0.7;

		// adds a little offset to the depth of the pegs so they aren't perfectly aligned with the edge of tray
		const offsetDepth = blockSize * 0.3;

		for (let i = 0; i < numItems; i++) {
			const newCyl = cylinder2D(
				width - width * 0.2,
				`calc(${depth}px - ${offsetDepth}px)`,
				colorPrimary,
				'black',
				'1px solid black',
				holeSize,
			);
			newCyl.style.transformStyle = 'preserve-3d';
			newCyl.style.transform = `translateZ(calc(-1 * ${depth} / 2 + 1px))`;

			trayFaceFront.appendChild(newCyl);
		}
	}
}

customElements.define('ship-board', ShipBoard);
