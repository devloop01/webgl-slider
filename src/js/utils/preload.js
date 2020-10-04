import imagesLoaded from "imagesloaded";

export function preloadImages(selector) {
	return new Promise((resolve, reject) => {
		imagesLoaded(selector, { background: true }, resolve);
	});
}
