import { on } from "../events";
import UTLabelControl from "./UTLabelControl";

const UTLabelWithTextInputWithKeyPressControl = function (t) {
    UTControl.call(this);
}


UTLabelWithTextInputWithKeyPressControl.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");

        this._label = new UTLabelControl();
        this._input = new UTTextInputControl();

        container.appendChild(this._label.getRootElement());
        container.appendChild(this._input.getRootElement());

        const clearButton = document.createElement("i");
        clearButton.classList.add("fut_icon");
        clearButton.classList.add("icon_close");
        clearButton.addEventListener("click", () => {
            this._input.setValue("");
            fireInputCallbacks(this._input, "");
        });
        container.appendChild(clearButton);

        this._onInputChangeCallbacks = [];

        let self = this;

        const fireInputCallbacks = (input, code) => {
            for (let callback of self._onInputChangeCallbacks) {
                (callback)(input, code);
            }
        }

        on(this._input.getRootElement(), "keydown", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();

            fireInputCallbacks(this, e.code);
            return false;
        });

        this.__root = container;
        this.generated = true;
    }
}

UTLabelWithTextInputWithKeyPressControl.prototype.addClearButton = function (value) {
    this._addClearButton = value;
}

UTLabelWithTextInputWithKeyPressControl.prototype.setLabelLocale = function (localeKey) {
    this._label.getRootElement().dataset.locale = localeKey;
}

UTLabelWithTextInputWithKeyPressControl.prototype.setLabel = function (text) {
    this._label.setText(text);
}

UTLabelWithTextInputWithKeyPressControl.prototype.setInputId = function (value) {
    this._input.getRootElement().id = value;
}

UTLabelWithTextInputWithKeyPressControl.prototype.setInputValue = function (value) {
    this._input.setValue(value);
}

UTLabelWithTextInputWithKeyPressControl.prototype.onInputChange = function (callback) {
    this._onInputChangeCallbacks.push(callback);
}

UTLabelWithTextInputWithKeyPressControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelWithTextInputWithKeyPressControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelWithTextInputWithKeyPressControl;