import { logDebug } from "../log";
import getWindow from "../window";
import { TransactionsStore } from "./transactions";
import { UnassignedStore } from "./unassigned";

IDBRequest.prototype.toPromise = function () {
    const request = this;

    return new Promise((resolve, reject) => {
        request.addEventListener("success", ev => {
            resolve(ev);
        });

        request.addEventListener("error", ev => {
            reject(ev);
        });
    });
}

class Database {
    #db;

    constructor() {
        this.#db = null;
        this.initPromise = null;
        this.transactions = null;
        this.unassigned = null;
    }

    executeQuery(storeName, func) {
        return new Promise((resolve, reject) => {
            if (!this.#db) {
                resolve();
            }

            this.initPromise.then(() => {
                const request = func(this.#db.transaction(storeName).objectStore(storeName));

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

    clearStore(storeName) {
        return this.#db.transaction(storeName, "readwrite").objectStore(storeName).clear().toPromise();
    }

    executeNonQuery(storeName, func) {
        return new Promise((resolve, reject) => {
            if (!this.#db) {
                resolve();
            }

            this.initPromise.then(() => {
                const request = func(this.#db.transaction(storeName, "readwrite").objectStore(storeName));

                request.addEventListener("success", ev => {
                    resolve(ev.target.result);
                });

                request.addEventListener("error", ev => {
                    reject(ev);
                });
            });
        });
    }

    addRecord(storeName, record, key) {
        return this.executeNonQuery(storeName, store => key ? store.add(record, key) : store.add(record));
    }

    isSupported() {
        return getWindow().indexedDB;
    }

    init() {
        this.transactions = new TransactionsStore(this);
        //this.unassigned = new UnassignedStore(this);

        this.initPromise = new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(`paletools`, 6);

            openRequest.onblocked = function (e) {
                logDebug("DB request blocked");
                // Another connection is open, preventing the upgrade,
                // and it didn't close immediately.
            };

            openRequest.addEventListener("upgradeneeded", async ev => {
                this.#db = ev.target.result;
                logDebug(`Event: ${JSON.stringify(ev)}`);
                logDebug(`Updgrading from v${ev.oldVersion} to v${ev.newVersion}`);
                this.transactions.build(ev.oldVersion);
                //this.unassigned.build(ev.oldVersion);
            });

            openRequest.addEventListener("error", ev => {
                logDebug(`Error opening database: ${JSON.stringify(ev)}`);
                reject();
            })

            openRequest.addEventListener("success", ev => {
                this.#db = ev.target.result;
                const connection = openRequest.result;
                connection.onversionchange = function (e) {
                    logDebug('Version chagned');
                    // Close immediately to allow the upgrade requested by another
                    // instance to proceed.
                    connection.close();
                };

                resolve();
            });
        });

        return this.initPromise;
    }

}


const db = new Database();

export default db;
