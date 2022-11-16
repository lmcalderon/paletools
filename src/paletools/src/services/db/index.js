import { logDebug } from "../log";
import getWindow from "../window";
import { TransactionsStore } from "./transactions";

class Database {
    #db;

    constructor() {
        this.#db = null;
        this.initPromise = null;
        this.transactions = null;
    }

    executeQuery(store, func) {
        return new Promise((resolve, reject) => {
            if (!this.#db) {
                resolve();
            }

            this.initPromise.then(() => {
                const request = func(this.#db.transaction(store).objectStore(store));

                request.addEventListener("success", ev => {
                    resolve(ev.target.result);
                });

                request.addEventListener("error", ev => {
                    reject(ev);
                });
            });
        });
    }

    createStore(storeName, options) {
        return this.#db.createObjectStore(storeName, options);
    }

    deleteStore(storeName) {
        return this.#db.deleteObjectStore(storeName);
    }

    addRecord(storeName, record) {
        return this.#db
        .transaction(storeName, "readwrite")
        .objectStore(storeName)
        .add(record);
    }

    isSupported() {
        return getWindow().indexedDB;
    }

    init() {
        this.transactions = new TransactionsStore(this);

        this.initPromise = new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("paletools", 5);

            openRequest.addEventListener("upgradeneeded", async ev => {
                this.#db = ev.target.result;
                logDebug(`Event: ${JSON.stringify(ev)}`);
                logDebug(`Updgrading from v${ev.oldVersion} to v${ev.newVersion}`);
                this.transactions.build(ev.oldVersion);
            });

            openRequest.addEventListener("error", () => {
                reject();
            })

            openRequest.addEventListener("success", ev => {
                this.#db = ev.target.result;
                resolve();
            });
        });

        return this.initPromise;
    }
   
}


const db = new Database();

export default db;
