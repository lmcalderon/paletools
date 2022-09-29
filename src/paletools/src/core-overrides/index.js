import executeMarketSearchFiltersViewOverrides from "./UTMarketSearchFiltersView";
import executeMarketSearchResultsViewControllerOverrides from "./UTMarketSearchResultsViewControllerOverrides";

export default function runOverrides(){
    executeMarketSearchResultsViewControllerOverrides();
    executeMarketSearchFiltersViewOverrides();
}