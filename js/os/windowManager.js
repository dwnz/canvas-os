function WindowManager(kernel) {
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

        var openButton = new Button("btn1", "Button", null, 100, 100);
        openButton.onClick = function (e) {
            console.log("CLICKED BRO");
        };
        textEdit.elements.push(openButton);


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
            return e.x >= w.x && e.x <= (w.x + w.width) &&
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
            return e.x >= w.x && e.x <= (w.x + w.width) &&
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
            return e.x >= w.x && e.x <= (w.x + w.width) &&
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
            return e.x >= w.x && e.x <= (w.x + w.width) &&
                e.y >= w.y && e.y <= (w.y + w.height)

        }).sort(function (w, w1) {
            return w.zindex < w1.zindex;
        });

        if (findWindowsInClickZone[0]) {
            e.realX = e.x;
            e.realY = e.y;

            e.x = e.x - findWindowsInClickZone[0].x;
            e.y = e.y - findWindowsInClickZone[0].y;

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
            self.context.drawImage(this.elements[i].paint(), this.elements[i].position.x, this.elements[i].position.y, this.elements[i].position.width, this.elements[i].position.height);
        }
    };

    this.windowClick = function (e) {
        e.realX = e.x;
        e.realY = e.y;

        e.x = e.x - self.x;
        e.y = e.y - self.y;

        var findElementsInClickZone = self.elements.filter(function (w) {
            return e.x >= w.position.x && e.x <= (w.position.x + w.position.width) &&
                e.y >= w.position.y && e.y <= (w.position.y + w.position.height)
        });

        if (findElementsInClickZone.length === 1) {
            findElementsInClickZone[0].onClick(e);
        }
    };

    this.onMouseMove = function (e) {
        if (self.mouseOnTitle) {
            self.displayObject.x = e.x - self.xOffset;
            self.displayObject.y = e.y - self.yOffset;

            self.x = e.x - self.xOffset;
            self.y = e.y - self.yOffset;
        } else {
            for (var i = 0; i < self.elements.length; i++) {
                self.elements[i].hover = false;
            }

            var findElementsInClickZone = self.elements.filter(function (w) {
                return e.x >= w.position.x && e.x <= (w.position.x + w.position.width) &&
                    e.y >= w.position.y && e.y <= (w.position.y + w.position.height)
            });

            for (var i = 0; i < findElementsInClickZone.length; i++) {
                self.elements[i].hover = true;
            }
        }
    };

    this.onMouseDown = function (e) {
        if (
            e.x >= self.x && e.x <= (self.x + self.width) &&
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