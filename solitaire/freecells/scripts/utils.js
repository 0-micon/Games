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
