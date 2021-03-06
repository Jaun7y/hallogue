Game.Screen = {};

//Define out initial start screen
Game.Screen.startScreen = {
  enter: function() {console.log("Entered start screen");},
  exit: function() {console.log("Exited start screen");},
  render: function(display) {
    //render our prompt to the screen
    display.drawText(1,1, "%c{yellow}Javascript Roguelike");
    display.drawText(1,2, "Press Enter to Start");
  },
  handleInput: function(inputType, inputData) {
    //When [enter] is pressed, go to the play screen
    if(inputType == 'keydown') {
      if(inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.playScreen);
      }
    }
  }
}

//Define our playing screen
Game.Screen.playScreen = {
    _map: null,
    _centerX: 0,
    _centerY: 0,
    move: function(dX, dY) {
      //positive dx means movement right
      //negative means movement left
      //0 means none
      this._centerX = Math.max(0,
      Math.min(this._map.getWidth() - 1, this._centerX + dX));

      //positive dY means movement down
      //negative means movement up
      //0 means none
      this._centerY = Math.max(0,
      Math.min(this._map.getHeight() - 1, this._centerY + dY));
    },
    enter: function() {
    var map = [];
    var mapWidth = 500;
    var mapHeight = 500;
    for (var x = 0; x < mapWidth; x++) {
      //create the nested array for the y values
      map.push([]);
      //add all the tiles
      for (y = 0; y < mapHeight; y++) {
        map[x].push(Game.Tile.nullTile);
      }
    }
    //setup the map generator
    var generator = new ROT.Map.Cellular(mapWidth,mapHeight);
    generator.randomize(0.5);
    var totalIterations = 3;
    //iteratively smoothen the map
    for(var i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }
    //smoothen it one last time and then update our map
    generator.create(function(x, y, v) {
      if(v === 1) {
        map[x][y] = Game.Tile.floorTile;
      } else {
        map[x][y] = Game.Tile.wallTile;
      }
    });
    //create our map from the tiles
    console.log(Game);
    this._map = new Game.Map(map);
  },
  exit: function() {console.log("Exited play screen");},
  render: function(display){
    var screenWidth = Game.getScreenWidth();
    var screenHeight = Game.getScreenHeight();
    //Make sure that the xaxis doesnt go to the left of the left bound
    var topLeftX = Math.max(0, this._centerX - (screenWidth / 2));
    //Make sure we still have enough space to fit an entire game screen.
    topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
    //Make sure the yaxis doesnt go above the top bound
    var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
    //Make sure we have enough space to fit an entire game screen.
    topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
    //iterate thru all visible map cells
    for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
      for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
        //fetch the glyph for this tile and render
        var glyph = this._map.getTile(x, y).getGlyph();
        display.draw(x - topLeftX, y - topLeftY,
        glyph.getChar(),
        glyph.getForeground(),
        glyph.getBackground());
      }
    }
    //render the cursor
    display.draw(
      this._centerX - topLeftX,
      this._centerY - topLeftY,
      '@',
      'white',
      'black'
    );
  },
  handleInput: function(inputType, inputData) {
    if(inputType === 'keydown') {
      //if enter is pressed go to the win screen
      //if escape is pressed go to the lose screen
      if(inputData.keyCode === ROT.VK_LEFT) {
        this.move(-1,0);
      } else if (inputData.keyCode === ROT.VK_RIGHT) {
        this.move(1,0);
      } else if (inputData.keyCode === ROT.VK_UP) {
        this.move(0, -1);
      } else if (inputData.keyCode === ROT.VK_DOWN) {
        this.move(0, 1);
      } else if(inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.winScreen);
      }
      else if (inputData.keyCode === ROT.VK_ESCAPE) {
        Game.switchScreen(Game.Screen.loseScreen);
      }
    }
  }
}

//Define our winning screen
Game.Screen.winScreen = {
  enter: function() {console.log("Entered win screen");},
  exit: function() {console.log("Exited the win screen");},
  render: function(display) {
    //render our prompt to the screen
    for(var i = 0; i < 22; i++) {
      //generate random background colours
      var r = Math.round(Math.random() * 255);
      var g = Math.round(Math.random() * 255);
      var b = Math.round(Math.random() * 255);

      var background = ROT.Color.toRGB([r,g,b]);

      display.drawText(2, i + 1, "%b{" + background + "}You win");
    }
  },
  handleInput: function(inputType, inputData) {
    //nothing to do here
  }
}

//Define our losing screen
Game.Screen.loseScreen = {
  enter: function() {console.log("Enetered the lose screen");},
  exit: function() {console.log("Exited the lose screen");},
  render: function(display) {
    for(var i = 0; i < 22; i++) {
      display.drawText(2, i + 1, "%b{red}You lose");
    }
  },
  handleInput: function(inputType, inputData) {
    //nothing to do here
  }
}
