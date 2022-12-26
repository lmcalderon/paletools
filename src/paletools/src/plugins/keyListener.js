import { getKeyboardActions } from "../services/keyboard";

let plugin;

/// #if process.env.KEY_LISTENER
function run() {
    document.body.addEventListener('keydown', e => {
        if (e.target.tagName === "INPUT") {
            return;
        }

        const actions = getKeyboardActions(e.code);
        if(actions){
            for(let action of actions){
                action();
            }
            e.preventDefault();
        }
    });
}

plugin = {
    run: run,
    order: -100
};
/// #endif

export default plugin;