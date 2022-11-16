import getWindow from "../services/window";

export function resetConsole(){
     // reset console
     let iframe = document.createElement('iframe');
     iframe.style.display = 'none';
     document.body.appendChild(iframe);
     getWindow().console = iframe.contentWindow.console;
}