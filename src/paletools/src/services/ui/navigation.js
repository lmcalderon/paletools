import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";

export function navigateBack(controller, delayMs) {
    function back(controller) {
        controller.getNavigationController()._eBackButtonTapped();
    }

    if (delayMs) {
        delay(delayMs).then(() => {
            back(controller || getCurrentController());
        });
    }
    else {
        back(controller || getCurrentController());
    }
} 