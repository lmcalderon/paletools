import { clearSnipeRequests } from "../services/ui/market";

export default function executeMarketSearchFiltersViewOverrides() {
    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate;
    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        UTMarketSearchFiltersView__generate.call(this);

        const maskedDefId = services.User.getUser().marketSearchCriteria.maskedDefId;
        if(maskedDefId){
            this._searchFilters.getPlayerNameSearch().setPlayerData(repositories.Item.getStaticDataByDefId(maskedDefId))
        }

        this._searchButton.addTarget(this, () => {
            clearSnipeRequests();
        }, EventType.TAP);
    }
}
