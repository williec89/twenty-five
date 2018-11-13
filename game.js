import { Tiles } from './tiles.js';

var game;
// Size of the board
let gameSize = 2;
var gameOptions = {
    tileSize: 200,
    tweenSpeed: 1500
}

window.onload = function() {
    var gameConfig = {
       type: Phaser.WEBGL,
       width: gameOptions.tileSize * gameSize,
       height: gameOptions.tileSize * gameSize + 125,
       backgroundColor: 0x333333,
       scene: [playGame]
   };
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

var playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function playGame(){
        Phaser.Scene.call(this, {key: "PlayGame"})
    },
    preload: function(){
        this.load.image("tile", "tile.png")
    },
    init: function() {
        this.timedEvent = 0
        this.gameSize = gameSize
        this.displayTime = 0
        this.fieldArray = []
        this.validator = []
    },
    create: function(){
        this.tiles = (new Tiles)
        this.init()
        this.fieldGroup = this.add.group();
        this.tiles.setUpTiles(this, gameOptions)
        this.scoreText = this.add.text(16, game.config.height - 100, 'Score: '+ 0 , { fontSize: '64px', fill: '#fff', fontWeight: 'bold'  });
        this.startTimer()
        this.initalizeGame()
        this.setUpGameLogic()
    },
    exit: function() {
        // this.scoreText.remove();
        this.game.state.restart()
    },
    startTimer: function(scoreText)
    {
        this.timedEvent = this.time.addEvent({ delay: 10, callback: this.updateTime, callbackScope: this});
    },
    updateTime: function()
    {
        this.displayTime += 1
        this.timedEvent.reset({ delay: 10, callback: this.updateTime, callbackScope: this, repeat: 1});
        this.scoreText.setText('Time: '+this.displayTime.toString()+"ms");
        this.scoreText.setStyle({ fontSize: '64px', fill: '#fff', fontWeight: 'bold' });
    },
    initalizeGame: function(){
        var emptyTiles = [];
        for(var i = 0; i < this.gameSize; i++){
            for(var j = 0; j < this.gameSize; j++){
                if(this.fieldArray[i][j].tileValue == 0){
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        for (var i = 1; i <= this.gameSize*this.gameSize; i++) {
            this.validator.push(i)
            var chosenTile = Phaser.Utils.Array.RemoveRandomElement(emptyTiles);
            this.fieldArray[chosenTile.row][chosenTile.col].tileValue = i;
            this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
            this.fieldArray[chosenTile.row][chosenTile.col].tileText.setText(i.toString());
            this.fieldArray[chosenTile.row][chosenTile.col].tileText.visible = true;
            this.tweens.add({
                targets: [this.fieldArray[chosenTile.row][chosenTile.col].tileSprite, this.fieldArray[chosenTile.row][chosenTile.col].tileText],
                alpha: 1,
                duration: gameOptions.tweenSpeed,
                onComplete: function(tween){
                    tween.parent.scene.canMove = true;
                },
            });
        }
    },

    setUpGameLogic: function() {
        this.input.on('gameobjectdown', function (p, go) {
            if (go.restart) {
                this.exit()
                this.create()
                return
            }
            let tileVal = this.fieldArray[go.row][go.col].tileValue;    
            if (tileVal == this.validator[0]) {
                this.validator.shift()
                this.fieldArray[go.row][go.col].tileSprite.visible = 0
                this.fieldArray[go.row][go.col].tileText.visible = 0
                this.scoreText.setStyle({ fontSize: '64px', fill: '#00ff00', fontWeight: 'bold' });
                this.timedEvent.reset({ delay: 150, callback: this.updateTime, callbackScope: this, repeat: 0});
            } else {
                this.displayTime += 200
                this.scoreText.setText('Time: '+this.displayTime.toString()+"ms");
                this.scoreText.setStyle({ fontSize: '64px', fill: '#ff0000', fontWeight: 'bold' });
                this.timedEvent.reset({ delay: 200, callback: this.updateTime, callbackScope: this, repeat: 0});
            }

            if (this.validator.length == 0) {
                // add functionality when game is finished
                this.add.text(game.config.height/2 - 33*4, (game.config.height - 100)/2, "Game!" , { fontSize: '64px', fill: '#fff', fontWeight: 'bold'  });
                let playAgain = this.add.text(game.config.height/2 - 33*4, (game.config.height - 170)/2, "Play Again?" , { fontSize: '64px', fill: '#ddd', fontWeight: 'bold'  })
                playAgain.restart = true
                playAgain.setInteractive()
                this.timedEvent.reset();
            }
        }, this)
    }
});
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
