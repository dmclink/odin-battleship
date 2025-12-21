const text = `
<template id="rotate-3d-template">
  <style>
    :host {
      transform-style: preserve-3d;
      perspective: 500px;
      position: relative;
    }
    .controls {
      position: relative;
      z-index: 2;
    }
  </style>
  <div class="controls">
    <label for="rotate-x">X:</label>
    <input type="range" name="rotate-x" id="rotate-x" min="-180" max="180" value="0" />

    <label for="rotate-y">Y:</label>
    <input type="range" name="rotate-y" id="rotate-y" min="-180" max="180" value="0" />

    <label for="rotate-z">Z:</label>
    <input type="range" name="rotate-z" id="rotate-z" min="-180" max="180" value="0" />

    <label for="perspective">P:</label>
    <input type="range" name="perspective" id="perspective" min="1" max="10000" value="5000" />
  </div>
  <slot name="obj-3d" id="obj-3d"></slot>
</template>
`;

class Rotate3D extends HTMLElement {
	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });

		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = text;

		const template = tempContainer.querySelector('#rotate-3d-template');

		const rotator = document.importNode(template.content, true);
		const xSlider = rotator.querySelector('#rotate-x');
		const ySlider = rotator.querySelector('#rotate-y');
		const zSlider = rotator.querySelector('#rotate-z');
		const pSlider = rotator.querySelector('#perspective');

		shadowRoot.appendChild(rotator);

		const [obj] = Array.from(this.shadowRoot.querySelector('slot[name="obj-3d"]').assignedElements());

		obj.style.transformStyle = 'preserve-3d';

		// these coincide with the starting values
		let xVal = xSlider.value;
		let yVal = ySlider.value;
		let zVal = zSlider.value;
		let pVal = pSlider.value;

		const updateTransform = function () {
			obj.style.transform = `rotateX(${xVal}deg) rotateY(${yVal}deg) rotateZ(${zVal}deg)`;
		};

		const updatePerspective = () => {
			obj.style.perspective = `${pVal}px`;
		};
		xSlider.addEventListener('input', () => {
			xVal = xSlider.value;
			updateTransform();
		});
		ySlider.addEventListener('input', () => {
			yVal = ySlider.value;
			updateTransform();
		});
		zSlider.addEventListener('input', () => {
			zVal = zSlider.value;
			updateTransform();
		});
		pSlider.addEventListener('input', () => {
			pVal = pSlider.value;
			updatePerspective();
		});
	}
}

customElements.define('rotate-3d', Rotate3D);
