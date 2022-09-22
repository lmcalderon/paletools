import { remove } from "../utils/dom";

const UTLinkControl = function (t) {
    UTControl.call(this);
}

UTLinkControl.prototype._generate = function _generate() {
    if (!this.generated) {
        this._link = document.createElement("a");
        this.__root = this._link;
        this.generated = true;
    }
}

UTLinkControl.prototype.setText = function (text) {
    this._link.textContent = text;
}

UTLinkControl.prototype.setUrl = function(url){
    this._link.href = url;
}

UTLinkControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    remove(this.__root);
    this.__root = null;
}

UTLinkControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLinkControl;