function Draggable(element, parent) {
    this.element = element;
    this.parent = parent;

    this.savePosition();
}

Draggable.prototype.savePosition = function () {
    this.savedOffsetLeft = this.element.offsetLeft;
    this.savedOffsetTop = this.element.offsetTop;

    const style = this.element.style;
    if (style.left) {
        this.savedLeft = style.left;
    }
    if (style.right) {
        this.savedRight = style.right;
    }
    if (style.top) {
        this.savedTop = style.top;
    }
    if (style.bottom) {
        this.savedBottom = style.bottom;
    }

    if (style.zIndex) {
        this.savedZIndex = style.zIndex;
    }

    style.transition = 'none';
};

Draggable.prototype.restorePosition = function () {
    if (this.parent) {
        this.parent.restorePosition();
    }

    const style = this.element.style;
    style.transition = '';

    if (this.savedLeft) {
        style.left = this.savedLeft;
    }
    if (this.savedRight) {
        style.right = this.savedRight;
    }
    if (this.savedTop) {
        style.top = this.savedTop;
    }
    if (this.savedBottom) {
        style.bottom = this.savedBottom;
    }
    if (this.savedZIndex) {
        style.zIndex = this.savedZIndex;
    }
};

Draggable.prototype.move = function (deltaX, deltaY) {
    if (this.parent) {
        this.parent.move(deltaX, deltaY);
    }
    this.element.style.left = this.savedOffsetLeft + deltaX + "px";
    this.element.style.top = this.savedOffsetTop + deltaY + "px";
};
