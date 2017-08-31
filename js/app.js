// BOOTSTRAP
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

var canvas = document.getElementById('myos');

var windowHeight = window.innerHeight;
var windowWidth = window.innerWidth;

canvas.width = windowWidth * PIXEL_RATIO;
canvas.height = windowHeight * PIXEL_RATIO;
canvas.style.width = windowWidth + "px";
canvas.style.height = windowHeight + "px";

var ctx = canvas.getContext("2d");

ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, windowWidth, windowHeight);

// Setup raw output
var basicOutput = new RawVideoOutput(ctx);
basicOutput.writeLine("Setting screen pixel ratio to: " + PIXEL_RATIO);

// Start "BIOS"
var bios = new BIOS(basicOutput);
var kernel;

bios.findHardware(function () {
    kernel = new Kernel(bios, true);
    kernel.start();
});


function GET_CANVAS(width, height) {
    // BOOTSTRAP
    var PIXEL_RATIO = (function () {
        var ctx = document.createElement("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    })();

    var canvas = document.createElement('canvas');

    canvas.width = width * PIXEL_RATIO;
    canvas.height = height * PIXEL_RATIO;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    return canvas;
}