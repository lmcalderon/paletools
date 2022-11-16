let plugin;
/// #if process.env.PLAYER_CARD_INFO
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import { EVENTS, on } from "../../events";
import settings, { saveConfiguration } from "../../settings";
import { append, createElem } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";
import { addStyle, removeStyle } from "../../utils/styles";
import localize from "../../localization";

const cfg = settings.plugins.playerCardInfo;

function addStyles() {
    addStyle('paletools-player-card-info', styles);
}

function removeStyles() {
    removeStyle('paletools-player-card-info');
}


function run() {

    const UTPlayerItemView_renderItem = UTPlayerItemView.prototype.renderItem;


    UTPlayerItemView.prototype.renderItem = function (player, t) {
        const result = UTPlayerItemView_renderItem.call(this, player, t);
        if (settings.enabled && cfg.enabled && !this._alternativePositionsGenerated) {
            const starsContainer = createElem("div", { className: "stars" });

            const colors = t.getExpColorMap(player.getTier()).header;
            const colorStyle = `color: rgba(${colors.r},${colors.g},${colors.b},1)`;


            const untradeableContainer = createElem("div", { className: "untradeable" });
            if(cfg.untradeable){
                append(this.__mainViewDiv, untradeableContainer);
            }

            if (cfg.skillMoves) {
                append(starsContainer, createElem("div", { className: "skill-moves", style: colorStyle }, player.getMetaData().skillMoves + 1));
            }

            if (cfg.weakFoot) {
                const wfText = player.getMetaData().isLeftFoot ? localize("cards.cardfront.weakFootRightAbbr") : localize("cards.cardfront.weakFootLeftAbbr");
                append(starsContainer, createElem("div", { className: `weak-foot ${(player.getMetaData().isLeftFoot ? "" : "weak-foot-left")}`, style: colorStyle }, `${wfText} ${player.getMetaData().weakFoot}`));
            }

            if(cfg.skillMoves || cfg.weakFoot){
                append(this.__mainViewDiv, starsContainer);
            }

            const altPosContainer = createElem("div", { className: "alternative-positions" });
            if (cfg.alternatePositions) {
                for (let position of player.possiblePositions || []) {
                    if (player.preferredPosition === position) continue;

                    const positionDiv = createElem("div", { className: "alternative-position" }, PlayerPosition[position]);
                    append(altPosContainer, positionDiv);
                }

                append(this.__mainViewDiv, altPosContainer);
            }

            on(EVENTS.APP_ENABLED, () => { show(altPosContainer); show(starsContainer); show(untradeableContainer); addStyles(); });
            on(EVENTS.APP_DISABLED, () => { hide(altPosContainer); hide(starsContainer); hide(untradeableContainer); removeStyles(); });

            this._alternativePositionsGenerated = true;
        }

        return result;
    };

    addStyles();
}

function menu() {
    const container = document.createElement("div");
    ["enabled", "alternatePositions", "skillMoves", "weakFoot", "untradeable"].forEach(x => {
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