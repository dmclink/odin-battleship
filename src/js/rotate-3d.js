class Rotate3D extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		const tempContainer = document.createElement('div');
		try {
			const resp = await fetch('../html/rotate-3d.html');
			const text = await resp.text();
			tempContainer.innerHTML = text;

			const template = tempContainer.querySelector('#rotate-3d-template');

			const rotator = document.importNode(template.content, true);
			const xSlider = rotator.querySelector('#rotate-x');
			const ySlider = rotator.querySelector('#rotate-y');
			const zSlider = rotator.querySelector('#rotate-z');
			const pSlider = rotator.querySelector('#perspective');

			this.shadowRoot.appendChild(rotator);

			const [obj] = Array.from(this.shadowRoot.querySelector('slot[name="obj-3d"]').assignedElements());

			obj.style.transformStyle = 'preserve-3d';

			// these coincide with the starting values
			let xVal = xSlider.value;
			let yVal = ySlider.value;
			let zVal = zSlider.value;
			let pVal = pSlider.value;

			console.log('this:', this);
			const updateTransform = function () {
				obj.style.transform = `rotateX(${xVal}deg) rotateY(${yVal}deg) rotateZ(${zVal}deg)`;
			};

			const updatePerspective = () => {
				console.log(this);
				obj.style.perspective = `${pVal}px`;
			};
			xSlider.addEventListener('input', (e) => {
				xVal = xSlider.value;
				updateTransform();
			});
			ySlider.addEventListener('input', (e) => {
				yVal = ySlider.value;
				updateTransform();
			});
			zSlider.addEventListener('input', (e) => {
				zVal = zSlider.value;
				updateTransform();
			});
			pSlider.addEventListener('input', (e) => {
				pVal = pSlider.value;
				updatePerspective();
			});
		} catch (err) {
			console.error('cannot retrieve rotate template:', err);
			return;
		}
	}
}

customElements.define('rotate-3d', Rotate3D);
