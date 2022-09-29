import settings from "../settings";
const marketSearchFilters = [];
const marketSearchComplete = [];
const marketSearchPreRender = [];

export function addMarketSearchFilter(filterFunc){
    marketSearchFilters.push(filterFunc);
}

export function addMarketSearchComplete(func){
    marketSearchComplete.push(func)
}

export function addMarketSearchPreRender(func){
    marketSearchPreRender.push(func);
}

export default function executeMarketSearchResultsViewControllerOverrides() {

    const UTMarketSearchResultsViewController_requestItems = UTMarketSearchResultsViewController.prototype._requestItems;
    UTMarketSearchResultsViewController.prototype._requestItems = function _requestItems(_) {
        if (!settings.enabled) {
            UTMarketSearchResultsViewController_requestItems.call(this, _);
            return;
        }

        services.Module.set(3355443200);
        this._paginationViewModel.stopAuctionUpdates();

        services.Item.searchTransferMarket(this._searchCriteria, _).observe(this, function _onRequestItemsComplete(e, t) {
            if (e.unobserve(this), !t.success)
                return NetworkErrorManager.checkCriticalStatus(t.status)
                    ? void NetworkErrorManager.handleStatus(t.status)
                    : (services.Notification.queue([services.Localization.localize("popup.error.searcherror"), UINotificationType.NEGATIVE]), void this.getNavigationController().popViewController());
            if (0 < this._searchCriteria.offset && 0 === t.data.items.length) {
                this._requestItems(_ - 1);
            }
            else {
                let itemsPerPage = this._paginationViewModel.getNumItemsPerPage();
                let items = t.data.items.slice();

                if(marketSearchFilters.length > 0){
                    for(let filter of marketSearchFilters){
                        items = filter(items, this);
                    }
                }

                for(let onPreRender of marketSearchPreRender){
                    let shouldContinue = onPreRender(items, this);
                    if(!shouldContinue){
                        return;
                    }
                }

                if (this.onDataChange.notify({
                    items: items
                }), items.length > itemsPerPage && (items = items.slice(0, itemsPerPage)), this._paginationViewModel.setPageItems(items), this._paginationViewModel.setPageIndex(_), this._selectedItem && 0 < items.length) {
                    var n = this._paginationViewModel.getIndexByItemId(this._selectedItem.id);
                    0 < n && this._paginationViewModel.setIndex(n),
                        this._selectedItem = null
                }
                var view = this.getView(),
                    s = null;
                if (!this._stadiumViewmodel || this._searchCriteria.type !== SearchType.VANITY && this._searchCriteria.type !== SearchType.CLUB_INFO && this._searchCriteria.type !== SearchType.BALL || (s = this._stadiumViewmodel.getStadiumProgression(this._searchCriteria.subtypes)), this._squadContext && this._squadContext.getSquad() && (this._squadContext.getCurrentSlot().index < UTSquadEntity.FIELD_PLAYERS || this._squadContext.getCurrentSlot().item.isManager()) && this._compareItem) {
                    var l = [],
                        c = [],
                        slotsChemistries = [],
                        u = [],
                        squad = this._squadContext.getSquad(),
                        currentSlot = this._squadContext.getCurrentSlot();
                    this._paginationViewModel.getCurrentPageItems().forEach(function (t) {
                        var e = squad.getPlayers().map(function (e) {
                            return e.index === currentSlot.index ? t : e.item
                        }, this),
                            i = currentSlot.item.isManager() ? t : squad.getManager().item,
                            formation = squad.getFormation(),
                            n = 0;
                        if (formation) {
                            var r = this._chemCalculator.calculate(formation, e, i);
                            if (n = r.chemistry, !t.isManager()) {
                                var slotChemistry = r.getSlotChemistry(currentSlot.index).points;
                                slotsChemistries.push(slotChemistry),
                                    u.push(slotChemistry - this._squadContext.getCurrentSlot().chemistry)
                            }
                        } else if (!t.isManager()) {
                            var currentSlotChemistry = this._squadContext.getCurrentSlot().chemistry;
                            slotsChemistries.push(0),
                                u.push(0 - currentSlotChemistry)
                        }
                        l.push(n),
                            c.push(n - squad.getChemistry())
                    }, this),
                        view.setItemsWithChemDiff(this._paginationViewModel.getCurrentPageItems(), l, c, slotsChemistries, u)
                } else
                    view.setItems(this._paginationViewModel.getCurrentPageItems(), s);
                if (view.setPaginationState(1 < _, t.data.items.length > itemsPerPage), JSUtils.isValid(this._compareItem) && !this._squadContext) {
                    var a = JSUtils.find(items, function (e) {
                        return e.getAuctionData().tradeId === this._compareItem.getAuctionData().tradeId
                    }
                        .bind(this));
                    JSUtils.isValid(a) ? this._pinnedListItem.setItem(a) : this._paginationViewModel.setPinnedItem(this._compareItem)
                } else !isPhone() && 0 < items.length && view.selectListRow(this._paginationViewModel.getCurrentItem().id)
            
            
                if(marketSearchComplete.length > 0){
                    for(let func of marketSearchComplete){
                        func(items, this);
                    }
                }
            }

            if(this._paginationViewModel){
                this._paginationViewModel.startAuctionUpdates()
            }
        });
    }
}