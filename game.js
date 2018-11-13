import { Tiles } from './tiles.js';

var game;
// Size of the board
let gameSize = 5;

var gameOptions = {
    tileSize: 200,
    colors: {
        1: 0xFFFFFF,
        2: 0xFFFFFF,
        3: 0xFFEEEE,
        4: 0xFFDDDD,
        5: 0xFFCCCC,
        6: 0xFFBBBB,
        7: 0xFFAAAA,
        8: 0xFF9999,
        9: 0xFF8888,
        10: 0xFF7777,
        11: 0xFF6666,
        12: 0xFF5555,
        13: 0xFF4444,
        14: 0xFF3333,
        15: 0xFF2222,
        16: 0xFF1111,
    },
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
    create: function(){
        let tiles = (new Tiles)
        this.timedEvent = 0
        this.gameSize = gameSize
        this.displayTime = 0
        this.fieldArray = []
        this.validator = []
        this.fieldGroup = this.add.group();
        tiles.setUpTiles(this, gameOptions)
        this.scoreText = this.add.text(16, game.config.height - 100, 'Score: '+ 0 , { fontSize: '64px', fill: '#fff', fontWeight: 'bold'  });
        this.startTimer()
        this.initalizeGame()
        this.setUpGameLogic()
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
    isInsideBoard: function(row, col){
        return (row >= 0) && (col >= 0) && (row < this.gameSize) && (col < this.gameSize);
    },
    // This only occurs once game board reset should not run this method

    setUpGameLogic: function() {
        this.input.on('gameobjectdown', function (p, go) { 
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
