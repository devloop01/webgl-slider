import { getMousePos } from "./index";

export default class Mouse {
	constructor() {
		this.position = {
			x: 0,
			y: 0,
		};
		this.isMoving = false;

		this.mouseEvent = {
			previous: null,
			current: null,
		};

		this.initEvents();
		this.updateMovingState();
	}
	initEvents() {
		window.addEventListener("mousemove", (ev) => {
			this.mouseEvent.current = ev;
			this.position = getMousePos(ev);
		});
	}
	updateMovingState() {
		setInterval(() => {
			if (this.mouseEvent.previous && this.mouseEvent.current) {
				const moveX = Math.abs(this.mouseEvent.current.screenX - this.mouseEvent.previous.screenX);
				const moveY = Math.abs(this.mouseEvent.current.screenY - this.mouseEvent.previous.screenY);
				const movement = Math.sqrt(moveX * moveX + moveY * moveY);

				if (movement == 0) this.isMoving = false;
				else this.isMoving = true;
			}

			this.mouseEvent.previous = this.mouseEvent.current;
		}, 100);
	}
}
