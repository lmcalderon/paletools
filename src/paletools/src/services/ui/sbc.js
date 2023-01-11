import getCurrentController from "../../utils/controller";

export function getSbcChallengeFromController(controller) {
    controller = controller || getCurrentController();
    if (controller._challengeDetailsController) {
        return controller._challengeDetailsController._currentController._challenge;
    }
    else {
        return controller._challenge;
    }
}