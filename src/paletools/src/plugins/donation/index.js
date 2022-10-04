import desktopPlugin from "./desktop";
import mobilePlugin from "./mobile";

let plugin;
if(desktopPlugin){
    plugin = desktopPlugin;
}
else {
    plugin = mobilePlugin;
}

export default plugin;