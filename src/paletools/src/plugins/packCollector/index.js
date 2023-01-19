let plugin;

// #if process.env.PACK_COLLECTOR
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { append, createElem, insertBefore } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { EVENTS, on } from "../../events";
import { addStyle, removeStyle } from "../../utils/styles";

const cfg = settings.plugins.packCollector;

function addStyles() {
    addStyle('paletools-pack-collector', styles);
}

function removeStyles() {
    removeStyle('paletools-pack-collector');
}

function run() {
    addStyles();

    on(EVENTS.APP_ENABLED, () => addStyles());
    on(EVENTS.APP_DISABLED,  () => removeStyles());

    const UTStoreViewController_setCategory = UTStoreViewController.prototype.setCategory;
    UTStoreViewController.prototype.setCategory = function (e) {
        UTStoreViewController_setCategory.call(this, e);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this.viewmodel.hasMyPacks) return;

        const packs = {};
        for (let pack of this.viewmodel.myPacks.values()) {
            if (!packs[pack.id]) {
                packs[pack.id] = [pack.id, 0, 0];
            }

            if (pack.tradable) {
                packs[pack.id][2]++;
            }
            else {
                packs[pack.id][1]++;
            }
        }

        this.getView().setPackCollectorLink(`https://freakpants.github.io/pack-collector/?packs=${Object.values(packs).map(x => x.join(",")).join("-")}`);
    }

    const UTStoreView__generate = UTStoreView.prototype._generate;
    UTStoreView.prototype._generate = function _generate() {
        UTStoreView__generate.call(this);
        if(!settings.enabled || !cfg.enabled) return;

        if (!this._packCollectorGenerated) {
            const packCollectorContainer = createElem("div", { className: "pack-collector-btn-container" });
            this.__packCollectorLink = createElem("a", { target: "_blank", className: "pack-collector-btn" }, localize("plugins.packCollector.link.text"));
            append(packCollectorContainer, this.__packCollectorLink);
            insertBefore(packCollectorContainer, this.__description);
            this._packCollectorGenerated = true;
        }
    }

    const UTStoreView_setPacks = UTStoreView.prototype.setPacks;
    UTStoreView.prototype.setPacks = function (...args) {
        UTStoreView_setPacks.call(this, ...args);

        if (!settings.enabled || !cfg.enabled) return;

        const packs = args[0];

        if(packs.length === 0) return;

        if(packs[0].isMyPack) {
            show(this.__packCollectorLink);
        }
        else {
            hide(this.__packCollectorLink);
        }
    }

    UTStoreView.prototype.setPackCollectorLink = function (link) {
        this.__packCollectorLink.href = link;
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 10,
    settings: {
        name: "packCollector",
        title: 'plugins.packCollector.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;