const text = `
<template id="board-tray-template">
  <style>
    .tray {
      position: absolute;
      width: var(--tray-size);
      height: var(--tray-size);
      transform-style: preserve-3d;
    }

    .tray > * {
      position: absolute;
    }

    .tray-face-container {
      transform-style: preserve-3d;
      width: var(--tray-size);
      height: var(--tray-size);
      padding: var(--tray-depth);
    }

    .tray-face {
      width: calc(var(--tray-size) - var(--tray-depth) * 2);
      height: calc(var(--tray-size) - var(--tray-depth) * 2);
      &.front {
        transform: translateZ(var(--tray-depth));
      }
      background-color: #2222aa;
    }

    .tray-face.front {
      background-color: transparent;
    }

    .tray-rim-edge {
      position: absolute;
      background-color: #4468ea;
      box-shadow: 0 0 5px inset black;
    }

    .tray-rim {
      --mid: calc(var(--tray-depth) / 2);
      height: 100%;
      width: var(--tray-depth);
      transform-style: preserve-3d;

      &.right {
        right: 0;
      }
      &.top {
        transform-origin: 50% calc(100% - var(--mid));
        transform: rotateZ(90deg);
      }
      &.bottom {
        transform-origin: 50% calc(0% + var(--mid));
        transform: rotateZ(-90deg);
      }
    }

    .tray-rim-edge {
      height: 100%;
      width: 100%;
      &.left {
        transform: translateZ(var(--mid)) rotateY(90deg) translateZ(var(--mid));
      }
      &.right {
        transform: translateZ(var(--mid)) rotateY(90deg) translateZ(calc(-1 * var(--mid)));
      }
      &.top {
        transform: translateZ(var(--tray-depth));
      }
    }
    slot {
      transform-style: preserve-3d;
    }
  </style>
  <div class="tray">
    <div class="tray-face-container back">
      <div class="tray-face"></div>
    </div>
    <div class="tray-face-container front">
      <div class="tray-face front"></div>
    </div>
    <div class="tray-rim left">
      <div class="tray-rim-edge left"></div>
      <div class="tray-rim-edge right"></div>
      <div class="tray-rim-edge top"></div>
    </div>
    <div class="tray-rim right">
      <div class="tray-rim-edge left"></div>
      <div class="tray-rim-edge right"></div>
      <div class="tray-rim-edge top"></div>
    </div>
    <div class="tray-rim top">
      <div class="tray-rim-edge left"></div>
      <div class="tray-rim-edge right"></div>
      <div class="tray-rim-edge top"></div>
    </div>
    <div class="tray-rim bottom">
      <div class="tray-rim-edge left"></div>
      <div class="tray-rim-edge right"></div>
      <div class="tray-rim-edge top"></div>
    </div>
  </div>
</template>
`;

export default class BoardTray extends HTMLElement {
	constructor() {
		super();
		// const shadowRoot = this.attachShadow({ mode: 'open' });

		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = text;

		const template = tempContainer.querySelector('#board-tray-template');
		const templateContent = template.content;

		// shadowRoot.appendChild(templateContent.cloneNode(true));
		this.appendChild(templateContent.cloneNode(true));
	}
}

customElements.define('board-tray', BoardTray);
