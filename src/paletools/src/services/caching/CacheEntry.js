export default class CacheEntry {
    #key;
    #data;
    #expirationDateUtc;

    contructor(key, data, expirationDateUtc) {
        this.#key = key;
        this.#data = data;
        this.#expirationDateUtc = expirationDateUtc;
    }

    get key() {
        return this.#key;
    }

    get data() {
        return this.#data;
    }

    get expirationDateUtc() {
        return this.#expirationDateUtc;
    }

    set expirationDateUtc(value) {
        this.#expirationDateUtc = value;
    }

    get isExpired() {
        return new Date().getUTCDate() > this.#expirationDateUtc;
    }
}