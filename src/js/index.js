import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "../css/index.scss";

import Splitting from "splitting";
import gsap from "gsap";

import Slideshow from "./Slideshow";
import Cursors from "./Cursors";
import { preloadImages } from "./utils";

Splitting();

const bgColors = ["#27172e", "#1f1322", "#454d53", "#2d1f2d"];

const masterTl = gsap.timeline();

preloadImages(document.querySelectorAll(".slider__image")).then(() => {
	const slider = new Slideshow(document.querySelector(".slider"));
	slider.init();

	const loadedAnimationTl = gsap
		.timeline({
			onStart: () => {
				gsap.set(".text__row .text", { autoAlpha: 1 });
			},
		})
		.to(".loading__text", {
			duration: 1,
			opacity: 0,
		})
		.from(".text__row .text", {
			duration: 3,
			translateY: (i) => -100 + i * -25 + "%",
			ease: "expo.out",
			stagger: 0.1,
		})
		.to(".text__row .text", {
			duration: 2,
			translateY: (i) => 100 + i * 25 + "%",
			ease: "expo.in",
			stagger: 0.25,
		})
		.to(".bg__transition--slide", {
			duration: 1,
			scaleY: 0,
			transformOrigin: "top center",
			ease: "expo.out",
			onComplete: () => {
				slider.initAnimation();
				gsap.set(".loading__wrapper", {
					pointerEvents: "none",
					autoAlpha: 0,
				});
			},
		});

	const pageAnimationTl = gsap
		.timeline({
			delay: loadedAnimationTl.duration(),
			onComplete: () => {
				Cursors.init();
				Cursors.initEventsOnSlider(slider);
			},
		})
		.from([".frame__logo", ".frame__button", ".frame__artist > span", ".frame__credits > span"], {
			duration: 1,
			opacity: 0,
			yPercent: 100,
			stagger: 0.1,
			ease: "expo.out",
		});

	masterTl.add(loadedAnimationTl, 0);
	masterTl.add(pageAnimationTl, pageAnimationTl.duration() - 0.5);

	slider.onSlideChange((currentSlideIndex) => {
		gsap.to("body", {
			duration: 1.2,
			backgroundColor: bgColors[currentSlideIndex],
		});
	});
});
