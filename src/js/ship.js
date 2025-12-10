class Ship {
	#sunk;
	#placed;

	constructor(length) {
		this.hits = 0;
		this.length = length;
		this.#sunk = false;
		this.#placed = false;
	}

	hit() {
		if (this.hits === this.length) {
			throw new Error('ship is already destroyed, cannot hit again');
		}
		this.hits++;

		if (this.hits === this.length) {
			this.#sunk = true;
		}
	}

	place() {
		this.#placed = true;
	}

	isPlaced() {
		return this.#placed;
	}

	isSunk() {
		return this.#sunk;
	}
}

export { Ship };
