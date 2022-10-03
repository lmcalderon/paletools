import { clearSnipeRequests } from "../services/ui/market";

export default function executeSlotActionPanelViewOverrides() {
    const UTSlotActionPanelView_generate = UTSlotActionPanelView.prototype._generate;
    UTSlotActionPanelView.prototype._generate = function _generate() {
        UTSlotActionPanelView_generate.call(this);
        
        this._btnSearchMarket.addTarget(this, () => {
            clearSnipeRequests();
        },
        EventType.TAP);
    }
}