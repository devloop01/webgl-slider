import gsap from "gsap";

import GlSlider from "./gl/Slider";
import Slideinfo from "./Slideinfo";

let clicked = false;

export default class Slideshow {
	constructor(el) {
		this.DOM = { el };
		this.DOM.imageWrapperEl = this.DOM.el.querySelector(".slider__image--wrapper");
		this.DOM.navigation = {
			prev: this.DOM.el.querySelector(".slider__nav--prev"),
			next: this.DOM.el.querySelector(".slider__nav--next"),
		};
		this.slideInfos = [];
		[...this.DOM.el.querySelectorAll(".slider__silde-info")].forEach((slide) => this.slideInfos.push(new Slideinfo(slide)));
		this.current = 0;
		this.slidesTotal = this.slideInfos.length;

		this.GlSlider = new GlSlider();
		this.GlSlider.init(document.querySelector(".slider__image--wrapper"));

		this.initEvents();
	}

	init() {
		const currentSlideInfo = this.slideInfos[this.current];

		gsap.set([currentSlideInfo.DOM.text.index, currentSlideInfo.DOM.text.title], {
			yPercent: 120,
			rotation: -3,
			stagger: -0.02,
		});
		gsap.set(currentSlideInfo.DOM.text.descriptionLines, {
			yPercent: 100,
			stagger: 0.05,
		});
		gsap.set(this.DOM.navigation.prev, {
			translateX: 100,
			opacity: 0,
		});
		gsap.set(this.DOM.navigation.next, {
			translateX: -100,
			opacity: 0,
		});

		gsap.set(this.DOM.imageWrapperEl, {
			translateY: "150%",
			onUpdate: () => {
				this.GlSlider.setBounds();
			},
		});
	}

	initAnimation() {
		const currentSlideInfo = this.slideInfos[this.current];

		const tl = gsap
			.timeline({
				defaults: { duration: 1, ease: "power4.inOut" },
				delay: 0.25,
			})
			.addLabel("start", 0)
			.addLabel("upcoming", 1.25);
		tl.to(
			this.DOM.imageWrapperEl,
			{
				duration: 1.25,
				translateY: 0,
				ease: "sine.out",
				onUpdate: () => {
					this.GlSlider.setBounds();
				},
			},
			"start"
		)
			.to(
				this.GlSlider.material.uniforms.uAmplitude,
				{
					duration: 1,
					value: 1,
					repeat: 1,
					yoyo: true,
					yoyoEase: "sine.out",
					ease: "expo.out",
					onComplete: () => {
						this.GlSlider.material.uniforms.uTranslating = false;
					},
				},
				"start"
			)
			.to(
				[currentSlideInfo.DOM.text.index, currentSlideInfo.DOM.text.title],
				{
					yPercent: 0,
					rotation: 0,
					stagger: -0.02,
				},
				"upcoming"
			)
			.to(
				currentSlideInfo.DOM.text.descriptionLines,
				{
					yPercent: 0,
					stagger: 0.05,
				},
				"upcoming"
			)
			.to(
				[this.DOM.navigation.prev, this.DOM.navigation.next],
				{
					translateX: 0,
					opacity: 1,
				},
				"upcoming"
			);
	}

