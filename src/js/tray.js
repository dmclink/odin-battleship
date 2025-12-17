class BoardTray extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async connectedCallback() {
		const tempContainer = document.createElement('div');
		try {
			const resp = await fetch('../html/tray.html');
			const text = await resp.text();
			tempContainer.innerHTML = text;

			const template = tempContainer.querySelector('#board-tray-template');
			const templateContent = template.content;

			this.shadowRoot.appendChild(templateContent.cloneNode(true));
		} catch (err) {
			console.error('failed to get tray element from tray.html:', err);
			return;
		}
	}
}

customElements.define('board-tray', BoardTray);
