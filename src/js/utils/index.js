import Splitter from "./Splitter";
import Mouse from "./Mouse";
import { preloadImages } from "./preload";

const lerp = (a, b, n) => (1 - n) * a + n * b;

const getMousePos = (e) => {
	let posx = 0;
	let posy = 0;
	if (!e) e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
	}

	return { x: posx, y: posy };
};

export { lerp, getMousePos, Splitter, Mouse, preloadImages };
