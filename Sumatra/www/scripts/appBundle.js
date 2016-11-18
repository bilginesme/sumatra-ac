// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var Sumatra;
(function (Sumatra) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = Sumatra.Application || (Sumatra.Application = {}));
    window.onload = function () {
        Application.initialize();
        new SimpleGame();
    };
})(Sumatra || (Sumatra = {}));
var SimpleGame = (function () {
    function SimpleGame() {
        // create a new Game object
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "content", { preload: this.preload, create: this.create });
    }
    SimpleGame.prototype.preload = function () {
        // in the preload step of the game state, we want to load the phaser logo
        this.game.load.image("logo", "images/Phaser-Logo-Small.png");
    };
    SimpleGame.prototype.create = function () {
        // create a sprite from the phaser logo and center it
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        logo.scale.setTo(0.5, 0.5);
        logo.anchor.setTo(0.5, 0.5);
    };
    return SimpleGame;
}());
//# sourceMappingURL=appBundle.js.map