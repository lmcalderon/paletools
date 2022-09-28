let plugin;

/// #if process.env.SETTINGS_MENU
import SettingsController from "./SettingsController";
import styles from "./styles.css";
import { addStyle } from "../../utils/styles";
import localize from "../../localization";

plugin = {
    run: (menus) => {
        const UTGameTabBarController_initWithViewControllers = UTGameTabBarController.prototype.initWithViewControllers;
        UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
            const paletoolsNav = new UTGameFlowNavigationController();
            paletoolsNav.initWithRootController(new SettingsController(menus));
            paletoolsNav.tabBarItem = generatePaletoolsSettingsTab();
            tabs.push(paletoolsNav);
            UTGameTabBarController_initWithViewControllers.call(this, tabs);
        }

        function generatePaletoolsSettingsTab() {
            const tab = new UTTabBarItemView();
            tab.init();
            tab.setTag(6);
            tab.setText(localize("plugins.settings.title"));
            tab.addClass("icon-transfer");
            tab.getRootElement().classList.add("paletools-element");
            return tab;
        }

        addStyle('paletools-settings', styles);
    }
}
/// #endif

export default plugin;