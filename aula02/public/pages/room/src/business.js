class Business{
    
    constructor({room, media, view, socketBuilder, peerBuilder }){
        this.room = room
        this.media = media
        this.view = view

        this.peerBuilder = peerBuilder
        this.socketBuilder = socketBuilder

        this.currentStream = {}
        this.socket =  {}
        this.currentPeer = {}

        this.peers = new Map()
    }
    
    static initialize(deps){
        const instance = new Business(deps);
        return instance._init()
        
    }
    //iniciar o nome do método como anderline o torna privado
    async _init(){
        this.currentStream = await this.media.getCamera(true)

        this.socket = this.socketBuilder
        .setOnUserConnected(this.onUserConnected())
        .setOnUserDisconnected(this.onUserDisconnected())
        .build()

        this.currentPeer = await this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnCallReceived(this.onPeerCallReceived())
            .setOnPeerStreamReceived(this.onPeerStreamReceived())
            .build()
        
        this.addVideoStream('user01')
    }

    addVideoStream(userId, stream = this.currentStream){
        const isCurrentId = false;
        this.view.renderVideo({
            userId,
            stream, 
            isCurrentId
        })
    }

    onUserConnected = () => (userId) =>{
        console.log('user connecetd!!!', userId)
        const stream = this.currentStream
        this.currentPeer.call(userId, stream)
        this.peers.set(userId, { stream })
        this.view.setParticipants(this.peers.size)
    }
    
    onUserDisconnected = () => userId =>{
        console.log('user disconnecetd!!!', userId )
    }

    onPeerError = () => error => console.error('error on peer!', error)
    
    onPeerConnectionOpened = () => peer => {
        const id = peer.id
        console.log('peer!!', peer)
        this.socket.emit('join-room', this.room, id)
    }

    onPeerCallReceived = () => call =>{
        console.log('answering call', call)
        call.answer(this.currentStream)
    }

    onPeerStreamReceived = () => (call, stream) => {
        const callerId = call.peer
        this.addVideoStream(callerId, stream)
        this.peers.set(callerId, { call })
        this.view.setParticipants(this.peers.size)
    }
     
}