let plugin;
/// #if process.env.PLAYER_CARD_INFO
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import settings, { saveConfiguration } from "../../settings";
import { addClass, append, createElem, remove, select } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { addStyle, removeStyle } from "../../utils/styles";
import localize, { localizePosition, getLeagueAbbr5 } from "../../localization";
import { getImportantLeagueIds, getUnimportantLeagueIds } from "../../services/league";

const cfg = settings.plugins.playerCardInfo;

function addStyles() {
    addStyle('paletools-player-card-info', styles);
}

function removeStyles() {
    removeStyle('paletools-player-card-info');
}


function run() {
    if (settings.enabled && cfg.enabled) {
        function setupImportantLeaguesCss() {
            if (!cfg.importantLeague) {
                remove(select("#paletools-player-card-info-league"));
                return;
            }

            const leaguesCss = [];
            for (let leagueId of getImportantLeagueIds()) {
                leaguesCss.push(`.league.league-${leagueId}`);
            }

            const style = select("#paletools-player-card-info-league") || createElem("style", { id: "paletools-player-card-info-league" });
            style.textContent = `${leaguesCss.join(',')} { background-color: white !important; color: #0099cc !important; border: 1px solid #0099cc !important; }`;

            if (!document.head.contains(style)) {
                document.head.appendChild(style);
            }
        }

        on(EVENTS.CONFIGURATION_SAVED, () => {
            setupImportantLeaguesCss();
        });

        setupImportantLeaguesCss();
    }


    const UTPlayerItemView_renderItem = UTPlayerItemView.prototype.renderItem;
    UTPlayerItemView.prototype.renderItem = function (player, t) {
        const result = UTPlayerItemView_renderItem.call(this, player, t);
        if (settings.enabled && cfg.enabled) {
            const starsContainer = createElem("div", { className: "stars" });
            const leagueContainer = createElem("div", { className: "league" });

            const colors = t.getExpColorMap(player.getTier()).header;
            const colorStyle = `color: rgba(${colors.r},${colors.g},${colors.b},1)`;


            const untradeableContainer = createElem("div", { className: "untradeable" });
            if (cfg.untradeable && player.untradeable) {
                append(this.__mainViewDiv, untradeableContainer);
            }

            if (cfg.skillMoves) {
                append(starsContainer, createElem("div", { className: "skill-moves", style: colorStyle }, player.getSkillMoves()));
            }

            if (cfg.weakFoot) {
                const wfText = player.isLeftFoot() ? localize("cards.cardfront.weakFootRightAbbr") : localize("cards.cardfront.weakFootLeftAbbr");
                append(starsContainer, createElem("div", { className: `weak-foot ${(player.isLeftFoot() ? "" : "weak-foot-left")}`, style: colorStyle }, `${wfText} ${player.getWeakFoot()}`));
            }

            if (cfg.skillMoves || cfg.weakFoot) {
                append(this.__mainViewDiv, starsContainer);
            }

            if (cfg.pristine && player.contract === 7 && player.owners === 1 && player.loans === -1) {
                addClass(this.getRootElement(), "pristine-player");
            }

            if (cfg.contracts && player.loans === -1 && this.__loanInfoTab) {
                addClass(this.__loanInfoTab, "player-contracts");
                this.__loanInfoTab.textContent = player.contract;
            }

            if (cfg.league) {
                leagueContainer.textContent = getLeagueAbbr5(player.leagueId);;
                addClass(leagueContainer, `league-${player.leagueId}`);
                append(this.__mainViewDiv, leagueContainer);
            }

            const altPosContainer = createElem("div", { className: "alternative-positions" });
            if (cfg.alternatePositions) {
                for (let position of player.possiblePositions || []) {
                    if (player.preferredPosition === position) continue;

                    const positionDiv = createElem("div", { className: "alternative-position" }, localizePosition(position));
                    append(altPosContainer, positionDiv);
                }

                append(this.__mainViewDiv, altPosContainer);
            }

            on(EVENTS.APP_ENABLED, () => { show(altPosContainer); show(starsContainer); show(untradeableContainer); show(leagueContainer); addStyles(); });
            on(EVENTS.APP_DISABLED, () => { hide(altPosContainer); hide(starsContainer); hide(untradeableContainer); hide(leagueContainer); removeStyles(); });
        }

        return result;
    };

    addStyles();
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
    ["enabled", "alternatePositions", "skillMoves", "weakFoot", "untradeable", "pristine", "contracts", "league", "importantLeague"].forEach(x => {
        addLabelWithToggle(container, x === "enabled" ? x : `plugins.playerCardInfo.settings.${x}`, cfg[x], toggleState => {
            cfg[x] = toggleState;
            saveConfiguration();
        });
    });

    return container;
}

plugin = {
    run: run,
    order: 100,
    settings: {
        name: 'player-card-info',
        title: 'plugins.playerCardInfo.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;