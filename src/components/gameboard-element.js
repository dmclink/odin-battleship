import HitBoard from './hit-board.js';
import ShipBoard from './ship-board.js';
import Hinge from './hinge.js';

class GameBoard extends HTMLElement {
	constructor() {
		super();

		const blockSize = Number(this.getAttribute('block-size'));
		if (!blockSize) {
			throw new Error('requires block-size attribute with a number');
		}
		const holeSize = Number(this.getAttribute('hole-size'));
		if (!holeSize) {
			throw new Error('requires hit-size attribute with a number');
		}

		const colorPrimary =
			this.getAttribute('color-primary') || window.getComputedStyle(this).getPropertyValue('--color-primary');
		const colorSecondary =
			this.getAttribute('color-secondary') || window.getComputedStyle(this).getPropertyValue('--color-secondary');

		const hingeGap = 5;
		const hingeCylinders = 3;
		const hingeSides = 6;
		const hingeHeight = blockSize * 3;
		const leftHinge = new Hinge(blockSize * 2, hingeHeight, hingeSides, hingeGap, hingeCylinders, colorPrimary);
		const rightHinge = new Hinge(blockSize * 2, hingeHeight, hingeSides, hingeGap, hingeCylinders, colorPrimary);

		const shipBoard = new ShipBoard(blockSize, holeSize, colorPrimary, colorSecondary);
		const hitBoard = new HitBoard(blockSize, holeSize, colorPrimary, colorSecondary);

		this.append(shipBoard, hitBoard, leftHinge, rightHinge);

		const parentWidth = this.offsetParent.offsetWidth;
		const parentHeight = this.offsetParent.offsetHeight;

		hitBoard.style.transform = `translateZ(${parentWidth / -2 + blockSize / 2}px) translateY(${parentHeight / 2 - blockSize * 8}px)`;
		shipBoard.style.transform = `rotateX(90deg) translateZ(${parentHeight / -2 + blockSize / 2}px) translateY(${parentWidth / -2 + blockSize * 8.15}px)`;

		leftHinge.style.transform = `rotateX(90deg) rotateZ(90deg) translateZ(${parentHeight / -2 + blockSize}px) translateX(${parentWidth / -2 + blockSize}px) translateY(${blockSize * 3.5}px)`;
		rightHinge.style.transform = `rotateX(90deg) rotateZ(90deg) translateZ(${parentHeight / -2 + blockSize}px) translateX(${parentWidth / -2 + blockSize}px) translateY(${blockSize * -3.5}px)`;

		this.style.transformStyle = 'preserve-3d';
	}
}

customElements.define('game-board', GameBoard);
