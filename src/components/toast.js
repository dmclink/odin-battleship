export class Toast extends HTMLElement {
	constructor(msg, timeoutMs) {
		super();
		this.style.width = '100%';
		this.style.border = '2px solid black';
		this.style.display = 'block';
		this.style.padding = '1rem';
		this.style.paddingRight = '2rem';
		this.style.position = 'relative';
		this.style.backgroundColor = 'white';

		const p = document.createElement('p');
		p.innerText = msg;
		this.appendChild(p);

		const closeBtn = document.createElement('button');
		closeBtn.style.display = 'block';
		closeBtn.classList.add('close-btn');
		closeBtn.innerText = 'X';
		closeBtn.style.position = 'absolute';
		closeBtn.style.paddingInline = '0.2rem';
		closeBtn.style.right = '0.2rem';
		closeBtn.style.top = '0.2rem';
		this.appendChild(closeBtn);

		const timer = setTimeout(this.destroySelf.bind(this), timeoutMs || 2000);
		closeBtn.addEventListener('click', () => {
			clearTimeout(timer);
			this.destroySelf();
		});
	}

	destroySelf() {
		this.offsetParent.destroyToast(this);
	}
}

customElements.define('toast-el', Toast);
