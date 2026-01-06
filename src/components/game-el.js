import GameScreen from './game-screen.js';
import GameBoard from './gameboard-element.js';

export default class Game extends HTMLElement {
	#blockSize;
	#holeSize;

	constructor() {
		super();
		this.id = 'game';

		const blockSize = Number(this.getAttribute('block-size'));
		if (!blockSize) {
			throw new Error('requires block-size attribute with a number');
		}
		const holeSize = Number(this.getAttribute('hole-size'));
		if (!holeSize) {
			throw new Error('requires hit-size attribute with a number');
		}
		this.style.height = `${blockSize * 12}px`;

		this.#holeSize = holeSize;
		this.#blockSize = blockSize;

		const colorPrimary =
			this.getAttribute('color-primary') || window.getComputedStyle(this).getPropertyValue('--color-primary');
		const colorSecondary =
			this.getAttribute('color-secondary') || window.getComputedStyle(this).getPropertyValue('--color-secondary');

		const screen = new GameScreen();
		screen.id = 'game-screen';
		screen.classList.add('game-screen');

		this.appendChild(screen);

		const player0Board = new GameBoard(blockSize, holeSize, colorPrimary, colorSecondary, 0);
		const player1Board = new GameBoard(blockSize, holeSize, colorPrimary, colorSecondary, 1);
		player0Board.style.zIndex = 1;
		player1Board.style.zIndex = -1;
		player0Board.id = 'player0-board';
		player1Board.id = 'player1-board';

		this.append(player0Board, player1Board);
	}

	getBlockSize() {
		return this.#blockSize;
	}
	getHoleSize() {
		return this.#holeSize;
	}
}

customElements.define('game-el', Game);
