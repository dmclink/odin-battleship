import { Loc } from '../js/loc.js';

function buildWall(blockSize, depth, numHoles, color, leftBevel = false, rightBevel = false) {
	const result = document.createElement('div');
	result.classList.add('wall');
	result.style.transformStyle = 'preserve-3d';
	result.style.position = 'absolute';
	result.style.display = 'flex';

	const diagonalConstant = 1.414;

	const mainWall = document.createElement('div');
	mainWall.classList.add('center');
	let leftWall;
	let rightWall;

	// we'll reduce this if any bevels exist
	let wallWidth = blockSize * numHoles;

	if (leftBevel) {
		leftWall = document.createElement('div');
		const paintedWall = document.createElement('div');
		leftWall.appendChild(paintedWall);

		let leftWallWidth = blockSize / 2;
		leftWall.style.width = `${leftWallWidth}px`;
		wallWidth -= leftWallWidth;
		leftWallWidth *= diagonalConstant;

		leftWall.classList.add('left');
		leftWall.style.backgroundColor = color;
		leftWall.style.height = `${depth}px`;
		leftWall.style.transformOrigin = '100% 50%';
		leftWall.style.transform = 'rotateY(-45deg)';
		leftWall.style.transformStyle = 'preserve-3d';

		paintedWall.style.width = `${leftWallWidth}px`;
		paintedWall.style.height = `${blockSize}px`;
		paintedWall.style.position = 'absolute';
		paintedWall.style.right = '0';
		paintedWall.style.top = '0';
		paintedWall.style.backgroundColor = color;
		paintedWall.style.borderInline = '1px solid black';
	}

	if (rightBevel) {
		rightWall = document.createElement('div');
		const paintedWall = document.createElement('div');
		rightWall.appendChild(paintedWall);

		rightWall.classList.add('right');
		rightWall.style.backgroundColor = color;

		let rightWallWidth = blockSize / 2;
		rightWall.style.width = `${rightWallWidth}px`;
		wallWidth -= rightWallWidth;
		rightWallWidth *= diagonalConstant;

		rightWall.style.transform = 'rotateY(45deg)';
		rightWall.style.height = `${depth}px`;
		rightWall.style.transformOrigin = '0% 50%';
		rightWall.style.transformStyle = 'preserve-3d';

		paintedWall.style.width = `${rightWallWidth}px`;
		paintedWall.style.height = `${blockSize}px`;
		paintedWall.style.position = 'absolute';
		paintedWall.style.left = '0';
		paintedWall.style.top = '0';
		paintedWall.style.backgroundColor = color;
		paintedWall.style.borderInline = '1px solid black';
	}

	mainWall.style.width = `${wallWidth}px`;
	mainWall.style.height = `${depth}px`;
	mainWall.classList.add('wall-piece');
	mainWall.style.backgroundColor = color;
	mainWall.style.transformStyle = 'preserve-3d';
	mainWall.style.borderInline = '1px solid black';

	if (leftWall) {
		leftWall.classList.add('wall-piece');
		result.appendChild(leftWall);
	}
	result.appendChild(mainWall);
	if (rightWall) {
		rightWall.classList.add('wall-piece');
		result.appendChild(rightWall);
	}

	return result;
}

function buildTop(
	blockSize,
	depth,
	holeSize,
	numHoles,
	color,
	holeColor,
	leftBevel = false,
	rightBevel = false,
	leftShape = 'bevel',
	rightShape = 'bevel',
) {
	const result = document.createElement('div');
	const width = `${blockSize * numHoles}px`;
	result.style.width = width;
	result.style.height = `${blockSize}px`;
	result.style.display = 'grid';
	result.style.gridTemplateColumns = `repeat(${numHoles}, 1fr)`;
	result.style.transformStyle = 'preserve-3d';
	const holeRadiusPx = `${holeSize / 2}px`;
	for (let i = 0; i < numHoles; i++) {
		const newHole = document.createElement('div');
		newHole.style.background = `radial-gradient(circle at center, ${holeColor} ${holeRadiusPx}, ${color} ${holeRadiusPx})`;
		newHole.style.transformStyle = 'preserve-3d';
		result.appendChild(newHole);
	}

	let leftRadius = '0';
	if (leftBevel) {
		result.style.overflow = 'hidden';
		result.style.cornerLeftShape = leftShape;
		leftRadius = '9999px';
	}

	let rightRadius = '0';
	if (rightBevel) {
		result.style.overflow = 'hidden';
		result.style.cornerRightShape = rightShape;
		rightRadius = '9999px';
	}

	result.style.borderRadius = `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`;
	result.classList.add('wall-piece');

	result.style.border = '1px solid black';
	return result;
}

