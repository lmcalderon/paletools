import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";
import { select } from "../../utils/dom";
import pointerClick from "../../utils/pointer";

export function navigateBack(controller, delayMs) {
    function back() {
        try {
            const navigationController = (controller || getCurrentController()).getNavigationController();
            navigationController._eBackButtonTapped();
            while(!(getCurrentController() instanceof UTMarketSearchFiltersViewController)){
                navigationController._eBackButtonTapped();
            }
        }
        catch {
        }
    }

    if (delayMs) {
        delay(delayMs).then(() => {
            back();
        });
    }
    else {
        back();
    }
}