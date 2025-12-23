import BoardTray from './tray.js';
import { cylinder2D } from './shapes-3d.js';

class ShipBoard extends BoardTray {
	constructor() {
		super();

		const trayFace = this.querySelector('.tray-face-container.front > .tray-face');
		console.log(trayFace);

		trayFace.style.display = 'grid';
		trayFace.style.gridTemplateColumns = 'repeat(10, 1fr)';
		trayFace.style.transformStyle = 'preserve-3d';
		trayFace.style.placeItems = 'center';

		const gridGap = 0;
		const numItems = 10;
		const blockWidth = (trayFace.offsetWidth - (numItems - 1) * gridGap) / numItems;
		// assumes width and height are the same becaues grid is assumed square
		// const height = (trayFace.offsetHeight - (numItems - 1) * gridGap) / numItems;
		const depth = window.getComputedStyle(trayFace).getPropertyValue('--depth');

		const width = blockWidth * 0.7;

		// adds a little offset to the depth of the pegs so they aren't perfectly aligned with the edge of tray
		const offsetDepth = '25px';

		for (let i = 0; i < 100; i++) {
			// not sure how well this width measurements scales up or down
			const newCyl = cylinder2D(
				width - width * 0.2,
				`calc(${depth} - ${offsetDepth})`,
				'#4468ea',
				'black',
				'1px solid black',
				width / 2,
			);
			newCyl.style.transformStyle = 'preserve-3d';
			newCyl.style.transform = `translateZ(calc(-1 * ${depth} / 2 + 1px))`;

			trayFace.appendChild(newCyl);
		}
	}
}

customElements.define('ship-board', ShipBoard);
