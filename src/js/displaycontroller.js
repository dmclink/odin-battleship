import { Events } from './events.js';
import { em } from './eventemitter.js';

class DisplayController {
	constructor() {
		this.welcomeScreen = document.querySelector('#welcome-screen');
		this.main = document.querySelector('#main');
		this.playerModeBtns = Array.from(document.querySelectorAll('.welcome-player-mode'));
	}

	bindPlayerModeButtons() {
		// i coincides with enums for game mode
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

	bindEvents() {
		this.bindPlayerModeButtons();
		em.on(Events.GAME_START, this.hideWelcomeScreen.bind(this));
	}
}

export { DisplayController };
