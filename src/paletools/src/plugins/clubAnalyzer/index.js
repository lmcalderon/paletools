let plugin;
import { addLabelWithToggle } from "../../controls";
/// #if process.env.CLUB_ANALYZER
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";
import { addStyle } from "../../utils/styles";
import { ClubAnalyzerController } from "./ClubAnalyzerController";
import styles from "./styles.css";

const cfg = settings.plugins.clubAnalyzer;

function run() {

    function generateClubAnalyzerTab() {
        const clubAnalyzerTab = new UTTabBarItemView();
        clubAnalyzerTab.init();
        clubAnalyzerTab.setTag(9);
        clubAnalyzerTab.setText(localize("plugins.clubAnalyzer.settings.title"));
        clubAnalyzerTab.addClass("icon-club");
        clubAnalyzerTab.getRootElement().classList.add("paletools-element");
        return clubAnalyzerTab;
    }

    const UTGameTabBarController_initWithViewControllers = UTGameTabBarController.prototype.initWithViewControllers;
    UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
        const clubAnalyzerNav = new UTGameFlowNavigationController();
        clubAnalyzerNav.initWithRootController(new ClubAnalyzerController());
        clubAnalyzerNav.tabBarItem = generateClubAnalyzerTab();
        tabs.push(clubAnalyzerNav);
        UTGameTabBarController_initWithViewControllers.call(this, tabs);
    };

    addStyle('paletools-club-analyzer', styles.replace("#EXTENDED_PLAYER_INFO.TOTAL#", localize("extendedPlayerInfo.total")));
}

function menu() {
    const container = document.createElement("div");
    container.classList.add("menuContainer");
    addLabelWithToggle(container, "plugins.clubAnalyzer.settings.autoRefresh", cfg.autoRefresh, toggleState => {
        cfg.autoRefresh = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 20,
    menu: menu,
    settings: {
        name: 'club-analyzer',
        title: 'plugins.clubAnalyzer.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;