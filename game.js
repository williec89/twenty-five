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
       height: gameOptions.tileSize * gameSize,
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
        Phaser.Scene.call(this, {key: "PlayGame"});
    },
    preload: function(){
        this.load.image("tile", "tile.png");
    },
    create: function(){
        this.fieldArray = [];
        this.validator = []
        this.fieldGroup = this.add.group();
        this.setUpTiles()

        this.initalizeGame()
        this.setUpGameLogic()
    },
    initalizeGame: function(){
        var emptyTiles = [];
        for(var i = 0; i < gameSize; i++){
            for(var j = 0; j < gameSize; j++){
                if(this.fieldArray[i][j].tileValue == 0){
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        for (var i = 1; i <= gameSize*gameSize; i++) {
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
    resetTiles: function(){
        for(var i = 0; i < gameSize; i++){
            for(var j = 0; j < gameSize; j++){
                this.fieldArray[i][j].canUpgrade = true;
                this.fieldArray[i][j].tileSprite.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
                this.fieldArray[i][j].tileSprite.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                this.fieldArray[i][j].tileText.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
                this.fieldArray[i][j].tileText.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                if(this.fieldArray[i][j].tileValue > 0){
                    this.fieldArray[i][j].tileSprite.alpha = 1;
                    this.fieldArray[i][j].tileSprite.visible = true;
                    this.fieldArray[i][j].tileText.alpha = 1;
                    this.fieldArray[i][j].tileText.visible = true;
                    this.fieldArray[i][j].tileText.setText(this.fieldArray[i][j].tileValue.toString());
                }
                else{
                    this.fieldArray[i][j].tileValue = 0;
                    this.fieldArray[i][j].tileSprite.alpha = 0;
                    this.fieldArray[i][j].tileSprite.visible = false;
                    this.fieldArray[i][j].tileText.alpha = 0;
                    this.fieldArray[i][j].tileText.visible = false;
                }
                this.fieldArray[i][j].tileSprite.setTint(gameOptions.colors[this.fieldArray[i][j].tileValue]);
            }
        }
    },
    isInsideBoard: function(row, col){
        return (row >= 0) && (col >= 0) && (row < gameSize) && (col < gameSize);
    },
    // This only occurs once game board reset should not run this method
    setUpTiles: function() {
        for(var i = 0; i < gameSize; i++){
            this.fieldArray[i] = [];
            for(var j = 0; j < gameSize; j++){
                var two = this.add.sprite(j * gameOptions.tileSize + gameOptions.tileSize / 2, i * gameOptions.tileSize  + gameOptions.tileSize / 2, "tile");
                two.alpha = 0;
                two.visible = 0;
                two.row = i;
                two.col = j;
                two.setInteractive();
                this.fieldGroup.add(two);
                var text = this.add.text(j * gameOptions.tileSize + gameOptions.tileSize / 2, i * gameOptions.tileSize  + gameOptions.tileSize / 2, "2", {
                    font: "bold 64px Arial",
                    align: "center",
                    color: "black",
                    align: "center"
                });
                text.setOrigin(0.5);
                text.alpha = 0;
                text.visible = 0;
                text.row = i;
                text.column = j;
                this.fieldGroup.add(text);
                this.fieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: two,
                    tileText: text,
                }
            }
        }
    },
    setUpGameLogic: function() {
        this.input.on('gameobjectdown', function (p, go) { 
            tileVal = this.fieldArray[go.row][go.col].tileValue; 
            if (tileVal == this.validator[0]) {
                this.validator.shift()
                this.fieldArray[go.row][go.col].tileSprite.visible = 0
                this.fieldArray[go.row][go.col].tileText.visible = 0
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
