const keyboardActions = {};

export function addKeyboardAction(actionName, keyCode, actionLocale, action) {
    if(!keyboardActions[keyCode]){
        keyboardActions[keyCode] = [];
    }

    keyboardActions[keyCode].push({ keyCode: keyCode, name: actionName, locale: actionLocale, action: action });
}

export function getAllKeyboardActions() {
    return Object.values(keyboardActions);
}

export function getKeyboardActions(keyCode){
    if(keyboardActions[keyCode]) return keyboardActions[keyCode];

    return null;
}