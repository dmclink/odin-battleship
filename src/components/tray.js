import { cube } from './shapes-3d.js';

export default class BoardTray extends HTMLElement {
	constructor(blockSize, colorPrimary, colorSecondary, gridSize) {
		super();

		const rowLength = gridSize || 10;

		this.innerHTML = `
          <style>
            .tray {
              position: absolute;
              transform-style: preserve-3d;
			.middle-row {
				transform-style: preserve-3d;
				display: flex;
			}
			.main-container {
				transform-style: preserve-3d;
			}
			.board-grid {
				transform-style: preserve-3d;
				display: grid;
				place-items: center;
				position: absolute;
				height: 100%;
				width: 100%;
			}
			.tray-face.front {
				transform-style: preserve-3d;
				display: grid;
				place-items: center;
			}
			.tray-face.back {
				height: 100%;
				width: 100%;
				position: absolute;
			}
			.ship-cell.drop-zone {
				background-color: #44a7bd9e;
				border-bottom: 1px solid black;
				&::before {
					content: "";
					height: 100%;
					width: 100%;
					position: absolute;
					transform-style: preserve-3d;
					transform: rotateX(90deg) translateZ(${blockSize / -2}px) translateY(${blockSize / -2}px);
				    background-color: #44a7bd9e;
				}
			}
          </style>
		  <div class="tray-rim top"></div>
		  <div class="middle-row">
		    <div class="tray-rim left"></div>
		    <div class="main-container">
			  <div class="board-grid"></div>
		      <div class="tray-face front">
			    <div class="tray-face back"></div>
			  </div>
		    </div>
		    <div class="tray-rim right"></div>
		  </div>
		  <div class="tray-rim bottom"></div>
        `;

		this.classList.add('tray');

		const left = this.querySelector('.tray-rim.left');
		left.replaceWith(cube(blockSize * rowLength, blockSize, blockSize, colorPrimary, '1px solid black'));

		const right = this.querySelector('.tray-rim.right');
		right.replaceWith(cube(blockSize * rowLength, blockSize, blockSize, colorPrimary, '1px solid black'));

		const top = this.querySelector('.tray-rim.top');
		top.replaceWith(cube(blockSize, blockSize * (rowLength + 2), blockSize, colorPrimary, '1px solid black'));

		const bottom = this.querySelector('.tray-rim.bottom');
		bottom.replaceWith(cube(blockSize, blockSize * (rowLength + 2), blockSize, colorPrimary, '1px solid black'));

		const trayFaceFront = this.querySelector('.tray-face.front');

		trayFaceFront.style.gridTemplateColumns = `repeat(${rowLength}, ${blockSize}px)`;
		trayFaceFront.style.gridTemplateRows = `repeat(${rowLength}, ${blockSize}px)`;

		const boardGrid = this.querySelector('.board-grid');

		boardGrid.style.gridTemplateColumns = `repeat(${rowLength}, ${blockSize}px)`;
		boardGrid.style.gridTemplateRows = `repeat(${rowLength}, ${blockSize}px)`;
		boardGrid.style.transform = `translateZ(${blockSize / 2}px)`;

		const trayFaceBack = this.querySelector('.tray-face.back');
		trayFaceBack.style.transform = `translateZ(${-blockSize / 2}px)`;
		trayFaceBack.style.backgroundColor = colorSecondary;
	}
}

customElements.define('board-tray', BoardTray);
