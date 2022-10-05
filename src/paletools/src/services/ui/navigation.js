import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";
import { isHidden, select } from "../../utils/dom";
import pointerClick from "../../utils/pointer";
import { logDebug } from "../log";

export function navigateBack(controller, delayMs) {
    function back(controller) {
        const previousController = controller.getNavigationController().getPreviousController();

        try {
            controller.getNavigationController()._eBackButtonTapped();
        }
        catch (ex) {
            logDebug("Navigation back failed: _eBackButtonTapped " + ex);
        }

        if (previousController !== getCurrentController()) {
            try {
                controller.getNavigationController()._currentController = null;
                controller.getNavigationController().popToViewController(previousController);
            }
            catch (ex) {
                logDebug("Navigation back failed: popToViewController " + ex)
            }
        }

        const newCurrentController = getCurrentController();
        if (isHidden(newCurrentController.getView().getRootElement())) {
            logDebug("view is hidden, executing hack");
            newCurrentController.getNavigationController()._currentController = null;
            newCurrentController.getNavigationController().pushViewController(newCurrentController);
        }

        if (isPhone()) {
            delay(50).then(() => {
                const viewContent = select(".ut-navigation-container-view--content");

                if (!viewContent.innerHTML) {
                    const newCurrentController = getCurrentController();
                    logDebug("HTML is empty, pushing previousController")
                    const navigationController = newCurrentController.getNavigationController();

                    let index = navigationController._childViewControllers.length - 1;
                    
                    for(; index > 0; index--){
                        if(navigationController._childViewControllers[index].className === previousController.className) break;
                    }

                    if(index > 0){
                        navigationController._childViewControllers.length = index;
                    }

                    newCurrentController.getNavigationController()._currentController = null;
                    newCurrentController.getNavigationController().pushViewController(previousController);
                }
            });
        }
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