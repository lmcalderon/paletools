export function getUserPlatform() {
    const persona = services.User.getUser().getSelectedPersona();
    if (persona.isPC) {
        return GamePlatform.PC;
    }
    else if (persona.isPlaystation) {
        return GamePlatform.PSN;
    }
    else if (persona.isXbox) {
        return GamePlatform.XBL;
    }
    else if (persona.isSwitch) {
        return GamePlatform.SWI;
    }
    else if (persona.isStadia) {
        return GamePlatform.STADIA;
    }

    return GamePlatform.NONE;
};