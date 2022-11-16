export default function getWindow() {
    if(typeof unsafeWindow !== "undefined") {
        return unsafeWindow;
    }

    return window;
}