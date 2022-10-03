import { executeAuctionActionPanelViewOverrides } from "./UTAuctionActionPanelViewOverrides";
import executeDefaultActionPanelViewOverrides from "./UTDefaultActionPanelViewOverrides";
import executeItemTableCellViewOverrides from "./UTItemTableCellViewOverrides";
import executeMarketSearchFiltersViewControllerOverrides from "./UTMarketSearchFiltersViewControllerOverrides";
import executeMarketSearchFiltersViewOverrides from "./UTMarketSearchFiltersViewOverrides";
import executeMarketSearchResultsViewControllerOverrides from "./UTMarketSearchResultsViewControllerOverrides";
import executeSlotActionPanelViewOverrides from "./UTSlotActionPanelViewOverrides";

export default function runOverrides(){
    executeMarketSearchFiltersViewControllerOverrides();
    executeMarketSearchFiltersViewOverrides();
    executeMarketSearchResultsViewControllerOverrides();
    executeDefaultActionPanelViewOverrides();
    executeAuctionActionPanelViewOverrides();
    executeItemTableCellViewOverrides();
    executeSlotActionPanelViewOverrides();
}