function buildShip(
	blockSize,
	depth,
	holeSize,
	numHoles,
	color,
	holeColor,
	leftBevel = false,
	rightBevel = false,
	leftShape = 'bevel',
	rightShape = 'bevel',
) {
	const result = document.createElement('div');
	const container = document.createElement('div');

	const style = document.createElement('style');
	style.innerHTML = `
      .ship {
        box-sizing: border-box;
        display: grid;
        place-items: center;
	    transform-origin: 50% 50%;
        & * {
          box-sizing: inherit;
        }
      }
      .wall {
        pointer-events: none;
      }
	  .wall-piece {
	    opacity: var(--opacity, 1)
	  }
    `;
	result.appendChild(style);
	result.style.transformStyle = 'preserve-3d';
	result.classList.add('ship');
	result.style.height = '100%';
	result.style.width = '100%';

	container.classList.add('rotation-container');

	container.style.transformStyle = 'preserve-3d';
	container.style.transformOrigin = `center`;
	container.style.width = '100%';
	container.style.height = '100%';

	const wall1 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
	const wall2 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
	container.appendChild(wall1);
	container.appendChild(wall2);

	const top = buildTop(
		blockSize,
		depth,
		holeSize,
		numHoles,
		color,
		holeColor,
		leftBevel,
		rightBevel,
		leftShape,
		rightShape,
	);
	wall1.style.position = 'absolute';
	wall1.style.transform = `rotateX(-90deg) translateZ(${blockSize / 2}px)`;
	wall2.style.transform = `rotateX(90deg) translateZ(${blockSize / 2}px)`;
	wall2.style.position = 'absolute';
	top.style.position = 'absolute';
	top.style.transform = `translateZ(${blockSize / 2}px)`;
	container.appendChild(top);

	result.appendChild(container);

	return result;
}

class Ship extends HTMLElement {
	#locked;
	#shipSize;
	#shipName;
	#rotation;
	#r1;
	#r2;
	#c1;
	#c2;
	#transformOrigins;

	constructor(shipSize, blockSize, shipName) {
		super();
		this.#locked = false;
		this.style.height = '100%';
		this.style.width = '100%';
		this.style.transformStyle = 'preserve-3d';
		this.style.placeSelf = 'start';
		this.style.cursor = 'pointer';
		this.#shipSize = shipSize;
		this.#shipName = shipName;
		this.#transformOrigins = [
			`center`,
			`${blockSize / 2}px ${blockSize / 2}px`,
			`center`,
			`${(shipSize * blockSize) / 2}px ${(shipSize * blockSize) / 2}px`,
		];
		this.#rotation = 0;
	}

	getShipName() {
		return this.#shipName;
	}

	renderRotation() {
		const rotationContainer = this.querySelector('.rotation-container');
		rotationContainer.style.transform = `rotateZ(${this.#rotation}deg)`;
		const rotationIndex = Math.round(this.#rotation / 90);
		const transformString = this.#transformOrigins[rotationIndex];
		rotationContainer.style.transformOrigin = transformString;
	}

	rotateCW() {
		this.#rotation += 90;
		this.#rotation %= 360;
		this.renderRotation();
	}

	rotateCCW() {
		this.#rotation -= 90;
		if (this.#rotation < 0) {
			this.#rotation = 360 + this.#rotation;
		}
		this.renderRotation();
	}

	setRotation(newRotation) {
		this.#rotation = Math.floor(newRotation / 90) * 90;
		this.renderRotation();
	}

	getRotation() {
		return this.#rotation;
	}

	lock() {
		this.#locked = true;
		this.style.cursor = 'default';
	}
	isLocked() {
		return this.#locked;
	}

	getSize() {
		return this.#shipSize;
	}

	setLocation(start, end) {
		let c1 = start.x;
		let c2 = end.x;
		if (c1 > c2) {
			[c1, c2] = [c2, c1];
		}
		let r1 = start.y;
		let r2 = end.y;
		if (r1 > r2) {
			[r1, r2] = [r2, r1];
		}
		this.#r1 = r1;
		this.#r2 = r2;
		this.#c1 = c1;
		this.#c2 = c2;
		this.updateGridArea();
	}

	getLocation() {
		return [new Loc(this.#c1, this.#r1), new Loc(this.#c2, this.#r2)];
	}

	updateGridArea() {
		this.style.gridArea = `${this.#r1 + 1} / ${this.#c1 + 1} / ${this.#r2 + 2} / ${this.#c2 + 2}`;
	}
}

class Submarine extends Ship {
	constructor(blockSize, holeSize) {
		super(3, blockSize, 'submarine');
		this.innerHTML = buildShip(
			blockSize,
			blockSize,
			holeSize,
			3,
			'gray',
			'black',
			true,
			true,
			'round',
			'round',
		).innerHTML;
	}
}

class Carrier extends Ship {
	constructor(blockSize, holeSize) {
		super(5, blockSize, 'carrier');
		this.innerHTML = buildShip(blockSize, blockSize, holeSize, 5, 'gray', 'black').innerHTML;
	}
}

class Battleship extends Ship {
	constructor(blockSize, holeSize) {
		super(4, blockSize, 'battleship');
		this.innerHTML = buildShip(blockSize, blockSize, holeSize, 4, 'gray', 'black', true, true).innerHTML;
	}
}

class Cruiser extends Ship {
	constructor(blockSize, holeSize) {
		super(3, blockSize, 'cruiser');
		this.innerHTML = buildShip(blockSize, blockSize, holeSize, 3, 'gray', 'black', false, true).innerHTML;
	}
}

class Destroyer extends Ship {
	constructor(blockSize, holeSize) {
		super(2, blockSize, 'destroyer');
		this.innerHTML = buildShip(blockSize, blockSize, holeSize, 2, 'gray', 'black', true, false).innerHTML;
	}
}

customElements.define('ship-submarine', Submarine);
customElements.define('ship-carrier', Carrier);
customElements.define('ship-battleship', Battleship);
customElements.define('ship-cruiser', Cruiser);
customElements.define('ship-destroyer', Destroyer);

export { Destroyer, Submarine, Carrier, Battleship, Cruiser };
