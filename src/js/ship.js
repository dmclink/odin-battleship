class Ship {
	#sunk;
	#placed;
	#hits;
	#length;
	#name;

	constructor(length, name) {
		this.#hits = 0;
		this.#length = length;
		this.#sunk = false;
		this.#placed = false;
		this.#name = name;
	}

	name() {
		return this.#name;
	}

	hit() {
		if (this.#hits === this.#length) {
			throw new Error('ship is already destroyed, cannot hit again');
		}
		this.#hits++;

		if (this.#hits === this.#length) {
			this.#sunk = true;
		}
	}

	hits() {
		return this.#hits;
	}

	length() {
		return this.#length;
	}

	place() {
		this.#placed = true;
	}

	unplace() {
		this.#placed = false;
	}

	isPlaced() {
		return this.#placed;
	}

	isSunk() {
		return this.#sunk;
	}

	string() {
		return JSON.stringify({ name: this.#name, placed: this.#placed, hits: this.#hits });
	}
}

export { Ship };
