function Element(id) {
}

function Button(id, text, x, y) {
    this.id = id;
    this.text = text;
    this.position = new Position(x, y, 250, 60);
    this.canvas = null;

    this.paint = function () {
        var canvas = GET_CANVAS(this.position.width, this.position.height);
        var ctx = canvas.getContext('2d');
        ctx.width = this.position.width;
        ctx.height = this.position.height;

        if (this.hover) {
            ctx.fillStyle = "grey";
        } else {
            ctx.fillStyle = "black";
        }

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