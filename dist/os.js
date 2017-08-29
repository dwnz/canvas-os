;// BOOTSTRAP
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
bios.findHardware(function () {
    var kernel = new Kernel(bios);
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
};;;;;function BIOS(rawVideoOutput) {
    this.video = rawVideoOutput;
    this.mouse = null;

    this.findHardware = function (callback) {
        rawVideoOutput.writeLine("Trying to find hardware...");

        this.mouse = new Mouse(this.video);
        this.mouse.start();

        callback();
    };
};function Mouse(rawVideo) {
    var image = new Image();
    image.src = '/img/cursor.png';
    image.repaint = function () {

    };

    var downState = new Image();
    downState.src = '/img/cursor-down.png';

    var cursor = document.createElement('canvas');
    cursor.width = 32;
    cursor.height = 32;

    var beginPosition;

    var displayObject = new DisplayObject(image, 0, 0, 16, 16, 99999);

    this.start = function () {
        rawVideo.writeLine("Found mouse - 0,0");
        rawVideo.writeLine("Creating cursor...");

        displayObject.title = "CURSOR";
        rawVideo.addObject(displayObject);

        document.addEventListener('mousemove', this.onmousemove);
        document.addEventListener('mousedown', this.onmousedown);
        document.addEventListener('click', this.onclick);
        document.addEventListener('mouseup', this.onmouseup);

        rawVideo.writeLine("Cursor ready");
    };

    this.onmousemove = function (e) {
        displayObject.x = e.x;
        displayObject.y = e.y;

        var clickEvent = new Event('myMOUSEMOVE');
        clickEvent.x = e.x;
        clickEvent.y = e.y;
        window.dispatchEvent(clickEvent);
    };

    this.onmousedown = function (e) {
        displayObject.element = downState;

        var clickEvent = new Event('myMOUSEDOWN');
        clickEvent.x = e.x;
        clickEvent.y = e.y;
        window.dispatchEvent(clickEvent);
    };

    this.onmouseup = function (e) {
        displayObject.element = image;

        var clickEvent = new Event('myMOUSEUP');
        clickEvent.x = e.x;
        clickEvent.y = e.y;
        window.dispatchEvent(clickEvent);
    };

    this.onclick = function (e) {
        var clickEvent = new Event('myCLICK');
        clickEvent.x = e.x;
        clickEvent.y = e.y;
        window.dispatchEvent(clickEvent);
    }
};function RawVideoOutput(ctx) {
    var self = this;

    var buffer = [];
    var displayObjects = [];

    this.writeLine = function (message) {
        buffer.push(message);
    };

    this.addObject = function (object) {
        if (!object.zindex) {
            object.zindex = displayObjects.length + 1;
        }

        object.id = new Date().getTime();

        displayObjects.push(object);
    };

    this.updateDisplayObject = function (displayObject) {
        for (var i = 0; i < displayObjects.length; i++) {
            if (displayObject.id === displayObjects[i].id) {
                displayObjects[i] = displayObject;
                return;
            }
        }
    };

    function paint() {
        ctx.clearRect(0, 0, windowWidth, windowHeight);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, windowWidth, windowHeight);

        ctx.fillStyle = 'white';

        for (var i = 0; i < buffer.length; i++) {
            ctx.fillText(buffer[i], 10, 20 * (i + 1), 800);
        }

        if (self.onPaint) {
            self.onPaint();
        }

        var sortedItems = displayObjects.sort(function (item, item2) {
            return item.zindex > item2.zindex;
        });

        for (var i = 0; i < sortedItems.length; i++) {
            ctx.drawImage(sortedItems[i].element, sortedItems[i].x, sortedItems[i].y, sortedItems[i].width, sortedItems[i].height);
        }

        requestAnimationFrame(paint);
    }

    requestAnimationFrame(paint);
}

function DisplayObject(element, x, y, w, h, zindex) {
    this.element = element;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.zindex = zindex;
};function Kernel(bios) {
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
};;function Element(id) {
}

function Button(id, text, onClick, x, y) {
    this.id = id;
    this.text = text;
    this.onClick = onClick;
    this.position = new Position(x, y, 250, 60);
    this.canvas = null;

    this.paint = function () {
        var canvas = GET_CANVAS(this.position.width, this.position.height);
        var ctx = canvas.getContext('2d');
        ctx.width = this.position.width;
        ctx.height = this.position.height;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.position.width, this.position.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.position.width / 2, this.position.height - 20, this.position.width);

        return canvas;
    }
}

Button.prototype = new Element();

