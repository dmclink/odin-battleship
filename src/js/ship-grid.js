import { cube, cylinder, cylinder2D } from './shapes-3d.js';
import './cylinder.js';

const text = `
<template id="ship-grid-template">
  <style>
    :host {
      display: grid;
      place-items: center;
      height: 100%;
      width: 100%;
      position: absolute;
      transform-style: preserve-3d;
    }
    .ship-grid__container {
      display: grid;
      place-items: center;
      grid-template-rows: repeat(10, 1fr);
      grid-template-columns: repeat(10, 1fr);
      height: 100%;
      width: 100%;
      transform-style: preserve-3d;
    }
  </style>
  <div class="ship-grid__container">
  </div>
</template>
`;

class ShipGrid extends HTMLElement {
	#container;
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		const temp = document.createElement('div');
		temp.innerHTML = text;

		const template = temp.querySelector('#ship-grid-template');
		console.log('temp:', temp);
		console.log('template:', template);
		console.log('content:', template.content);

		// const grid = document.importNode(template.content, true);
		const grid = template.content.cloneNode(true);
		this.#container = grid.querySelector('.ship-grid__container');
		console.log('grid before:', grid);
		shadowRoot.appendChild(grid);
		console.log('container:', this.#container);
		console.log('w/h:', this.offsetWidth, this.offsetHeight);

		const gridGap = 10;
		const numItems = 10;
		const width = (this.offsetWidth - (numItems - 1) * gridGap) / numItems;
		const height = (this.offsetHeight - (numItems - 1) * gridGap) / numItems;
		const depth = window.getComputedStyle(this.#container).getPropertyValue('--depth');

		this.#container.style.gap = `${gridGap}px`;

		console.log(this.#container);

		console.log(width, height, depth);
		// adds a little offset to the depth of the pegs so they aren't perfectly aligned with the edge of tray
		const offsetDepth = '12px';

		for (let i = 0; i < 100; i++) {
			// const newCube = cube(height, width, depth, '#44c9ea');
			const newCyl = cylinder2D(
				width,
				`calc(${depth} - ${offsetDepth})`,
				'#44c9ea',
				'black',
				'1px solid black',
				width / 2,
			);
			// newCyl.style.transform = 'rotateX(-90deg)';
			newCyl.style.transformStyle = 'preserve-3d';
			// newCyl.style.transform = `translateZ(${offsetDepth})`;

			// newCube.style.transformStyle = 'preserve-3d';
			// newCube.appendChild(newCyl);
			//
			this.#container.appendChild(newCyl);

			// newCube.appendChild(newCyl);
			// this.#container.appendChild(newCube);
		}
		shadowRoot.appendChild(grid);
	}
}

customElements.define('ship-grid', ShipGrid);
