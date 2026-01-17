import { Game } from './game.js';
import { DisplayController } from './displaycontroller.js';
import { em } from './eventemitter.js';
import { Events } from './events.js';

let g;
let dc;

function restartGame() {
	em.offAll();
	g = new Game();
	dc = new DisplayController();

	g.bindEvents();
	dc.bindEvents();
	em.on(Events.RESTART_GAME, restartGame);
}

document.addEventListener('DOMContentLoaded', () => {
	restartGame();
});
