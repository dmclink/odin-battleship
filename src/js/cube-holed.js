import './cube.js';
import './cylinder.js';

const text = `
<template id="cube-holed-template">
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
    .cube-holed__container {
      height: 100%;
      width: 100%;
      display: grid;
      place-items: center;
    }
    // .cube-holed__hole {
    //   margin: 0 auto;
    // }
  </style>
  <div class="cube-holed__container">
    <cube-3d></cube-3d>
    <cylinder-3d class="cube-holed__hole" sides="30"></cylinder-3d>
  </div>
</template>
`;

class CubeHoled3D extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		const temp = document.createElement('div');
		temp.innerHTML = text;

		const cubeHoled = temp.querySelector('#cube-holed-template').content.cloneNode(true);

		const container = cubeHoled.querySelector('.cube-holed__container');

		const cube = container.querySelector('cube-3d');
		const hole = container.querySelector('cylinder-3d');

		// append it before checking sizes
		shadowRoot.appendChild(cubeHoled);

		const width = this.offsetWidth;

		const holeSize = Number(this.getAttribute('hole-size')) || width / 2;

		hole.style.width = `${holeSize + 1}px`;

		hole.setAttribute('inner-thickness', '0.01');
		hole.setAttribute('shadow-inner', '0.6');

		const [, , , , top, bottom] = cube.getFaces();

		const maskImage = `radial-gradient(circle at center, transparent ${holeSize / 2}px, black ${holeSize / 2}px`;

		top.style.maskImage = maskImage;
		bottom.style.maskImage = maskImage;
		top.style.maskSize = holeSize;

		hole.rebuild(holeSize, this.offsetHeight);
	}
}

customElements.define('cube-holed-3d', CubeHoled3D);
