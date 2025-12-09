class Ship {
	#sunk;

	constructor(length) {
		this.hits = 0;
		this.length = length;
		this.#sunk = false;
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

	isSunk() {
		return this.#sunk;
	}
}

export { Ship };
