import BoardTray from './tray.js';

class HitBoard extends BoardTray {
	constructor() {
		super();

		const trayFace = this.querySelector('.tray-face-container.front > .tray-face');
		console.log(trayFace);

		trayFace.style.display = 'grid';
		trayFace.style.gridTemplateColumns = 'repeat(10, 1fr)';
		trayFace.style.transformStyle = 'preserve-3d';
		trayFace.style.placeItems = 'center';

		const gridGap = 3;
		const numItems = 10;

		const width = (trayFace.offsetWidth - (numItems - 1) * gridGap) / numItems;
		// assumes width and height are the same becaues grid is assumed square
		// const height = (trayFace.offsetHeight - (numItems - 1) * gridGap) / numItems;

		const color = '#19a5dd8a';

		for (let i = 0; i < 100; i++) {
			const cube = document.createElement('div');

			cube.style.backgroundColor = color;
			cube.style.height = `${width}px`;
			cube.style.width = `${width}px`;
			cube.style.border = '1px solid black';
			cube.style.backgroundImage = `radial-gradient(circle at center, #07124dff ${width / 4}px, ${color} ${width / 4}px)`;

			trayFace.appendChild(cube);
		}
	}
}

customElements.define('hit-board', HitBoard);
