import { Game } from './game.js';
import { DisplayController } from './displaycontroller.js';

document.addEventListener('DOMContentLoaded', (e) => {
	const g = new Game();
	const dc = new DisplayController();

	g.bindEvents();
	dc.bindEvents();
});
