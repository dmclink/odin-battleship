class Ship {
	constructor(length) {
		this.hits = 0;
		this.length = length;
	}

	hit() {
		if (this.hits === this.length) {
			throw new Error('ship is already destroyed, cannot hit again');
		}
		this.hits++;
	}
}

export { Ship };
