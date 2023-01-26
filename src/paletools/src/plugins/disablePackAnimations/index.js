let plugin;

// #if process.env.DISABLE_PACK_ANIMATIONS
import { addLabelWithToggle } from "../../controls";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.disablePackAnimations;

function run() {

    const UTPackAnimationView_runAnimation = UTPackAnimationView.prototype.runAnimation;
    UTPackAnimationView.prototype.runAnimation = function (e, t) {
        if (!cfg.enabled) {
            UTPackAnimationView_runAnimation.call(this, e, t);
        }
    }

    const UTPackAnimationViewController_runAnimation = UTPackAnimationViewController.prototype.runAnimation;
    UTPackAnimationViewController.prototype.runAnimation = function () {
        if (!cfg.enabled) {
            UTPackAnimationViewController_runAnimation.call(this);
            return;
        }

        this.runCallback();
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
    order: 10,
    settings: {
        name: "disablePackAnimations",
        title: 'plugins.disablePackAnimations.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;


