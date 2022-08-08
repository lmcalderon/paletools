export default function getCurrentController(){
    return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();
}

export function findControllerByType(type){
    
    function internalFindControllerByType(controller, type){
        if(controller instanceof type) return controller;

        if(controller._leftController && controller._leftController instanceof type) return controller._leftController;
        if(controller._rightController && controller._rightController instanceof type) return controller._rightController;
        if(controller._currentController && controller._currentController instanceof type) return controller._currentController;
        if(controller._childViewControllers && controller._childViewControllers && controller._childViewControllers.length > 0){
            for(let c of controller._childViewControllers){
                if(c instanceof type) return c;
            }
        }

        let foundController;
        if(controller._leftController){
            foundController = internalFindControllerByType(controller._leftController, type);
            if(foundController) return foundController;
        }

        if(controller._rightController){
            foundController = internalFindControllerByType(controller._rightController, type);
            if(foundController) return foundController;
        }

        if(controller._currentController){
            foundController = internalFindControllerByType(controller._currentController, type);
            if(foundController) return foundController;
        }

        if(controller._childViewControllers && controller._childViewControllers.length > 0){
            for(let c of controller._childViewControllers){
                foundController = internalFindControllerByType(c, type);
                if(foundController) return foundController;
            }
        }

        return null;
    }

    return internalFindControllerByType(getCurrentController(), type);
}
