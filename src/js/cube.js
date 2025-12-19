const text = `
<template id="cube-template">
  <style>
    :host {
      box-sizing: border-box;
      display: grid;
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
    .cube__container {
      display: grid;
      place-items: center;
      height: 100%;
      width: 100%;
    }
  </style>
  <div class="cube__container"></div>
</template>
`;

class Cube3D extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		this.faces = [];
		const temp = document.createElement('div');
		temp.innerHTML = text;

		const cube = document.importNode(temp.querySelector('#cube-template').content, true);
		const container = cube.querySelector('.cube__container');

		// append it before checking sizes
		shadowRoot.appendChild(cube);

		const height = this.offsetHeight;
		const width = this.offsetWidth;

		const color = `var(--bgc, ${this.getAttribute('color') || 'black'})`;

		for (let i = 0; i < 6; i++) {
			const face = document.createElement('div');
			// the last two pieces are the top and bottom, so they must be full squares
			face.style.height = i >= 4 ? `${width}px` : `${height}px`;
			face.style.width = `${width}px`;
			face.style.backgroundColor = color;
			face.style.border = '1px solid black';
			this.faces.push(face);
			container.appendChild(face);
		}
		const [front, back, left, right, top, bottom] = this.faces;
		const midWidth = width / 2;
		const midHeight = height / 2;

		front.classList.add('cube__wall', 'cube__front');
		back.classList.add('cube__wall', 'cube__back');
		left.classList.add('cube__wall', 'cube__left');
		right.classList.add('cube__wall', 'cube__right');
		top.classList.add('cube__wall', 'cube__top');
		bottom.classList.add('cube__wall', 'cube__bottom');

		front.style.transform = `translateZ(${midWidth}px)`;
		back.style.transform = `translateZ(calc(-1 * ${midWidth}px))`;
		top.style.transform = `rotateX(90deg) translateZ(${midHeight}px)`;
		bottom.style.transform = `rotateX(90deg) translateZ(calc(-1 * ${midHeight}px))`;
		right.style.transform = `rotateY(90deg) translateZ(${midWidth}px)`;
		left.style.transform = `rotateY(90deg) translateZ(calc(-1 * ${midWidth}px))`;

		this.shadowRoot.appendChild(cube);
	}

	getFaces() {
		return this.faces;
	}
}

customElements.define('cube-3d', Cube3D);
