export default class ItemPrice {
    #definitionId;
    #price;
    #platform;

    constructor(definitionId, price, platform) {
        this.#definitionId = definitionId;
        this.#price = price;
        this.#platform = platform;
    }

    get definitionId() {
        return this.#definitionId;
    }

    get price() {
        return this.#price;
    }

    get platform() {
        return this.#platform;
    }
}