function Position(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}
;function WindowManager(kernel) {
    var self = this;

    this.kernel = kernel;
    this.managedWindows = [];
    this.activeWindow = null;
    this.applyToActiveWindow = false;

    this.start = function () {
        var newWindow = this.requestWindow(100, 100, 800, 600);
        newWindow.title = 'Desktop';
        newWindow.elements.push(new Button("btn1", "Button", null, 100, 100));

        var textEdit = this.requestWindow(400, 400, 200, 500);
        textEdit.title = "Text Edit";

        window.addEventListener('myCLICK', this.onClick);
        window.addEventListener('myMOUSEDOWN', this.onMouseDown);
        window.addEventListener('myMOUSEUP', this.onMouseUp);
        window.addEventListener('myMOUSEMOVE', this.onMouseMove);
    };

    this.requestWindow = function (x, y, w, h) {
        var myWindow = new MyWindow(this, x, y, w, h);
        myWindow.zindex = this.managedWindows.length;

        this.managedWindows.push(myWindow);
        self.kernel.bios.video.addObject(myWindow.getDisplayObject());

        if (this.activeWindow) {
            this.activeWindow.isActive = false;
        }

        this.activeWindow = myWindow;

        return myWindow;
    };

    this.onPaint = function (bios) {
        for (var i = 0; i < self.managedWindows.length; i++) {
            bios.video.updateDisplayObject(self.managedWindows[i].getDisplayObject());
            self.managedWindows[i].repaint();
        }
    };

    this.onClick = function (e) {
        var findWindowsInClickZone = self.managedWindows.filter(function (w) {
            return e.x >= w.x && e.x <= (w.x + w.width)
                &&
                e.y >= w.y && e.y <= (w.y + w.height)

        });

        var sortedWindows = findWindowsInClickZone
            .sort(function (w, w1) {
                return w.zindex < w1.zindex;
            });

        if (sortedWindows[0]) {
            if (sortedWindows[0].id !== self.activeWindow.id) {
                for (var i = self.managedWindows.length - 1; i >= 0; i--) {
                    console.log("Moving", self.managedWindows[i].title, "back to", self.managedWindows[i].zindex);
                    self.managedWindows[i].zindex = i;
                    self.managedWindows[i].displayObject.zindex = i;
                }

                self.activeWindow.isActive = false;
                self.activeWindow = sortedWindows[0];
                self.activeWindow.zindex = self.managedWindows.length + 1;
                self.activeWindow.displayObject.zindex = self.managedWindows.length + 1;
                self.activeWindow.isActive = true;
            }

            sortedWindows[0].windowClick(e);
        }
    };

    this.onMouseDown = function (e) {
        var findWindowsInClickZone = self.managedWindows.filter(function (w) {
            return e.x >= w.x && e.x <= (w.x + w.width)
                &&
                e.y >= w.y && e.y <= (w.y + w.height)

        }).sort(function (w, w1) {
            return w.zindex < w1.zindex;
        });

        if (findWindowsInClickZone[0]) {
            findWindowsInClickZone[0].onMouseDown(e);
        }
    };

    this.onMouseUp = function (e) {
        var findWindowsInClickZone = self.managedWindows.filter(function (w) {
            return e.x >= w.x && e.x <= (w.x + w.width)
                &&
                e.y >= w.y && e.y <= (w.y + w.height)

        }).sort(function (w, w1) {
            return w.zindex < w1.zindex;
        });

        if (findWindowsInClickZone[0]) {
            findWindowsInClickZone[0].onMouseUp(e);
        }
    };

    this.onMouseMove = function (e) {
        if (self.applyToActiveWindow) {
            return self.activeWindow.onMouseMove(e);
        }

        var findWindowsInClickZone = self.managedWindows.filter(function (w) {
            return e.x >= w.x && e.x <= (w.x + w.width)
                &&
                e.y >= w.y && e.y <= (w.y + w.height)

        }).sort(function (w, w1) {
            return w.zindex < w1.zindex;
        });

        if (findWindowsInClickZone[0]) {
            findWindowsInClickZone[0].onMouseMove(e);
        }
    }
}

function MyWindow(manager, x, y, w, h) {
    var self = this;

    this.width = w || 800;
    this.height = h || 600;

    this.x = x || 100;
    this.y = y || 100;

    this.zindex = 1;

    this.title = 'Window';
    this.hasTitle = true;
    this.id = new Date().getTime();
    this.isActive = true;

    this.elements = [];

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * PIXEL_RATIO;
    this.canvas.height = this.height * PIXEL_RATIO;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";

    this.context = this.canvas.getContext('2d');
    this.context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    this.displayObject = new DisplayObject(this.canvas, this.x, this.y, this.width, this.height, this.zindex);

    this.getDisplayObject = function () {
        return this.displayObject;
    };

    this.repaint = function () {
        self.context.fillStyle = "white";
        self.context.fillRect(0, 0, this.width, this.height);

        self.context.fillStyle = "yellow";
        self.context.fillRect(0, 0, 5, self.height);
        self.context.fillRect(self.width - 5, 0, 5, self.height);
        self.context.fillRect(0, self.height - 5, this.width, 5);

        if (this.hasTitle) {
            self.context.fillStyle = self.isActive ? "blue" : 'darkblue';
            self.context.fillRect(0, 0, this.width, 32);

            self.context.fillStyle = "white";
            self.context.font = "14px Arial";
            self.context.fillText(this.title, 5, 19);
        }

        for (var i = 0; i < this.elements.length; i++) {
            console.log(this.elements[i].position.x, this.elements[i].position.y, this.elements[i].position.width, this.elements[i].position.height);
            self.context.drawImage(this.elements[i].paint(), this.elements[i].position.x, this.elements[i].position.y, this.elements[i].position.width, this.elements[i].position.height);
        }
    };

    this.windowClick = function (e) {
        console.log(this.title, "was clicked");
    };

    this.onMouseMove = function (e) {
        if (self.mouseOnTitle) {
            console.log("Mouse move");

            self.displayObject.x = e.x - self.xOffset;
            self.displayObject.y = e.y - self.yOffset;
            self.x = e.x - self.xOffset;
            self.y = e.y - self.yOffset;
        }
    };

    this.onMouseDown = function (e) {
        if (
            e.x >= self.x && e.x <= (self.x + self.width)
            &&
            e.y >= self.y && e.y <= (self.y + 32)
        ) {
            console.log(this.title, "MOUSE DOWN");


            self.xOffset = e.x - self.x;
            self.yOffset = e.y - self.y;

            self.mouseOnTitle = true;
            manager.applyToActiveWindow = true;
        }
    };

    this.onMouseUp = function (e) {
        self.mouseOnTitle = false;
        manager.applyToActiveWindow = false;
        console.log(this.title, "MOUSE UP");
    };
}

//# sourceMappingURL=os.js.map