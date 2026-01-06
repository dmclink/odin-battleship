import { Events } from './events.js';
import { em } from './eventemitter.js';
import { GameTypes, Players } from './const.js';

import GameEl from '../components/game-el.js';
import { MissPeg } from '../components/miss-peg.js';
import { HitPeg } from '../components/hit-peg.js';

class DisplayController {
	#gameType;
	#playerBoards;
	#holeSize;
	#blockSize;
	#toastContainer;

	constructor() {
		this.welcomeScreen = document.querySelector('#welcome-screen');
		this.player0board = document.getElementById('player0-board');
		this.player1board = document.getElementById('player1-board');
		this.#toastContainer = document.getElementById('toast-container');

		// start player1 board hidden
		this.player1board.style.zIndex = '-1';
		this.player1board.rotate3D(0, 180, 0);

		this.#playerBoards = [this.player0board, this.player1board];

		this.game = document.getElementById('game');
		this.main = document.querySelector('#main');
		this.playerModeBtns = Array.from(document.querySelectorAll('.welcome-player-mode'));

		this.#holeSize = this.game.getHoleSize();
		this.#blockSize = this.game.getBlockSize();

		// this.game.rotate3D(-80, 0, 0);
	}

	bindPlayerModeButtons() {
		// i represents enums for game mode
		// make sure not to change enums order or button order
		// TODO: consider moving the enums to constants file and iterating its values
		for (let i = 0; i < this.playerModeBtns.length; i++) {
			const button = this.playerModeBtns[i];
			button.addEventListener('click', () => {
				em.emit(Events.SELECT_GAME_TYPE, i);
			});
		}
	}

	hideWelcomeScreen() {
		this.welcomeScreen.classList.add('hidden');
		this.main.classList.remove('hidden');
	}

	bindStartGameButton() {
		document.getElementById('player0-ready-btn').addEventListener('click', (ev) => {
			ev.target.disabled = true;
			this.player0board.teardown();
			em.emit(Events.PLAYER0_READY);
		});
	}

	initPlayer0() {
		this.player0board.init();
	}

	initPlayer1() {
		if (this.#gameType !== GameTypes.COMPUTER) {
			this.player1board.init();
		}
	}

	setGameType(gameType) {
		this.#gameType = gameType;
	}

	// rotates the boards so you can see the hitboard side, player1board is reversed behind player0board
	rotateBoards() {
		// this.player0board.rotate3D(-30, 0, 0);
		// this.player1board.rotate3D(-30, 180, 0);
		//
		this.game.rotate3D(-30, 0, 0);
	}

