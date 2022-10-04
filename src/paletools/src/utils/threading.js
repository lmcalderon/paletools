export default function fork() {
    return new Promise(resolve => {
        setTimeout(resolve);
    });
}