'strict mode'
export class Tiles {
	setUpTiles(e, gameOptions) {
        for(var i = 0; i < e.gameSize; i++){
            e.fieldArray[i] = [];
            for(var j = 0; j < e.gameSize; j++){
                var two = e.add.sprite(j * gameOptions.tileSize + gameOptions.tileSize / 2, i * gameOptions.tileSize  + gameOptions.tileSize / 2, "tile");
                two.alpha = 0;
                two.visible = 0;
                two.row = i;
                two.col = j;
                two.setInteractive();
                e.fieldGroup.add(two);
                var text = e.add.text(j * gameOptions.tileSize + gameOptions.tileSize / 2, i * gameOptions.tileSize  + gameOptions.tileSize / 2, "2", {
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
                e.fieldGroup.add(text);
                e.fieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: two,
                    tileText: text,
                }
            }
        }
        return e
    }

    resetTiles(e, gameOptions) {
        for(var i = 0; i < e.gameSize; i++){
            for(var j = 0; j < e.gameSize; j++){
                e.fieldArray[i][j].canUpgrade = true;
                e.fieldArray[i][j].tileSprite.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
                e.fieldArray[i][j].tileSprite.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                e.fieldArray[i][j].tileText.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
                e.fieldArray[i][j].tileText.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                if(e.fieldArray[i][j].tileValue > 0){
                    e.fieldArray[i][j].tileSprite.alpha = 1;
                    e.fieldArray[i][j].tileSprite.visible = true;
                    e.fieldArray[i][j].tileText.alpha = 1;
                    e.fieldArray[i][j].tileText.visible = true;
                    e.fieldArray[i][j].tileText.setText(e.fieldArray[i][j].tileValue.toString());
                }
                else{
                    e.fieldArray[i][j].tileValue = 0;
                    e.fieldArray[i][j].tileSprite.alpha = 0;
                    e.fieldArray[i][j].tileSprite.visible = false;
                    e.fieldArray[i][j].tileText.alpha = 0;
                    e.fieldArray[i][j].tileText.visible = false;
                }
                e.fieldArray[i][j].tileSprite.setTint(gameOptions.colors[e.fieldArray[i][j].tileValue]);
            }
        }
        return e
    }
}
