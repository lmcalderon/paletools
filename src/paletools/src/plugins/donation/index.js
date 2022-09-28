let plugin;

/// #if process.env.DONATION
import VERSION from "../../version";
import { addStyle } from "../../utils/styles";
import styles from "./styles.css";
import localize from "../../localization";
import { createElem } from "../../utils/dom";

let version = VERSION;

function run() {

    var html = `<h3>v${version} - ${localize('plugins.donation.title')}</h3>
        <div><a href="https://streamlabs.com/paleta_ar/tip" target="_blank">${localize('plugins.donation.paypal')}</a></div>
        <div><a href="https://ceneka.net/mp/d/paletaeaa" target="_blank">${localize('plugins.donation.mercadopago')}</a></div>
        <div>Follow me at&nbsp;<a href="https://twitter.com/paleta" target="_blank">@paleta</a></div>`;

    var donationDiv = createElem("div", { id: "palesnipe-donation-ui", className: "palesnipe-element" }, html);

    document.querySelector(".ut-fifa-header-view").appendChild(donationDiv);

    addStyle('paletools-donation', styles);
}

plugin =  {
    run: run,
    order: 2
};


/// #endif
export default plugin;