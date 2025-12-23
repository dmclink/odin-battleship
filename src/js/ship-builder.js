function buildWall(blockSize, depth, numHoles, color, leftBevel = false, rightBevel = false) {
	const result = document.createElement('div');
	result.classList.add('wall');
	result.style.transformStyle = 'preserve-3d';
	result.style.position = 'absolute';
	result.style.display = 'flex';

	const mainWall = document.createElement('div');
	mainWall.classList.add('center');
	let leftWall;
	let rightWall;

	// we'll reduce this if any bevels exist
	let wallWidth = blockSize * numHoles;

	if (leftBevel) {
		leftWall = document.createElement('div');
		leftWall.classList.add('left');
		leftWall.style.backgroundColor = color;

		const leftWallWidth = blockSize / 2;
		wallWidth -= leftWallWidth;

		leftWall.style.width = `${leftWallWidth * 1.414 - 2}px`;
		leftWall.style.height = `${depth}px`;
		leftWall.style.color = color;
		leftWall.style.transformOrigin = '100% 50%';
		leftWall.style.transform = 'rotateY(-45deg)';
		leftWall.style.transformStyle = 'preserve-3d';
		leftWall.style.borderInline = '1px solid black';
	}

	if (rightBevel) {
		rightWall = document.createElement('div');
		rightWall.classList.add('right');
		rightWall.style.backgroundColor = color;

		const rightWallWidth = blockSize / 2;
		wallWidth -= rightWallWidth;

		rightWall.style.width = `${rightWallWidth * 1.414 - 2}px`;
		rightWall.style.height = `${depth}px`;
		rightWall.style.color = color;
		rightWall.style.transformOrigin = '0% 50%';
		rightWall.style.transform = 'rotateY(45deg)';
		rightWall.style.transformStyle = 'preserve-3d';
		rightWall.style.borderInline = '1px solid black';
	}

	mainWall.style.width = `${wallWidth}px`;
	mainWall.style.height = `${depth}px`;
	mainWall.style.backgroundColor = color;
	mainWall.style.transformStyle = 'preserve-3d';
	mainWall.style.borderInline = '1px solid black';
	// mainWall.style.position = 'absolute'

	if (leftWall) {
		result.appendChild(leftWall);
	}
	result.appendChild(mainWall);
	if (rightWall) {
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
	// result.style.backgroundColor = color;
	result.style.display = 'grid';
	result.style.gridTemplateColumns = `repeat(${numHoles}, 1fr)`;
	const holeRadiusPx = `${holeSize / 2}px`;
	console.log(holeColor, color, holeRadiusPx);
	for (let i = 0; i < numHoles; i++) {
		const newHole = document.createElement('div');
		console.log(`radial-gradient(circle at center, ${holeColor} ${holeRadiusPx}, ${color} ${holeRadiusPx})`);
		newHole.style.background = `radial-gradient(circle at center, ${holeColor} ${holeRadiusPx}, ${color} ${holeRadiusPx})`;
		result.appendChild(newHole);
	}

	if (leftBevel) {
		result.style.overflow = 'hidden';
		result.style.cornerLeftShape = leftShape;
		result.style.borderRadius = '9999px';
	}
	if (rightBevel) {
		result.style.overflow = 'hidden';
		result.style.cornerRightShape = rightShape;
		result.style.borderRightRadius = '9999px';
	}

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
	result.style.transformStyle = 'preserve-3d';
	// result.style.position = 'absolute';
	result.style.display = 'grid';
	result.style.placeItems = 'center';

	const wall1 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
	const wall2 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
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
	result.appendChild(wall1);
	result.appendChild(wall2);
	result.appendChild(top);

	return result;
}

class Submarine extends HTMLElement {
	constructor() {
		super();
		this.appendChild(buildShip(60, 60, 10, 3, 'gray', 'black', true, true, 'round', 'round'));
		this.style.transformStyle = 'preserve-3d';
	}
}

class Carrier extends HTMLElement {
	constructor() {
		super();
		this.style.transformStyle = 'preserve-3d';
		this.appendChild(buildShip(60, 60, 10, 5, 'gray', 'black'));
	}
}

class Battleship extends HTMLElement {
	constructor() {
		super();

		this.style.transformStyle = 'preserve-3d';
		// this.style.position = 'absolute';
		this.appendChild(buildShip(60, 60, 10, 4, 'gray', 'black', true, true));
	}
}

customElements.define('ship-submarine', Submarine);
customElements.define('ship-carrier', Carrier);
customElements.define('ship-battleship', Battleship);
