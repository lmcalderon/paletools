import { executeItemDetailsOverrides } from "./ItemDetailsOverrides";
import executeServicesOverrides from "./ServicesOverrides";
import { executeAuctionActionPanelViewOverrides } from "./UTAuctionActionPanelViewOverrides";
import executeDefaultActionPanelViewOverrides from "./UTDefaultActionPanelViewOverrides";
import executeDropDownControlOverrides from "./UTDropDownControlOverrides";
import executeItemActionControllerOverrides from "./UTItemActionControllerOverrides";
import executeItemEntityOverrides from "./UTItemEntityOverrides";
import executeItemTableCellViewOverrides from "./UTItemTableCellViewOverrides";
import executeMarketSearchFiltersViewControllerOverrides from "./UTMarketSearchFiltersViewControllerOverrides";
import executeMarketSearchFiltersViewOverrides from "./UTMarketSearchFiltersViewOverrides";
import executeMarketSearchResultsViewControllerOverrides from "./UTMarketSearchResultsViewControllerOverrides";
import executeSlotActionPanelViewOverrides from "./UTSlotActionPanelViewOverrides";
import executeTransferListViewControllerOverrides from "./UTTransferListViewControllerOverrides";
import executeUnassignedItemsViewControllerOverrides from "./UTUnaassignedItemsViewControllerOverrides";
import executeWatchListViewControllerOverrides from "./UTWatchListViewControllerOverrides";

export default function runOverrides(){
    executeMarketSearchFiltersViewControllerOverrides();
    executeMarketSearchFiltersViewOverrides();
    executeMarketSearchResultsViewControllerOverrides();
    executeDefaultActionPanelViewOverrides();
    executeAuctionActionPanelViewOverrides();
    executeItemTableCellViewOverrides();
    executeSlotActionPanelViewOverrides();
    executeDropDownControlOverrides();
    executeItemDetailsOverrides();
    executeItemActionControllerOverrides();
    executeItemEntityOverrides();
    executeTransferListViewControllerOverrides();
    executeWatchListViewControllerOverrides();
    executeUnassignedItemsViewControllerOverrides();
    executeServicesOverrides();
}