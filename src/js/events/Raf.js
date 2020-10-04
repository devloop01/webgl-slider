import gsap from "gsap";
import Events from "./Events";

class Raf {
	constructor() {
		this.init();
	}

	tick() {
		Events.emit("tick");
	}

	on() {
		gsap.ticker.add(this.tick.bind(this));
	}

	init() {
		this.on();
	}
}

export default new Raf();
