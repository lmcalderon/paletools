export default {
    "enabled": "Enabled",
    "valid": "valid",
    "invalid": "invalid",
    "ui.loadingPlayers": "Loading club players: {count} loaded",
    "plugins.dangerous": "WARNING: Enabling this plugin could eventually lead to a potential BAN from EA, are you sure you want to continue?",
    "page.restart": "Please reload the page and re-execute Paletools for the changes to take effect",

    /// #if process.env.GRID_MODE
    "plugins.gridMode.title": "Grid Mode",
    /// #endif

    /// #if process.env.WIDE_MODE
    "plugins.wideMode.title": "Wide Mode",
    /// #endif

    "plugins.donation.title": "Powered by Paletools",
    "plugins.donation.paypal": "PayPal Donation",
    "plugins.donation.mercadopago": "MercadoPago Donation",

    /// #if process.env.COMPARE_MIN_MAX_PRICES
    "plugins.compareMinMaxPrices.settings.title": "Compare Prices",
    "plugins.compareMinMaxPrices.minPriceLabel": "Min Buy Now",
    "plugins.compareMinMaxPrices.maxPriceLabel": "Max Buy Now",
    /// #endif

    /// #if process.env.PLAYER_ACTIONS
    "plugins.playerActions.settings.title": "Player Actions",
    "plugins.playerActions.settings.copyPlayerId": "Enable Copy Player Id",
    "plugins.playerActions.settings.futbinSearch": "Enable FUTBIN search",
    "plugins.playerActions.settings.findLowestPrice": "Find lowest market price",

    "plugins.playerActions.copyPlayerId": "Copy Player Id to clipboard",
    "plugins.playerActions.futbinSearch": "FUTBIN search",
    "plugins.playerActions.findLowestPrice.button": "Find lowest market price",
    "plugins.playerActions.findLowestPrice.notFound": "Extinct",
    "plugins.playerActions.findLowestPrice.searching": "Searching...",
    /// #endif

    /// #if process.env.MARKET_SEARCH_FILTERS
    "plugins.marketSearchFilters.settings.title": "Market Search Filters",
    "plugins.marketSearchFilters.settings.savedFilters": "Enable Saved Filters",
    "plugins.marketSearchFilters.settings.playerId": "Enable Player Id",
    "plugins.marketSearchFilters.settings.playerRating": "Enable Player Rating",
    "plugins.marketSearchFilters.settings.hideDuplicates": "Hide player duplicates in Market Search",
    "plugins.marketSearchFilters.filterSaved": "Filter saved",
    "plugins.marketSearchFilters.filterDeleted": "Filter deleted",
    "plugins.marketSearchFilters.loadFilters": "-- Select a filter to load --",
    "plugins.marketSearchFilters.playerId": "Player ID",
    "plugins.marketSearchFilters.playerRating": "Player Rating",
    "plugins.marketSearchFilters.filter.name": "Filter name",
    "plugins.marketSearchFilters.filter.save": "Save",
    "plugins.marketSearchFilters.filter.delete": "Delete",
    "plugins.marketSearchFilters.playerIdWarning": "This is an experimental feature and could potentially lead to you account being banned, are you sure you want to enable it?",
    /// #endif

    /// #if process.env.SNIPE
    "plugins.snipe.settings.title": "Sniping",
    "plugins.snipe.settings.enableDisable": "Enable / Disable",
    "plugins.snipe.settings.results.pressEnter": "Auto press ENTER after buy",
    "plugins.snipe.settings.search.enableBotMode": "BOT Mode",
    "plugins.snipe.settings.back": "Go Back",
    "plugins.snipe.settings.search.search": "Search",
    "plugins.snipe.settings.results.buy": "Buy now",
    "plugins.snipe.settings.search.resetBid": "Reset Bid",
    "plugins.snipe.settings.results.bid": "Bid",
    "plugins.snipe.settings.results.transfer": "Send item to transfer list",
    "plugins.snipe.settings.results.club": "Send item to club",
    "plugins.snipe.settings.results.sell": "Quick sell item",
    "plugins.snipe.settings.results.compare": "Compare price",
    "plugins.snipe.settings.lists.up": "Select previous player in lists",
    "plugins.snipe.settings.lists.down": "Select next player in lists",
    "plugins.snipe.settings.lists.prev": "Go to previous page",
    "plugins.snipe.settings.lists.next": "Go to next page",
    "plugins.snipe.settings.search.decMinBid": "Decrease min bid value",
    "plugins.snipe.settings.search.incMinBid": "Increase min bid value",
    "plugins.snipe.settings.search.decMaxBid": "Decrease max bid value",
    "plugins.snipe.settings.search.incMaxBid": "Increase max bid value",
    "plugins.snipe.settings.search.decMinBuy": "Decrease min buy now value",
    "plugins.snipe.settings.search.incMinBuy": "Increase min buy now value",
    "plugins.snipe.settings.search.decMaxBuy": "Decrease max buy now value",
    "plugins.snipe.settings.search.incMaxBuy": "Increase max buy now value",
    "plugins.snipe.settings.search.botModeMinBid": "Bot mode, increment min bid",
    "plugins.snipe.settings.search.botModeMinBuy": "Bot mode, increment min buy now",
    "plugins.snipe.settings.legacyMode": "Use legacy mode for buying cards (palesnipe 3.1)",
    /// #endif

    // #if process.env.DUPLICATED_TO_SBC
    "plugins.duplicatedToSbc.button.text": "Use duplicated players",
    "plugins.duplicatedToSbc.settings.title": "Duplicated to SBC",
    "plugins.duplicatedToSbc.button.textLoading": "Loading players from club... {count} loaded",
    /// #endif

    /// #if process.env.SELECT_CHEAPEST
    "plugins.selectCheapest.settings.title": "Select cheapest player automatically",
    "plugins.selectCheapest.banner.text": "Mas Barato: {name} - {minBuyNow}",
    /// #endif

    /// #if process.env.FILL_SBC_FROM_FUTBIN
    "plugins.fillSbcFromFutbin.settings.title": "Fill SBC with FUTBIN",
    "plugins.fillSbcFromFutbin.settings.importToolLabel": "Install FUTBIN Link",
    "plugins.fillSbcFromFutbin.settings.importToolLinkText": "Export FUTBIN SBC",
    "plugins.fillSbcFromFutbin.settings.installInstructions": "Drag the install link to the bookmarks bar",
    "plugins.fillSbcFromFutbin.button.text": "Import SBC from FUTBIN",
    "plugins.fillSbcFromFutbin.button.textLoading": "Loading players from club... {count} loaded",
    "plugins.fillSbcFromFutbin.copyError": "There was an error importing SBC from FUTBIN, make sure you use the Export FUTBIN SBC first",
    /// #endif

    /// #if process.env.MARK_DUPLICATED
    "plugins.markDuplicated.settings.title": "Highlight duplicated players",
    /// #endif

    /// #if process.env.IMPROVED_PLAYER_SEARCH
    "plugins.improvedPlayerSearch.settings.title": "Improved player search",
    /// #endif

    /// #if process.env.SBC_SELECT_MULTIPLE_PLAYERS
    "plugins.sbcSelectMultiplePlayers.settings.title": "Select Multiple Players on SBCs",
    // #endif

    /// #if process.env.FILTER_SBCS
    "plugins.filterSbcs.settings.title": "Filter SBCs",
    "plugins.filterSbcs.label": "Search",
    "plugins.filterSbcs.sort.label": "-- Sort By --",
    "plugins.filterSbcs.sort.byId": "Newly added first",
    "plugins.filterSbcs.sort.byEndTime": "Closes expiration first",
    "plugins.filterSbcs.sort.byTimesCompleted": "More Times Completed first",
    "plugins.filterSbcs.sort.byChallengesCompletedCount": "More completed first",
    // #endif

    /// #if process.env.SETTINGS_MENU
    "plugins.settings.title": "Paletools Settings",
    /// #endif

    /// #if process.env.CLUB_ANALYZER
    "plugins.clubAnalyzer.settings.title": "Club Analyzer",
    "plugins.clubAnalyzer.view.dashboard.description": "Players count (including duplicated, not including loans) in club + unnasigned up to 50, watchlist (won) up to 100 and tradepile",
    "plugins.clubAnalyzer.view.loading.players": "Loading players {count} loaded...",
    "plugins.clubAnalyzer.view.loading.usermassinfo": "Loading unassigned players data...",
    "plugins.clubAnalyzer.view.loading.watchlist": "Loading watchlist data...",
    "plugins.clubAnalyzer.view.loading.tradepile": "Loading tradepile data...",
    "plugins.clubAnalyzer.view.loading.process": "Processing information",
    "plugins.clubAnalyzer.view.buttons.reload": "Reload",
    "plugins.clubAnalyzer.view.buttons.exportCsv": "Export as CSV",
    "plugins.clubAnalyzer.view.buttons.exportHtml": "Export as HTML",
    /// #endif

    /// #if process.env.SHOW_CONSOLE_OUTPUT
    "plugins.showConsoleOutput.settings.title": "Show Console Output",
    /// #endif

    /// #if process.env.SBC_TIMES_COMPLETED
    "plugins.sbcTimesCompleted.settings.title": "SBC times completed notification",
    /// #endif

    /// #if process.env.COUNT_MY_PACKS
    "plugins.countMyPacks.settings.title": "My Packs counter",
    /// #endif

    /// #if process.env.GROUP_MY_PACKS
    "plugins.groupMyPacks.settings.title": "Group My Packs",
    /// #endif

    /// #if process.env.TRANSFER_LIST_SEND_ALL_TO_CLUB
    "plugins.transferListSendAllToClub.settings.title": "Send Non Duplicated From Transfer List to Club",
    "plugins.transferListSendAllToClub.button.text": "Send Non Duplicated To Club",
    /// #endif

    /// #if process.env.SBC_BUILDER_ENHACER
    "plugins.sbcBuilderEnhacer.settings.title": "SBC Builder Enhacer",
    "plugins.sbcBuilderEnhacer.filter.ratings.title": "Ratings",
    "plugins.sbcBuilderEnhacer.filter.ratings.min.label": "Min",
    "plugins.sbcBuilderEnhacer.filter.ratings.max.label": "Max",
    "plugins.sbcBuilderEnhacer.filter.settings.title": "Settings",
    "plugins.sbcBuilderEnhacer.filter.settings.maxPlayers.label": "Players Count",
    "plugins.sbcBuilderEnhacer.filter.search.ignorePlayersPos": "Ignore Players Positions",
    /// #endif


    /// #if process.env.CLUB_SEARCH_ENHACER
    "plugins.clubSearchEnhacer.settings.title": "Club Search Enhacer",

    /// #if process.env.SBC_SMART_BUILDER
    "plugins.sbcSmartBuilder.button.text": "Smart Builder",
    /// #endif

    /// #if process.env.DISABLE_PACK_ANIMATIONS
    "plugins.disablePackAnimations.settings.title": "Disable Pack Opening Animations",
    /// #endif

    /// #if process.env.KEEP_PLAYER_SELL_VALUES
    "plugins.keepPlayerSellValues.settings.title": "Keep player sell values",
    /// #endif

    /// #if process.env.SELL_MULTIPLE
    "plugins.sellMultiple.settings.title": "Sell multiple items at once",
    "plugins.sellMultiple.button.text": "Sell Multiple",
    "plugins.sellMultiple.label.ignoredCards": "Card will be ignored if teh price range does not fall in the provided values",
    "plugins.sellMultiple.warning": "This is an automation feature, your account could potentially be banned if you are abusing of it, are you sure you want to enable it?",
    "plugins.sellMultiple.notifications.maxPlayersReached": "You have reached the limit of {PLAYERS} players you can listº",
    "plugins.sellMultiple.notifications.wait": "Please wait {SECONDS} seconds before performing another list",
    /// #endif

    /// #if process.env.INCREASE_ALLOWED_AUCTIONS
    "plugins.increaseAllowedAuctions.settings.title": "Increase Allowed Auctions",
    /// #endif

    "plugins.eaBugFixer.settings.title": "Fix EA mistakes",
};

