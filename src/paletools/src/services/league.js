import settings from "../settings";
import { toArray } from "../utils/array";
import delay from "../utils/delay";
import { toPromise } from "../utils/observable";

export function getLeagues() {
    return factories.DataProvider.getLeagueDP(0).filter(x => x.id > -1);
}

export function getImportantLeagueIds() {
    if (!settings.plugins.importantLeagues.enabled) return getLeagues().map(x => x.id);

    return getLeagues().filter(x => {
        if (settings.plugins.importantLeagues.leagueIds.length === 0) {
            return false;
        }

        return settings.plugins.importantLeagues.leagueIds.indexOf(x.id) > -1;
    }).map(x => x.id);
}

export async function getRequiredLeagueIdsInSbcs() {
    const requestSetsResponse = await toPromise(services.SBC.requestSets());
    if (!requestSetsResponse.success) return [];

    const leagueIds = [];

    for (let set of requestSetsResponse.data.sets) {
        const requirementsResponse = await toPromise(services.SBC.requestChallengesForSet(set));
        if (!requirementsResponse.success) continue;

        for (let challenge in toArray(set.challenges).map(x => x.value)) {
            for (let requirement in challenge.eligibilityRequirements.filter(x => x.scope === SBCElegibilityScope.EXACT && x.keys().find(e => e == SBCElegibilityKey.LEAGUE_ID))) {
                for (let leagueId of requirement.getValue(SBCElegibilityKey.LEAGUE_ID)) {
                    if (leagueIds.indexOf(leagueId) === -1) {
                        leagueIds.push(leagueId);
                    }
                }
            }
        }

        await delay(300);
    }

    return leagueIds;
}