class PeerBuilder{
    constructor({peerConfig}){
        this.peerConfig = peerConfig
        const defaultValue = () =>{}
        this.onError = defaultValue
        this.onCallReceived = defaultValue
        this.onConnectionOpened = defaultValue
        this.onPeerStreamReceived = defaultValue
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
        this.onCallReceived(call)
    }

    build() {
        const peer = new Peer(...this.peerConfig)

        peer.on('error', this.onError)
        peer.on('call', this._prepareCallEvent.bind(this))

        return new Promise(resolve => peer.on('open', id =>{
            this.onConnectionOpened(peer)
            return resolve(peer)
        }))
    }
}