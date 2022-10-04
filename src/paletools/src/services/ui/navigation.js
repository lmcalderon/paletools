import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";
import { isHidden, select } from "../../utils/dom";
import pointerClick from "../../utils/pointer";
import { logDebug } from "../log";

export function navigateBack(controller, delayMs) {
    function back(controller) {
        try {
            const navigationController = controller.getNavigationController();
            const previousController = navigationController.getPreviousController();
            navigationController.popToViewController(previousController);
        }
        catch {
        }

        setTimeout(() => {
            const newCurrentController = getCurrentController();
            if(isHidden(newCurrentController.getView().getRootElement())){
                logDebug("view is hidden, executing hack");
                newCurrentController.getNavigationController()._currentController = null;
                newCurrentController.getNavigationController().pushViewController(newCurrentController);
            }
        }, 5);
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