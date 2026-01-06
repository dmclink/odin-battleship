import { Events } from './events.js';
import { em } from './eventemitter.js';
import { GameTypes } from './const.js';

import { MissPeg } from '../components/miss-peg.js';
import { HitPeg } from '../components/hit-peg.js';

class DisplayController {
	#gameType;
	#playerBoards;
	#holeSize;
	#blockSize;

	constructor() {
		this.welcomeScreen = document.querySelector('#welcome-screen');
		this.player0board = document.getElementById('player0-board');
		this.player1board = document.getElementById('player1-board');
		this.player1board.style.display = 'none';

		this.#playerBoards = [this.player0board, this.player1board];

		this.game = document.getElementById('game');
		this.main = document.querySelector('#main');
		this.playerModeBtns = Array.from(document.querySelectorAll('.welcome-player-mode'));

		this.#holeSize = this.game.getHoleSize();
		this.#blockSize = this.game.getBlockSize();
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
		this.player0board.rotate3D(-40, 20, 0);
		this.player1board.rotate3D(-10, 180, 0);
	}

	addWhitePegToAttackingPlayerHitBoard(x, y, player) {
		const board = this.#playerBoards[player];
		const cell = board.getHitCell(x, y);

		const peg = new MissPeg(this.#blockSize, this.#holeSize);
		cell.appendChild(peg);
	}

	addWhitePegToReceivedPlayerShipBoard(x, y, player) {
		const board = this.#playerBoards[player];
		const cell = board.getShipCell(x, y);

		const peg = new MissPeg(this.#blockSize, this.#holeSize, false);
		peg.style.transform = `translateZ(${-board.shipBoard.getOffsetDepth() / 2}px)`;
		cell.appendChild(peg);
	}

	addPegToAttackingPlayerHitBoard(x, y, player, hitOrMiss) {
		const board = this.#playerBoards[player];
		const cell = board.getHitCell(x, y);

		let peg;
		if (hitOrMiss === 'hit') {
			peg = new HitPeg(this.#blockSize, this.#holeSize, false);
		} else if (hitOrMiss === 'miss') {
			peg = new MissPeg(this.#blockSize, this.#holeSize, false);
		} else {
			throw new Error('got event that was not hit or miss:', hitOrMiss);
		}

		cell.appendChild(peg);
	}

	addPegToReceivedPlayerShipBoard(x, y, player, hitOrMiss) {
		const board = this.#playerBoards[player];
		const cell = board.getShipCell(x, y);

		let peg;
		if (hitOrMiss === 'hit') {
			peg = new HitPeg(this.#blockSize, this.#holeSize, false);
			peg.style.transform = `translateZ(${this.#blockSize / 2}px)`;
		} else if (hitOrMiss === 'miss') {
			peg = new MissPeg(this.#blockSize, this.#holeSize, false);
			peg.style.transform = `translateZ(${-board.shipBoard.getOffsetDepth() / 2}px)`;
		} else {
			throw new Error('got event that was not hit or miss:', hitOrMiss);
		}

		cell.appendChild(peg);
	}

	handleReceivedAttackMiss(x, y, playerThatReceivedAttack) {
		this.addWhitePegToAttackingPlayerHitBoard(x, y, playerThatReceivedAttack ^ 1);
		this.addWhitePegToReceivedPlayerShipBoard(x, y, playerThatReceivedAttack);
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

	announceSunkShip(x, y, shipName, player) {
		console.log(`player ${player}'s ${shipName} was sunk!`);
	}

	announceGameOver(x, y, shipName, player) {
		console.log(`player ${player ^ 1} wins the game!`);
	}

	bindEvents() {
		this.bindPlayerModeButtons();
		this.bindStartGameButton();

		em.on(Events.GAME_START, this.setGameType.bind(this));
		em.on(Events.GAME_START, this.hideWelcomeScreen.bind(this));
		em.on(Events.GAME_START, this.initPlayer0.bind(this));
		em.on(Events.PLAYER0_READY, this.initPlayer1.bind(this));

		em.on(Events.PHASE_CHANGE, this.rotateBoards.bind(this));
		em.on(Events.PHASE_CHANGE, this.bindHitBoardEvents.bind(this));

		// TODO: add events for received attack and attack to send pegs into holes
		// params - x, y, player representing col and row, these are 0 indexed, and the player
		// that received the attack
		em.on(Events.RECEIVED_ATTACK_MISS, this.handleReceivedAttackMiss.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.handleReceivedAttackHit.bind(this));
		em.on(Events.SHIP_SUNK, this.handleReceivedAttackHit.bind(this));
		em.on(Events.GAME_OVER, this.handleReceivedAttackHit.bind(this));

		em.on(Events.SHIP_SUNK, this.announceSunkShip.bind(this));
		em.on(Events.GAME_OVER, this.announceGameOver.bind(this));
	}
}

export { DisplayController };
