const inspectors = [];

export function registerXmlHttpRequestInspector(inspector){
    inspectors.push(inspector);
}

export function getRegisteredXmlHttpRequestInspectors(){
    return inspectors;
}