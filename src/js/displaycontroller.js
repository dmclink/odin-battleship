import { Events } from './events.js';
import { em } from './eventemitter.js';
import { GameTypes, Players, rotateDelay, rotateTransition } from './const.js';

import GameEl from '../components/game-el.js';
import { MissPeg } from '../components/miss-peg.js';
import { HitPeg } from '../components/hit-peg.js';

class DisplayController {
	#gameType;
	#playerBoards;
	#holeSize;
	#blockSize;
	#toastContainer;
	#playControls;
	#setupControls;
	#volumeControls;
	#volumeOnBtn;
	#volumeOffBtn;
	#volumeOn;
	#currentPlayer;

	constructor() {
		this.welcomeScreen = document.querySelector('#welcome-screen');
		this.player0board = document.getElementById('player0-board');
		this.player1board = document.getElementById('player1-board');
		this.#toastContainer = document.getElementById('toast-container');
		this.#playControls = document.getElementById('play-controls');
		this.#setupControls = document.getElementById('setup-controls');
		this.#volumeControls = document.getElementById('volume-controls');
		this.#volumeOnBtn = document.getElementById('volume-on-btn');
		this.#volumeOffBtn = document.getElementById('volume-off-btn');
		this.#volumeOn = true;

		this.#playerBoards = [this.player0board, this.player1board];

		this.game = document.getElementById('game');
		this.#holeSize = this.game.getHoleSize();
		this.#blockSize = this.game.getBlockSize();

		this.main = document.querySelector('#main');
		this.playerModeBtns = Array.from(document.querySelectorAll('.welcome-player-mode'));

		// start player1 board hidden
		this.player1board.rotateOutShipPlacement();
		this.player1board.classList.add('hidden');

		this.welcomeScreen.classList.remove('hidden');
		this.main.classList.add('hidden');
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
		if (this.#gameType === GameTypes.PLAYER) {
			this.player1board.classList.remove('hidden');
		}
	}

	// TODO: need to bind player1-ready-btn
	bindStartGameButton() {
		document.getElementById('player0-ready-btn').addEventListener('click', (ev) => {
			ev.target.classList.add('dnone');
			this.player0board.teardown();
			em.emit(Events.PLAYER0_READY);
			// TODO: need to change phase? switch to player2 depending on game type
			if (this.#gameType === GameTypes.PLAYER) {
				document.getElementById('player1-ready-btn').classList.remove('dnone');
			}
		});

		document.getElementById('player1-ready-btn').addEventListener('click', (ev) => {
			ev.target.disabled = true;
			this.player1board.teardown();
			em.emit(Events.PLAYER1_READY);
			// TODO: need to change phase? switch to player2 depending on game type
		});
	}

	initPlayer0() {
		this.player0board.init();
	}

	initPlayer1() {
		if (this.#gameType === GameTypes.PLAYER) {
			this.player0board.hideShips();
			this.player0board.rotateOutShipPlacement();
			this.player1board.init();
			this.player1board.rotateInShipPlacement();
		}
	}

	start2PlayerGame() {
		if (this.gameType === GameTypes.PLAYER) {
			this.player1board.hideShips();
		}
	}

	setGameType(gameType) {
		this.#gameType = gameType;
	}

	rotateForHitBoards() {
		this.player0board.rotateForHitBoard();
		this.player1board.rotateForReversedHitBoard();
	}

	rotateReverseHitBoards() {
		this.player0board.rotateForReversedHitBoard();
		this.player1board.rotateForHitBoard();
	}

	phaseChange() {
		if (this.GameType === GameTypes.COMPUTER) {
			this.player0board.rotate3D(-20, 0, 0);
		} else {
			this.announcePassDevice(Players.PLAYER_0);
			this.updateCurrentPlayer(Players.PLAYER_0);
			this.player0board.rotateForShipPlacement();
			this.player1board.rotateOutShipPlacement();
			setTimeout(this.rotateForHitBoards.bind(this), rotateDelay + rotateTransition);
		}
	}

