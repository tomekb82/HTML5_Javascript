(function() {

function VideoPlayer(videoContainer) {

    if(!document.createElement("video").canPlayType) {
        videoContainer.querySelector(".controls").style.display = "none";
        return;
    }
    
    this.video = videoContainer.querySelector("video");
    this.playPause = videoContainer.querySelector(".playPause");
    this.progressBar = videoContainer.querySelector(".progressBar");
    this.loadedBar = videoContainer.querySelector(".loadedBar");
    this.playbackBar = videoContainer.querySelector(".playbackBar");
    this.currentTime = videoContainer.querySelector(".currentTime");
    this.totalTime = videoContainer.querySelector(".totalTime");
    this.volume = videoContainer.querySelector(".volume");
    this.fullVolume = videoContainer.querySelector(".fullVolume");
    this.currentVolume = videoContainer.querySelector(".currentVolume");

    this.setCurrentVolume();
    this.assignEventListeners();
}
    
/* EVENTS BINDING */    
VideoPlayer.prototype.assignEventListeners = function() {
    
    // obsluga przycisku Play/Pause
    this.playPause.onclick = this.play.bind(this);
    
    // obsluga paska postepu
    this.video.addEventListener("timeupdate", this.updatePlayingProgress.bind(this), false);
    this.video.onprogress = this.updateLoadingProgress.bind(this);
    this.progressBar.onclick = this.setCurrentPlayback.bind(this);
    
    // obsluga timera
    this.video.addEventListener("timeupdate", this.updateCurrentTime.bind(this), false);
    this.video.ondurationchange = this.setDuration.bind(this);

    // obsluga glosnosci
    this.fullVolume.onclick = this.adjustVolume.bind(this);
    this.video.onvolumechange = this.setVolume.bind(this);
    //this.volume.onclick = this.changeVolume.bind(this);
    
    this.video.onended = this.resetPlayer.bind(this);
}    
   
/* PLAY/PAUSE */
VideoPlayer.prototype.play = function(e) {

    if(this.video.paused) {
        this.video.play();

        e.target.classList.remove("glyphicon-play");
        e.target.classList.add("glyphicon-pause");
    } else {
        this.video.pause();

        e.target.classList.remove("glyphicon-pause");
        e.target.classList.add("glyphicon-play");
    }

}

/* PROGRESS BAR */
VideoPlayer.prototype.updatePlayingProgress = function() {
    var percentPlayed = (this.video.currentTime / this.video.duration) * 100;

    this.playbackBar.style.width = percentPlayed + "%";
}
VideoPlayer.prototype.updateLoadingProgress = function() {
    if(this.video.buffered.length > 0) {
        var percentLoaded = (this.video.buffered.end(0) / this.video.duration) * 100;

        this.loadedBar.style.width = percentLoaded + "%";
    }
}
VideoPlayer.prototype.setCurrentPlayback = function(e) {
    var leftPos = this.progressBar.getBoundingClientRect().left,
        clickPos = e.pageX,
        pixelsFromLeft = clickPos - leftPos,
        percent = (pixelsFromLeft / this.progressBar.offsetWidth);

    var newTime = this.video.duration * percent;

    this.video.currentTime = newTime;
}

/* VOLUME */
VideoPlayer.prototype.setCurrentVolume = function() {
    this.currentVolume.style.width = (this.video.volume * 100) + "%";
}
VideoPlayer.prototype.adjustVolume = function(e) {
    var leftPos = this.fullVolume.getBoundingClientRect().left,
        clickPos = e.pageX,
        pixelsFromLeft = clickPos - leftPos,
        percent = (pixelsFromLeft / this.fullVolume.offsetWidth);

    this.video.volume = percent;
    
    if(this.video.volume < 0.3){
        this.volume.classList.remove("glyphicon-volume-up");
        this.volume.classList.add("glyphicon-volume-down");
    }else{
        this.volume.classList.remove("glyphicon-volume-down");
        this.volume.classList.add("glyphicon-volume-up");
    }

    this.setVolume();
}

VideoPlayer.prototype.changeVolume = function() {
    if(this.video.volume > 0){
        this.oldVolume = this.video.volume;
        this.video.volume = 0;
    }else {
        this.video.volume = this.oldVolume;
    }
    
    this.setVolume();
}

VideoPlayer.prototype.setVolume = function() {
    var percent = this.video.volume * 100;

    this.currentVolume.style.width = percent + "%";
}

/* TIMER */
VideoPlayer.prototype.updateCurrentTime = function() {
    this.currentTime.innerHTML = this.formatTime(this.video.currentTime);
}
VideoPlayer.prototype.setDuration = function() {
    this.totalTime.innerHTML = this.formatTime(this.video.duration);
}


VideoPlayer.prototype.resetPlayer = function() {
    this.playPause.classList.remove("glyphicon-pause");
    this.playPause.classList.add("glyphicon-play");
}

/* utility functions */
VideoPlayer.prototype.formatTime = function(seconds) {

    var seconds = Math.round(seconds),
        minutes = Math.floor(seconds / 60),
        remainingSeconds = seconds - minutes * 60;

    if(remainingSeconds == 0)
        remainingSeconds = "00";
    else if(remainingSeconds < 10)
        remainingSeconds = "0" + remainingSeconds;

    return minutes + ":" + remainingSeconds;
}

var videoPlayer = new VideoPlayer(document.querySelector("#videoPlayer"));

})();    