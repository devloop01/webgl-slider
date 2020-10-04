import * as THREE from "three";
import gsap from "gsap";
import { Events } from "../events";

export default new (class {
	constructor() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
		this.camera.position.z = 50;

		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		this.renderer.setPixelRatio(gsap.utils.clamp(1.5, 1, window.devicePixelRatio));
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xf2f2f2, 0);

		this.clock = new THREE.Clock();

		this.init();
	}

	init() {
		this.addToDom();
		this.addEvents();
		this.run();
	}

	addToDom() {
		const canvas = this.renderer.domElement;
		canvas.classList.add("dom-gl");
		document.body.appendChild(canvas);
	}

	addEvents() {
		Events.on("resize", this.resize.bind(this));
		Events.on("tick", this.run.bind(this));
	}

	resize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.updateProjectionMatrix();

		for (let i = 0; i < this.scene.children.length; i++) {
			const plane = this.scene.children[i];
			if (plane.resize) plane.resize();
		}
	}

	run() {
		let elapsed = this.clock.getElapsedTime();

		for (let i = 0; i < this.scene.children.length; i++) {
			const plane = this.scene.children[i];
			if (plane.updateTime) plane.updateTime(elapsed);
		}

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}
})();
