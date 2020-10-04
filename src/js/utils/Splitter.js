export default class Splitter {
	constructor(el) {
		this.DOM = { el };
		this.DOMElComputedStyles = getComputedStyle(this.DOM.el);

		this.init();
	}

	init() {
		const lines = this.split();
		this.clearElement();
		this.insertLines(lines);
	}

	split() {
		const maxwidth = this.DOM.el.getBoundingClientRect().width;
		const textContent = this.DOM.el.innerText;
		const words = textContent.split(" ");

		const lines = [];
		let curline = [];

		const fontWeight = this.DOMElComputedStyles["font-weight"];
		const fontSize = this.DOMElComputedStyles["font-size"];
		const fontFamily = this.DOMElComputedStyles["font-family"];

		const canvasEl = document.createElement("canvas");
		const ghost = "OffscreenCanvas" in window ? canvasEl.transferControlToOffscreen() : canvasEl;
		const context = ghost.getContext("2d");

		context.font = `${fontWeight} ${fontSize} ${fontFamily}`;

		for (let i = 0; i < words.length; i++) {
			curline.push(words[i]);
			if (context.measureText(curline.join(" ")).width >= maxwidth) {
				const cache = curline.pop();
				lines.push(curline.join(" "));
				curline = [cache];
			}
		}
		lines.push(curline.join(" "));
		return lines;
	}

	insertLines(lines) {
		this.linesEl = document.createElement("span");
		this.linesEl.className = "lines";
		this.linesEl.style.display = "block";

		lines.forEach((line) => {
			const lineEl = document.createElement("span");
			const lineInnerTextEl = document.createElement("span");

			lineEl.className = "line";
			lineInnerTextEl.className = "line--innertext";

			lineEl.style.display = "block";
			lineInnerTextEl.style.display = "block";

			lineInnerTextEl.innerText = line;

			lineEl.appendChild(lineInnerTextEl);
			this.linesEl.appendChild(lineEl);
		});

		this.DOM.el.appendChild(this.linesEl);
	}

	clearElement() {
		this.DOM.el.innerHTML = "";
	}
}
