let plugin;

// #if process.env.DISABLE_PACK_ANIMATIONS
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.disablePackAnimations;

function run(){

    const UTPackAnimationViewController_runAnimation = UTPackAnimationViewController.prototype.runAnimation;
    UTPackAnimationViewController.prototype.runAnimation = function () {
        if(!cfg.enabled) {
            UTPackAnimationViewController_runAnimation.call(this);
            return;
        }

        this.runCallback.bind(this);
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
        name: "disablePackAnimations",
        title: 'plugins.disablePackAnimations.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;


