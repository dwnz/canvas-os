function Mouse(rawVideo) {
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
}