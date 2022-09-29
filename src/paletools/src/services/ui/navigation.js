import getCurrentController from "../../utils/controller";
import delay from "../../utils/delay";

export function navigateBack(controller, delayMs){
    function back() {
        (controller || getCurrentController()).getNavigationController()._eBackButtonTapped();
    }

    if(delay){
        delay(delayMs).then(() => {
            back();
        });
    }

    back();
}