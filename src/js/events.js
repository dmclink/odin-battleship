const Events = Object.freeze({
	PHASE_CHANGE: 'phaseChange',
	RECEIVED_ATTACK_HIT: 'receivedAttackHit',
	RECEIVED_ATTACK_MISS: 'receivedAttackMiss',
	ATTACK: 'attack',
	GAME_OVER: 'gameOver',
	SELECT_GAME_TYPE: 'selectGameType',
	GAME_START: 'gameStart',
	TRY_PLACE_SHIP: 'tryPlaceShip',
	PLACE_SHIP_SUCCESS: 'placeShipSuccess',
	PLACE_SHIP_FAIL: 'placeShipFail',
	PLAYER0_READY: 'player0Ready',
	PLAYER1_READY: 'player1Ready',
});

export { Events };
