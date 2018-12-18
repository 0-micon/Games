function newSingleElementSelector(selectionClassName) {
    var selectedElement, selectedData, onselectstart, onselectend;
    if (selectionClassName) {
        onselectstart = function () {
            selectedElement.classList.add(selectionClassName);
        };
        onselectend = function () {
            selectedElement.classList.remove(selectionClassName);
        };
    }
    return {
        get selection() {
            return selectedElement;
        },
        get data() {
            return selectedData;
        },
        get isSelection() {
            return selectedElement != null;
        },
        get className() {
            return selectionClassName;
        },
        onselectstart: onselectstart,
        onselectend: onselectend,
        unselect: function () {
            if (selectedElement) {
                if (this.onselectend) {
                    this.onselectend();
                }
            }
            selectedElement = null;
            selectedData = null;
        },
        clear: function () {
            selectedElement = null;
            selectedData = null;
        },
        select: function (element, data) {
            this.unselect();
            if (element) {
                selectedElement = element;
                selectedData = data;
                if (this.onselectstart) {
                    this.onselectstart();
                }
            }
        }
    };
}

function newHistory() {
    var history = [], current = -1, lockCount = 0;

    return {
        get total() {
            return history.length;
        },
        get length() {
            return current + 1;
        },
        get current() {
            return current;
        },
        get currentItem() {
            return history[current];
        },
        get backwardItem() {
            return history[current - 1];
        },
        get forwardItem() {
            return history[current + 1];
        },
        get lockCount() {
            return lockCount;
        },
        get isLocked() {
            return lockCount > 0;
        },
        lock: function() {
            return ++lockCount > 0;
        },
        unlock: function() {
            if (lockCount > 0) {
                lockCount--;
            }
            return lockCount == 0;
        },
        at: function (index) {
            return history[index];
        },
        add: function (item) {
            if (lockCount == 0) {
                if (history.length > current + 1) {
                    // truncate
                    history.length = current + 1;
                }
                history[++current] = item;
                if (this.onadd) {
                    this.onadd();
                }
                return true;
            }
        },
        moveBackward: function () {
            if (current >= 0) {
                current--;
                if (this.onmove) {
                    this.onmove();
                }
            }
        },
        moveForward: function () {
            if (current + 1 < history.length) {
                current++;
                if (this.onmove) {
                    this.onmove();
                }
            }
        },
        clear: function(){
            current = -1;
            history.length = 0;
            lockCount = 0;
            if (this.onclear) {
                this.onclear();
            }
        }
    };
}
