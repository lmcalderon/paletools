class Storage {
    set(key, value, persist) {
        key = `paletools:${key}`;
        value = JSON.stringify(value);
        if (persist) {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    }

    get(key) {
        key = `paletools:${key}`;
        let value = sessionStorage.getItem(key);
        if(!value){
            value = localStorage.getItem(key);
        }
        if (value) {
            return JSON.parse(value);
        }
    }
}

const storage = new Storage();

export default storage;