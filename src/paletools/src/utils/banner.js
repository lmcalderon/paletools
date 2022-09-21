import { createElem, insertAfter, select } from "./dom";


export function updateBanner(msg){
    let bannerMessage = select("#banner-message");

    if(!bannerMessage){
        bannerMessage = createElem("div", { id: "banner-message", className: "title"});
        insertAfter(bannerMessage, select(".ut-navigation-bar-view .title"));
    }

    bannerMessage.textContent = msg;
}