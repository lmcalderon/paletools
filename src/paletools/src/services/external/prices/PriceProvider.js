export class PriceProvider {
    constructor() {
        if(this.constructor === PriceProvider){
            throw new Error("PriceProvider is abstract");
        }
    }

    async getItemPrices(items, gamePlatform) {
        throw new Error("Method 'getItemPrices' must be implemented");
    }
}