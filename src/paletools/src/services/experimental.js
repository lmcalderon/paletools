import settings from "../settings";

export function isFastClubSearchEnabled(){
    return settings.plugins.experimental.fastClubSearch;
}


export function isFastConceptSearchEnabled() {
    return settings.plugins.experimental.fastConceptSearch;
}