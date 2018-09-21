'use strict'
class GestioneServer {
    constructor(argStartNode){
        this.argStartNode = new Object();
        if (typeof argStartNode === 'object'){
            this.argStartNode = argStartNode;
        } else {
            throw("Non sono stati passati parametri");
        }
        //init porta e parametro per CORS
        this.portaThread = 0;
        this.setupCors = '';
    }
    
    setPortaThread(posParam){
        if (this.argStartNode[posParam] && !isNaN(parseInt(this.argStartNode[posParam]))){
            this.portaThread = parseInt(this.argStartNode[posParam]);
        }
    }

    setSetupCors(localHost){
        if (typeof localHost === 'string'){
            this.setupCors = `${localHost}:${this.getPortaThread().toString}`;
        }
    }

    getPortaThread(){
        return this.portaThread;
    }

    getSetupCors(){
        return this.setupCors;
    }

}
module.exports=GestioneServer;