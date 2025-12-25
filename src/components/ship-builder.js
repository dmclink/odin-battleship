const style = document.createElement('style');
style.textContent = `
.ship {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  & * {
    box-sizing: inherit;
  }
}
`;
document.head.appendChild(style);

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
		paintedWall.style.height = '100%';
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
		paintedWall.style.height = '100%';
		paintedWall.style.position = 'absolute';
		paintedWall.style.left = '0';
		paintedWall.style.top = '0';
		paintedWall.style.backgroundColor = color;
		paintedWall.style.borderInline = '1px solid black';
	}

	mainWall.style.width = `${wallWidth}px`;
	mainWall.style.height = `${depth}px`;
	mainWall.style.backgroundColor = color;
	mainWall.style.transformStyle = 'preserve-3d';
	mainWall.style.borderInline = '1px solid black';

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
	result.style.display = 'grid';
	result.style.gridTemplateColumns = `repeat(${numHoles}, 1fr)`;
	const holeRadiusPx = `${holeSize / 2}px`;
	for (let i = 0; i < numHoles; i++) {
		const newHole = document.createElement('div');
		console.log(`radial-gradient(circle at center, ${holeColor} ${holeRadiusPx}, ${color} ${holeRadiusPx})`);
		newHole.style.background = `radial-gradient(circle at center, ${holeColor} ${holeRadiusPx}, ${color} ${holeRadiusPx})`;
		result.appendChild(newHole);
	}

	const offset = blockSize * 1.414 - blockSize;
	console.log('offset:', blockSize * 1.414 - blockSize);
	console.log('offset halved:', offset / 2);

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

	// TODO: consider adding padding or margin to sides that don't have bevels to make them the same length
	// on the top wall

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
	result.classList.add('ship');
	result.style.width = `${blockSize * numHoles}px`;

	const wall1 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
	const wall2 = buildWall(blockSize, depth, numHoles, color, leftBevel, rightBevel);
	result.appendChild(wall1);
	result.appendChild(wall2);

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
		this.appendChild(buildShip(60, 60, 10, 4, 'gray', 'black', true, true));
	}
}

class Cruiser extends HTMLElement {
	constructor() {
		super();
		this.style.transformStyle = 'preserve-3d';
		this.appendChild(buildShip(60, 60, 10, 4, 'gray', 'black', false, true));
	}
}

class Destroyer extends HTMLElement {
	constructor() {
		super();
		this.style.transformStyle = 'preserve-3d';
		this.appendChild(buildShip(60, 60, 10, 2, 'gray', 'black', true, false));
	}
}

customElements.define('ship-submarine', Submarine);
customElements.define('ship-carrier', Carrier);
customElements.define('ship-battleship', Battleship);
customElements.define('ship-cruiser', Cruiser);
customElements.define('ship-destroyer', Destroyer);
