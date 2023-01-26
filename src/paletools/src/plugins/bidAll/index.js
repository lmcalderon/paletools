let plugin;

// #if process.env.BID_ALL
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { openDialog } from "../../services/dialog";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, createElem, insertBefore, prepend } from "../../utils/dom";


const cfg = settings.plugins.clubSearchEnhacer;

function run() {
    if (!settings.enabled || !cfg.enabled) return;

    const UTMarketSearchView_generate = UTMarketSearchView.prototype._generate;
    UTMarketSearchView.prototype._generate = function _generate() {
        UTMarketSearchView_generate.call(this);

        if (this._bidAllGenerated) return;

        const header = createElem("header", { className: "ut-section-header-view" });
        const view = this;

        const bidAllButton = new UTStandardButtonControl();
        bidAllButton.init();
        addClass(bidAllButton, "call-to-action");
        bidAllButton.setText(localize("plugins.bidAll.button.text"));
        bidAllButton.addTarget(this, () => {
            openDialog([
                { labelEnum: enums.UIDialogOptions.OK },
                { labelEnum: enums.UIDialogOptions.CANCEL }
            ],
                localize("plugins.bidAll.settings.title"),
                `<label>${localize("auctioninfo.bidprice")}</label>
                    <input id="bid-all-price" type="number" class="ut-text-input-control fut-bin-buy" placeholder="${localize("auctioninfo.startprice")}" />
                `,
                text => {
                    const bidPrice = parseInt(select("#bid-all-price").value);
                    if (text !== 2) return;

                    if (isNaN(bidPrice) || !bidPrice) {
                        notifyFailure(`${localize("auctioninfo.bidprice")} - ${localize("invalid")}`);
                        return;
                    }

                    for(const row of view.listRows) {
                        const data = row.data;

                    }
                });
        }, EventType.TAP);

        append(header, bidAllButton);

        insertBefore(header, this._list);

        this._bidAllGenerated = true;
    }
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 6,
    menu: menu,
    settings: {
        name: 'bid-all',
        title: 'plugins.bidAll.settings.title',
        menu: menu
    }
}
// #endif

export default plugin;
