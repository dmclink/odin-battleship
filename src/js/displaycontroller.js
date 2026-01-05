import { Events } from './events.js';
import { em } from './eventemitter.js';

class DisplayController {
	constructor() {
		this.welcomeScreen = document.querySelector('#welcome-screen');
		this.player0board = document.getElementById('player0-board');
		this.player1board = document.getElementById('player1-board');
		this.player1board.style.display = 'none';
		this.game = document.getElementById('game');
		this.main = document.querySelector('#main');
		this.playerModeBtns = Array.from(document.querySelectorAll('.welcome-player-mode'));
	}

	bindPlayerModeButtons() {
		// i represents enums for game mode
		// make sure not to change enums order or button order
		// TODO: consider moving the enums to constants file and iterating its values
		for (let i = 0; i < this.playerModeBtns.length; i++) {
			const button = this.playerModeBtns[i];
			button.addEventListener('click', () => {
				em.emit(Events.SELECT_GAME_TYPE, i);
			});
		}
	}

	hideWelcomeScreen() {
		this.welcomeScreen.classList.add('hidden');
		this.main.classList.remove('hidden');
	}

	bindStartGameButton() {
		document.getElementById('player0-ready-btn').addEventListener('click', (ev) => {
			ev.target.disabled = true;
			this.player0board.rotate3D(-10, 0, 0);
			this.player0board.teardown();
			em.emit(Events.PLAYER0_READY);
		});
	}

	initPlayer0() {
		this.player0board.init();
	}

	initPlayer1() {
		console.log(this.player1board);
		this.player1board.init();
	}

	bindEvents() {
		this.bindPlayerModeButtons();
		this.bindStartGameButton();

		em.on(Events.GAME_START, this.hideWelcomeScreen.bind(this));
		em.on(Events.GAME_START, this.initPlayer0.bind(this));
		em.on(Events.PLAYER0_READY, this.initPlayer1.bind(this));
	}
}

export { DisplayController };
