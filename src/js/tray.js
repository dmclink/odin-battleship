class BoardTray extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		const resp = await fetch('../html/tray.html');
		const text = await resp.text();

		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = text;

		console.log(tempContainer);
		const template = tempContainer.querySelector('#board-tray-template');
		const templateContent = template.content;

		this.shadowRoot.appendChild(templateContent.cloneNode(true));
	}
}

customElements.define('board-tray', BoardTray);
