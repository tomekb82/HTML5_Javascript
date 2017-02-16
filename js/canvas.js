(function() {


function Avatar(canvas){

    this.canvas = canvas,
    this.ctx = canvas.getContext("2d"),
    this.shape = canvas.dataset.shape;
    
    this.avatar = new Image();
    this.avatar.src = canvas.dataset.avatar;
    this.avatar.id = "avatar";
    this.avatar.alt = "";
    
    this.createAvatar();
};
    
Avatar.prototype.createAvatar = function(){
    this.ctx.beginPath();
    if(this.shape == 'circle'){
        this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.canvas.width/2, 0, 2*Math.PI);
    }else if(this.shape == 'square'){
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.clip();
    this.ctx.drawImage(this.avatar, 0, 0);
}

    
if(document.createElement("canvas").getContext){
  var avatar1 = new Avatar(document.querySelector("#canvas1"));
  var avatar2 = new Avatar(document.querySelector("#canvas2"));
};


})();