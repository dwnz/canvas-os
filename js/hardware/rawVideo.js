function RawVideoOutput(ctx) {
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
}