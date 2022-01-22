let plugin;

// #if process.env.GRID_MODE
import styles from "./styles.css";
import UTLabelWithToggleControl from "../../controls/UTLabelWithToggleControl";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import localize from "../../localization";
import { EVENTS, on } from "../../events";

const cfg = settings.plugins.gridMode;

function run(){

    function addStyles(){
        $(document.body).addClass("paletools-gridmode");
        addStyle('paletools-grid', styles);
    }

    function removeStyles() {
        $(document.body).removeClass("paletools-gridmode");
        removeStyle('paletools-grid');
    }

    const UTCurrencyNavigationBarView__generate = UTCurrencyNavigationBarView.prototype._generate;
    UTCurrencyNavigationBarView.prototype._generate = function _generate() {
        UTCurrencyNavigationBarView__generate.call(this);
        if (!this._gridModeGenerated) {
            this._gridModeToggle = new UTLabelWithToggleControl();

            this._gridModeToggle.setLabel(localize('plugins.gridMode.title'));
            this._gridModeToggle.onToggle = (elem, eventType, value) => {
                if(value.toggleState){
                    addStyles();
                }
                else {
                    removeStyles();
                }
                cfg.enabled = value.toggleState;
                saveConfiguration();
            };
        
            if(cfg.enabled){
                this._gridModeToggle.toggle();
            }
            
            $(this._gridModeToggle.getRootElement())
                .css({
                    borderRight: "1px solid white",
                    marginRight: "10px",
                    paddingRight: "10px"
                })
                .insertBefore(this.__currencies);
            
            on(EVENTS.APP_ENABLED, () => {
                $(this._gridModeToggle.getRootElement()).show();
                removeStyles();
                if(cfg.enabled){
                    addStyles();
                }
            });
            
            on(EVENTS.APP_DISABLED, () => {
                $(this._gridModeToggle.getRootElement()).hide();
                removeStyles();
            });

            this._gridModeGenerated = true;
        }
    }

    const UTGameFlowNavigationController_viewDidAppear = UTGameFlowNavigationController.prototype.viewDidAppear;
    UTGameFlowNavigationController.prototype.viewDidAppear = function() {
        UTGameFlowNavigationController_viewDidAppear.call(this);

        if(this._navigationBar instanceof UTCurrencyNavigationBarView){
            const toggleState = this._navigationBar._gridModeToggle.getToggleState();

            if(cfg.enabled && !toggleState){
                this._navigationBar._gridModeToggle.toggle();
            }
            else if(!cfg.enabled && toggleState){
                this._navigationBar._gridModeToggle.toggle();
            }
        }
    }
}

plugin = {
    run: run,
    order: 4
};
// #endif

export default plugin;