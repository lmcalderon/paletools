import { clearSnipeRequests } from "../services/ui/market";

export function executeAuctionActionPanelViewOverrides(){
    const UTAuctionActionPanelView_render = UTAuctionActionPanelView.prototype.render;
    UTAuctionActionPanelView.prototype.render = function (e, t) {
        UTAuctionActionPanelView_render.call(this, e, t);

        this._findRelatedButton.addTarget(this, () => {
            clearSnipeRequests();
        }, EventType.TAP);
    }
}