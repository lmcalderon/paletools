import { remove } from "../utils/dom";

const UTLabelControl = function (t) {
    UTControl.call(this);
}

UTLabelControl.prototype._generate = function _generate() {
    if (!this.generated) {
        this._label = document.createElement("label");
        this.__root = this._label;
        this.generated = true;
    }
}

UTLabelControl.prototype.setText = function (text) {
    this._label.textContent = text;
}

UTLabelControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    remove(this.__root);
    this.__root = null;
}

UTLabelControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelControl;