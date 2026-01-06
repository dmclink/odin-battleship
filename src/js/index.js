import { Game } from './game.js';
import { DisplayController } from './displaycontroller.js';
import { em } from './eventemitter.js';
import { Events } from './events.js';
import { GameTypes } from './const.js';

let g;
let dc;

function restartGame() {
	g = new Game();
	dc = new DisplayController();

	g.bindEvents();
	dc.bindEvents();
}

document.addEventListener('DOMContentLoaded', (e) => {
	g = new Game();
	dc = new DisplayController();

	g.bindEvents();
	dc.bindEvents();
	em.on(Events.RESTART_GAME, restartGame);

	// FIX: delete this. just using it to initialize game and not have to click start button
	em.emit(Events.SELECT_GAME_TYPE, GameTypes.COMPUTER);
});
