import Cylinder3D from './cylinder.js';

export default class Hinge3D extends HTMLElement {
	#cylinders;
	constructor(hingeWidth, hingeHeight, sides, gapSize, numCylinders, color) {
		super();
		this.style.display = 'grid';
		this.style.gridTemplateRows = `repeat(${numCylinders}, 1fr)`;
		this.style.transformStyle = 'preserve-3d';
		this.style.position = 'absolute';
		this.style.placeItems = 'center';

		const gap = `${gapSize}px`;

		this.style.gap = gap;
		this.style.width = `${hingeWidth}px`;
		this.style.height = `${hingeHeight}px`;

		this.#cylinders = [];

		const cylinderHeight = (hingeHeight - gapSize * numCylinders) / numCylinders;
		const brightnessVal = '0.6';
		for (let i = 0; i < numCylinders; i++) {
			const args = [hingeWidth, cylinderHeight, sides, color, '1px solid black', true];
			let newCyl;
			if (i === 0) {
				newCyl = new Cylinder3D(...args, brightnessVal);
			} else if (i === numCylinders - 1) {
				newCyl = new Cylinder3D(...args, false, brightnessVal);
			} else {
				newCyl = new Cylinder3D(...args, false, false, brightnessVal);
			}

			this.#cylinders.push(newCyl);

			this.appendChild(newCyl);
		}
	}
}

customElements.define('hinge-3d', Hinge3D);
