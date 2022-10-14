export default function executeDropDownControlOverrides(){

    const UTDropDownControl_init = UTDropDownControl.prototype.init;
    UTDropDownControl.prototype.init = function () {
        UTDropDownControl_init.call(this);
        const self = this;
        this._paletoolsHandleKeyUpEvent = ev => {
            self.handleKeyUpEvent(ev);
        }
    }

    const UTDropDownControl_addWindowListener = UTDropDownControl.prototype.addWindowListener;
    UTDropDownControl.prototype.addWindowListener = function () {
        UTDropDownControl_addWindowListener.call(this);

        if(isPhone()) return;

        window.addEventListener(EventType.KEYUP, this._paletoolsHandleKeyUpEvent);
    }

    const UTDropDownControl_removeWindowListener = UTDropDownControl.prototype.removeWindowListener;
    UTDropDownControl.prototype.removeWindowListener = function () {
        UTDropDownControl_removeWindowListener.call(this);

        if(isPhone()) return;

        window.removeEventListener(EventType.KEYUP, this._paletoolsHandleKeyUpEvent);
    }
}