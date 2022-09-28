import getCurrentController from "../../utils/controller";

export function navigateBack(controller){
    (controller || getCurrentController()).getNavigationController()._eBackButtonTapped();
}