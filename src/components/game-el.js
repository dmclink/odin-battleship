import GameScreen from './game-screen.js';
import GameBoard from './gameboard-element.js';

export default class Game extends HTMLElement {
	#blockSize;
	#holeSize;

	constructor(blockSizeIn, holeSizeIn, colorPrimaryIn, colorSecondaryIn) {
		super();
		this.id = 'game';

		this.style.transformStyle = 'preserve-3d';
		this.style.position = 'relative';
		this.style.transition = 'transform 0.6s ease-out 0.3s';
		this.style.height = '100%';

		const blockSize = blockSizeIn || Number(this.getAttribute('block-size'));
		if (!blockSize) {
			throw new Error('requires block-size attribute with a number');
		}
		const holeSize = holeSizeIn || Number(this.getAttribute('hole-size'));
		if (!holeSize) {
			throw new Error('requires hit-size attribute with a number');
		}

		this.#holeSize = holeSize;
		this.#blockSize = blockSize;

		const colorPrimary =
			colorPrimaryIn ||
			this.getAttribute('color-primary') ||
			window.getComputedStyle(this).getPropertyValue('--color-primary');
		const colorSecondary =
			colorSecondaryIn ||
			this.getAttribute('color-secondary') ||
			window.getComputedStyle(this).getPropertyValue('--color-secondary');
		this.colorPrimary = colorPrimary;
		this.colorSecondary = colorSecondary;

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
	getColors() {
		return [this.colorPrimary, this.colorSecondary];
	}
	rotate3D(x, y, z) {
		this.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
	}
}

customElements.define('game-el', Game);
