import BoardTray from './tray.js';
import { cylinder2D } from './shapes-3d.js';
import { Destroyer, Submarine, Carrier, Battleship, Cruiser } from './ship-builder.js';
import { em } from '../js/eventemitter.js';
import { Events } from '../js/events.js';
import { Loc } from '../js/loc.js';

export default class ShipBoard extends BoardTray {
	#blockSize;
	#holeSize;
	#ships;
	#shipClones;
	#boardGrid;
	#gameScreen;
	#isDragging;
	#draggedShip;
	#draggedClone;
	#draggedIdx;
	#draggedLoc;
	#ogRotation;
	#ogLoc1;
	#ogLoc2;
	#player;
	#offsetDepth;

	constructor(blockSize, holeSize, colorPrimary, colorSecondary, gridSize, player) {
		super(blockSize, colorPrimary, colorSecondary, gridSize);
		this.#isDragging = false;
		this.#blockSize = blockSize;
		this.#holeSize = holeSize;
		this.#player = player;

		this.querySelector('.tray-container').style.transform = 'rotateX(-20deg)';

		const trayFaceFront = this.querySelector('.tray-face.front');
		const boardGrid = this.querySelector('.board-grid');
		this.#boardGrid = boardGrid;
		this.#gameScreen = document.querySelector('.game-screen');
		boardGrid.id = `ship-grid${this.#player}`;
		console.log({ boardGrid });

		const rowLength = gridSize || 10;
		const numItems = rowLength * rowLength;
		const width = blockSize * 0.7;
		const holeColor = 'black';

		// adds a little offset to the depth of the pegs so they aren't perfectly aligned with the edge of tray
		const offsetDepth = blockSize * 0.3;
		this.#offsetDepth = offsetDepth;

		for (let i = 0; i < numItems; i++) {
			const cell = document.createElement('div');
			cell.style.transformStyle = 'preserve-3d';
			cell.style.height = '100%';
			cell.style.width = '100%';
			cell.style.display = 'grid';
			cell.classList.add('ship-cell');
			const row = Math.floor(i / 10) + 1;
			const col = (i % 10) + 1;
			cell.setAttribute('data-row', row);
			cell.setAttribute('data-col', col);
			cell.style.gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

			const newCyl = cylinder2D(
				width - width * 0.2,
				`calc(${blockSize}px - ${offsetDepth}px)`,
				colorPrimary,
				holeColor,
				'1px solid black',
				holeSize,
			);
			newCyl.style.transformStyle = 'preserve-3d';

			boardGrid.appendChild(cell);
			trayFaceFront.appendChild(newCyl);
		}
	}

	init() {
		this.buildShips();
		this.bindEvents();
	}

