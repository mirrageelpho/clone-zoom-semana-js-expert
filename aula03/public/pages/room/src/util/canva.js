/* $(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var video = document.getElementById('video');
  
    video.addEventListener('play', function() {
      var $this = this; //cache
      (function loop() {
        if (!$this.paused && !$this.ended) {
          
  
          ctx.drawImage($this, 0, 0);
          ctx.font = "12px Arial";
          ctx.fillText("Info do vídeo", 10, 20);
          setTimeout(loop, 1000 / 30); // drawing at 30fps
        }
      })();
    }, 0);
  }); */