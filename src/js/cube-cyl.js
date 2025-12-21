import './cube.js';
import './cylinder.js';

const text = `
<template id="cube-cyl-template">
  <style>
    :host {
      box-sizing: border-box;
      display: block;
      place-items: center;
      transform-style: preserve-3d;
      height: 100%;
      width: 100%;
    }

    :host * {
      box-sizing: inherit;
      position: absolute;
      transform-style: preserve-3d;
    }
    .cube-cyl__container {
      height: 100%;
      width: 100%;
      display: grid;
      place-items: center;
    }

    .cube-cyl__transparent {
      --bgc: transparent;
    }
  </style>
  <div class="cube-cyl__container">
    <cube-3d class="cube-cyl__transparent"></cube-3d>
    <cylinder-3d class="cube-cyl__hole" sides="10"></cylinder-3d>
  </div>
</template>
`;

export default class CubeCyl3D extends HTMLElement {
	#cube;
	#color;
	#cyl;

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		const temp = document.createElement('div');
		temp.innerHTML = text;

		const cubeCyl = temp.querySelector('#cube-cyl-template').content.cloneNode(true);

		const container = cubeCyl.querySelector('.cube-cyl__container');

		const cube = container.querySelector('cube-3d');

		const color = this.getAttribute('--bgc');

		this.#cube = cube;
		this.#color = color;

		cube.setAttribute('--bgc', 'transparent');
		const cyl = container.querySelector('cylinder-3d');

		this.#cyl = cyl;

		// append it before checking sizes
		shadowRoot.appendChild(cubeCyl);

		const width = this.offsetWidth;

		const holePercent = 0.6;
		const holeSize = Number(this.getAttribute('hole-size')) || width / 2;
		const cylWidth = holeSize / holePercent;

		console.log({ cylWidth });

		cyl.style.width = `${cylWidth}`;

		cyl.setAttribute('inner-thickness', `${holePercent}`);
		cyl.setAttribute('shadow-inner', '0.6');

		// cyl.rebuild(cylWidth, this.offsetHeight);

		// this.addEventListener('mouseenter', (e) => {
		// 	e.stopPropagation();
		// 	e.preventDefault();
		// 	this.applyHoverColor('#b21f1f33');
		// });
		// this.addEventListener('mouseleave', (e) => {
		// 	e.stopPropagation();
		// 	e.preventDefault();
		// 	this.applyHoverColor('transparent');
		// });
	}

	applyHoverColor(color) {
		this.#cube.getFaces().forEach((face) => {
			face.style.backgroundColor = color;
		});
	}
}

customElements.define('cube-cyl-3d', CubeCyl3D);