	addPegToAttackingPlayerHitBoard(x, y, player, hitOrMiss) {
		const board = this.#playerBoards[player];
		const cell = board.getHitCell(x, y);

		let peg;
		if (hitOrMiss === 'hit') {
			peg = new HitPeg(this.#blockSize, this.#holeSize);
		} else if (hitOrMiss === 'miss') {
			peg = new MissPeg(this.#blockSize, this.#holeSize);
		} else {
			throw new Error('got event that was not hit or miss:', hitOrMiss);
		}

		peg.animate([{ transform: 'translateZ(999px)' }, { transform: 'translateZ(0)' }], 200);

		cell.appendChild(peg);
	}

	addPegToReceivedPlayerShipBoard(x, y, player, hitOrMiss) {
		const board = this.#playerBoards[player];
		const cell = board.getShipCell(x, y);

		let peg;
		if (hitOrMiss === 'hit') {
			peg = new HitPeg(this.#blockSize, this.#holeSize, false);
			peg.style.transform = `translateZ(${this.#blockSize / 2}px)`;
			peg.animate(
				[{ transform: 'translateZ(999px)' }, { transform: `translateZ(${this.#blockSize / 2}px)` }],
				200,
			);
		} else if (hitOrMiss === 'miss') {
			peg = new MissPeg(this.#blockSize, this.#holeSize, false);
			peg.style.transform = `translateZ(${-board.shipBoard.getOffsetDepth() / 2}px)`;
			peg.animate(
				[
					{ transform: 'translateZ(999px)' },
					{ transform: `translateZ(${-board.shipBoard.getOffsetDepth() / 2}px)` },
				],
				200,
			);
		} else {
			throw new Error('got event that was not hit or miss:', hitOrMiss);
		}

		cell.appendChild(peg);
	}

	handleReceivedAttackMiss(x, y, playerThatReceivedAttack) {
		this.addPegToAttackingPlayerHitBoard(x, y, playerThatReceivedAttack ^ 1, 'miss');
		this.addPegToReceivedPlayerShipBoard(x, y, playerThatReceivedAttack, 'miss');
	}

	handleReceivedAttackHit(x, y, hitShip, playerThatReceivedAttack) {
		this.addPegToAttackingPlayerHitBoard(x, y, playerThatReceivedAttack ^ 1, 'hit');
		this.addPegToReceivedPlayerShipBoard(x, y, playerThatReceivedAttack, 'hit');
	}

	bindHitBoardEvents() {
		this.player0board.querySelector('.hit-board').bindEvents();
		if (this.#gameType === GameTypes.PLAYER) {
			this.player1board.querySelector('.hit-board').bindEvents();
		}
	}

	playerString(player) {
		if (this.#gameType === GameTypes.COMPUTER) {
			return player === Players.COMPUTER ? 'The computer' : 'The player';
		}

		return `Player ${player + 1}`;
	}

	announceMiss(x, y, player) {
		this.#toastContainer.addToast(`${this.playerString(player ^ 1)} missed...`, 600);
		const dialog = document.getElementById('winner-dialog');
		dialog.querySelector('#winner-span').innerText = `${this.playerString(player ^ 1)}`;
		dialog.showModal();
	}

	announceHit(x, y, shipName, player) {
		this.#toastContainer.addToast(`${this.playerString(player ^ 1)} hit a ${shipName}`, 1500);
	}

	announceSunkShip(x, y, shipName, player) {
		this.#toastContainer.addToast(`${this.playerString(player)}'s ${shipName} was sunk!`, 2000);
	}

	announceGameOver(x, y, shipName, player) {
		const dialog = document.getElementById('winner-dialog');
		dialog.querySelector('#winner-span').innerText = `${this.playerString(player ^ 1)}`;
		dialog.showModal();
	}

	bindPlayAgainButton() {
		document.getElementById('play-again-btn').addEventListener('click', (ev) => {
			console.log('makin new game');
			const [colorPrimary, colorSecondary] = this.game.getColors();
			this.game.replaceWith(new GameEl(this.#blockSize, this.#holeSize, colorPrimary, colorSecondary));
		});
	}

	bindEvents() {
		this.bindPlayerModeButtons();
		this.bindStartGameButton();
		this.bindPlayAgainButton();

		em.on(Events.GAME_START, this.setGameType.bind(this));
		em.on(Events.GAME_START, this.hideWelcomeScreen.bind(this));
		em.on(Events.GAME_START, this.initPlayer0.bind(this));
		em.on(Events.PLAYER0_READY, this.initPlayer1.bind(this));

		em.on(Events.PHASE_CHANGE, this.rotateBoards.bind(this));
		em.on(Events.PHASE_CHANGE, this.bindHitBoardEvents.bind(this));

		// this group of functions generates the pegs and sends them into holes
		// params - x, y, player representing col and row, these are 0 indexed, and the player
		// that received the attack
		em.on(Events.RECEIVED_ATTACK_MISS, this.handleReceivedAttackMiss.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.handleReceivedAttackHit.bind(this));
		em.on(Events.SHIP_SUNK, this.handleReceivedAttackHit.bind(this));
		em.on(Events.GAME_OVER, this.handleReceivedAttackHit.bind(this));

		// this group of functions generates the toasts to announce events hit/miss/sunk
		em.on(Events.RECEIVED_ATTACK_MISS, this.announceMiss.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.announceHit.bind(this));
		em.on(Events.SHIP_SUNK, this.announceSunkShip.bind(this));
		em.on(Events.GAME_OVER, this.announceGameOver.bind(this));
	}
}

export { DisplayController };
