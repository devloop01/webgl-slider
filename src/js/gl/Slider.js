import * as THREE from "three";
import gsap from "gsap";

import Gl from "./index";
import GlObject from "./GlObject";
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";

let mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
let mouseOver = false,
	mouseDown = false;

const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
const planeMaterial = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	side: THREE.DoubleSide,
	defines: {
		PI: Math.PI,
	},
});

export default class extends GlObject {
	init(el) {
		super.init(el);

		this.geometry = planeGeometry;
		this.material = planeMaterial.clone();

		this.material.uniforms = {
			uCurrTex: { value: 0 },
			uNextTex: { value: 0 },
			uTime: { value: 0 },
			uProg: { value: 0 },
			uAmplitude: { value: 0 },
			uProgDirection: { value: 0 },
			uMeshSize: { value: [this.rect.width, this.rect.height] },
			uImageSize: { value: [0, 0] },
			uMousePos: { value: [0, 0] },
			uMouseOverAmp: { value: 0 },
			uAnimating: { value: false },
			uRadius: { value: 0.08 },
			uTranslating: { value: true },
		};

		this.imageScale = 1;

		this.textures = [];

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.mouseLerpAmount = 0.1;

		this.state = {
			animating: false,
			current: 0,
		};

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.add(this.mesh);

		Gl.scene.add(this);

		this.loadTextures();
		this.addEvents();
	}

	loadTextures() {
		const manager = new THREE.LoadingManager(() => {
			this.material.uniforms.uCurrTex.value = this.textures[0];
		});
		const loader = new THREE.TextureLoader(manager);
		const imgs = [...this.el.querySelectorAll("img")];

		imgs.forEach((img) => {
			loader.load(img.src, (texture) => {
				texture.minFilter = THREE.LinearFilter;
				texture.generateMipmaps = false;

				this.material.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
				this.textures.push(texture);
			});
		});
	}

	switchTextures(index, direction) {
		if (this.state.animating) return;

		gsap.timeline({
			onStart: () => {
				this.state.animating = true;
				this.material.uniforms.uAnimating.value = true;
				this.material.uniforms.uProgDirection.value = direction;
				this.material.uniforms.uNextTex.value = this.textures[index];
			},
			onComplete: () => {
				this.state.animating = false;
				this.material.uniforms.uAnimating.value = false;
				this.material.uniforms.uCurrTex.value = this.textures[index];
				this.currentAmp = 0;
			},
		})
			.fromTo(
				this.material.uniforms.uProg,
				{
					value: 0,
				},
				{
					value: 1,
					duration: 1,
					ease: "ease.out",
				},
				0
			)
			.fromTo(
				this.material.uniforms.uAmplitude,
				{
					value: 0,
				},
				{
					duration: 0.8,
					value: 1,
					repeat: 1,
					yoyo: true,
					yoyoEase: "sine.out",
					ease: "expo.out",
				},
				0
			);
	}

	updateTime(time) {
		this.material.uniforms.uTime.value = time;
		this.run();
	}

	addEvents() {
		this.el.addEventListener("mouseenter", () => (mouseOver = true));
		this.el.addEventListener("mouseleave", () => (mouseOver = false));
		this.el.addEventListener("mousedown", () => (mouseDown = true));
		this.el.addEventListener("mouseup", () => (mouseDown = false));
	}

	scaleImage(direction) {
		const imageTl = gsap.timeline({
			defaults: {
				duration: 1.2,
				ease: "elastic.out(1, 1)",
				onUpdate: () => {
					this.resize();
				},
			},
		});
		if (direction == "up") {
			imageTl.to(this.el, {
				scale: window.innerHeight / 600,
			});
		} else if (direction == "down") {
			imageTl.to(this.el, {
				scale: 1,
			});
		}
	}

	run() {
		let m = mouseOver ? mouse : new THREE.Vector2(0, 0);
		this.mouse.lerp(m, this.mouseLerpAmount);

		this.raycaster.setFromCamera(this.mouse, Gl.camera);
		let intersects = this.raycaster.intersectObject(this.mesh);
		if (intersects.length > 0) {
			this.material.uniforms.uMousePos.value = [intersects[0].uv.x, intersects[0].uv.y];
		}

		if (mouseOver) {
			this.material.uniforms.uMouseOverAmp.value = THREE.MathUtils.lerp(this.material.uniforms.uMouseOverAmp.value, 1, 0.08);
			this.mouseLerpAmount = THREE.MathUtils.lerp(this.mouseLerpAmount, 0.1, 0.5);
		} else {
			this.material.uniforms.uMouseOverAmp.value = THREE.MathUtils.lerp(this.material.uniforms.uMouseOverAmp.value, 0, 0.08);
			this.mouseLerpAmount = THREE.MathUtils.lerp(this.mouseLerpAmount, 0, 0.5);
		}

		if (mouseOver && mouseDown) {
			this.material.uniforms.uRadius.value = THREE.MathUtils.lerp(this.material.uniforms.uRadius.value, 1, 0.01);
		} else if (mouseOver && !mouseDown) {
			this.material.uniforms.uRadius.value = THREE.MathUtils.lerp(this.material.uniforms.uRadius.value, 0.08, 0.08);
		}

		if (this.state.animating) {
			this.material.uniforms.uMouseOverAmp.value = THREE.MathUtils.lerp(this.material.uniforms.uMouseOverAmp.value, 0, 0.1);
		}
	}
}