	// TODO: need to rotate player1board i tried rotating but dont see it even if deleting player0
	// is it not on screen?
	rotateForShipPlacement() {
		this.player0board.rotate3D(-60, 0, 0);
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

	bindPlayer0HitBoardEvents() {
		this.player0board.querySelector('.hit-board').bindEvents();
	}

	bindPlayer1HitBoardEvents() {
		this.player1board.querySelector('.hit-board').bindEvents();
	}

	unbindPlayer0HitBoardEvents() {
		this.player0board.querySelector('.hit-board').unbindEvents();
	}

	unbindPlayer1HitBoardEvents() {
		this.player1board.querySelector('.hit-board').unbindEvents();
	}

	bindHitBoardEvents() {
		if (this.#gameType === GameTypes.COMPUTER) {
			this.bindPlayer0HitBoardEvents();
		}
	}

	playerString(player) {
		if (this.#gameType === GameTypes.COMPUTER) {
			return player === Players.COMPUTER ? 'The computer' : 'The player';
		}

		return `Player ${player + 1}`;
	}

	announcePassDevice(player) {
		if (this.#gameType === GameTypes.PLAYER) {
			this.#toastContainer.addToast(`Pass device back to ${this.playerString(player)}`, 5000);
		}
	}

	announceMiss(x, y, player) {
		this.#toastContainer.addToast(`${this.playerString(player ^ 1)} missed...`, 600);
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

	initButtons() {
		this.#setupControls.classList.add('dnone');
		this.#playControls.classList.add('dnone');
	}

	showSetupButtons() {
		const player0ready = this.#setupControls.querySelector('#player0-ready-btn');
		player0ready.innerText = this.#gameType === GameTypes.COMPUTER ? 'Ready' : 'Player 1 Ready';

		player0ready.classList.remove('dnone');
		this.#setupControls.classList.remove('dnone');
	}

	hideSetupButtons() {
		this.#setupControls.classList.add('dnone');
	}

	updatePlayerButtonName(player) {
		this.#playControls.querySelector('#next-ready-btn').innerText = `${this.playerString(player)} Ready`;
	}

	handlePlayerEndTurnClick() {
		if (this.#currentPlayer === Players.PLAYER_1) {
			this.player1board.hideShips();
			this.rotateReverseHitBoards();
			this.unbindPlayer1HitBoardEvents();
		} else {
			this.player0board.hideShips();
			this.rotateForHitBoards();
			this.unbindPlayer0HitBoardEvents();
		}
		this.updatePlayerButtonName(this.#currentPlayer);
	}

	handlePlayerReadyClick() {
		if (this.#currentPlayer === Players.PLAYER_0) {
			this.bindPlayer0HitBoardEvents();
			this.player0board.showShips();
		} else {
			this.bindPlayer1HitBoardEvents();
			this.player1board.showShips();
		}
	}

	bindPlayControlsButtons() {
		const endTurnBtn = this.#playControls.querySelector('#end-turn-btn');
		const nextReadyBtn = this.#playControls.querySelector('#next-ready-btn');

		nextReadyBtn.addEventListener('click', (ev) => {
			nextReadyBtn.disabled = true;
			this.handlePlayerReadyClick();
		});

		endTurnBtn.addEventListener('click', (ev) => {
			endTurnBtn.disabled = true;
			this.handlePlayerEndTurnClick();
			nextReadyBtn.disabled = false;
		});
	}

	disableEndTurnBtn() {
		this.#playControls.querySelector('#end-turn-btn').disabled = true;
	}

	enableEndTurnBtn() {
		this.#playControls.querySelector('#end-turn-btn').disabled = false;
	}

	disablePlayerReadyBtn() {
		this.#playControls.querySelector('#next-ready-btn').disabled = true;
		this.#playControls.querySelector('#end-turn-btn').disabled = false;
	}

	showPlayerButtons() {
		if (this.#gameType === GameTypes.PLAYER) {
			this.disableEndTurnBtn();
			this.updatePlayerButtonName(Players.PLAYER_0);
			this.#playControls.classList.remove('dnone');
		}
	}

	showVolumeControls() {
		this.#volumeControls.classList.remove('dnone');
	}

	hideVolumeControls() {
		this.#volumeControls.classList.add('dnone');
	}

	bindPlayAgainButton() {
		document.getElementById('play-again-btn').addEventListener('click', () => {
			// TODO: need to reset controls in footer
			// thinking to make a few sets of controls that i can display none for the different phases
			// setup phase play phase and welcome screen phase (has nothing)
			// play phase against computer also has nothing
			// play phase against human has ready buttons that need to be bound to create a handoff
			// can hide the inactive player .board-grid or #ship-grid$ (player number 0 or 1)
			const dialog = document.getElementById('winner-dialog');
			dialog.close();
			const [colorPrimary, colorSecondary] = this.game.getColors();
			this.game.replaceWith(new GameEl(this.#blockSize, this.#holeSize, colorPrimary, colorSecondary));
			em.emit(Events.RESTART_GAME);
		});
	}

	playSplashAudio() {
		if (this.#volumeOn) {
			const audio = new Audio('../assets/water-splash-199583.mp3');
			audio.play();
		}
	}

	playHitAudio() {
		if (this.#volumeOn) {
			const audio = new Audio('../assets/missile-explosion.mp3');
			audio.play();
		}
	}

	toggleVolume() {
		this.#volumeOn = !this.#volumeOn;
		if (this.#volumeOn) {
			this.#volumeOnBtn.classList.remove('dnone');
			this.#volumeOffBtn.classList.add('dnone');
		} else {
			this.#volumeOnBtn.classList.add('dnone');
			this.#volumeOffBtn.classList.remove('dnone');
		}
	}

	bindVolumeButtons() {
		this.#volumeControls.addEventListener('click', () => {
			this.toggleVolume();
		});
	}

	updateCurrentPlayer(player) {
		this.#currentPlayer = player;
	}

	bindEvents() {
		this.bindVolumeButtons();
		this.bindPlayerModeButtons();
		this.bindStartGameButton();
		this.bindPlayAgainButton();
		this.bindPlayControlsButtons();

		em.on(Events.GAME_START, this.setGameType.bind(this));
		em.on(Events.GAME_START, this.hideWelcomeScreen.bind(this));
		em.on(Events.GAME_START, this.rotateForShipPlacement.bind(this));
		em.on(Events.GAME_START, this.initPlayer0.bind(this));
		em.on(Events.GAME_START, this.showSetupButtons.bind(this));
		em.on(Events.PLAYER0_READY, this.initPlayer1.bind(this));
		em.on(Events.PLAYER1_READY, this.start2PlayerGame.bind(this));

		em.on(Events.PHASE_CHANGE, this.phaseChange.bind(this));
		em.on(Events.PHASE_CHANGE, this.bindHitBoardEvents.bind(this));
		em.on(Events.PHASE_CHANGE, this.hideSetupButtons.bind(this));
		em.on(Events.PHASE_CHANGE, this.showPlayerButtons.bind(this));

		// this group of functions generates the pegs and sends them into holes
		// params - x, y, player representing col and row, these are 0 indexed, and the player
		// that received the attack
		em.on(Events.RECEIVED_ATTACK, this.updateCurrentPlayer.bind(this));
		em.on(Events.RECEIVED_ATTACK, this.enableEndTurnBtn.bind(this));
		em.on(Events.RECEIVED_ATTACK, this.announcePassDevice.bind(this));
		em.on(Events.RECEIVED_ATTACK_MISS, this.handleReceivedAttackMiss.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.handleReceivedAttackHit.bind(this));
		em.on(Events.SHIP_SUNK, this.handleReceivedAttackHit.bind(this));
		em.on(Events.GAME_OVER, this.handleReceivedAttackHit.bind(this));

		// AUDIO: this group of functions generates audio and controls
		em.on(Events.GAME_START, this.showVolumeControls.bind(this));
		em.on(Events.RECEIVED_ATTACK_MISS, this.playSplashAudio.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.playHitAudio.bind(this));
		// TODO: what is this function supposed to be?
		// em.on(Events.GAME_OVER, this.showHideControls.bind(this));

		// TOAST: this group of functions generates the toasts to announce events hit/miss/sunk
		em.on(Events.RECEIVED_ATTACK_MISS, this.announceMiss.bind(this));
		em.on(Events.RECEIVED_ATTACK_HIT, this.announceHit.bind(this));
		em.on(Events.SHIP_SUNK, this.announceSunkShip.bind(this));
		em.on(Events.GAME_OVER, this.announceGameOver.bind(this));
	}
}

export { DisplayController };
