import { addClass, css, removeClass, select } from "./dom";

export function displayLoader() {
    addClass(select(".ut-click-shield"), "showing");
    css(select(".loaderIcon"), { display: "block" });
};

export function hideLoader() {
    removeClass(select(".ut-click-shield"), "showing");
    css(select(".loaderIcon"), { display: "none" });
};