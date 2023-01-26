
let plugin;

/// #if process.env.LIMBO
import { addLabelWithToggle } from "../../controls";
import UTNativeDropDownControl from "../../controls/UTNativeDropDownControl";
import { EVENTS, on } from "../../events";
import db from "../../services/db";
import { getItemAsText, getItemStaticDataByDefId } from "../../services/item";
import { getTransferListItems } from "../../services/market";
import { findPlayersInClub } from "../../services/ui/club";
import settings, { saveConfiguration } from "../../settings";
import { chunks } from "../../utils/array";
import delay from "../../utils/delay";
import { append } from "../../utils/dom";
const cfg = settings.plugins.limbo;

function run() {

    async function syncronize() {
        const unassignedItems = await db.unassigned.getAll();
        for (const chunk of chunks(unassignedItems, MAX_ITEMS_REQUEST)) {
            const playersInClub = await findPlayersInClub(chunk, null, false, true);

            for (const playerInClub of playersInClub) {
                db.unassigned.deleteById(playerInClub.id);
            }

            await delay(10, 30);
        }

        if (unassignedItems.length > 0) {
            for (const item of await getTransferListItems()) {
                db.unassigned.deleteById(item.id);
            }
        }
    }

    if (settings.enabled && cfg.enabled) {
        syncronize();
    }

    const UTUnassignedItemsView_renderSection = UTUnassignedItemsView.prototype.renderSection;

    UTUnassignedItemsView.prototype.renderSection = function (...args) {
        const section = UTUnassignedItemsView_renderSection.call(this, ...args);

        const sectionType = args[1];

        if (sectionType === UTUnassignedItemsViewModel.SECTION.ITEMS) {
            append(section._header, this._uniquePlayersDropDown);
        }

        return section;
    }

    const UTUnassignedItemsView_generate = UTUnassignedItemsView.prototype._generate;
    UTUnassignedItemsView.prototype._generate = function _generate(...args) {
        UTUnassignedItemsView_generate.call(this, ...args);
        if (!settings.enabled || !cfg.enabled) return;

        if (!this._limboGenerated) {
            this._uniquePlayersDropDown = new UTNativeDropDownControl();

            (async () => {
                const definitionIds = await db.unassigned.getDefinitionIds();
                const options = [];

                for (let defId of definitionIds) {
                    const count = await db.unassigned.getCountByDefinitionId(defId);
                    let name;

                    const player = getItemStaticDataByDefId(defId);
                    if(player) {
                        name = player.commonName ? player.commonName : `${player.lastName} ${player.firstName}`;
                    }
                    else {
                        const item = await db.unassigned.getFirstByDefinitionId(defId);
                        name = getItemAsText(item);
                    };
                    options.push({ label: `${name}  ( ${count} )`, value: defId });
                }

                options.sort((a, b) => a.label.localeCompare(b.label));

                this._uniquePlayersDropDown.setOptions(options);
            })();

            this._uniquePlayersDropDown.onChange(item => {
                alert(item);
            });

            this._limboGenerated = true;
        }
    }

    const UTUnassignedItemsViewModel_requestUnassignedItems = UTUnassignedItemsViewModel.prototype.requestUnassignedItems;
    UTUnassignedItemsViewModel.prototype.requestUnassignedItems = function (...args) {
        const observable = UTUnassignedItemsViewModel_requestUnassignedItems.call(this, ...args);

        const newObservable = new EAObservable();

        observable.observe(this, (sender, response) => {
            const itemsDictionary = {};
            for (const item of response.response.items) {
                db.unassigned.insertItem(item);
                itemsDictionary[item.id] = item;
            }

            db.unassigned.getAll().then(unassignedItems => {
                for (let unassignedItem of unassignedItems) {
                    if (itemsDictionary[unassignedItem.id]) continue;

                    this.add(unassignedItem);
                    response.response.items.push(unassignedItem);
                }

                newObservable.notify(response);
            });

        });

        return newObservable;
    }


    on(EVENTS.ITEM_WON, ev => {
        db.unassigned.insertItem(ev.detail.item);
    });

    on(EVENTS.ITEM_MOVED, ev => {
        db.unassigned.deleteById(ev.detail.item.id);
    });

    on(EVENTS.ITEM_DISCARDED, ev => {
        db.unassigned.deleteById(ev.detail.id);
    });

    on(EVENTS.REQUEST_UNASSIGNED, ev => {
        for (let item of ev.detail) {
            db.unassigned.insertItem(item);
        }
    });
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}


plugin = {
    run: run,
    order: 10,
    settings: {
        name: 'limbo',
        title: 'plugins.limbo.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;