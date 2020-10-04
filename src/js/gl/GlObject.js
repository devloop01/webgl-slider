import * as THREE from "three";
import Gl from "./index";
import gsap from "gsap";

export default class extends THREE.Object3D {
	init(el) {
		this.el = el;
		this.resize();
	}

	resize() {
		this.setBounds();
	}

	setBounds() {
		this.rect = this.el.getBoundingClientRect();

		this.bounds = {
			left: this.rect.left,
			top: this.rect.top + window.scrollY,
			width: this.rect.width,
			height: this.rect.height,
		};

		this.updateSize();
		this.updatePosition();
	}

	updateSize() {
		this.camUnit = this.calculateUnitSize(Gl.camera.position.z - this.position.z);

		const x = this.bounds.width / window.innerWidth;
		const y = this.bounds.height / window.innerHeight;

		if (!x || !y) return;

		this.scale.x = this.camUnit.width * x;
		this.scale.y = this.camUnit.height * y;
	}

	calculateUnitSize(distance = this.position.z) {
		const vFov = (Gl.camera.fov * Math.PI) / 180;
		const height = 2 * Math.tan(vFov / 2) * distance;
		const width = height * Gl.camera.aspect;

		return { width, height };
	}

	updateY(y = 0) {
		const { top, height } = this.bounds;

		this.position.y = this.camUnit.height / 2 - this.scale.y / 2;
		this.position.y -= ((top - y) / window.innerHeight) * this.camUnit.height;

		this.progress = gsap.utils.clamp(0, 1, 1 - (-y + top + height) / (window.innerHeight + height));
	}

	updateX(x = 0) {
		const { left } = this.bounds;

		this.position.x = -(this.camUnit.width / 2) + this.scale.x / 2;
		this.position.x += ((left + x) / window.innerWidth) * this.camUnit.width;
	}

	updatePosition(y) {
		this.updateY(y);
		this.updateX(0);
	}
}
