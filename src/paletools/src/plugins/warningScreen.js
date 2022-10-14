import localize from "../localization";
import { openDialog } from "../services/dialog";
import settings, { saveConfiguration } from "../settings";

const cfg = settings.plugins.warningScreen;

function run() {
    if(cfg.enabled){

    openDialog([
        { labelEnum: enums.UIDialogOptions.OK },
    ],
        localize("plugins.warningScreen.title"),
        `<p>${localize("plugins.warningScreen.disclaimer")}</p>
    `,
        async () => {
            cfg.enabled = false;
            saveConfiguration();
        });
    }
}

export default {
    run: run
};