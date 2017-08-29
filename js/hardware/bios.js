function BIOS(rawVideoOutput) {
    this.video = rawVideoOutput;
    this.mouse = null;

    this.findHardware = function (callback) {
        rawVideoOutput.writeLine("Trying to find hardware...");

        this.mouse = new Mouse(this.video);
        this.mouse.start();

        callback();
    };
}