import HitBoard from './hit-board.js';
import ShipBoard from './ship-board.js';
import Hinge from './hinge.js';
import { rotateDelay, rotateTransition } from '../js/const.js';

export default class GameBoard extends HTMLElement {
	constructor(blockSize, holeSize, colorPrimary, colorSecondary, player) {
		super();
		this.style.display = 'grid';
		this.style.placeItems = 'center';
		this.style.transformOrigin = `center ${-blockSize * 12}px`;
		this.style.transformStyle = 'preserve-3d';
		this.style.transition = `transform ${rotateTransition / 1000}s ease-out ${rotateDelay / 1000}s, opacity ${rotateTransition / 1000}s ease-out ${rotateDelay / 1000}s, z-index ${rotateTransition / 1000}s ease-out ${rotateDelay / 1000}s`;
		this.style.position = 'absolute';
		this.style.placeSelf = 'center';

		const hingeGap = 5;
		const hingeCylinders = 3;
		const hingeSides = 6;
		const hingeHeight = blockSize * 3;
		const leftHinge = new Hinge(blockSize * 2, hingeHeight, hingeSides, hingeGap, hingeCylinders, colorPrimary);
		const rightHinge = new Hinge(blockSize * 2, hingeHeight, hingeSides, hingeGap, hingeCylinders, colorPrimary);

		const shipBoard = new ShipBoard(blockSize, holeSize, colorPrimary, colorSecondary, 10, player);
		const hitBoard = new HitBoard(blockSize, holeSize, colorPrimary, colorSecondary, player);
		this.shipBoard = shipBoard;
		this.hitBoard = hitBoard;
		this.leftHinge = leftHinge;
		this.rightHinge = rightHinge;
		this.blockSize = blockSize;

		this.append(shipBoard, hitBoard, leftHinge, rightHinge);
		shipBoard.style.transform = 'rotateZ(10deg)';
	}

	connectedCallback() {
		// had to push these to connectedCallback since it pulls offsetParent height, on instanciation before appending there is no parent
		const parentWidth = this.offsetParent.offsetWidth;
		const parentHeight = this.offsetParent.offsetHeight;

		this.hitBoard.style.transform = `translateZ(${parentWidth / -2 + this.blockSize / 2}px) translateY(${parentHeight / 2 - this.blockSize * 8}px)`;
		this.shipBoard.style.transform = `rotateX(90deg) translateZ(${parentHeight / -2 + this.blockSize / 2}px) translateY(${parentWidth / -2 + this.blockSize * 8.15}px)`;

		this.leftHinge.style.transform = `rotateX(90deg) rotateZ(90deg) translateZ(${parentHeight / -2 + this.blockSize}px) translateX(${parentWidth / -2 + this.blockSize}px) translateY(${this.blockSize * 3.5}px)`;
		this.rightHinge.style.transform = `rotateX(90deg) rotateZ(90deg) translateZ(${parentHeight / -2 + this.blockSize}px) translateX(${parentWidth / -2 + this.blockSize}px) translateY(${this.blockSize * -3.5}px)`;
	}

	rotate3D(x, y, z) {
		this.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
	}

	rotateForShipPlacement() {
		this.rotate3D(-60, 0, 0);
	}

	rotateForHitBoard() {
		this.rotate3D(-20, 0, 0);
	}

	rotateForHitBoardNeg180() {
		this.rotate3D(-20, -180, 0);
	}

	rotateForHitBoard180() {
		this.rotate3D(-20, 180, 0);
	}

	rotateOutShipPlacement() {
		this.rotate3D(-60, 180, 0);
		this.zIndex = '-1';
	}

	rotateInShipPlacement() {
		this.rotate3D(-60, 360, 0);
		this.zIndex = '-1';
	}

	ships() {
		return this.shipBoard.ships();
	}

	hideShips() {
		this.ships().forEach((ship) => {
			ship.classList.add('dnone');
		});
	}

	showShips() {
		this.ships().forEach((ship) => {
			ship.classList.remove('dnone');
		});
	}

	blinkOut() {
		this.style.zIndex = '-1';
		this.style.transform = 'scale(0) rotateY(-180deg)';
		// this.style.opacity = '0';
	}

	blinkIn() {
		this.style.zIndex = '1';
		this.style.transform = 'scale(1) rotateY(0deg)';
		// this.style.opacity = '1';
	}

	init() {
		this.shipBoard.init();
	}

	teardown() {
		this.shipBoard.teardown();
	}

	flipZIndex() {
		this.style.zIndex *= -1;
	}

	// x and y are the 0 indexed col and row of cell to lookup
	// NOTE: cells are 1 indexed, so an input of x = 4, y = 9 should retrieve cell with data-col = 4 data-row = 10
	getHitCell(x, y) {
		const cells = Array.from(this.hitBoard.querySelectorAll('.hit-cell'));
		return cells[y * 10 + x];
	}

	// x and y are the 0 indexed col and row of cell to lookup
	// NOTE: cells are 1 indexed, so an input of x = 4, y = 9 should retrieve cell with data-col = 4 data-row = 10
	getShipCell(x, y) {
		const cells = Array.from(this.shipBoard.querySelectorAll('.ship-cell'));
		return cells[y * 10 + x];
	}
}

customElements.define('game-board', GameBoard);
