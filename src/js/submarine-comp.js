import { buildShip } from './ship-builder.js';

class Submarine extends HTMLElement {
	constructor() {
		super();
		this.appendChild(buildShip(60, 60, 10, 5, 'gray', 'black', true, true));
		this.style.position = 'absolute';
		this.style.transformStyle = 'preserve-3d';
	}
}

customElements.define('ship-submarine', Submarine);
