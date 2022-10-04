class  MessageBus {

    constructor(){
        this.subscribers = {};
    }

    publish(cmd, args){
        if(jsBridge){
            jsBridge.invokeAction(JSON.stringify({ command: cmd, commandArgs: args }));
        }
    }

    subscribe(cmd, callback){
        if(!this.subscribers[cmd]){
            this.subscribers[cmd] = [];
        }
        this.subscribers[cmd].push(callback);
    }

    notify(cmd, args){
        if(this.subscribers[cmd]){
            for(let sub of this.subscribers[cmd]){
                sub(args);
            }
        }
    }
}

const messageBus = new MessageBus();

window.messageBus = messageBus;

export default messageBus;
