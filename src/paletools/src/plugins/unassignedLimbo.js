import getWindow from "../services/window";

let plugin;

/// #if process.env.UNASSIGNED_LIMBO
plugin = {
    run: () => {
        getWindow().MAX_NEW_ITEMS = Number.MAX_VALUE;
    }
};
/// #endif

export default plugin;