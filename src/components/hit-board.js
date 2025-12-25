import BoardTray from './tray.js';

export default class HitBoard extends BoardTray {
	constructor(blockSize, holeSize, colorPrimary, colorSecondary) {
		super(blockSize, colorPrimary, colorSecondary);

		const trayFace = this.querySelector('.tray-face.front');

		const rowLength = 10;
		const numItems = rowLength * rowLength;

		// TODO: get color from external
		const color = '#19a5dd8a';

		for (let i = 0; i < numItems; i++) {
			const cube = document.createElement('div');

			cube.style.backgroundColor = color;
			cube.style.height = `${blockSize}px`;
			cube.style.width = `${blockSize}px`;
			cube.style.border = '1px solid black';
			cube.style.backgroundImage = `radial-gradient(circle at center, #07124dff ${holeSize / 2}px, ${color} ${holeSize / 2}px)`;

			trayFace.appendChild(cube);
		}
	}
}

customElements.define('hit-board', HitBoard);
