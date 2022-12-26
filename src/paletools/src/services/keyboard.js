const keyboardActions = {};

export function addKeyboardAction(keyCode, action) {
    if(!keyboardActions[keyCode]){
        keyboardActions[keyCode] = [];
    }

    keyboardActions[keyCode].push(action);
}

export function getKeyboardActions(keyCode){
    if(keyboardActions[keyCode]) return keyboardActions[keyCode];

    return null;
}