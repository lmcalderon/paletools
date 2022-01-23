const UTNativeDropDownControl = function(t){
    UTControl.call(this);
} 

UTNativeDropDownControl.prototype._generate = function _generate() {
    if(!this.generated){
        this._select = document.createElement("select");
        this.__root = this._select;
        this._onChangeCallbacks = [];
        this._select.addEventListener("change", () => {
            for(let callback of this._onChangeCallbacks){
                callback(this._select.value);
            }
        });
    
        this.generated = true;
    }
}

UTNativeDropDownControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTNativeDropDownControl.prototype.getValue = function(){
    return this._select.value;
} 

UTNativeDropDownControl.prototype.onChange = function(callback){
    this._onChangeCallbacks.push(callback);
}

UTNativeDropDownControl.prototype.init = function() {
    UTControl.prototype.init.call(this);
}

UTNativeDropDownControl.prototype.setOptions = function(options){
    for(let option of options){
        const node = document.createElement("option");
        node.value = option.value;
        node.text = option.label;
        this._select.appendChild(node);
    }
}

UTNativeDropDownControl.prototype.dealloc = function() {
    this._removeListenersByName(EventType.CHANGE);
}

UTNativeDropDownControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTNativeDropDownControl;