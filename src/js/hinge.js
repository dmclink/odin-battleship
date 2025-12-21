import './cylinder.js';

const text = `
<template id="hinge-3d-template" class="hinge-3d">
  <style>
    :host {
      display: block;
      height: 100%;
      width: 100%;
      transform-style: preserve-3d;
    }
    .hinge__container {
      box-sizing: border-box;
      display: grid;
      align-items: center;
      height: 100%;
      transform-style: preserve-3d;
      grid-template-rows: repeat(var(--num-cylinders, 1), 1fr);
      perspective: 1000px;
    }

    .hinge__container * {
      box-sizing: inherit;
      transform-style: preserve-3d;
    }
  </style>
  <div class="hinge__container">
  </div>
</template>
`;

export class Hinge3D extends HTMLElement {
	#cylinders;
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		const tempNode = document.createElement('div');
		tempNode.innerHTML = text;

		const hinge = tempNode.querySelector('#hinge-3d-template').content.cloneNode(true);
		const container = hinge.querySelector('.hinge__container');

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

		this.#cylinders = [];

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

			this.#cylinders.push(newCyl);

			container.appendChild(newCyl);
		}

		shadowRoot.appendChild(hinge);
	}

	connectedCallback() {
		this.#cylinders.forEach((cylinder) => cylinder.rebuildWithoutDimensions());
	}
}

customElements.define('hinge-3d', Hinge3D);
