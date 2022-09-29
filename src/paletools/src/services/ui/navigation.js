import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";
import { select } from "../../utils/dom";
import pointerClick from "../../utils/pointer";

export function navigateBack(controller, delayMs) {
    function back() {
        try {
            (controller || getCurrentController()).getNavigationController()._eBackButtonTapped();
        }
        catch {
            pointerClick(select(".ut-navigation-button-control"));
        }
    }

    if (delay) {
        delay(delayMs).then(() => {
            back();
        });
    }
    else {
        back();
    }
}