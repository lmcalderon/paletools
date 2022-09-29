import { hideLoader } from "../utils/loader";

export default function executeMarketSearchFiltersViewOverrides() {
    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate
    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        UTMarketSearchFiltersView__generate.call(this);

        hideLoader();
    }
}