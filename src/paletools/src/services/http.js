export default function http(url, method, body){
    return fetch(`${window.services.Authentication.sessionUtas.url}/ut/game/fifa${window.APP_YEAR_SHORT}/${url}`, {
        method: method || 'GET',
        headers: {
            "X-UT-SID": services.Authentication.getUtasSession()["id"],
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null
    }).then(response => response.json());
}