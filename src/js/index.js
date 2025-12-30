import { Game } from './game.js';
import { DisplayController } from './displaycontroller.js';
import { em } from './eventemitter.js';
import { Events } from './events.js';

document.addEventListener('DOMContentLoaded', (e) => {
	const g = new Game();
	const dc = new DisplayController();

	g.bindEvents();
	dc.bindEvents();

	// FIX: delete this. just using it to initialize game and not have to click start button
	em.emit(Events.SELECT_GAME_TYPE, 0);
});
