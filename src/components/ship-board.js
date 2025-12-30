import BoardTray from './tray.js';
import { cylinder2D } from './shapes-3d.js';
import { Destroyer, Submarine, Carrier, Battleship, Cruiser } from './ship-builder.js';
import { em } from '../js/eventemitter.js';
import { Events } from '../js/events.js';
import { Loc } from '../js/loc.js';

export default class ShipBoard extends BoardTray {
	#ships;
	#shipClones;
	#boardGrid;
	constructor(blockSize, holeSize, colorPrimary, colorSecondary, gridSize) {
		super(blockSize, colorPrimary, colorSecondary, gridSize);

		const trayFaceFront = this.querySelector('.tray-face.front');
		const boardGrid = this.querySelector('.board-grid');
		this.#boardGrid = boardGrid;
		boardGrid.id = 'ship-grid';
		boardGrid.style.zIndex = '2';
		// trayFaceFront.id = 'ship-grid';

		const rowLength = gridSize || 10;
		const numItems = rowLength * rowLength;
		const blockWidth = blockSize;
		const depth = blockSize;
		const width = blockWidth * 0.7;
		const holeColor = 'black';

		// adds a little offset to the depth of the pegs so they aren't perfectly aligned with the edge of tray
		const offsetDepth = blockSize * 0.3;

		for (let i = 0; i < numItems; i++) {
			const cell = document.createElement('div');
			cell.style.transformStyle = 'preserve-3d';
			cell.style.height = '100%';
			cell.style.width = '100%';
			cell.classList.add('ship-cell');
			// cell.style.transform = 'translateZ(10px)';
			// cell.style.display = 'grid';
			// cell.style.placeItems = 'center';
			const row = Math.floor(i / 10) + 1;
			const col = (i % 10) + 1;
			cell.setAttribute('data-row', row);
			cell.setAttribute('data-col', col);
			cell.style.gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

			const newCyl = cylinder2D(
				width - width * 0.2,
				`calc(${depth}px - ${offsetDepth}px)`,
				colorPrimary,
				holeColor,
				'1px solid black',
				holeSize,
			);
			newCyl.style.transformStyle = 'preserve-3d';

			boardGrid.appendChild(cell);
			trayFaceFront.appendChild(newCyl);
			// cell.appendChild(newCyl);
			// trayFaceFront.appendChild(cell);
		}

		const shipGrid = this.querySelector('#ship-grid');

		this.#ships = {
			carrier: new Carrier(blockSize, holeSize, shipGrid),
			battleship: new Battleship(blockSize, holeSize, shipGrid),
			submarine: new Submarine(blockSize, holeSize, shipGrid),
			cruiser: new Cruiser(blockSize, holeSize, shipGrid),
			destroyer: new Destroyer(blockSize, holeSize, shipGrid),
		};

