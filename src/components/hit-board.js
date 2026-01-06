import BoardTray from './tray.js';
import { Events } from '../js/events.js';
import { em } from '../js/eventemitter.js';

export default class HitBoard extends BoardTray {
	#player;
	constructor(blockSize, holeSize, colorPrimary, colorSecondary, player) {
		super(blockSize, colorPrimary, colorSecondary);
		this.classList.add('hit-board');
		this.#player = player;

		const trayFace = this.querySelector('.tray-face.front');
		const boardGrid = this.querySelector('.board-grid');

		// need for passthrough click events on hit cells
		boardGrid.style.pointerEvents = 'none';

		const rowLength = 10;
		const numItems = rowLength * rowLength;

		// TODO: get color from external
		const color = '#19a5dd8a';

		for (let i = 0; i < numItems; i++) {
			const cube = document.createElement('div');
			cube.classList.add('hit-cell');

			cube.style.backgroundColor = color;
			cube.style.height = `${blockSize}px`;
			cube.style.width = `${blockSize}px`;
			cube.style.border = '1px solid black';
			cube.style.backgroundImage = `radial-gradient(circle at center, #07124dff ${holeSize / 2}px, ${color} ${holeSize / 2}px)`;
			cube.style.transformStyle = 'preserve-3d';
			cube.style.display = 'grid';
			cube.style.placeItems = 'center';
			const row = Math.floor(i / 10) + 1;
			const col = (i % 10) + 1;
			cube.setAttribute('data-row', row);
			cube.setAttribute('data-col', col);

			trayFace.appendChild(cube);
		}
	}

	bindEvents() {
		const trayFace = this.querySelector('.tray-face.front');

		Array.from(trayFace.querySelectorAll('.hit-cell')).forEach((cell) => {
			cell.addEventListener('click', () => {
				const row = cell.getAttribute('data-row');
				const col = cell.getAttribute('data-col');
				em.emit(Events.ATTACK, this.#player, row - 1, col - 1);
			});
		});
	}
}

customElements.define('hit-board', HitBoard);
