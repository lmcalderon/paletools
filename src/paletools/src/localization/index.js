import localeEn from './locales/en';
import localeEs from "./locales/es";

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

const monthKeys = ["january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december"];

export function localizeMonthAbbr(date) {
    return localize(`date.${monthKeys[date.getMonth() - 1]}`);
}