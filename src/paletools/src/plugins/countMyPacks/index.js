let plugin;

// #if process.env.COUNT_MY_PACKS
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.countMyPacks;

function run(){

    const UTStoreViewController_setCategory = UTStoreViewController.prototype.setCategory;
    UTStoreViewController.prototype.setCategory = function(e){
        UTStoreViewController_setCategory.call(this, e);
        if(!cfg.enabled) return;

        if(this.packLoadObservable) return;

        if(!this.viewmodel.hasMyPacks) return;

        const myPacksNavItem = this.getView()._navigation.items.find(x => x.id === "mypacks");
        const elem = myPacksNavItem.getRootElement();

        const updateCount = () => $(elem).text(`${localize("store.group.mypacks")} (${this.viewmodel.myPacks.length})`);
        const reset = () => $(elem).text(localize("store.group.mypacks"));

        updateCount();

        on(EVENTS.APP_DISABLED, () => {
            reset();
        });
        on(EVENTS.APP_ENABLED, () => {
            updateCount();
        });
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
        name: "countMyPacks",
        title: 'plugins.countMyPacks.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;