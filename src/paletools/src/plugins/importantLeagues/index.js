

let plugin;

/// #if process.env.IMPORTANT_LEAGUES
import { addLabelWithToggle } from "../../controls";
import { getLeagues, getRequiredLeagueIdsInSbcs } from "../../services/league";
import settings, { saveConfiguration } from "../../settings";
import { append, createElem } from "../../utils/dom";
const cfg = settings.plugins.transferListSendAllToClub;

function run() {
}

function menu() {
    const toggles = {};

    const container = document.createElement("div");

    const autoPopulateFromSbcButton = new UTStandardButtonControl();
    autoPopulateFromSbcButton.init();
    autoPopulateFromSbcButton.setText("AUTO");
    autoPopulateFromSbcButton.addTarget(this, async () => {
        const leagueIds = await getRequiredLeagueIdsInSbcs();

        for (let leagueId of Object.keys(toggles)) {
            const toggle = toggles[leagueId];
            if(!toggle.getToggleState() && leagueIds.indexOf(leagueId) === -1) {
                toggle.toggle();
            }
        }

    }, EventType.TAP);

    //append(container, autoPopulateFromSbcButton);

    const leagueContainers = [createElem("div"), createElem("div"), createElem("div")];

    append(container, leagueContainers);

    let containerIndex = 0;

    for (let league of getLeagues()) {
        toggles[league.id] = addLabelWithToggle(leagueContainers[containerIndex++], league.label, settings.plugins.importantLeagues.leagueIds.indexOf(league.id) > -1, toggleState => {
            const leagueIndex = settings.plugins.importantLeagues.leagueIds.indexOf(league.id);
            if (toggleState && leagueIndex === -1) {
                settings.plugins.importantLeagues.leagueIds.push(league.id);
            }
            else if (!toggleState && leagueIndex > -1) {
                settings.plugins.importantLeagues.leagueIds = settings.plugins.importantLeagues.leagueIds.splice(leagueIndex, 1);
            }

            saveConfiguration();
        });

        if (containerIndex === leagueContainers.length) {
            containerIndex = 0;
        }
    }


    return container;
}

plugin = {
    run: run,
    order: 10000,
    settings: {
        name: 'important-leagues',
        title: 'plugins.importantLeagues.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;


