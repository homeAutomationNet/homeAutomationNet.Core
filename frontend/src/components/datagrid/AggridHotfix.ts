// hotfix for bug:
// https://github.com/ag-grid/ag-grid/issues/5586
// pull req:
// https://github.com/ag-grid/ag-grid/pull/5587
// remove code if it is fixed in aggrid......
const __values = function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

function flatten(arrayOfArrays) {
    return [].concat.apply([], arrayOfArrays);
}
//@ts-ignore
agGrid.DragAndDropService.prototype.findCurrentDropTarget = function (mouseEvent, validDropTargets) {
    var e_3, _a, e_4, _b;
    var len = validDropTargets.length;
    if (len === 0) {
        return null;
    }
    if (len === 1) {
        return validDropTargets[0];
    }
    var elementStack = this.gridOptionsWrapper.eGridDiv.getRootNode().elementsFromPoint(mouseEvent.clientX, mouseEvent.clientY);
    try {
        // loop over the sorted elementStack to find which dropTarget comes first
        for (var elementStack_1 = __values(elementStack), elementStack_1_1 = elementStack_1.next(); !elementStack_1_1.done; elementStack_1_1 = elementStack_1.next()) {
            var el = elementStack_1_1.value;
            try {
                for (var validDropTargets_1 = (e_4 = void 0, __values(validDropTargets)), validDropTargets_1_1 = validDropTargets_1.next(); !validDropTargets_1_1.done; validDropTargets_1_1 = validDropTargets_1.next()) {
                    var dropTarget = validDropTargets_1_1.value;
                    var containers = flatten(this.getAllContainersFromDropTarget(dropTarget));
                    if (containers.indexOf(el) !== -1) {
                        return dropTarget;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (validDropTargets_1_1 && !validDropTargets_1_1.done && (_b = validDropTargets_1.return)) _b.call(validDropTargets_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (elementStack_1_1 && !elementStack_1_1.done && (_a = elementStack_1.return)) _a.call(elementStack_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    // we should never hit this point of the code because only
    // valid dropTargets should be provided to this method.
    return null;
};
//----------------- end hotfix ----------------