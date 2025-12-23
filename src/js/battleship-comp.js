function buildBattleship(blockSize, depth, holeRadius) {
	const width = blockSize * 4;
	const height = blockSize;
	const shipDepth = blockSize;
	const holeRadiusPx = `${holeRadius}px`;

	const result = document.createElement('div');

	result.style.transformStyle = 'preserve-3d';
	result.style.width = `${width}px`;
	result.style.height = `${height}px`;
	result.style.display = 'grid';
	result.style.placeItems = 'center';

	const color = '#707070';

	const styles = document.createElement('style');
	styles.textContent = `
        .wall {
          background-color: ${color};
          position: absolute;
          border: 1px solid black;
        }
    `;
	document.head.appendChild(styles);

	const wall1 = document.createElement('div');
	const wall2 = document.createElement('div');
	wall1.classList.add('wall');
	wall2.classList.add('wall');

	const wall3 = document.createElement('div');
	const wall4 = document.createElement('div');
	const wall5 = document.createElement('div');
	const wall6 = document.createElement('div');

	wall3.classList.add('wall');
	wall4.classList.add('wall');
	wall5.classList.add('wall');
	wall6.classList.add('wall');
	wall3.style.width = `${(blockSize / 2) * 1.414}px`;
	wall4.style.width = `${(blockSize / 2) * 1.414}px`;
	wall3.style.height = `${shipDepth}px`;
	wall4.style.height = `${shipDepth}px`;
	wall5.style.width = `${(blockSize / 2) * 1.414}px`;
	wall6.style.width = `${(blockSize / 2) * 1.414}px`;
	wall5.style.height = `${shipDepth}px`;
	wall6.style.height = `${shipDepth}px`;

	const top = document.createElement('div');
	top.classList.add('wall');
	top.style.overflow = 'hidden';

	top.style.width = `${width}px`;
	top.style.height = `${blockSize}px`;
	top.style.borderRadius = `${blockSize / 2}px`;
	top.style.cornerShape = 'bevel';

	wall1.style.width = `${width / 2 + blockSize}px`;
	wall2.style.width = `${width / 2 + blockSize}px`;
	wall1.style.height = `${shipDepth}px`;
	wall2.style.height = `${shipDepth}px`;

	wall3.style.transformOrigin = '0% 50%';
	wall4.style.transformOrigin = '0% 50%';

	wall5.style.transformOrigin = '100% 50%';
	wall6.style.transformOrigin = '100% 50%';

	wall3.style.transform = `translateX(${-width / 2 + blockSize / 3}px) rotateY(45deg)`;
	wall4.style.transform = `translateX(${-width / 2 + blockSize / 3}px) rotateY(-45deg)`;
	wall5.style.transform = `translateX(${width / 2 - blockSize / 3}px) rotateY(45deg)`;
	wall6.style.transform = `translateX(${width / 2 - blockSize / 3}px) rotateY(-45deg)`;

	result.appendChild(wall1);
	result.appendChild(wall2);
	result.appendChild(wall3);
	result.appendChild(wall4);
	result.appendChild(wall5);
	result.appendChild(wall6);
	result.appendChild(top);

	wall1.style.transform = `translateZ(${blockSize / 2}px)`;
	wall2.style.transform = `translateZ(${blockSize / -2}px)`;
	top.style.transform = `rotateX(90deg) translateZ(${shipDepth / 2}px)`;
	top.style.display = 'grid';
	top.style.gridTemplateColumns = 'repeat(4, 1fr)';

	for (let i = 0; i < 4; i++) {
		const hole = document.createElement('div');
		hole.style.background = `radial-gradient(circle at center, black ${holeRadiusPx}, ${color} ${holeRadiusPx})`;
		top.appendChild(hole);
	}

	return result;
}

class Battleship extends HTMLElement {
	constructor() {
		super();

		this.style.transformStyle = 'preserve-3d';
		this.style.position = 'absolute';
		this.appendChild(buildBattleship(20, 20, 5));
	}
}

customElements.define('ship-battleship', Battleship);
