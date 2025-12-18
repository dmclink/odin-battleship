import './cylinder.js';

export class Hinge3D extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		try {
			const resp = await fetch('../html/hinge.html');
			const text = await resp.text();

			const tempNode = document.createElement('div');
			tempNode.innerHTML = text;

			const hinge = tempNode.querySelector('#hinge-3d-template').content.cloneNode(true);
			const container = hinge.querySelector('.container');

			let numCylinders = Number(this.getAttribute('num-cylinders'));

			if (!numCylinders) {
				numCylinders = 1;
			}

			container.style.setProperty('--num-cylinders', numCylinders);

			let gap = this.getAttribute('gap-size');
			if (!gap) {
				gap = '1px';
			}

			container.style.gap = gap;

			for (let i = 0; i < numCylinders; i++) {
				const newCyl = document.createElement('cylinder-3d');
				newCyl.setAttribute('cap', 'true');
				newCyl.setAttribute('border', '1px solid black');
				const brightnessVal = '0.6';
				if (i === 0) {
					newCyl.setAttribute('shadow-bottom-cap', brightnessVal);
				} else if (i === numCylinders - 1) {
					newCyl.setAttribute('shadow-top-cap', brightnessVal);
				} else {
					newCyl.setAttribute('shadow-both-caps', brightnessVal);
				}

				container.appendChild(newCyl);
			}

			this.shadowRoot.appendChild(hinge);
		} catch (err) {
			console.error(err);
		}
	}
}

customElements.define('hinge-3d', Hinge3D);
