function buildCarrier(blockSize, depth, holeRadius) {
	const width = blockSize * 5;
	const height = blockSize;
	const shipDepth = blockSize * 0.7;
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
	const top = document.createElement('div');
	wall1.classList.add('wall');
	wall2.classList.add('wall');
	top.classList.add('wall');

	top.style.width = `${width}px`;
	top.style.height = `${blockSize}px`;
	wall1.style.width = `${width}px`;
	wall2.style.width = `${width}px`;
	wall1.style.height = `${shipDepth}px`;
	wall2.style.height = `${shipDepth}px`;

	result.appendChild(wall1);
	result.appendChild(wall2);
	result.appendChild(top);

	wall1.style.transform = `translateZ(${blockSize / 2}px)`;
	wall2.style.transform = `translateZ(${blockSize / -2}px)`;
	top.style.transform = `rotateX(90deg) translateZ(${shipDepth / 2}px)`;
	top.style.display = 'grid';
	top.style.gridTemplateColumns = 'repeat(5, 1fr)';

	for (let i = 0; i < 5; i++) {
		const hole = document.createElement('div');
		hole.style.background = `radial-gradient(circle at center, black ${holeRadiusPx}, ${color} ${holeRadiusPx})`;
		top.appendChild(hole);
	}

	return result;
}

class Carrier extends HTMLElement {
	constructor() {
		super();

		this.style.transformStyle = 'preserve-3d';
		this.style.position = 'absolute';
		this.appendChild(buildCarrier(20, 20, 5));
	}
}

customElements.define('ship-carrier', Carrier);
