import { clearSnipeRequests } from "../services/ui/market";

export default function executeDefaultActionPanelViewOverrides() {

    const UTDefaultActionPanelView_render = UTDefaultActionPanelView.prototype.render;
    UTDefaultActionPanelView.prototype.render = function (e, t, i, o, n, r, s) {
        UTDefaultActionPanelView_render.call(this, e, t, i, o, n, r, s);
        this._comparePriceButton.addTarget(this, () => {
            clearSnipeRequests();
        }, EventType.TAP);
    }
}