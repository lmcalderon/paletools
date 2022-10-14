import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";

export function navigateBack(controller, delayMs, callback) {
    function back(controller) {
        controller.getNavigationController()._eBackButtonTapped();
    }

    if (delayMs) {
        delay(delayMs).then(() => {
            back(controller || getCurrentController());
            if(callback){
                callback();
            }
        });
    }
    else {
        back(controller || getCurrentController());
        if(callback){
            callback();
        }
    }
} 