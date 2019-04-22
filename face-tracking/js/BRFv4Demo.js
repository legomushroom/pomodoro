//
// Namespace: brfv4Example structures these examples.
//

var brfv4Example = {

	appId: "com.tastenkunst.brfv4.js.examples", // Choose your own app id. 8 chars minimum.

	loader: { queuePreloader: null },	// preloading/example loading
	imageData: {						// image data source handling
		webcam: { stream: null },		// either webcam ...
		picture: {}						// ... or pictures/images
	},
	dom: {},							// html dom stuff
	gui: {},							// QuickSettings elements
	drawing: {},						// drawing the results using createJS
	drawing3d: {						// all 3D engine functions
		t3d: {}//,						// ThreeJS stuff
		//f3d: {}						// Flare3D stuff (coming later)
	},
	stats: {}							// fps meter
};

var brfv4BaseURL = "js/libs/brf_wasm/";

(function() {

	// detect WebAssembly support and load either WASM or ASM version of BRFv4
	var support	= (typeof WebAssembly === 'object');

	// if(support) {
	// 	// from https://github.com/brion/min-wasm-fail/blob/master/min-wasm-fail.js
	// 	function testSafariWebAssemblyBug() {
	// 		var bin = new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]);
	// 		var mod = new WebAssembly.Module(bin);
	// 		var inst = new WebAssembly.Instance(mod, {});

	// 		// test storing to and loading from a non-zero location via a parameter.
	// 		// Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations
	// 		return (inst.exports.test(4) !== 0);
	// 	}

	// 	if (!testSafariWebAssemblyBug()) {
	// 		support = false;
	// 	}
	// }

	if (!support) { brfv4BaseURL = "js/libs/brf_asmjs/"; }

	console.log("Checking support of WebAssembly: " + support + " " + (support ? "loading WASM (not ASM)." : "loading ASM (not WASM)."));

})();

//
// Namespace: brfv4 is the (mandatory) namespace for the BRFv4 library.
//

var brfv4 = {locateFile: function(fileName) { return brfv4BaseURL + fileName; }};

//
// Demo entry point: preloading js files.
//

brfv4Example.start = function() {

	brfv4Example.loader.preload([

		brfv4BaseURL + "BRFv4_JS_TK210219_v4.2.0_trial.js",						// BRFv4 SDK

		"js/libs/createjs/easeljs.min.js",						// canvas drawing lib

		"js/utils/BRFv4DOMUtils.js",							// DOM handling
		"js/utils/BRFv4Stats.js",								// FPS meter

		"js/utils/BRFv4DrawingUtils_CreateJS.js",				// BRF result drawing

		"js/utils/BRFv4SetupWebcam.js",							// webcam handling
		// "js/utils/BRFv4SetupPicture.js",						// picture/image handling
		"js/utils/BRFv4SetupExample.js",						// overall example setup

		"js/utils/BRFv4PointUtils.js",							// some calculation helpers

		"js/examples/face_tracking/track_single_face.js"		// start with this example

	], function() {
		brfv4Example.init("webcam");
	});
};

//
// Helper stuff: logging and loading
//

// Custom way to write to a log/error to console.

brfv4Example.trace = function(msg, error) {
	if(typeof window !== 'undefined' && window.console) {
		var now = (window.performance.now() / 1000).toFixed(3);
		if(error) {	window.console.error(now + ': ', msg); }
		else { window.console.log(now + ': ', msg); }
	}
};

// loading of javascript files:
//
// preload(filesToLoad, callback) // filesToLoad (array)
// loadExample(filesToLoad, callback) // filesToLoad (array)
// setProgressBar(percent, visible)

(function () {
	"use strict";

	var loader = brfv4Example.loader;

	loader.preload = function (filesToLoad, callback) {

		if (loader.queuePreloader !== null || !filesToLoad) {
			return;
		}

		var queue = loader.queuePreloader = new createjs.LoadQueue(true);
		queue.on("complete", callback);
		queue.loadManifest(filesToLoad, true);
	};
})();