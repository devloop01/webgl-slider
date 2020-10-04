import { gsap } from "gsap";
import { lerp, Mouse } from "./utils";
import { Events } from "./events";

let mouse = new Mouse();

export default class Cursor {
	constructor(el) {
		this.DOM = { el: el };
		this.DOM.el.style.opacity = 0;

		this.bounds = this.DOM.el.getBoundingClientRect();

		this.renderedStyles = {
			tx: { previous: 0, current: 0, amt: 0.2 },
			ty: { previous: 0, current: 0, amt: 0.2 },
			scale: { previous: 0, current: 1, amt: 0.2 },
			opacity: { previous: 0, current: 1, amt: 0.15 },
		};
	}

	init() {
		this.onMouseMoveEv = () => {
			this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.position.x - this.bounds.width / 2;
			this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.position.y - this.bounds.height / 2;
			Events.on("tick", this.render.bind(this));
			window.removeEventListener("mousemove", this.onMouseMoveEv);
		};
		window.addEventListener("mousemove", this.onMouseMoveEv);
	}

	setTranslateLerpAmount(amount) {
		this.renderedStyles["tx"].amt = amount;
		this.renderedStyles["ty"].amt = amount;
		return this;
	}
	scale(amount = 1) {
		this.renderedStyles["scale"].current = amount;
		return this;
	}
	opaque(amount = 1) {
		this.renderedStyles["opacity"].current = amount;
		return this;
	}
	render() {
		this.renderedStyles["tx"].current = mouse.position.x - this.bounds.width / 2;
		this.renderedStyles["ty"].current = mouse.position.y - this.bounds.height / 2;

		for (const key in this.renderedStyles) {
			this.renderedStyles[key].previous = lerp(
				this.renderedStyles[key].previous,
				this.renderedStyles[key].current,
				this.renderedStyles[key].amt
			);
		}

		gsap.set(this.DOM.el, {
			translateX: this.renderedStyles["tx"].previous,
			translateY: this.renderedStyles["ty"].previous,
			scale: this.renderedStyles["scale"].previous,
			opacity: this.renderedStyles["opacity"].previous,
		});
	}
}
