export default function delay(msec, msec2) {
    msec = msec2 ? Math.random() * (msec2 - msec) + msec : msec;
    msec = (msec / 1000 + Math.floor(Math.random())) * 1000;
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}