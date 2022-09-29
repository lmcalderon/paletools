import executeMarketSearchFiltersViewControllerOverrides from "./UTMarketSearchFiltersViewControllerOverrides";
import executeMarketSearchFiltersViewOverrides from "./UTMarketSearchFiltersViewOverrides";
import executeMarketSearchResultsViewControllerOverrides from "./UTMarketSearchResultsViewControllerOverrides";

export default function runOverrides(){
    executeMarketSearchFiltersViewControllerOverrides();
    executeMarketSearchFiltersViewOverrides();
    executeMarketSearchResultsViewControllerOverrides();
}