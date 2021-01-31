 class Media{
     async getCamera(audio=true, video = true){
        if(navigator?.mediaDevices){
            return navigator?.mediaDevices?.getUserMedia({
                video,
                audio
            })
        }
        console.log('error, mabe you navigator is not compatible with mediaDevices api', navigator)
        return navigator.getUserMedia
     }
 }