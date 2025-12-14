import { em } from './eventemitter.js';
import { jest } from '@jest/globals';
import { Events } from './events.js';

describe('EventEmitter', () => {
	it('on', () => {
		const mockListener1 = jest.fn();
		const mockListener2 = jest.fn();
		em.on(Events.PHASE_CHANGE, mockListener1);
		em.on(Events.PHASE_CHANGE, mockListener2);
		em.emit(Events.PHASE_CHANGE);
		expect(mockListener1).toHaveBeenCalledTimes(1);
		expect(mockListener2).toHaveBeenCalledTimes(1);
	});

	it('off', () => {
		const mockListener = jest.fn();
		em.on(Events.PHASE_CHANGE, mockListener);
		em.off(Events.PHASE_CHANGE, mockListener);
		em.emit(Events.PHASE_CHANGE);
		expect(mockListener).toHaveBeenCalledTimes(0);
	});

	it('doesnt throw when calling off on unset event', () => {
		const mockListener = jest.fn();
		const emitPhaseChange = () => em.off(Events.PHASE_CHANGE, mockListener);

		expect(emitPhaseChange).not.toThrow();
		em.emit(Events.PHASE_CHANGE);
		expect(mockListener).toHaveBeenCalledTimes(0);
	});

	it('doesnt call unset events', () => {
		const emitPhaseChange = () => em.emit(Events.PHASE_CHANGE);
		const mockListener = jest.fn();
		expect(emitPhaseChange).not.toThrow();
		expect(mockListener).toHaveBeenCalledTimes(0);
	});
});
