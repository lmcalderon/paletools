import localize from "../../localization";
import SettingsView from "./SettingsView";

const SettingsController = function (menus) {
    this._menus = menus;
    UTViewController.call(this);
};

JSUtils.inherits(SettingsController, UTViewController);

SettingsController.prototype._getViewInstanceFromData = function () {
    return new SettingsView(this._menus);
}

SettingsController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
}

SettingsController.prototype.getNavigationTitle = function () {
    return localize("plugins.settings.title");
}

export default SettingsController;