/// #if process.env.FX
const fx = {
    "tuki": new Audio("data:audio/mp3;base64,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"),
    "castigo": new Audio("data:audio/mp3;base64,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")
}
/// #endif


export function playAudio(name){
/// #if process.env.FX
    if(!fx[name]) return;

    fx[name].play();
/// #endif    
}