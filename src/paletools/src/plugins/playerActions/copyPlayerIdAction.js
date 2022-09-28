import settings from "../../settings";
import { copyToClipboard } from "../../utils/clipboard";
import localize from "../../localization";
import { on } from "../../events";
import { notifySuccess } from "../../utils/notifications";
import { append } from "../../utils/dom";
import { show } from "../../utils/visibility";

const cfg = settings.plugins.playerActions;

const copyPlayerIdAction = {
    generate: (instance, buttonsContainerFunc) => {
        if (cfg.copyPlayerId) {
            instance._copyPlayerIdButton = new UTGroupButtonControl();
            instance._copyPlayerIdButton.init();
            instance._copyPlayerIdButton.setText(localize("plugins.playerActions.copyPlayerId"));
            instance._copyPlayerIdButton.addTarget(instance, () => instance.onCopyPlayerId.notify(), EventType.TAP);
            instance._copyPlayerIdButton.getRootElement().classList.add("paletools-element");
            instance.onCopyPlayerId = new EAObservable();
            append(buttonsContainerFunc(instance),instance._copyPlayerIdButton.getRootElement());
            on("appEnabled", () => show(instance._copyPlayerIdButton.getRootElement()));
            on("appDisabled", () => hide(instance._copyPlayerIdButton.getRootElement()));
        }
    },
    destroyGeneratedElements: (instance) => {
        if (instance._copyPlayerIdButton) {
            instance._copyPlayerIdButton.destroy();
        }
    },
    dealloc: (instance) => {
        if (instance.onCopyPlayerId) {
            instance.onCopyPlayerId.dealloc();
        }
    },
    attachEvent: (instance) => {
        if (instance._panel.onCopyPlayerId) {
            instance._panel.onCopyPlayerId.observe(instance, instance._onCopyPlayerId);
        }
    },
    
    createEvent: (proto) => {
        proto._onCopyPlayerId = function () {
            copyToClipboard(this._viewmodel.current().definitionId);
            notifySuccess("Player ID copied to clipboard!");
        }
    }
}

export default copyPlayerIdAction;