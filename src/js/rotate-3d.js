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
			const templateContent = template.content;

			const rotator = templateContent.cloneNode(true);
			const xSlider = rotator.querySelector('#rotate-x');
			console.log(xSlider);

			this.shadowRoot.appendChild(rotator);
		} catch (err) {
			console.error('cannot retrieve rotate template:', err);
			return;
		}
	}
}

customElements.define('rotate-3d', Rotate3D);
