import { toPromise } from "../utils/observable";

export async function getUserCredits() {
    const response = await toPromise(services.User.requestCurrencies());
    if(response.success){
        return response.data
    }
    else {
        return {
            coins: new UTCurrencyVO(GameCurrency.COINS, 0),
            packs: 0,
            points: new UTCurrencyVO(GameCurrency.POINTS, 0),
            tokens: new UTCurrencyVO(GameCurrency.DRAFT_TOKEN, 0)
        };
    }
};