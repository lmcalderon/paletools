export default class Cache {
    #entries = {};

    #defaultExpirationSeconds;

    constructor(defaultExpirationSeconds){
        this.#defaultExpirationSeconds = defaultExpirationSeconds;
    }

    get keys() {
        return Object.keys(this.#entries);
    }

    set(cacheEntry) {
        this.#expireEntries();

        if(!cacheEntry.expirationDateUtc && this.#defaultExpirationSeconds) {
            const date = new Date();
            date.setSeconds(date.getSeconds() + this.#defaultExpirationSeconds);
            cacheEntry.expirationDateUtc = date.getUTCDate();
        }

        this.#entries[cacheEntry.key] = cacheEntry; 
    }

    get(key) {
        this.#expireEntries();
        if(this.#entries[key]) return this.#entries[key];

        return null;
    }

    remove(key) {
        this.#expireEntries();
        if(this.#entries[key]) {
            delete this.#entries[key];
        }
    }

    #expireEntries(){
        for(let entry of Object.values(this.#entries)){
            if(entry.isExpired){
                delete this.#entries[entry.key];
            }
        }
    }
}