	buildShips() {
		this.#ships = {
			carrier: new Carrier(this.#blockSize, this.#holeSize),
			battleship: new Battleship(this.#blockSize, this.#holeSize),
			submarine: new Submarine(this.#blockSize, this.#holeSize),
			cruiser: new Cruiser(this.#blockSize, this.#holeSize),
			destroyer: new Destroyer(this.#blockSize, this.#holeSize),
		};

		this.#shipClones = {
			carrier: new Carrier(this.#blockSize, this.#holeSize),
			battleship: new Battleship(this.#blockSize, this.#holeSize),
			submarine: new Submarine(this.#blockSize, this.#holeSize),
			cruiser: new Cruiser(this.#blockSize, this.#holeSize),
			destroyer: new Destroyer(this.#blockSize, this.#holeSize),
		};

		const { carrier, battleship, submarine, cruiser, destroyer } = this.#ships;
		const {
			carrier: carrierClone,
			battleship: battleshipClone,
			submarine: submarineClone,
			cruiser: cruiserClone,
			destroyer: destroyerClone,
		} = this.#shipClones;

		this.#boardGrid.append(battleship, carrier, submarine, cruiser, destroyer);

		this.#gameScreen.append(battleshipClone, carrierClone, submarineClone, cruiserClone, destroyerClone);

		// apply special styles to clone ships so they only display when dragging and can follow mouse
		for (const [, shipClone] of Object.entries(this.#shipClones)) {
			// cache these so we don't cause redraws, they shouldn't change
			shipClone.width = this.#blockSize * shipClone.getSize();
			shipClone.height = this.#blockSize;

			shipClone.style.position = 'absolute';
			shipClone.style.display = 'none';
			shipClone.style.pointerEvents = 'none';
		}
	}

	handleMouseDownOnShip(ev) {
		if (!this.#isDragging) {
			const ship = ev.currentTarget;
			const clone = this.#shipClones[ship.getShipName()];
			em.emit(Events.UNPLACE_SHIP, ship.getShipName());
			this.#draggedIdx = Math.round(ev.target.offsetLeft / this.#blockSize);

			// store original state in case of failure placement we place ship back
			[this.#ogLoc1, this.#ogLoc2] = ship.getLocation();
			this.#ogRotation = ship.getRotation();

			ship.style.setProperty('--opacity', '0.3');
			ship.style.pointerEvents = 'none';

			// set state
			this.#isDragging = true;
			this.#draggedClone = clone;
			this.#draggedShip = ship;

			this.#draggedClone.style.left = `${ev.clientX - this.#draggedClone.width / 2}px`;
			this.#draggedClone.style.top = `${ev.clientY - this.#draggedClone.height / 2}px`;

			clone.style.display = 'block';
		}
	}

	handleMouseUp() {
		if (this.#isDragging) {
			this.#draggedShip.style.setProperty('--opacity', '1');
			this.#draggedShip.style.pointerEvents = 'all';

			this.#draggedClone.style.display = 'none';

			this.#isDragging = false;

			const { start, end } = this.draggedStartEndLoc();

			// need to decrement since shipboard grid element is 1 indexed and gameboard grid for logic is 0 indexed
			em.emit(Events.TRY_PLACE_SHIP, this.#draggedShip.getShipName(), start.moveLoc(-1, -1), end.moveLoc(-1, -1));
			this.#draggedShip = null;
			this.#draggedClone = null;
		}
	}

	handlePointerMove(ev) {
		if (this.#isDragging) {
			this.#draggedClone.style.left = `${ev.clientX - this.#draggedClone.width / 2}px`;
			this.#draggedClone.style.top = `${ev.clientY - this.#draggedClone.height / 2}px`;
		}
	}

	handleCellDrag(ev) {
		if (this.#isDragging) {
			const x = ev.target.getAttribute('data-col');
			const y = ev.target.getAttribute('data-row');
			this.#draggedLoc = new Loc(Number(x), Number(y));
			this.renderDropZone();
		}
	}

	static boundInRange(num, lower, upper) {
		let result = num;
		result = result > upper ? upper : result;
		result = result < lower ? lower : result;
		return result;
	}

	draggedDeltas() {
		const draggedShip = this.#draggedClone;
		let dX;
		let dY;
		if (draggedShip.getRotation() === 0) {
			dX = 1;
			dY = 0;
		} else if (draggedShip.getRotation() === 180) {
			dX = -1;
			dY = 0;
		} else if (draggedShip.getRotation() === 90) {
			dY = 1;
			dX = 0;
		} else if (draggedShip.getRotation() === 270) {
			dY = -1;
			dX = 0;
		}

		return { dX, dY };
	}

	draggedStartEndLoc() {
		const draggedShip = this.#draggedClone;
		const size = draggedShip.getSize();
		const { x } = this.#draggedLoc;
		const { y } = this.#draggedLoc;
		let curs = new Loc(x, y);

		let { dX, dY } = this.draggedDeltas();

		// distanceToStart = this.#draggedIdx
		const distanceToEnd = draggedShip.getSize() - 1 - this.#draggedIdx;

		const maxstart = new Loc(x, y).moveLoc(dX * -this.#draggedIdx, dY * -this.#draggedIdx);
		const maxend = new Loc(x, y).moveLoc(dX * distanceToEnd, dY * distanceToEnd);

		const locOOB = function (loc) {
			return loc.x > 10 || loc.y > 10 || loc.x < 1 || loc.y < 1;
		};

		const sizeOffset = size - 1;
		if (locOOB(maxend)) {
			let { x, y } = maxend;
			x = ShipBoard.boundInRange(x, 1, 10);
			y = ShipBoard.boundInRange(y, 1, 10);

			const end = new Loc(x, y);
			const start = new Loc(dX * -sizeOffset + end.x, dY * -sizeOffset + end.y);
			return { start, end };
		}

		if (locOOB(maxstart)) {
			let { x, y } = maxstart;
			x = ShipBoard.boundInRange(x, 1, 10);
			y = ShipBoard.boundInRange(y, 1, 10);

			const start = new Loc(x, y);
			const end = new Loc(dX * sizeOffset + start.x, dY * sizeOffset + start.y);
			return { start, end };
		}

		this.addDropZoneClass(curs);

		while (!curs.equal(maxend)) {
			curs = curs.moveLoc(dX, dY);
			this.addDropZoneClass(curs);
		}
		const end = curs.copy();

		// reverse direction towards start
		dX = -dX;
		dY = -dY;
		for (let i = 0; i < draggedShip.getSize() - 1; i++) {
			curs = curs.moveLoc(dX, dY);
			this.addDropZoneClass(curs);
		}

		const start = curs.copy();

		return { start, end };
	}

	restoreShips(shipName) {
		this.#draggedShip.style.setProperty('--opacity', '1');
		this.#draggedShip.style.pointerEvents = 'all';
		this.#draggedShip.setRotation(this.#ogRotation);
		this.#draggedClone.setRotation(this.#ogRotation);
		em.emit(Events.TRY_PLACE_SHIP, shipName, this.#ogLoc1, this.#ogLoc2);
	}

	resetDropZone() {
		Array.from(this.#boardGrid.querySelectorAll('.ship-cell')).forEach((cell) => {
			cell.classList.remove('drop-zone');
		});
	}

	renderDropZone() {
		this.resetDropZone();

		const { start, end } = this.draggedStartEndLoc();

		let curs = start;

		const { dX, dY } = this.draggedDeltas();

		this.addDropZoneClass(curs);

		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			this.addDropZoneClass(curs);
		}
	}

	addDropZoneClass(loc) {
		const { x } = loc;
		const { y } = loc;
		if (x < 1 || y < 1 || x > 10 || y > 10) {
			return;
		}

		const calculateNthChild = function (x, y) {
			return (y - 1) * 10 + x;
		};

		const nthChild = calculateNthChild(x, y);

		this.#boardGrid.querySelector(`.ship-cell:nth-child(${nthChild})`).classList.add('drop-zone');
	}

	updateShipLocation(shipName, start, end, player) {
		if (player !== this.#player) {
			return;
		}

		this.resetDropZone();
		const ship = this.#ships[shipName];
		if (!ship) {
			throw new Error('no ship by name ship:', shipName);
		}

		ship.setRotation(this.#shipClones[shipName].getRotation());
		ship.setLocation(start, end);
		ship.updateTransformOrigin();
	}

	handleRKeyPress() {
		this.#draggedClone.rotateCW();
	}

	handleQKeyPress() {
		this.#draggedClone.rotateCCW();
	}

	// save state of original dragged location, we need this to replace ship in case of invalid drop
	handleDraggedKeyPress(ev) {
		if (!this.#isDragging) {
			return;
		}
		if (ev.key === 'r') {
			this.handleRKeyPress();
		} else if (ev.key === 'q') {
			this.handleQKeyPress();
		}
		this.renderDropZone();
	}

	teardown() {
		for (const clone of Object.values(this.#shipClones)) {
			this.#gameScreen.removeChild(clone);
		}

		for (const ship of Object.values(this.#ships)) {
			ship.removeEventListener('mousedown', this.boundHandleMouseDownOnShip);
		}

		// mouseup on document because clones have no pointer events for passthrough on hover
		// this is the drop event
		document.removeEventListener('mouseup', this.boundHandleMouseUp);
		document.removeEventListener('pointermove', this.boundPointerMove);
		document.removeEventListener('keypress', this.boundHandleKeyPress);
		Array.from(this.#boardGrid.querySelectorAll('.ship-cell')).forEach((cell) =>
			cell.removeEventListener('mouseenter', this.handleCellDrag),
		);
	}

	bindEvents() {
		em.on(Events.PLACE_SHIP_SUCCESS, this.updateShipLocation.bind(this));
		em.on(Events.PLACE_SHIP_FAIL, this.restoreShips.bind(this));

		// pick arbitrary starting location on board for ships
		console.log(this);
		em.emit(Events.TRY_PLACE_SHIP, 'carrier', new Loc(0, 0), new Loc(4, 0));
		em.emit(Events.TRY_PLACE_SHIP, 'battleship', new Loc(0, 1), new Loc(3, 1));
		em.emit(Events.TRY_PLACE_SHIP, 'submarine', new Loc(0, 2), new Loc(2, 2));
		em.emit(Events.TRY_PLACE_SHIP, 'cruiser', new Loc(0, 3), new Loc(2, 3));
		em.emit(Events.TRY_PLACE_SHIP, 'destroyer', new Loc(0, 4), new Loc(1, 4));

		// html dragging API isn't working for passing data back and forth and firing events properly
		// so we implement bespoke drag with mousedown mouseup etc
		this.boundHandleMouseDownOnShip = this.handleMouseDownOnShip.bind(this);
		for (const ship of Object.values(this.#ships)) {
			ship.addEventListener('mousedown', this.boundHandleMouseDownOnShip);
		}

		// mouseup on document because clones have no pointer events for passthrough on hover
		// this is the drop event
		this.boundHandleMouseUp = this.handleMouseUp.bind(this);
		document.addEventListener('mouseup', this.boundHandleMouseUp);

		this.boundPointerMove = this.handlePointerMove.bind(this);
		document.addEventListener('pointermove', this.boundPointerMove);

		this.boundHandleKeyPress = this.handleDraggedKeyPress.bind(this);
		document.addEventListener('keypress', this.boundHandleKeyPress);

		Array.from(this.#boardGrid.querySelectorAll('.ship-cell')).forEach((cell) =>
			cell.addEventListener('mouseenter', this.handleCellDrag.bind(this)),
		);
	}

	getOffsetDepth() {
		return this.#offsetDepth;
	}
}

customElements.define('ship-board', ShipBoard);