		this.#shipClones = {
			carrier: new Carrier(blockSize, holeSize, shipGrid),
			battleship: new Battleship(blockSize, holeSize, shipGrid),
			submarine: new Submarine(blockSize, holeSize, shipGrid),
			cruiser: new Cruiser(blockSize, holeSize, shipGrid),
			destroyer: new Destroyer(blockSize, holeSize, shipGrid),
		};

		const { carrier, battleship, submarine, cruiser, destroyer } = this.#ships;
		const {
			carrier: carrierClone,
			battleship: battleshipClone,
			submarine: submarineClone,
			cruiser: cruiserClone,
			destroyer: destroyerClone,
		} = this.#shipClones;

		const shipClone = new Map();

		shipClone.set(carrier, carrierClone);
		shipClone.set(battleship, battleshipClone);
		shipClone.set(submarine, submarineClone);
		shipClone.set(cruiser, cruiserClone);
		shipClone.set(destroyer, destroyerClone);

		em.on(Events.PLACED_SHIP, this.updateShipLocation.bind(this));

		// pick arbitrary starting location on board for ships
		em.on(Events.GAME_START, () => {
			em.emit(Events.TRY_PLACE_SHIP, 'carrier', new Loc(0, 0), new Loc(0, 4));
			em.emit(Events.TRY_PLACE_SHIP, 'battleship', new Loc(1, 0), new Loc(1, 3));
			em.emit(Events.TRY_PLACE_SHIP, 'submarine', new Loc(2, 0), new Loc(2, 2));
			em.emit(Events.TRY_PLACE_SHIP, 'cruiser', new Loc(3, 0), new Loc(3, 2));
			em.emit(Events.TRY_PLACE_SHIP, 'destroyer', new Loc(4, 0), new Loc(4, 1));
		});

		boardGrid.append(battleship, carrier, submarine, cruiser, destroyer);
		boardGrid.append(battleshipClone, carrierClone, submarineClone, cruiserClone, destroyerClone);

		// let draggedSize;
		// let draggedRotation;
		// let draggedShip;
		// const updateDraggedShip = function (ship) {
		// 	draggedShip = ship;
		// };
		// const updateDraggedSize = function (size) {
		// 	draggedSize = size;
		// };
		// const updateDraggedRotation = function (rotation) {
		// 	draggedRotation = rotation;
		// };

		// boardGrid.addEventListener('dragenter', (ev) => {
		// 	if (ev.target.classList.contains('ship-cell')) {
		// 		ev.target.style.backgroundColor = 'green';
		// 	}
		// });
		//
		// boardGrid.addEventListener('dragover', (ev) => {
		// 	if (ev.target.classList.contains('ship-cell')) {
		// 		console.log(draggedRotation);
		// 	}
		// });

		// apply special styles to clone ships so they only display when dragging and can follow mouse
		for (const [, shipClone] of Object.entries(this.#shipClones)) {
			shipClone.style.position = 'absolute';
			shipClone.style.display = 'none';
			shipClone.style.pointerEvents = 'none';
		}

		// these are "global" mutated variables to track state and which ship is being dragged by user
		let isDragging = false;
		let draggedClone;
		let draggedShip;
		let draggedIdx;

		const handleRKeyPress = function (ship) {
			ship.rotateCW();
		};

		const handleQKeyPress = function (ship) {
			ship.rotateCCW();
		};

		// save state of original dragged location, we need this to replace ship in case of invalid drop
		let ogLoc1;
		let ogLoc2;
		let ogRotation;
		let draggedLoc;
		const handleDraggedKeyPress = function (ev) {
			if (!isDragging) {
				return;
			}
			console.log('firing keydown');
			if (ev.key === 'r') {
				console.log('fring r keypress');
				handleRKeyPress(draggedClone);
			} else if (ev.key === 'q') {
				console.log('fring q keypress');
				handleQKeyPress(draggedClone);
			}
			this.renderDropZone(draggedLoc.x, draggedLoc.y, draggedIdx, draggedClone);
		};

		// html dragging API isn't working for passing data back and forth and firing events properly
		// so we implement bespoke drag with mousedown mouseup etc
		for (const ship of Object.values(this.#ships)) {
			const clone = shipClone.get(ship);

			ship.addEventListener('mousedown', (ev) => {
				// TODO: unplace ship from gameboard
				draggedIdx = Math.round(ev.target.offsetLeft / blockSize);

				// store original state
				[ogLoc1, ogLoc2] = ship.getLocation();
				ogRotation = ship.getRotation();

				ship.style.setProperty('--opacity', '0.3');
				ship.style.pointerEvents = 'none';

				// set state
				isDragging = true;
				draggedClone = shipClone.get(ship);
				draggedShip = ship;

				draggedClone.offsetX = ev.clientX - ship.offsetLeft;
				draggedClone.offsetY = ev.clientY - ship.offsetTop;
				draggedClone.style.left = `${ev.clientX - draggedClone.offsetX}px`;
				draggedClone.style.top = `${ev.clientY - draggedClone.offsetY}px`;

				// gets the rotation around the grab/drag point
				draggedClone.style.transformOrigin = `${ev.target.offsetLeft + ev.offsetX}px ${ev.target.offsetTop + ev.offsetY}px`;

				clone.style.display = 'block';
			});

			// mouseup on document because clones have no pointer events for passthrough on hover
			// this is the drop event
			document.addEventListener('mouseup', (ev) => {
				ship.style.setProperty('--opacity', '1');
				ship.style.pointerEvents = 'all';

				isDragging = false;

				draggedClone.style.display = 'none';

				// TODO:
				// if valid drop, place ship at the new location on gameboard
				//
				// if not valid drop, reset cloned ship
				// also replace ship at og locations
				draggedClone.setRotation(ogRotation);
				this.resetDropZone();
			});

			// ship.addEventListener('dragend', (ev) => {
			// 	ship.style.setProperty('--opacity', '1');
			// 	isDragging = false;
			// });
		}
		document.addEventListener('pointermove', (ev) => {
			if (isDragging) {
				draggedClone.style.left = `${ev.clientX - draggedClone.offsetX}px`;
				draggedClone.style.top = `${ev.clientY - draggedClone.offsetY}px`;
			}
		});

		// TODO: also need to re-render highlight areas/dropzone
		document.addEventListener('keypress', handleDraggedKeyPress.bind(this));

		Array.from(boardGrid.querySelectorAll('.ship-cell')).forEach((cell) =>
			cell.addEventListener('mouseenter', (ev) => {
				if (isDragging) {
					const x = ev.target.getAttribute('data-col');
					const y = ev.target.getAttribute('data-row');
					draggedLoc = new Loc(Number(x), Number(y));
					this.renderDropZone(Number(x), Number(y), draggedIdx, draggedClone);
					// ev.target is the cells we drag over, cells have the data-row data-col
					// console.log(ev.target);
				}
			}),
		);
	}

	resetDropZone() {
		Array.from(this.#boardGrid.querySelectorAll('.ship-cell')).forEach((cell) => {
			cell.classList.remove('drop-zone');
		});
	}

	renderDropZone(x, y, draggedIdx, draggedShip) {
		this.resetDropZone();
		// console.dir({
		// 	x,
		// 	y,
		// 	idx: draggedIdx,
		// 	ship: draggedShip,
		// 	len: draggedShip.getSize(),
		// 	rotation: draggedShip.getRotation(),
		// });

		let curs = new Loc(x, y);
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

		const distanceToEnd = draggedShip.getSize() - 1 - draggedIdx;
		console.log('dist:', distanceToEnd);

		const end = new Loc(x, y).moveLoc(dX * distanceToEnd, dY * distanceToEnd);
		console.log({ start: curs, end });
		this.addDropZoneClass(curs);

		while (!curs.equal(end)) {
			curs = curs.moveLoc(dX, dY);
			this.addDropZoneClass(curs);
		}

		// reverse direction towards start
		dX = -dX;
		dY = -dY;
		for (let i = 0; i < draggedShip.getSize() - 1; i++) {
			console.log(dX, dY);
			curs = curs.moveLoc(dX, dY);
			console.log(curs);
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

	updateShipLocation(shipName, start, end) {
		const ship = this.#ships[shipName];
		if (!ship) {
			throw new Error('no ship by name ship:', shipName);
		}
		ship.setLocation(start, end);
	}
}

customElements.define('ship-board', ShipBoard);
