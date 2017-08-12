var Game = {
  _display: null,
  _currentScreen: null,
  _screenWidth: 80,
  _screenHeight: 24,
  getDisplay: function() {
    return this._display;
  },
  getScreenWidth: function() {
    return this._screenWidth;
  },
  getScreenHeight: function() {
    return this._screenHeight;
  },
  switchScreen: function(screen) {
    //if we had a screen before notify that we Exited
    if(this._currentScreen !== null) {
      this._currentScreen.exit();
    }
    //clear the display
    this.getDisplay().clear();
    //update our current screen, notify it that we Entered
    //and then render
    this._currentScreen = screen;
    console.log(this._currentScreen);
    if(!this._currentScreen !== null) {
      this._currentScreen.enter();
      this._currentScreen.render(this._display);
    }

  },
  init: function() {
    this._display = new ROT.Display({width:this._screenWidth, height: this._screenHeight});
    //create a helper function for binding to an event and making it send to the screens
    var game = this;
    var bindEventToScreen = function(event) {
      window.addEventListener(event, function(e){
        //when an event is received send it to the screen if there is one.
        if(game._currentScreen !== null) {
          //send the event type and data to the screen
          game._currentScreen.handleInput(event, e);
          //clear the screen
          game._display.clear();
          //render the screen
          game._currentScreen.render(game._display);
        }
      });
    }
    bindEventToScreen('keydown');
    bindEventToScreen('keyup');
    bindEventToScreen('keypress');
  },
  getDisplay: function() {
    return this._display;
  }
}

window.onload = function() {
  if(!ROT.isSupported()) {
    alert("The rot.js library is not supported by your browser");
  }
  else {
    //init the Game
    Game.init();
    //add the container to our html page
    document.body.appendChild(Game.getDisplay().getContainer());
    //load the start screen
    Game.switchScreen(Game.Screen.startScreen);

  }
}
