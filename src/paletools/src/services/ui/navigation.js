import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";

export function navigateBack(controller, delayMs, callback) {
    function back(controller) {
        setTimeout(() => controller.getNavigationController()._eBackButtonTapped(),0);
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