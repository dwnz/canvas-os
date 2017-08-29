function Kernel(bios) {
    var self = this;

    this.bios = bios;
    this.applications = [];
    this.windowManager = null;

    this.start = function () {
        this.bios.video.writeLine("Starting MyOS...");

        this.bios.video.onPaint = function () {
            if (self.windowManager) {
                self.windowManager.onPaint(self.bios);
            }
        };

        this.windowManager = new WindowManager(this);
        this.windowManager.start();
    };

    this.loadApplication = function (name) {

    };
}