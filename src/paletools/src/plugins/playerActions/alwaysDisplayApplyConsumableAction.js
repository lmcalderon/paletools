import { on } from "../../events";
import localize from "../../localization";
import { tryBuyItem } from "../../services/market";
import getWindow from "../../services/window";
import settings from "../../settings";
import { append } from "../../utils/dom";

const cfg = settings.plugins.playerActions;

const alwaysDisplayApplyConsumableAction = {
    canRun: (instance) => {
        return true;
    },

    inject: (proto) => {
        const render = proto.render;
        proto.render = function(...args) {
            render.call(this, ...args);

            if(!cfg.displayApplyConsumable || !this._applyConsumableButton) return;

            const e = args[0];
            const t = args[1];
            const y = e.isConsumable() && t && !t.isDream() && e.isValid();
            this._applyConsumableButton.setDisplay(y || (e.isPlayer() || e.isManager()));
        }
    }
}

export default alwaysDisplayApplyConsumableAction;