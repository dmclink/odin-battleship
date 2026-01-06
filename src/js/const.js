const Ships = Object.freeze({
	CARRIER: { name: 'carrier', size: 5 },
	BATTLESHIP: { name: 'battleship', size: 4 },
	CRUISER: { name: 'cruiser', size: 3 },
	SUBMARINE: { name: 'submarine', size: 3 },
	DESTROYER: { name: 'destroyer', size: 2 },
});

const GameTypes = Object.freeze({
	PLAYER: 0,
	COMPUTER: 1,
});

export { Ships, GameTypes };
