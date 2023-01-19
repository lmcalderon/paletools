import { flattenArray } from "../utils/array";

const keyboardActions = {};

export function addKeyboardAction(actionName, getKeyCodeFunc, setKeyCodeFunc, actionLocale, action, cssSelector) {
    if (!keyboardActions[getKeyCodeFunc()]) {
        keyboardActions[getKeyCodeFunc()] = [];
    }

    if (keyboardActions[getKeyCodeFunc()].find(x => x.name === actionName)) return;

    keyboardActions[getKeyCodeFunc()].push({ name: actionName, locale: actionLocale, action: action, getKeyCode: getKeyCodeFunc, setKeyCode: setKeyCodeFunc, cssSelector });
}

export function updateKeyboardAction(prevKeyCode, actionName, newKeyCode) {
    if (prevKeyCode === newKeyCode) return;

    let actions = keyboardActions[prevKeyCode];

    if (!actions) return;

    for (let index = 0; index < actions.length;) {
        if (actions[index].name === actionName) {
            const actionToUpdate = actions.splice(index, 1)[0];
            if (!keyboardActions[newKeyCode]) {
                keyboardActions[newKeyCode] = [actionToUpdate];
            }
            else {
                keyboardActions[newKeyCode].push(actionToUpdate);
            }
            actionToUpdate.setKeyCode(newKeyCode);
        }
        else {
            index++;
        }
    }

    if (keyboardActions[prevKeyCode] && keyboardActions[prevKeyCode].length === 0) {
        delete keyboardActions[prevKeyCode];
    }
}

export function getAllKeyboardActions() {
    return flattenArray(Object.values(keyboardActions));
}

export function getKeyboardActions(keyCode) {
    if (keyboardActions[keyCode]) return keyboardActions[keyCode];

    return null;
}