	initEvents() {
		this.onClickPrevEv = () => this.navigate("prev");
		this.onClickNextEv = () => this.navigate("next");
		this.onImageClickEv = () => {
			if (this.isAnimating) return;

			clicked = !clicked;

			const currentSlideInfo = this.slideInfos[this.current];

			const tl = gsap
				.timeline({
					defaults: { duration: 1, ease: "power4.inOut" },
					onStart: () => {
						console.log("start");
						this.isAnimating = true;
						if (clicked) {
							this.GlSlider.scaleImage("up");
							if (this.onFullscreenCallbackFn) this.onFullscreenCallbackFn();
						} else {
							this.GlSlider.scaleImage("down");
							if (this.offFullscreenCallbackFn) this.offFullscreenCallbackFn();
						}
					},
					onComplete: () => {
						this.isAnimating = false;
						console.log("complete");
					},
				})
				.addLabel("start", clicked ? 0 : 0.2);

			tl.fromTo(
				[currentSlideInfo.DOM.text.index, currentSlideInfo.DOM.text.title],
				{
					yPercent: clicked ? 0 : 120,
					rotation: clicked ? 0 : -3,
				},
				{
					yPercent: clicked ? -120 : 0,
					rotation: clicked ? 3 : 0,
					stagger: clicked ? 0.02 : -0.02,
				},
				"start"
			)
				.fromTo(
					currentSlideInfo.DOM.text.descriptionLines,
					{
						yPercent: clicked ? 0 : 100,
					},
					{
						yPercent: clicked ? -100 : 0,
						stagger: 0.05,
					},
					"start"
				)
				.fromTo(
					this.DOM.navigation.prev,
					{
						translateX: clicked ? 0 : 100,
						opacity: clicked ? 1 : 0,
					},
					{
						translateX: clicked ? -100 : 0,
						opacity: clicked ? 0 : 1,
					},
					"start"
				)
				.fromTo(
					this.DOM.navigation.next,
					{
						translateX: clicked ? 0 : -100,
						opacity: clicked ? 1 : 0,
					},
					{
						translateX: clicked ? 100 : 0,
						opacity: clicked ? 0 : 1,
					},
					"start"
				)
				.set([this.DOM.navigation.prev, this.DOM.navigation.next], { pointerEvents: clicked ? "none" : "auto" });
		};

		this.DOM.navigation.prev.addEventListener("click", () => this.onClickPrevEv());
		this.DOM.navigation.next.addEventListener("click", () => this.onClickNextEv());
		this.DOM.imageWrapperEl.addEventListener("click", () => this.onImageClickEv());
	}

	onSlideChange(callback) {
		if (typeof callback == "function") {
			this.onSlideChangeCallbackFn = callback;
		}
	}

	onFullscreen(callback) {
		if (typeof callback == "function") {
			this.onFullscreenCallbackFn = callback;
		}
	}

	offFullscreen(callback) {
		if (typeof callback == "function") {
			this.offFullscreenCallbackFn = callback;
		}
	}

	navigate(direction) {
		if (this.GlSlider.state.animating) return;

		const incrementSlideIndex = (val) => {
			if (val > 0 && this.current + val < this.slidesTotal) {
				this.current += val;
			} else if (val > 0) {
				this.current = 0;
			} else if (val < 0 && this.current + val < 0) {
				this.current = this.slidesTotal - 1;
			} else {
				this.current += val;
			}
		};

		const increment = direction == "prev" ? -1 : 1;

		const currentSlideInfo = this.slideInfos[this.current];
		incrementSlideIndex(increment);
		const nextSlideInfo = this.slideInfos[this.current];

		this.GlSlider.switchTextures(this.current, increment);

		gsap.timeline({
			defaults: { duration: 1, ease: "power4.inOut" },
			onStart: () => {
				this.GlSlider.switchTextures(this.current, increment);
				if (this.onSlideChangeCallbackFn) this.onSlideChangeCallbackFn(this.current);
				this.isAnimating = true;
			},
			onComplete: () => {
				currentSlideInfo.DOM.el.classList.remove("slide--current");
				this.isAnimating = false;
			},
		})
			.addLabel("start", 0)
			.to(
				[currentSlideInfo.DOM.text.index, currentSlideInfo.DOM.text.title],
				{
					yPercent: direction === "next" ? -120 : 120,
					rotation: direction === "next" ? 3 : -3,
					stagger: direction === "next" ? 0.02 : -0.02,
				},
				"start"
			)
			.to(
				currentSlideInfo.DOM.text.descriptionLines,
				{
					yPercent: direction === "next" ? -100 : 100,
					stagger: direction === "next" ? 0.05 : -0.05,
				},
				"start"
			)
			.addLabel("upcoming", 0.4)
			.add(() => {
				gsap.set([nextSlideInfo.DOM.text.index, nextSlideInfo.DOM.text.title], {
					yPercent: direction === "next" ? 120 : -120,
					rotation: direction === "next" ? -3 : 3,
				});
				gsap.set(nextSlideInfo.DOM.text.descriptionLines, {
					yPercent: direction === "next" ? 100 : -100,
				});
				nextSlideInfo.DOM.el.classList.add("slide--current");
			}, "upcoming")
			.to(
				[nextSlideInfo.DOM.text.index, nextSlideInfo.DOM.text.title],
				{
					yPercent: 0,
					rotation: 0,
					stagger: direction === "next" ? 0.02 : -0.02,
				},
				"upcoming"
			)
			.to(
				nextSlideInfo.DOM.text.descriptionLines,
				{
					yPercent: 0,
					stagger: direction === "next" ? 0.05 : -0.05,
				},
				"upcoming"
			);
	}
}
