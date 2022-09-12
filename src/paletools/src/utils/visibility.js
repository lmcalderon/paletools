export function show(elem){
    if(!elem) return;

    if(elem.getRootElement){
        elem = elem.getRootElement();
    }

    $(elem).removeClass("hide");
}

export function hide(elem){
    if(!elem) return;

    if(elem.getRootElement){
        elem = elem.getRootElement();
    }
    
    $(elem).addClass("hide");
}