'use strict'

const width = 512;
const height = 512;

var scale = 1;

const canvas = document.getElementsByTagName("canvas")[0];

function r() {
	var dw = document.body.clientWidth;
	var dh = document.body.clientHeight;

	let ww = width;
	let hh = height;
	if ((dw * hh) / (dh * ww) >= 1) {
		if(hh > dh) {
			do {
				hh /= 2;
				ww /= 2;
			} while(hh > dh);
			canvas.classList.remove("p");
			canvas.classList.add("s");
		} else {
			let scale = Math.floor(dh / hh);
			ww *= scale;
			hh *= scale;
			canvas.classList.remove("s");
			canvas.classList.add("p");
		}
	} else {
		if(ww > dw) {
			do {
				hh /= 2;
				ww /= 2;
			} while(ww > dw);
			canvas.classList.remove("p");
			canvas.classList.add("s");
		} else {
			let scale = Math.floor(dw / ww);
			ww *= scale;
			hh *= scale;
			canvas.classList.remove("s");
			canvas.classList.add("p");
		}
	}

	canvas.style.width  = Math.floor(ww) + "px";
	canvas.style.height = Math.floor(hh) + "px";
}

const ctx = canvas.getContext("2d");
var tk;
var img;

function animationLoop(timestamp) {
	tk(timestamp,0,0,0,0,0,1,0,0);
	ctx.putImageData(img, 0, 0);
	requestAnimationFrame(animationLoop);
}

fetch("demo.wasm").then(response => response.arrayBuffer()).then(bytes => {
  return WebAssembly.instantiate(bytes);
}).then(results => {
	var instance = results.instance;
	tk = instance.exports.t;
	var offset = instance.exports.p.value;
	let byteSize = width * height * 4;
	var usub = new Uint8ClampedArray(instance.exports.memory.buffer, offset, byteSize);
	instance.exports.i();
	img = new ImageData(usub, width, height);
	animationLoop(0);
});

r();