class Loc {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equal(loc2) {
		return this.x === loc2.x && this.y === loc2.y;
	}

	moveLoc(dX, dY) {
		return new Loc(this.x + dX, this.y + dY);
	}

	isOOB(xBound, yBound) {
		return this.x < 0 || this.y < 0 || this.x > xBound || this.y > yBound;
	}

	copy() {
		return new Loc(this.x, this.y);
	}
}

export { Loc };
