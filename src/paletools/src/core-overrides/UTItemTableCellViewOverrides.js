import { addClass } from "../utils/dom";

export default function executeItemTableCellViewOverrides(){
    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);

        if(this.data.untradeable){
            addClass(this.getRootElement(), "untradeable");
        }
    }
}