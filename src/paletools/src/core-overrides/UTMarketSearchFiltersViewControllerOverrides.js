export default function executeMarketSearchFiltersViewControllerOverrides() {
    const UTMarketSearchFiltersViewController_eSearchSelected = UTMarketSearchFiltersViewController.prototype._eSearchSelected;
    UTMarketSearchFiltersViewController.prototype._eSearchSelected = function _eSearchSelected() {
        const maskedDefId = this._viewmodel.searchCriteria.maskedDefId;
        UTMarketSearchFiltersViewController_eSearchSelected.call(this);
        services.User.getUser().marketSearchCriteria.maskedDefId = maskedDefId;
    }
}

//UTMarketSearchFiltersView.prototype._generate = function _generate() {