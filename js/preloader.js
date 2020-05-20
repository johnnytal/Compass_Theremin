var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){ 
        font = 'Kavoon';

        this.progress = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 30, '0%',{
             font: '25px ' + font, fill: 'darkblue', fontWeight: 'normal', align: 'center'
        });
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.game.load.image("compass", "images/zodiac.png");
        this.game.load.image("bg", "images/bg.jpg");
    },
    
    create: function(){
        this.game.state.start("Game");
    }
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text = progress+"%";
};
