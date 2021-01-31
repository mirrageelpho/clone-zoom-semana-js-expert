class PeerBuilder{
    constructor({peerConfig}){
        this.peerConfig = peerConfig
        const defaultValue = () =>{}
        this.onError = defaultValue
        this.onCallReceived = defaultValue
        this.onConnectionOpened = defaultValue
        this.onPeerStreamReceived = defaultValue
        this.onCallError = defaultValue
        this.onCallClose = defaultValue
    }
    
    setOnCallError(fn){
        this.onCallError = fn;
        return this
    }

    setOnCallClose(fn){
        this.onCallClose = fn;
        return this
    } 

    setOnError(fn){
        this.onError = fn
        return this
    }
    setOnCallReceived(fn){
        this.onCallReceived = fn
        return this
    }
    setOnConnectionOpened(fn){
        this.onConnectionOpened = fn
        return this
    }

    setOnPeerStreamReceived(fn){
        this.onPeerStreamReceived = fn
        return this
    }
    
    _prepareCallEvent(call){
        console.log('calling!!!',call)
        call.on('stream', stream => this.onPeerStreamReceived(call, stream))
        call.on('error', error=>this.onCallError(call, error))
        call.on('close', _ => this.onCallClose(call))
        this.onCallReceived(call)
    }

    //Adciona eventos de call também pra quem liga
    _preparePeerInstanceFunction(peerModule){
        class PeerCustomModule extends peerModule {}

        const peerCall = PeerCustomModule.prototype.call
        const context = this

        PeerCustomModule.prototype.call = function (id, stream ) {
            const call = peerCall.apply(this, [id, stream])
            // aqui interceptamos o call e adcionamos todos os evendos
            // da chamada para quem liga também
            context._prepareCallEvent(call)
            return call
        }
        console.log('Substituindo peear call')
        return PeerCustomModule
    }

    build() {
        // substituindo o objeto peer original pelo peer custommodule
        //const peer = new Peer(...this.peerConfig)
        const PeerCustomIntance = this._preparePeerInstanceFunction(Peer)
        const peer = new PeerCustomIntance(...this.peerConfig)

        peer.on('error', this.onError)
        peer.on('call', this._prepareCallEvent.bind(this))

        return new Promise(resolve => peer.on('open', id =>{
            this.onConnectionOpened(peer)
            return resolve(peer) 
        }))
    }
}