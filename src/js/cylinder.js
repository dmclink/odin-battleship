function calculateSideLength(sides, radius) {
	const degrees = 180;
	const radians = degrees * (Math.PI / 180);
	return Math.round(2 * radius * Math.tan(radians / sides));
}

export class Cylinder3D extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		try {
			const resp = await fetch('../html/cylinder.html');
			const text = await resp.text();

			const temp = document.createElement('div');
			temp.innerHTML = text;
			const template = temp.querySelector('#cylinder-3d-template');
			const clone = template.cloneNode(true);

			const cylinder = clone.content.cloneNode(true);

			this.shadowRoot.appendChild(cylinder);

			const sides = this.getAttribute('sides') || 50;
			const width = this.offsetWidth;
			const height = this.offsetHeight;
			const radius = width / 2;

			// const color = this.getAttribute('color') || 'black';
			const color = `var(--bgc, ${this.getAttribute('color') || 'black'})`;

			// +1 here in case of higher side counts will not look continuously connected
			const sideLength = calculateSideLength(sides, radius) + 1;

			const degreeStep = 360 / sides;

			const container = document.createElement('div');
			container.classList.add('container');

			for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
				const side = document.createElement('div');
				side.style.width = `${sideLength}px`;
				side.style.height = `${height}px`;
				side.style.position = 'absolute';
				side.style.backgroundColor = color;
				side.style.transform = `rotateY(${degree}deg) translateZ(${radius}px)`;
				container.appendChild(side);
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
				for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
					const side = document.createElement('div');
					side.style.width = `${sideLength}px`;
					side.style.height = `${height}px`;
					side.style.position = 'absolute';
					side.style.backgroundColor = color;
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
					container.appendChild(side);
				}

				// build the inner ring caps
				for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
					const top = document.createElement('div');
					top.style.width = `${sideLength}px`;
					top.style.height = `${thickness}px`;
					top.style.position = 'absolute';
					top.style.backgroundColor = color;
					top.style.transformOrigin = `50% 0%`;
					top.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px)`;
					top.style.borderBottom = border;
					if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-top-cap')) {
						const brightnessVal =
							this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-top-cap') || 0.7;
						top.style.filter = `brightness(${brightnessVal})`;
					}
					container.appendChild(top);

					const bottom = document.createElement('div');
					bottom.style.width = `${sideLength}px`;
					bottom.style.height = `${thickness}px`;
					bottom.style.position = 'absolute';
					bottom.style.backgroundColor = color;
					bottom.style.transformOrigin = `50% 0%`;
					bottom.style.transform = `rotateX(90deg) rotateZ(${degree}deg) translateY(${holeDiameter}px) translateZ(${-height}px)`;
					bottom.style.borderBottom = border;
					if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-bottom-cap')) {
						const brightnessVal =
							this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-bottom-cap') || 0.7;
						bottom.style.filter = `brightness(${brightnessVal})`;
					}

					container.appendChild(bottom);
				}
			}

			// cap will cover inner ring if it is also applied
			if (this.hasAttribute('cap')) {
				for (let i = 0, degree = 0; i < sides; i++, degree += degreeStep) {
					const top = document.createElement('div');
					top.style.width = `${sideLength}px`;
					top.style.top = '0';
					top.style.height = `${radius}px`;
					top.style.position = 'absolute';
					top.style.backgroundColor = color;
					top.style.transformOrigin = '50% 0%';
					top.style.transform = `rotateX(90deg) rotateZ(${degree}deg)`;
					top.style.borderBottom = border;
					if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-top-cap')) {
						const brightnessVal =
							this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-top-cap') || 0.7;
						top.style.filter = `brightness(${brightnessVal})`;
					}
					container.appendChild(top);

					const bottom = document.createElement('div');
					bottom.style.width = `${sideLength}px`;
					bottom.style.height = `${radius}px`;
					bottom.style.position = 'absolute';
					bottom.style.backgroundColor = color;
					bottom.style.transformOrigin = '50% 0%';
					bottom.style.transform = `translateY(${height}px) rotateX(90deg) rotateZ(${degree}deg)`;
					bottom.style.borderBottom = border;
					if (this.hasAttribute('shadow-both-caps') || this.hasAttribute('shadow-bottom-cap')) {
						const brightnessVal =
							this.getAttribute('shadow-both-caps') || this.getAttribute('shadow-bottom-cap') || 0.7;
						bottom.style.filter = `brightness(${brightnessVal})`;
					}
					container.appendChild(bottom);
				}
			}

			cylinder.appendChild(container);
			this.shadowRoot.appendChild(cylinder);
		} catch (err) {
			console.error('loading cylinder.js:', err);
		}
	}
}

customElements.define('cylinder-3d', Cylinder3D);
