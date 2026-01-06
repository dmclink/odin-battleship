export default class GameScreen extends HTMLElement {
	constructor() {
		super();
		this.classList.add('game-screen');
		this.id = 'game-screen';

		this.innerHTML = `
			<style>
			  .game-screen {
				position: fixed;
			    height: 100vh;
			    width: 100vw;
			    z-index: 10;
			    pointer-events: none;
			  }
			</style>
		`;
	}
}

customElements.define('game-screen', GameScreen);
