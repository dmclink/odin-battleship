class EventEmitter {
	constructor() {
		this.events = {};
	}

	on(eventName, callback) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}

	off(eventName, callback) {
		if (this.events[eventName]) {
			this.events[eventName] = this.events[eventName].filter((listener) => listener !== callback);
		}
	}

	emit(eventName, ...data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach((callback) => {
				callback(...data);
			});
		}
	}
}

const em = new EventEmitter();

export { em };
