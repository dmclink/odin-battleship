import { Toast } from './toast.js';
export class ToastContainer extends HTMLElement {
	#toasts;
	constructor() {
		super();
		this.style.display = 'flex';
		this.style.flexDirection = 'column-reverse';
		this.style.gap = '1rem';
		this.style.position = 'fixed';
		this.style.right = '0';
		this.style.bottom = '0';
		this.style.padding = '1rem';
		this.style.width = 'min(100vw, 15rem)';
		this.style.zIndex = '100';

		this.#toasts = [];
	}

	addToast(msg) {
		const toast = new Toast(msg);
		this.#toasts.push(toast);
		this.appendChild(toast);
	}

	destroyToast(toast) {
		this.#toasts.filter((t) => t !== toast);
		this.removeChild(toast);
	}
}

customElements.define('toast-container', ToastContainer);
