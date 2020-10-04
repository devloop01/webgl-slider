import { Splitter } from "./utils";

export default class Slideinfo {
	constructor(el) {
		this.DOM = { el: el };

		this.DOM.text = {
			index: this.DOM.el.querySelectorAll(".slide__index .char"),
			title: this.DOM.el.querySelectorAll(".slide__text--title .char"),
			description: this.DOM.el.querySelector(".slide__text--description"),
		};

		const split = new Splitter(this.DOM.text.description);

		const lines = [...split.linesEl.children].map((c) => [...c.children][0]);
		this.DOM.text.descriptionLines = lines;
	}
}
