let plugin;

// #if process.env.WIDE_MODE
import styles from "./styles.css";
import UTLabelWithToggleControl from "../../controls/UTLabelWithToggleControl";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import localize from "../../localization";
import { EVENTS, on } from "../../events";
import { css, insertBefore } from "../../utils/dom";
import { hide, show } from "../../utils/visibility";

const cfg = settings.plugins.wideMode;

function run(){

    function addStyles(){
        addStyle('paletools-widemode', styles);
    }

    function removeStyles() {
        removeStyle('paletools-widemode');
    }

    const UTCurrencyNavigationBarView__generate = UTCurrencyNavigationBarView.prototype._generate;
    UTCurrencyNavigationBarView.prototype._generate = function _generate() {
        UTCurrencyNavigationBarView__generate.call(this);
        if (!this._wideModeGenerated) {
            this._wideModeToggle = new UTLabelWithToggleControl();

            this._wideModeToggle.setLabel(localize('plugins.wideMode.title'));
            this._wideModeToggle.onToggle = (elem, eventType, value) => {
                if(value.toggleState){
                    addStyle('paletools-widemode', styles);
                }
                else {
                    removeStyle('paletools-widemode');
                }
                cfg.enabled = value.toggleState;
                saveConfiguration();
            };
        
            if(cfg.enabled){
                this._wideModeToggle.toggle();
            }
            
            css(this._wideModeToggle.getRootElement(), {
                    borderRight: "1px solid white",
                    marginRight: "10px",
                    paddingRight: "10px"
                });

            insertBefore(this._wideModeToggle.getRootElement(), this.__currencies);   
            
            on(EVENTS.APP_ENABLED, () => {
                show(this._wideModeToggle.getRootElement());
                removeStyles();
                if(cfg.enabled){
                    addStyles();
                }
            });
            
            on(EVENTS.APP_DISABLED, () => {
                hide(this._wideModeToggle.getRootElement());
                removeStyles();
            });

            this._wideModeGenerated = true;
        }
    }

    const UTGameFlowNavigationController_viewDidAppear = UTGameFlowNavigationController.prototype.viewDidAppear;
    UTGameFlowNavigationController.prototype.viewDidAppear = function() {
        UTGameFlowNavigationController_viewDidAppear.call(this);

        if(this._navigationBar instanceof UTCurrencyNavigationBarView){
            const toggleState = this._navigationBar._wideModeToggle.getToggleState();

            if(cfg.enabled && !toggleState){
                this._navigationBar._wideModeToggle.toggle();
            }
            else if(!cfg.enabled && toggleState){
                this._navigationBar._wideModeToggle.toggle();
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