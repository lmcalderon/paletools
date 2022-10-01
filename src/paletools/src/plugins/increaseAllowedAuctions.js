let plugin;

/// #if process.env.INCREASE_ALLOWED_AUCTIONS
import settings from "../settings";

const cfg = settings.plugins.increaseAllowedAuctions;

function run() {
    services.User.maxAllowedAuctions = 100;
}

plugin = {
    run: run,
};
/// #endif

export default plugin;