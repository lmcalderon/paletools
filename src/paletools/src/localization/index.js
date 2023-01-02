import localeEn from './locales/en';
import localeEs from "./locales/es";
import getWindow from "../services/window";

const dictionary = {
    'en': localeEn,
    'es': localeEs
};

export default function localize(key) {
    const lang = services.Localization.locale.language;

    const dict = dictionary[lang] || dictionary['en'];

    if (dict[key]) {
        return dict[key];
    }

    return services.Localization.localize(key);
}

export function localizeNumber(number) {
    return services.Localization.localizeNumber(number);
}

export function localizeDate(date) {
    return services.Localization.localizeDate(date);
}

export function localizePosition(positionId){
    return UTLocalizationUtil.positionIdToName(positionId, services.Localization);
}

const monthKeys = ["january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december"];

export function localizeMonthAbbr(date) {
    return localize(`date.${monthKeys[date.getMonth() - 1]}`);
}

export function getLeagueAbbr5(id) {
    return localize(`global.leagueabbr5.${getWindow().APP_YEAR}.league${id}`);
}
