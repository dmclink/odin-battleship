const text = `
<template name="cylinder-3d" id="cylinder-3d-template">
  <style>
    :host {
      display: block;
      background-color: inherit;
      transform-style: preserve-3d;
      height: 100%;
      width: 100%;
    }

    .cylinder__container {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      background-color: inherit;
      display: flex;
      justify-content: center;
      transform-style: preserve-3d;
      /* perspective: 1000px; */
    }

    .cylinder__container * {
      box-sizing: inherit;
    }
  </style>

  <div class="cylinder__container"><slot></slot></div>
</template>
`;

function calculateSideLength(sides, radius) {
	const degrees = 180;
	const radians = degrees * (Math.PI / 180);
	return Math.round(2 * radius * Math.tan(radians / sides));
}

export class Cylinder3D extends HTMLElement {
	#container;
	#color;
	#sides;

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		const temp = document.createElement('div');
		temp.innerHTML = text;

		const cylinder = document.importNode(temp.querySelector('#cylinder-3d-template').content, true);

		const container = cylinder.querySelector('.cylinder__container');
		this.#container = container;

		const color = `var(--bgc, ${this.getAttribute('color') || 'black'})`;
		this.#color = color;

		const sides = this.getAttribute('sides') || 50;
		this.#sides = sides;

		shadowRoot.appendChild(cylinder);

		const width = this.offsetWidth;
		const height = this.offsetHeight;

		this.render(width, height);
	}

	render(width, height) {
		const radius = width / 2;
		// +1 here in case of higher side counts will not look continuously connected
		const sideLength = calculateSideLength(this.#sides, radius) + 1;
		const degreeStep = 360 / this.#sides;

		for (let i = 0, degree = 0; i < this.#sides; i++, degree += degreeStep) {
			const side = document.createElement('div');
			side.classList.add('cylinder__side');
			side.style.width = `${sideLength}px`;
			side.style.height = `${height}px`;
			side.style.position = 'absolute';
			side.style.backgroundColor = this.#color;
			side.style.transform = `rotateY(${degree}deg) translateZ(${radius}px)`;
			this.#container.appendChild(side);
		}

		let border = 'none';
		if (this.hasAttribute('border')) {
			border = this.getAttribute('border') || '1px solid black';
		}

		// inner ring always has a cap
		if (this.hasAttribute('inner-thickness')) {
			const thicknessRatio = Number(this.getAttribute('inner-thickness'));
			const holeDiameter = radius - radius * thicknessRatio;
			const thickness = radius - holeDiameter;
			for (let i = 0, degree = 0; i < this.#sides; i++, degree += degreeStep) {
				const side = document.createElement('div');
				side.style.width = `${sideLength}px`;
				side.style.height = `${height}px`;
				side.style.position = 'absolute';
				side.style.backgroundColor = this.#color;
				side.style.transform = `rotateY(${degree}deg) translateZ(${holeDiameter}px)`;

				if (this.hasAttribute('shadow-inner')) {
					const brightnessVal = Number(this.getAttribute('shadow-inner'));
					if (brightnessVal) {
						side.style.filter = `brightness(${brightnessVal})`;
					} else {
						side.style.filter = `brightness(0.7)`;
					}
				}

				side.style.borderTop = border;
				side.style.borderBottom = border;
				this.#container.appendChild(side);
			}

			// build the inner ring caps
			for (let i = 0, degree = 0; i < this.#sides; i++, degree += degreeStep) {
				const top = document.createElement('div');
				top.style.width = `${sideLength}px`;
				top.style.height = `${thickness}px`;
				top.style.position = 'absolute';
				top.style.backgroundColor = this.#color;
				top.style.transformOrigin = `50% 0%`;
				top.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px)`;
				top.style.borderBottom = border;
				if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-top-cap')) {
					const brightnessVal =
						this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-top-cap') || 0.7;
					top.style.filter = `brightness(${brightnessVal})`;
				}
				this.#container.appendChild(top);

				const bottom = document.createElement('div');
				bottom.style.width = `${sideLength}px`;
				bottom.style.height = `${thickness}px`;
				bottom.style.position = 'absolute';
				bottom.style.backgroundColor = this.#color;
				bottom.style.transformOrigin = `50% 0%`;
				bottom.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px) translateZ(${-height}px)`;
				bottom.style.borderBottom = border;
				if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-bottom-cap')) {
					const brightnessVal =
						this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-bottom-cap') || 0.7;
					bottom.style.filter = `brightness(${brightnessVal})`;
				}

				this.#container.appendChild(bottom);
			}
		}

		// cap will cover inner ring if it is also applied
		if (this.hasAttribute('cap')) {
			for (let i = 0, degree = 0; i < this.#sides; i++, degree += degreeStep) {
				const top = document.createElement('div');
				top.style.width = `${sideLength}px`;
				top.style.top = '0';
				top.style.height = `${radius}px`;
				top.style.position = 'absolute';
				top.style.backgroundColor = this.#color;
				top.style.transformOrigin = '50% 0%';
				top.style.transform = `rotateX(90deg) rotateZ(${degree}deg)`;
				top.style.borderBottom = border;
				if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-top-cap')) {
					const brightnessVal =
						this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-top-cap') || 0.7;
					top.style.filter = `brightness(${brightnessVal})`;
				}
				this.#container.appendChild(top);

				const bottom = document.createElement('div');
				bottom.style.width = `${sideLength}px`;
				bottom.style.height = `${radius}px`;
				bottom.style.position = 'absolute';
				bottom.style.backgroundColor = this.#color;
				bottom.style.transformOrigin = '50% 0%';
				bottom.style.transform = `translateY(${height}px) rotateX(90deg) rotateZ(${degree}deg)`;
				bottom.style.borderBottom = border;
				if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-bottom-cap')) {
					const brightnessVal =
						this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-bottom-cap') || 0.7;
					bottom.style.filter = `brightness(${brightnessVal})`;
				}
				this.#container.appendChild(bottom);
			}
		}
	}

	rebuild(width, height) {
		this.removeCylinderSides();
		this.render(width, height);
	}

	removeCylinderSides() {
		const container = this.shadowRoot.querySelector('.cylinder__container');
		const sides = Array.from(this.shadowRoot.querySelectorAll('.cylinder__side'));
		sides.forEach((side) => container.removeChild(side));
	}
}

customElements.define('cylinder-3d', Cylinder3D);
