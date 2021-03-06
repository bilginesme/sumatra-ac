var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sumatra;
(function (Sumatra) {
    var GameEngine = (function (_super) {
        __extends(GameEngine, _super);
        function GameEngine() {
            var _this = _super.call(this, 1136, 640, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', Sumatra.Boot, false);
            _this.state.add('Preloader', Sumatra.Preloader, false);
            _this.state.add('MainMenu', Sumatra.MainMenu, false);
            _this.state.add('Action', Sumatra.Action, false);
            _this.state.start('Boot');
            return _this;
        }
        return GameEngine;
    }(Phaser.Game));
    Sumatra.GameEngine = GameEngine;
})(Sumatra || (Sumatra = {}));
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
        new Sumatra.GameEngine();
    };
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var GameStateEnum;
    (function (GameStateEnum) {
        GameStateEnum[GameStateEnum["NA"] = 0] = "NA";
        GameStateEnum[GameStateEnum["Running"] = 1] = "Running";
        GameStateEnum[GameStateEnum["LostOneLife"] = 2] = "LostOneLife";
        GameStateEnum[GameStateEnum["GameOver"] = 9] = "GameOver";
    })(GameStateEnum || (GameStateEnum = {}));
    var KeyboardDirectionEnum;
    (function (KeyboardDirectionEnum) {
        KeyboardDirectionEnum[KeyboardDirectionEnum["None"] = 0] = "None";
        KeyboardDirectionEnum[KeyboardDirectionEnum["Left"] = 1] = "Left";
        KeyboardDirectionEnum[KeyboardDirectionEnum["Right"] = 2] = "Right";
    })(KeyboardDirectionEnum || (KeyboardDirectionEnum = {}));
    var Action = (function (_super) {
        __extends(Action, _super);
        function Action() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.gameState = GameStateEnum.NA;
            _this.maxJeepsFoo = 5;
            _this.numLives = 3;
            _this.points = 0;
            _this.pointsForShootingMovingJeep = 100;
            _this.pointsForShootingStoppingJeep = 25;
            return _this;
        }
        Action.prototype.create = function () {
            //window.localStorage.removeItem('hiScore');
            var _this = this;
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.gameState = GameStateEnum.Running;
            this.add.image(0, 0, 'imgSky');
            this.clouds = new Array(5);
            for (var i = 0; i < this.clouds.length; i++)
                this.clouds[i] = new Sumatra.Cloud(this.game);
            this.volcano = new Sumatra.Volcano(this.game, this.game.width / 2, 418);
            this.add.image(0, 315, 'imgBushes');
            this.add.image(0, 412, 'imgGround3');
            this.jeepsFoo = new Array(this.maxJeepsFoo);
            for (var i = 0; i < this.jeepsFoo.length; i++) {
                this.jeepsFoo[i] = new Sumatra.JeepFoo(this.game);
                this.jeepsFoo[i].hideMe();
            }
            this.boom = this.add.sprite(0, 0, 'imgBoom');
            this.boom.anchor.setTo(0.5);
            this.boom.visible = false;
            this.explosion = this.add.sprite(0, 0, 'imgExplosion');
            this.explosion.anchor.setTo(0.5);
            this.explosion.visible = false;
            this.add.image(0, 480, 'imgGround2');
            this.add.image(0, 520, 'imgGround1');
            this.add.image(0, 566, 'imgGround0');
            this.rhino = new Sumatra.Rhino(this.game, new Phaser.Point(0, 0));
            this.jeep = new Sumatra.Jeep(this.game, 930, 630);
            this.cannon = new Sumatra.Cannon(this.game, this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);
            this.jeepExplosion = this.add.sprite(0, 0, 'imgExplosion');
            this.jeepExplosion.anchor.setTo(0.5);
            this.jeepExplosion.visible = false;
            this.boomWithCannon = this.add.sprite(0, 0, 'imgBoomWithCannon');
            this.boomWithCannon.anchor.setTo(0.5);
            this.boomWithCannon.visible = false;
            this.fireballs = new Array(Sumatra.Fireball.maxFireballs);
            for (var i = 0; i < this.fireballs.length; i++) {
                this.fireballs[i] = new Sumatra.Fireball(this.game, this.volcano.getFireballLocation().x, this.volcano.getFireballLocation().y);
                this.fireballs[i].hideMe();
            }
            this.statusText1 = this.game.add.text(5, this.world.height - 36, "...", { font: "10px Arial", fill: "#FFFFFF", align: "center" });
            this.statusText1.anchor.setTo(0, 0);
            this.txtLargeMessage = this.game.add.text(this.world.width / 2, this.world.height / 2, "", { font: "bold 48px Arial", fill: "#FFFFFF", align: "center" });
            this.txtLargeMessage.anchor.setTo(0.5);
            this.txtLargeMessage.visible = false;
            this.statusText2 = this.game.add.text(5, this.world.height - 26, "...", { font: "10px Arial", fill: "#FFFFFF", align: "center" });
            this.statusText2.anchor.setTo(0, 0);
            this.statusText3 = this.game.add.text(5, this.world.height - 16, "...", { font: "10px Arial", fill: "#FFFFFF", align: "center" });
            this.statusText3.anchor.setTo(0, 0);
            this.billboardLives = new Sumatra.Billboard(this.game, new Phaser.Point(80, 40), Sumatra.BillboardTypeEnum.Lives);
            this.billboardLives.anchor.setTo(0.5);
            this.billboardLives.changeValue(this.numLives, false);
            this.billboardPoints = new Sumatra.Billboard(this.game, new Phaser.Point(this.game.width - 100, 40), Sumatra.BillboardTypeEnum.Points);
            this.billboardPoints.anchor.setTo(0.5);
            this.billboardPoints.changeValue(this.points, false);
            this.point100 = this.add.sprite(0, 0, 'imgPoint100');
            this.point100.anchor.setTo(0.5);
            this.point100.visible = false;
            this.point25 = this.add.sprite(0, 0, 'imgPoint25');
            this.point25.anchor.setTo(0.5);
            this.point25.visible = false;
            this.gameOver = new Sumatra.GameOver(this.game);
            this.gameOver.anchor.setTo(0.5);
            this.game.input.onTap.add(this.onTap, this);
            this.game.input.addMoveCallback(this.onMove, this);
            setTimeout(function () { return _this.createRandomJeepFoo(); }, 1000);
            setTimeout(function () { return _this.rhino.giveLife(); }, 1000);
            setTimeout(function () { return _this.createRandomFireball(); }, 5000);
            this.game.add.audio('intro', 0.95, false).play();
            this.keyboardDirection = KeyboardDirectionEnum.None;
            var keyLeft = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            keyLeft.onDown.add(function () {
                if (this.keyboardDirection == KeyboardDirectionEnum.None) {
                    this.keyboardDirection = KeyboardDirectionEnum.Left;
                    this.onKeyDown(0, 0);
                }
            }, this);
            keyLeft.onUp.add(function () { this.onKeyUp(1); }, this);
            var keyRight = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            keyRight.onDown.add(function () {
                if (this.keyboardDirection == KeyboardDirectionEnum.None) {
                    this.keyboardDirection = KeyboardDirectionEnum.Right;
                    this.onKeyDown(0, 0);
                }
            }, this);
            keyRight.onUp.add(function () { this.onKeyUp(2); }, this);
            var keySpaceBar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            keySpaceBar.onDown.add(function (key) { this.onClickSpaceBar(); }, this);
        };
        Action.prototype.update = function () {
            if (this.game.input.activePointer.isDown) {
                if (this.jeep.isInArea(this.game.input.x, this.game.input.y)) {
                    if (this.jeep.isIdle()) {
                        this.jeep.startMotion(this.game.input.x);
                        this.statusText1.setText(this.jeep.motionState.toString() + " xPosStart = " + this.jeep.xMovementOffset);
                    }
                }
            }
            if (this.game.input.activePointer.isUp) {
                if (this.jeep.isMoving() && this.keyboardDirection == KeyboardDirectionEnum.None) {
                    this.jeep.endMotion();
                    this.statusText1.setText(this.jeep.motionState.toString());
                }
            }
            if (this.keyboardDirection != KeyboardDirectionEnum.None) {
                if (this.cannon.isIdle())
                    this.cannon.setPosition(this.jeep.getCanonLocation());
            }
            this.handleJeepMovement();
            this.checkJeepFooHit();
            this.checkJeepRhinoVicinity();
            this.checkWhetherRhinoShot();
            this.checkFireballHit();
            this.statusText2.setText("Fireball Duration : " + Sumatra.Fireball.durationForNewFireball);
        };
        Action.prototype.onTap = function (pointer, doubleTap) {
            if (doubleTap) {
                this.statusText1.setText("double");
            }
            else {
                if (this.gameState == GameStateEnum.Running
                    && this.jeep.isInArea(this.game.input.x, this.game.input.y)
                    && !this.rhino.isDead()) {
                    this.jeep.tickleMe(this.game.input.x, this.game.input.y);
                    if (this.cannon.startFiring())
                        this.createBoomWithCannon(this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);
                }
                if (this.volcano.tickleMe(this.game.input.x, this.game.input.y))
                    this.playTickSound();
            }
        };
        Action.prototype.onMove = function (pointer, x, y, isClick) {
            if (this.cannon.isIdle())
                this.cannon.setPosition(this.jeep.getCanonLocation());
        };
        Action.prototype.onClickSpaceBar = function () {
            if (this.gameState == GameStateEnum.Running && !this.rhino.isDead()) {
                if (this.cannon.startFiring())
                    this.createBoomWithCannon(this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);
            }
        };
        Action.prototype.onKeyDown = function (direction, notUsed) {
            this.jeep.startMotion(this.jeep.x);
            this.statusText1.setText(this.jeep.motionState.toString());
        };
        Action.prototype.onKeyUp = function (leftOrRight) {
            if ((leftOrRight == 1 && this.keyboardDirection == KeyboardDirectionEnum.Left) || (leftOrRight == 2 && this.keyboardDirection == KeyboardDirectionEnum.Right)) {
                this.keyboardDirection = KeyboardDirectionEnum.None;
                this.jeep.endMotion();
                this.statusText1.setText(this.jeep.motionState.toString());
            }
        };
        Action.prototype.playTickSound = function () { this.add.audio('click', 1, false).play(); };
        Action.prototype.decreaseOneLife = function () {
            if (this.numLives > 0) {
                this.numLives--;
                this.billboardLives.changeValue(this.numLives, false);
                if (this.numLives == 0) {
                    this.gameOver.showAndAnimate();
                    this.gameState = GameStateEnum.GameOver;
                    this.handleGameOver();
                    return false;
                }
                else {
                    this.handleLostOneLife();
                    return true;
                }
            }
        };
        Action.prototype.addPoints = function (p) {
            if (this.gameState == GameStateEnum.Running) {
                this.points += p;
                this.billboardPoints.changeValue(this.points, true);
                var strHiScore = window.localStorage.getItem('hiScore');
                var hiScore = 0;
                if (strHiScore != null) {
                    hiScore = parseInt(strHiScore);
                }
                if (this.points > hiScore)
                    this.billboardPoints.setHiScoreValue(this.points);
            }
        };
        Action.prototype.cleanAllFooElements = function () {
            if (this.jeep.x > this.jeep.xPrevious)
                this.jeep.scale.x = -1;
            else if (this.jeep.x < this.jeep.xPrevious)
                this.jeep.scale.x = 1;
        };
        Action.prototype.handleJeepMovement = function () {
            if (this.gameState == GameStateEnum.Running && this.jeep.isMoving()) {
                if (this.keyboardDirection != KeyboardDirectionEnum.None) {
                    if (this.keyboardDirection == KeyboardDirectionEnum.Left) {
                        if (this.jeep.x > 0)
                            this.jeep.x = this.jeep.x - 10;
                    }
                    else if (this.keyboardDirection == KeyboardDirectionEnum.Right) {
                        if (this.jeep.x < this.game.width)
                            this.jeep.x = this.jeep.x + 10;
                    }
                }
                else {
                    this.jeep.x = this.game.input.x - this.jeep.xMovementOffset;
                }
                this.cleanAllFooElements();
                this.jeep.xPrevious = this.jeep.x;
            }
        };
        Action.prototype.handleGameOver = function () {
            this.cleanAllFooElements();
            var strHiScore = window.localStorage.getItem('hiScore');
            var hiScore = 0;
            if (strHiScore != null) {
                hiScore = parseInt(strHiScore);
            }
            if (this.points > hiScore) {
                window.localStorage.setItem('hiScore', this.points.toString());
                alert("HI SCORE");
            }
        };
        Action.prototype.handleLostOneLife = function () {
            var _this = this;
            this.add.audio('fail', 1, false).play();
            for (var i = 0; i < this.fireballs.length; i++)
                this.fireballs[i].hideMe();
            for (var i = 0; i < this.jeepsFoo.length; i++)
                this.jeepsFoo[i].hideMe();
            this.gameState = GameStateEnum.LostOneLife;
            this.txtLargeMessage.setText("LOST ONE LIFE");
            this.txtLargeMessage.visible = true;
            this.jeep.visible = false;
            this.cannon.visible = false;
            var tweenText = this.game.add.tween(this.txtLargeMessage.scale).to({ x: 1.1, y: 1.1 }, 1500, Phaser.Easing.Bounce.In, true);
            setTimeout(function () { return _this.restartAfterLostLife(); }, 5000);
            tweenText.onComplete.add(function () {
                var tweenTextOut = this.game.add.tween(this.txtLargeMessage.scale).to({ x: 1, y: 1 }, 3000, Phaser.Easing.Elastic.Out, true);
                tweenTextOut.onComplete.add(function () {
                });
            }, this);
        };
        Action.prototype.restartAfterLostLife = function () {
            var _this = this;
            //alert("ok");
            this.jeep.visible = true;
            this.cannon.visible = true;
            this.gameState = GameStateEnum.Running;
            this.txtLargeMessage.visible = false;
            this.rhino.restart();
            setTimeout(function () { return _this.createRandomJeepFoo(); }, 2000);
        };
        Action.prototype.checkJeepFooHit = function () {
            var _this = this;
            if (!this.rhino.isDead() && this.cannon.checkHitOnGround()) {
                this.createBoom(this.cannon.getCannonPosition().x, this.cannon.getCannonPosition().y);
                for (var i = 0; i < this.jeepsFoo.length; i++) {
                    if (this.jeepsFoo[i].visible && this.jeepsFoo[i].overlap(this.cannon)) {
                        if (this.jeepsFoo[i].isMoving()) {
                            this.addPoints(this.pointsForShootingMovingJeep);
                            this.createFlyingPoint(this.pointsForShootingMovingJeep, this.jeepsFoo[i].x, this.jeepsFoo[i].y);
                        }
                        else {
                            this.addPoints(this.pointsForShootingStoppingJeep);
                            this.createFlyingPoint(this.pointsForShootingStoppingJeep, this.jeepsFoo[i].x, this.jeepsFoo[i].y);
                        }
                        this.jeepsFoo[i].hideMe();
                        this.createExplosion(this.cannon.getCannonPosition().x, this.cannon.getCannonPosition().y);
                        setTimeout(function () { return _this.createRandomJeepFoo(); }, 2000);
                        if (this.rhino.isStoppingNow())
                            this.rhino.restart();
                        Sumatra.Fireball.decreaseDurationForNewFireball();
                    }
                }
            }
        };
        Action.prototype.checkJeepRhinoVicinity = function () {
            for (var i = 0; i < this.jeepsFoo.length; i++) {
                if (this.jeepsFoo[i].visible == true && this.jeepsFoo[i].isMoving() && this.rhino.visible == true) {
                    if (Math.abs(this.jeepsFoo[i].x - this.rhino.x) < this.jeepsFoo[i].vicinityToRhino) {
                        this.jeepsFoo[i].stopToPrepareShooting(this.rhino);
                    }
                }
            }
        };
        Action.prototype.checkWhetherRhinoShot = function () {
            for (var i = 0; i < this.jeepsFoo.length; i++) {
                if (this.jeepsFoo[i].visible == true && this.jeepsFoo[i].isRhinoShot() && this.rhino.visible == true) {
                    this.jeepsFoo[i].hideMe();
                    if (this.rhino.isStoppingNow())
                        this.rhino.restart();
                    this.decreaseOneLife();
                    for (var j = 0; j < this.fireballs.length; j++) {
                        this.fireballs[j].hideMe();
                    }
                    break;
                }
            }
        };
        Action.prototype.checkFireballHit = function () {
            if (this.gameState != GameStateEnum.Running)
                return;
            for (var i = 0; i < this.fireballs.length; i++) {
                if (this.fireballs[i].checkHitOnGround()) {
                    if (this.fireballs[i].overlap(this.jeep)) {
                        this.jeep.showJeepExplosion();
                        this.decreaseOneLife();
                    }
                    this.fireballs[i].hideMe();
                }
            }
        };
        Action.prototype.createBoom = function (x, y) {
            this.boom.position.set(x, y);
            this.boom.visible = true;
            this.boom.alpha = 0;
            var tween = this.game.add.tween(this.boom.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.boom.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenAlpha = this.game.add.tween(this.boom).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.boom).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        Action.prototype.createFlyingPoint = function (point, x, y) {
            var img;
            if (point == 100)
                img = this.point100;
            else
                img = this.point25;
            img.position.set(x, y);
            img.visible = true;
            img.alpha = 0;
            img.scale.x = 0;
            img.scale.y = 0;
            var xPos = this.game.rnd.between(0, this.game.width);
            var distance = Math.sqrt(Math.pow(Math.abs(xPos - x), 2) + Math.pow(y, 2));
            var duration = 1500 * (distance / 500);
            var tween = this.game.add.tween(img.position).to({ x: xPos, y: 0 }, duration, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () { }, this);
            var tween = this.game.add.tween(img.scale).to({ x: 1, y: 1 }, 600, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () { }, this);
            var tweenAlpha = this.game.add.tween(img).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(img).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        Action.prototype.createJeepExplosion = function (x, y) {
            this.jeepExplosion.position.set(x, y);
            this.jeepExplosion.visible = true;
            this.jeepExplosion.alpha = 0;
            var tween = this.game.add.tween(this.jeepExplosion.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.jeepExplosion.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenAlpha = this.game.add.tween(this.jeepExplosion).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.jeepExplosion).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        Action.prototype.createBoomWithCannon = function (x, y) {
            this.boomWithCannon.position.set(x, y);
            this.boomWithCannon.visible = true;
            this.boomWithCannon.alpha = 0;
            var tween = this.game.add.tween(this.boomWithCannon.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.boomWithCannon.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenAlpha = this.game.add.tween(this.boomWithCannon).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.boomWithCannon).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        Action.prototype.createExplosion = function (x, y) {
            this.explosion.position.set(x, y);
            this.explosion.visible = true;
            this.explosion.alpha = 0;
            var tween = this.game.add.tween(this.explosion.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.explosion.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenAlpha = this.game.add.tween(this.explosion).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.explosion).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        Action.prototype.createRandomJeepFoo = function () {
            if (this.gameState == GameStateEnum.Running) {
                var isThereAJeepAlready = false;
                for (var i = 0; i < this.jeepsFoo.length; i++) {
                    if (this.jeepsFoo[i].visible == true)
                        isThereAJeepAlready = true;
                }
                if (!isThereAJeepAlready) {
                    for (var i = 0; i < this.jeepsFoo.length; i++) {
                        if (this.jeepsFoo[i].visible == false) {
                            this.jeepsFoo[i].showMe(this.rhino);
                            break;
                        }
                    }
                }
            }
        };
        Action.prototype.createRandomFireball = function () {
            var _this = this;
            if (this.gameState == GameStateEnum.Running) {
                for (var i = 0; i < this.fireballs.length; i++) {
                    if (this.fireballs[i].visible == false) {
                        this.fireballs[i].erupt();
                        break;
                    }
                }
            }
            setTimeout(function () { return _this.createRandomFireball(); }, Sumatra.Fireball.durationForNewFireball);
        };
        return Action;
    }(Phaser.State));
    Sumatra.Action = Action;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            //You can preload an image here if you dont want to use text for the loading screen
        };
        Boot.prototype.create = function () {
            this.stage.setBackgroundColor(0x000000);
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            else {
                // mobile
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 480;
                this.scale.minHeight = 260;
                this.scale.maxWidth = 1024;
                this.scale.maxHeight = 768;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.refresh();
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    }(Phaser.State));
    Sumatra.Boot = Boot;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.logo).to({ y: 220 }, 1000, Phaser.Easing.Elastic.Out, true, 500);
            this.game.debug.text("Click the logo to start the game", this.world.centerX, this.world.height - 20, "red");
            this.input.onDown.addOnce(this.fadeOut, this);
            /*
            this.game.input.keyboard.onDownCallback = function (this, e)
            {
                console.log(e.keyCode);
                this.fadeOut();
            }
            */
            var keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            keySpace.onDown.add(function () { this.fadeOut(); }, this);
            var keySpace = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            keySpace.onDown.add(function () { this.fadeOut(); }, this);
        };
        MainMenu.prototype.fadeOut = function () {
            console.log("Starting game...");
            this.add.audio('click', 1, false).play();
            this.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Action', true, false);
        };
        return MainMenu;
    }(Phaser.State));
    Sumatra.MainMenu = MainMenu;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);
            this.footerText = this.game.add.text(this.world.centerX, this.world.height - 50, "Bilgin Eşme", { font: "12px Arial", fill: "#FFFFFF", align: "center" });
            this.footerText.anchor.setTo(0.5);
            this.load.image('titlepage', './assets/images/Welcome.png');
            this.load.image('logo', './assets/ui/gameLogo.png');
            this.load.audio('click', './assets/sounds/click.ogg', true);
            this.load.audio('intro', './assets/sounds/intro.wav', true);
            this.load.audio('soundBazooka', './assets/sounds/bazooka.wav', true);
            this.load.audio('soundCannonFall', './assets/sounds/cannon_fall.wav', true);
            this.load.audio('fail', './assets/sounds/fail.wav', true);
            this.load.audio('ohNo', './assets/sounds/oh_no.wav', true);
            this.load.audio('gunShot', './assets/sounds/gun_shot.wav', true);
            this.load.audio('gunLoad', './assets/sounds/gun-load.wav', true);
            for (var i = 1; i <= 5; i++)
                this.load.audio('eruption' + i, './assets/sounds/eruption' + i + '.wav', true);
            this.load.atlasJSONHash('FireballSprite', './assets/sprites/FireballSprite.png', './assets/sprites/FireballSprite.json');
            this.load.atlasJSONHash('JeepExplosion', './assets/sprites/JeepExplosion.png', './assets/sprites/JeepExplosion.json');
            this.load.atlasJSONHash('RhinoSpriteSheet', './assets/sprites/RhinoSpriteSheet.png', './assets/sprites/RhinoSpriteSheet.json');
            this.load.image('imgSky', './assets/images/Sky.png');
            this.load.image('imgGround0', './assets/images/Ground0.png');
            this.load.image('imgGround1', './assets/images/Ground1.png');
            this.load.image('imgGround2', './assets/images/Ground2.png');
            this.load.image('imgGround3', './assets/images/Ground3.png');
            this.load.image('imgBushes', './assets/images/Bushes.png');
            this.load.image('imgJeep', './assets/images/Jeep.png');
            this.load.image('imgDriver', './assets/images/driver.png');
            this.load.image('imgJeepFoo', './assets/images/JeepFoo.png');
            this.load.image('imgHunterSitting', './assets/images/HunterSitting.png');
            this.load.image('imgHunterStanding', './assets/images/HunterStanding.png');
            this.load.image('imgCannon', './assets/images/Cannon.png');
            this.load.image('imgFireball', './assets/images/Fireball.png');
            this.load.image('imgBoom', './assets/images/Boom.png');
            this.load.image('imgBoomWithCannon', './assets/images/BoomWithCannon.png');
            this.load.image('imgBang', './assets/images/Bang.png');
            this.load.image('imgExplosion', './assets/images/ExplosionWithBoom.png');
            this.load.image('imgRhinoDead', './assets/images/RhinoDead.png');
            this.load.image('imgPoint100', './assets/images/point-100.png');
            this.load.image('imgPoint25', './assets/images/point-25.png');
            this.load.image('imgCloudSmall', './assets/images/CloudSmall.png');
            this.load.image('imgCloudLarge', './assets/images/CloudLarge.png');
            this.load.image('imgVolcanoCrest', './assets/images/VolcanoCrest.png');
            this.load.image('imgVolcanoSmoke', './assets/images/VolcanoSmoke.png');
            this.load.image('imgBGLives', './assets/images/BGLives.png');
            this.load.image('imgBGPoints', './assets/images/BGPoints.png');
            this.load.image('imgGameOver', './assets/images/GameOver.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
            //this.game.state.start('Action', true, false);
        };
        return Preloader;
    }(Phaser.State));
    Sumatra.Preloader = Preloader;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var BillboardTypeEnum;
    (function (BillboardTypeEnum) {
        BillboardTypeEnum[BillboardTypeEnum["Lives"] = 0] = "Lives";
        BillboardTypeEnum[BillboardTypeEnum["Points"] = 1] = "Points";
    })(BillboardTypeEnum = Sumatra.BillboardTypeEnum || (Sumatra.BillboardTypeEnum = {}));
    var Billboard = (function (_super) {
        __extends(Billboard, _super);
        function Billboard(game, pos, billboardType) {
            var _this = this;
            if (billboardType == BillboardTypeEnum.Lives)
                _this = _super.call(this, game, pos.x, pos.y, 'imgBGLives') || this;
            else
                _this = _super.call(this, game, pos.x, pos.y, 'imgBGPoints') || this;
            game.add.existing(_this);
            _this.anchor.set(0.5);
            _this.txt = _this.game.add.text(pos.x + 20, pos.y, "", { font: "bold 32px Arial", fill: "#FFFFFF", align: "center" });
            _this.txt.anchor.setTo(0.5);
            if (billboardType == BillboardTypeEnum.Points) {
                _this.txtHiScoreTitle = _this.game.add.text(pos.x + 20, pos.y + 50, "HI-SCORE", { font: "bold 18px Arial", fill: "#FFFFFF", align: "center" });
                _this.txtHiScoreTitle.anchor.setTo(0.5);
                var strHiScore = window.localStorage.getItem('hiScore');
                _this.txtHiScoreValue = _this.game.add.text(pos.x + 20, pos.y + 70, strHiScore, { font: "bold 14px Arial", fill: "#FFFFFF", align: "center" });
                _this.txtHiScoreValue.anchor.setTo(0.5);
            }
            _this.value = 0;
            return _this;
        }
        Billboard.prototype.update = function () {
        };
        Billboard.prototype.enlarge = function () {
            var normEnlarge = 300;
            var durationEnlarge = normEnlarge + normEnlarge * 0.25 * (Math.random() - 0.5);
            var normShrink = 500;
            var durationShrink = normShrink + normShrink * 0.25 * (Math.random() - 0.5);
            var tween = this.game.add.tween(this.scale).to({ x: 1.1, y: 1.1 }, durationEnlarge, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.scale).to({ x: 1, y: 1 }, durationShrink, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenText = this.game.add.tween(this.txt.scale).to({ x: 1.1, y: 1.1 }, durationEnlarge, Phaser.Easing.Bounce.In, true);
            tweenText.onComplete.add(function () { this.game.add.tween(this.txt.scale).to({ x: 1, y: 1 }, durationShrink, Phaser.Easing.Elastic.Out, true); }, this);
        };
        Billboard.prototype.changeValue = function (newValue, isAnimate) {
            this.value = newValue;
            this.txt.setText(this.value.toString());
            if (isAnimate)
                this.enlarge();
        };
        Billboard.prototype.setHiScoreValue = function (newValue) {
            this.txtHiScoreValue.setText(newValue.toString());
        };
        return Billboard;
    }(Phaser.Sprite));
    Sumatra.Billboard = Billboard;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var CannonStateEnum;
    (function (CannonStateEnum) {
        CannonStateEnum[CannonStateEnum["Idle"] = 0] = "Idle";
        CannonStateEnum[CannonStateEnum["GoingUp"] = 1] = "GoingUp";
        CannonStateEnum[CannonStateEnum["FallingDown"] = 2] = "FallingDown";
    })(CannonStateEnum || (CannonStateEnum = {}));
    var Cannon = (function (_super) {
        __extends(Cannon, _super);
        function Cannon(game, x, y) {
            var _this = _super.call(this, game, x, y, 'imgCannon') || this;
            _this.timeToGoUp = 1000;
            _this.anchor.setTo(0.5);
            game.add.existing(_this);
            _this.cannonState = CannonStateEnum.Idle;
            _this.posInitialX = x;
            _this.posInitialY = y;
            _this.isHitOnGround = false;
            return _this;
        }
        Cannon.prototype.update = function () {
            //this.posInitial = new Phaser.Point(0, 0);
            //this.footerText.setText("Boom : " + this.boom.x + "x" + this.boom.y);
        };
        Cannon.prototype.goUp = function () {
            var tweenUp = this.game.add.tween(this).to({ x: this.x, y: this.y - 400 }, this.timeToGoUp, Phaser.Easing.Quadratic.Out, true);
            tweenUp.onComplete.add(this.fallDown, this);
            var tweenResize = this.game.add.tween(this.scale).to({ x: 0.5, y: 0.5 }, this.timeToGoUp, Phaser.Easing.Linear.None, true);
        };
        Cannon.prototype.fallDown = function () {
            this.cannonState = CannonStateEnum.FallingDown;
            var tweenUp = this.game.add.tween(this).to({ x: this.x, y: this.y + 405 }, this.timeToGoUp, Phaser.Easing.Quadratic.In, true);
            tweenUp.onComplete.add(this.hitOnGround, this);
            var tweenResize = this.game.add.tween(this.scale).to({ x: 0.3, y: 0.3 }, this.timeToGoUp, Phaser.Easing.Linear.None, true);
        };
        Cannon.prototype.hitOnGround = function () {
            this.game.add.audio('soundCannonFall', 1, false).play();
            this.visible = false;
            this.isHitOnGround = true;
            var tweenUp = this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
            tweenUp.onComplete.add(this.shootOver, this);
        };
        Cannon.prototype.shootOver = function () {
            this.cannonState = CannonStateEnum.Idle;
            this.position = new Phaser.Point(this.posInitialX, this.posInitialY);
            this.scale.set(1);
            this.visible = true;
        };
        Cannon.prototype.checkHitOnGround = function () {
            if (this.isHitOnGround) {
                this.isHitOnGround = false;
                return true;
            }
            else {
                return false;
            }
        };
        Cannon.prototype.getCannonPosition = function () {
            return new Phaser.Point(this.x, this.y);
        };
        Cannon.prototype.isIdle = function () {
            if (this.cannonState == CannonStateEnum.Idle)
                return true;
            else
                return false;
        };
        Cannon.prototype.startFiring = function () {
            if (this.cannonState == CannonStateEnum.Idle) {
                this.cannonState = CannonStateEnum.GoingUp;
                this.goUp();
                //alert(this.posInitialX + "x" + this.posInitialY);
                this.game.add.audio('soundBazooka', 1, false).play();
                this.isHitOnGround = false;
                return true;
            }
            else {
                return false;
            }
        };
        Cannon.prototype.setPosition = function (pos) {
            this.position = pos;
            this.posInitialX = pos.x;
            this.posInitialY = pos.y;
        };
        return Cannon;
    }(Phaser.Sprite));
    Sumatra.Cannon = Cannon;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var LeftOrRightEnum;
    (function (LeftOrRightEnum) {
        LeftOrRightEnum[LeftOrRightEnum["Left"] = 0] = "Left";
        LeftOrRightEnum[LeftOrRightEnum["Right"] = 1] = "Right";
    })(LeftOrRightEnum || (LeftOrRightEnum = {}));
    var Cloud = (function (_super) {
        __extends(Cloud, _super);
        function Cloud(game) {
            var _this = this;
            var strCloudImageName = '';
            if (game.rnd.sign() == -1)
                strCloudImageName = 'imgCloudSmall';
            else
                strCloudImageName = 'imgCloudLarge';
            _this = _super.call(this, game, 0, 0, strCloudImageName) || this;
            if (game.rnd.sign() == -1) {
                _this.leftOrRight = LeftOrRightEnum.Left;
                _this.velocity = game.rnd.between(0, 5);
            }
            else {
                _this.leftOrRight = LeftOrRightEnum.Right;
                _this.velocity = -game.rnd.between(0, 5);
            }
            _this.x = game.rnd.between(0, game.width);
            _this.y = game.rnd.between(0, game.height / 2);
            _this.anchor.setTo(0.5);
            _this.alpha = 0.5 + game.rnd.realInRange(0, 0.1 * _this.velocity);
            if (game.rnd.sign() == -1)
                _this.scale.x = -1;
            else
                _this.scale.x = 1;
            game.add.existing(_this);
            // Physics
            game.physics.enable(_this);
            _this.body.collideWorldBounds = false;
            _this.body.setCircle(20);
            _this.body.velocity.x = _this.velocity;
            return _this;
            //this.footerText = this.game.add.text(0, 100, this.leftOrRight.toString(), { font: "12px Arial", fill: "#FFFFFF", align: "center" });
        }
        Cloud.prototype.update = function () {
        };
        return Cloud;
    }(Phaser.Sprite));
    Sumatra.Cloud = Cloud;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var PhaseEnum;
    (function (PhaseEnum) {
        PhaseEnum[PhaseEnum["Idle"] = 0] = "Idle";
        PhaseEnum[PhaseEnum["GoingUp"] = 1] = "GoingUp";
        PhaseEnum[PhaseEnum["FallingDown"] = 2] = "FallingDown";
    })(PhaseEnum || (PhaseEnum = {}));
    var Fireball = (function (_super) {
        __extends(Fireball, _super);
        function Fireball(game, x, y) {
            var _this = _super.call(this, game, x, y, 'FireballSprite', 1) || this;
            _this.timeToGoUp = 1500;
            _this.deltaXX = 0;
            _this.animations.add('fireballAnimation', null, 10, true);
            _this.anchor.setTo(0.5, 0.75);
            game.add.existing(_this);
            _this.phase = PhaseEnum.Idle;
            _this.posInitialX = x;
            _this.posInitialY = y;
            _this.isHitOnGround = false;
            _this.hideMe();
            return _this;
        }
        Fireball.prototype.update = function () {
        };
        Fireball.prototype.goUp = function () {
            this.deltaXX = 250 * (Math.random() - 0.5);
            this.scale.setTo(0.0, 0.0);
            var tweenUp = this.game.add.tween(this).to({ x: this.x + this.deltaXX, y: this.y - 220 }, this.timeToGoUp, Phaser.Easing.Quadratic.Out, true);
            tweenUp.onComplete.add(this.fallDown, this);
            var tweenResize = this.game.add.tween(this.scale).to({ x: 0.3, y: 0.3 }, this.timeToGoUp, Phaser.Easing.Linear.None, true);
        };
        Fireball.prototype.fallDown = function () {
            this.phase = PhaseEnum.FallingDown;
            var tweenUp = this.game.add.tween(this).to({ x: this.x + this.deltaXX * 4, y: this.y + 490 }, this.timeToGoUp, Phaser.Easing.Quadratic.In, true);
            tweenUp.onComplete.add(this.hitOnGround, this);
            var tweenResize = this.game.add.tween(this.scale).to({ x: 1.0, y: 1.0 }, this.timeToGoUp, Phaser.Easing.Linear.None, true);
        };
        Fireball.prototype.hitOnGround = function () {
            this.game.add.audio('soundCannonFall', 0.25, false).play();
            this.isHitOnGround = true;
        };
        Fireball.prototype.checkHitOnGround = function () {
            if (this.isHitOnGround) {
                this.isHitOnGround = false;
                return true;
            }
            else {
                return false;
            }
        };
        Fireball.prototype.hideMe = function () {
            this.phase = PhaseEnum.Idle;
            this.position.setTo(this.posInitialX, this.posInitialY);
            this.scale.setTo(0, 0);
            this.visible = false;
            this.animations.stop('fireballAnimation');
        };
        Fireball.prototype.erupt = function () {
            var k = Math.floor(Math.random() * 5) + 1;
            this.game.add.audio('eruption' + k, 0.25, false).play();
            //console.info('eruption' + k);
            this.animations.play('fireballAnimation');
            this.position.setTo(this.posInitialX, this.posInitialY);
            this.visible = true;
            this.phase = PhaseEnum.GoingUp;
            this.goUp();
        };
        Fireball.decreaseDurationForNewFireball = function () {
            if (this.durationForNewFireball - this.deltaDurationForNewFireball > this.minDurationForNewFireball)
                this.durationForNewFireball -= this.deltaDurationForNewFireball;
        };
        return Fireball;
    }(Phaser.Sprite));
    Fireball.maxFireballs = 10;
    Fireball.durationForNewFireball = 2500;
    Fireball.deltaDurationForNewFireball = 40;
    Fireball.minDurationForNewFireball = 750;
    Sumatra.Fireball = Fireball;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver(game) {
            var _this = _super.call(this, game, game.width / 2, game.height / 2, 'imgGameOver') || this;
            game.add.existing(_this);
            _this.anchor.set(0.5);
            _this.visible = false;
            return _this;
        }
        GameOver.prototype.update = function () {
        };
        GameOver.prototype.showAndAnimate = function () {
            this.scale.setTo(0.5, 0.5);
            this.visible = true;
            var durationEnlarge = 500;
            var durationShrink = 1000;
            var tween = this.game.add.tween(this.scale).to({ x: 1.2, y: 1.2 }, durationEnlarge, Phaser.Easing.Cubic.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.scale).to({ x: 1, y: 1 }, durationShrink, Phaser.Easing.Elastic.Out, true); }, this);
        };
        return GameOver;
    }(Phaser.Sprite));
    Sumatra.GameOver = GameOver;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var MotionStateEnum;
    (function (MotionStateEnum) {
        MotionStateEnum[MotionStateEnum["Idle"] = 0] = "Idle";
        MotionStateEnum[MotionStateEnum["Moving"] = 1] = "Moving";
    })(MotionStateEnum || (MotionStateEnum = {}));
    var Jeep = (function (_super) {
        __extends(Jeep, _super);
        function Jeep(game, x, y) {
            var _this = _super.call(this, game, x, y, 'imgJeep') || this;
            _this.durationEngineUp = 250;
            _this.durationEngineDown = 1250;
            game.add.existing(_this);
            _this.anchor.set(0.5, 1);
            _this.driver = new Phaser.Sprite(game, -20, -110, "imgDriver");
            _this.driver.anchor.setTo(0.5, 1);
            _this.addChild(_this.driver);
            _this.explosion = new Phaser.Sprite(game, 0, 0, "JeepExplosion", 1);
            _this.explosion.animations.add('jeepExplosionAnimation', null, 5, false);
            _this.explosion.anchor.setTo(0.5, 1);
            _this.explosion.visible = false;
            _this.explosion.scale.setTo(1.2);
            _this.addChild(_this.explosion);
            // Physics
            game.physics.enable(_this);
            _this.body.collideWorldBounds = false;
            _this.body.setCircle(20);
            _this.body.velocity.x = 0;
            _this.scale.x = 1;
            _this.motionState = MotionStateEnum.Idle;
            _this.engineMovementUp();
            return _this;
        }
        Jeep.prototype.update = function () {
        };
        Jeep.prototype.engineMovementUp = function () {
            var duration = this.durationEngineUp + this.durationEngineUp * 0.25 * (Math.random() - 0.5);
            var tween = this.game.add.tween(this.scale).to({ y: 1.015 }, duration, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(this.engineMovementDown, this);
        };
        Jeep.prototype.engineMovementDown = function () {
            var duration = this.durationEngineDown + this.durationEngineDown * 0.25 * (Math.random() - 0.5);
            var tween = this.game.add.tween(this.scale).to({ y: 1.00 }, duration, Phaser.Easing.Bounce.Out, true);
            tween.onComplete.add(this.engineMovementUp, this);
        };
        Jeep.prototype.bangAnim = function () {
            var tween = this.game.add.tween(this.scale).to({ y: 1.05 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.scale).to({ y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
        };
        Jeep.prototype.isInArea = function (x, y) {
            var left = this.left;
            var right = this.right;
            if (this.scale.x < 0) {
                var left = this.right;
                var right = this.left;
            }
            if (x > left && x < right && y > this.top && y < this.bottom)
                return true;
            else
                return false;
        };
        Jeep.prototype.startMotion = function (x) {
            if (this.motionState == MotionStateEnum.Idle) {
                this.xMovementOffset = x - this.x;
                this.xPrevious = this.x;
                this.xTouchBeforeMotion = x;
                this.motionState = MotionStateEnum.Moving;
            }
        };
        Jeep.prototype.endMotion = function () {
            this.xMovementOffset = 0;
            this.motionState = MotionStateEnum.Idle;
        };
        Jeep.prototype.tickleMe = function (x, y) {
            if (this.isInArea(x, y)) {
                var tween = this.game.add.tween(this.scale).to({ y: 1.05 }, 200, Phaser.Easing.Bounce.In, true);
                tween.onComplete.add(function () { this.game.add.tween(this.scale).to({ y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
                return true;
            }
            else {
                return false;
            }
        };
        Jeep.prototype.isMoving = function () { return this.motionState == MotionStateEnum.Moving; };
        Jeep.prototype.isIdle = function () { return this.motionState == MotionStateEnum.Idle; };
        Jeep.prototype.getCanonLocation = function () { return new Phaser.Point(this.x, this.y - 200); };
        Jeep.prototype.showJeepExplosion = function () {
            this.explosion.visible = true;
            this.explosion.animations.play('jeepExplosionAnimation');
            var tween = this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.hideJeepExplosion, this);
        };
        Jeep.prototype.hideJeepExplosion = function () {
            this.explosion.visible = false;
            this.alpha = 1;
            this.explosion.alpha = 1;
        };
        return Jeep;
    }(Phaser.Sprite));
    Sumatra.Jeep = Jeep;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var PhaseEnum;
    (function (PhaseEnum) {
        PhaseEnum[PhaseEnum["Hidden"] = 0] = "Hidden";
        PhaseEnum[PhaseEnum["Moving"] = 1] = "Moving";
        PhaseEnum[PhaseEnum["Stopping"] = 2] = "Stopping";
        PhaseEnum[PhaseEnum["Shooting"] = 3] = "Shooting";
        PhaseEnum[PhaseEnum["ShotComplete"] = 4] = "ShotComplete";
    })(PhaseEnum || (PhaseEnum = {}));
    var JeepFoo = (function (_super) {
        __extends(JeepFoo, _super);
        function JeepFoo(game) {
            var _this = _super.call(this, game, 0, 0, 'imgJeepFoo') || this;
            _this.minVelocity = 50;
            game.add.existing(_this);
            _this.anchor.set(0.5, 1);
            _this.phase = PhaseEnum.Hidden;
            // Physics
            game.physics.enable(_this);
            _this.body.collideWorldBounds = false;
            _this.body.setCircle(20);
            _this.body.velocity.x = 0;
            _this.scale.x = 1;
            _this.hunterSitting = new Phaser.Sprite(game, 5, -38, "imgHunterSitting", 1);
            _this.hunterSitting.anchor.setTo(0.5, 1);
            _this.hunterStanding = new Phaser.Sprite(game, 9, -41, "imgHunterStanding", 1);
            _this.hunterStanding.anchor.setTo(0.5, 1);
            _this.bang = new Phaser.Sprite(game, 30, -60, "imgBang", 1);
            _this.bang.anchor.setTo(0.5);
            _this.bang.visible = false;
            _this.addChild(_this.hunterSitting);
            _this.addChild(_this.hunterStanding);
            _this.addChild(_this.bang);
            _this.children.reverse();
            _this.soundGunShot = _this.game.add.audio('gunShot', 1, false);
            _this.soundGunLoad = _this.game.add.audio('gunLoad', 1, false);
            return _this;
        }
        JeepFoo.prototype.update = function () {
            if (this.phase == PhaseEnum.Moving && Math.abs(this.body.velocity.x) < this.minVelocity) {
                this.body.acceleration.x = 0;
                this.body.velocity.x = this.minVelocity * this.scale.x;
            }
        };
        JeepFoo.prototype.showMe = function (rhino) {
            var velocity = 90 + Math.random() * 45;
            var acceleration = 10;
            if (rhino.x < this.game.width / 2) {
                this.x = this.game.width;
                this.body.velocity.x = -velocity;
                this.body.acceleration.x = acceleration;
                this.scale.x = -1;
            }
            else {
                this.x = 0;
                this.body.velocity.x = velocity;
                this.body.acceleration.x = -acceleration;
                this.scale.x = 1;
            }
            this.bang.scale.x = this.scale.x;
            if (rhino.scale.x * this.scale.x > 0)
                rhino.turnAroundAndMove();
            this.y = 450;
            this.visible = true;
            this.phase = PhaseEnum.Moving;
            this.vicinityToRhino = 200 + 100 * Math.random();
            this.hunterSitting.visible = true;
            this.hunterStanding.visible = false;
        };
        JeepFoo.prototype.hideMe = function () {
            this.x = this.game.width;
            this.visible = false;
            this.body.velocity.x = 0;
            this.body.acceleration.x = 0;
            this.phase = PhaseEnum.Hidden;
            this.bang.visible = false;
            this.bang.alpha = 1;
        };
        JeepFoo.prototype.stopToPrepareShooting = function (rhino) {
            var _this = this;
            this.body.velocity.x = 0;
            this.body.acceleration.x = 0;
            this.phase = PhaseEnum.Stopping;
            setTimeout(function () { return _this.shoot(rhino); }, 4000);
            rhino.stop();
            this.hunterSitting.visible = false;
            this.hunterStanding.visible = true;
            this.soundGunLoad.play();
        };
        JeepFoo.prototype.shoot = function (rhino) {
            var _this = this;
            if (this.phase == PhaseEnum.Stopping) {
                this.soundGunShot.play();
                this.createBang();
                this.phase = PhaseEnum.Shooting;
                rhino.getKilled();
                setTimeout(function () { return _this.shotComplete(); }, 1000);
            }
        };
        JeepFoo.prototype.shotComplete = function () {
            if (this.phase == PhaseEnum.Shooting) {
                this.phase = PhaseEnum.ShotComplete;
            }
        };
        JeepFoo.prototype.createBang = function () {
            this.bang.visible = true;
            this.bang.alpha = 0;
            var factor = this.bang.scale.x;
            var tween = this.game.add.tween(this.bang.scale).to({ x: factor * 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.bang.scale).to({ x: factor, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);
            var tweenAlpha = this.game.add.tween(this.bang).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.bang).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        };
        JeepFoo.prototype.isMoving = function () { return this.phase == PhaseEnum.Moving; };
        JeepFoo.prototype.isRhinoShot = function () { return this.phase == PhaseEnum.ShotComplete; };
        return JeepFoo;
    }(Phaser.Sprite));
    Sumatra.JeepFoo = JeepFoo;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var MovingToLeftOrRightEnum;
    (function (MovingToLeftOrRightEnum) {
        MovingToLeftOrRightEnum[MovingToLeftOrRightEnum["NA"] = 0] = "NA";
        MovingToLeftOrRightEnum[MovingToLeftOrRightEnum["Left"] = 1] = "Left";
        MovingToLeftOrRightEnum[MovingToLeftOrRightEnum["Stopping"] = 2] = "Stopping";
        MovingToLeftOrRightEnum[MovingToLeftOrRightEnum["Dead"] = 3] = "Dead";
        MovingToLeftOrRightEnum[MovingToLeftOrRightEnum["Right"] = 4] = "Right";
    })(MovingToLeftOrRightEnum || (MovingToLeftOrRightEnum = {}));
    var Rhino = (function (_super) {
        __extends(Rhino, _super);
        function Rhino(game, posInit) {
            var _this = _super.call(this, game, posInit.x, posInit.y, 'RhinoSpriteSheet', 1) || this;
            _this.normDurationForStopping = 2000;
            _this.normVelocity = 50;
            _this.animations.add('rhinoWalking', [4, 5, 6], 4, true);
            _this.animations.add('rhinoStopping', [0, 1, 2, 3], 4, true);
            _this.animations.add('rhinoDead', [7], 1, true);
            game.add.existing(_this);
            _this.anchor.set(0.5, 1);
            _this.visible = false; // when created it's not visible
            // Physics
            game.physics.enable(_this);
            _this.body.collideWorldBounds = false;
            _this.body.setCircle(20);
            _this.body.velocity.x = 0;
            _this.statusText = _this.game.add.text(5, _this.game.world.height / 2, "Rhino", { font: "12px Arial", fill: "#FFFFFF", align: "center" });
            _this.statusText.anchor.setTo(0, 0.5);
            _this.initRhino();
            return _this;
        }
        Rhino.prototype.update = function () {
            this.statusText.setText("Rhino : " + this.movingToLeftOrRight.toString() + " LOC=" + Math.round(this.x) + "x" + Math.round(this.y));
            if (this.x < 0 || this.x > this.game.width)
                this.restart();
        };
        Rhino.prototype.initRhino = function () {
            this.scale.x = 1;
            this.y = 470;
            this.x = 0;
            this.stop();
        };
        Rhino.prototype.isStoppingNow = function () { return this.movingToLeftOrRight == MovingToLeftOrRightEnum.Stopping; };
        Rhino.prototype.isDead = function () { return this.movingToLeftOrRight == MovingToLeftOrRightEnum.Dead; };
        Rhino.prototype.giveLife = function () {
            if (!this.visible) {
                this.visible = true;
                this.scale.x = 1;
                this.movingToLeftOrRight = MovingToLeftOrRightEnum.Right;
                this.body.velocity.x = this.normVelocity;
                this.animations.play('rhinoWalking');
            }
        };
        Rhino.prototype.stop = function () {
            this.movingToLeftOrRight = MovingToLeftOrRightEnum.Stopping;
            this.body.velocity.x = 0;
            this.animations.stop('rhinoWalking');
            this.animations.play('rhinoStopping');
        };
        Rhino.prototype.restart = function () {
            if (this.scale.x > 0) {
                if (this.x > 0.75 * this.game.width) {
                    this.scale.x = -1;
                    this.movingToLeftOrRight == MovingToLeftOrRightEnum.Left;
                }
            }
            else {
                if (this.x < 0.25 * this.game.width) {
                    this.movingToLeftOrRight == MovingToLeftOrRightEnum.Right;
                    this.scale.x = 1;
                }
            }
            this.body.velocity.x = this.scale.x * this.normVelocity;
            this.animations.stop('rhinoStopping');
            this.animations.play('rhinoWalking');
        };
        Rhino.prototype.getKilled = function () {
            this.movingToLeftOrRight = MovingToLeftOrRightEnum.Dead;
            this.body.velocity.x = 0;
            this.animations.stop('rhinoWalking');
            this.animations.stop('rhinoStopping');
            this.animations.play('rhinoDead');
        };
        Rhino.prototype.turnAroundAndMove = function () {
            if (this.scale.x > 0) {
                this.scale.x = -1;
                this.movingToLeftOrRight = MovingToLeftOrRightEnum.Left;
            }
            else {
                this.scale.x = 1;
                this.movingToLeftOrRight = MovingToLeftOrRightEnum.Right;
            }
            this.body.velocity.x = this.scale.x * this.normVelocity;
        };
        return Rhino;
    }(Phaser.Sprite));
    Sumatra.Rhino = Rhino;
})(Sumatra || (Sumatra = {}));
var Sumatra;
(function (Sumatra) {
    var Volcano = (function (_super) {
        __extends(Volcano, _super);
        function Volcano(game, x, y) {
            var _this = _super.call(this, game, 0, 0) || this;
            game.add.existing(_this);
            _this.volcanoCrest = new Phaser.Sprite(game, x, y, 'imgVolcanoCrest');
            _this.volcanoCrest.anchor.setTo(0.5, 1);
            _this.volcanoSmoke = new Phaser.Sprite(game, x, y - _this.volcanoCrest.height, 'imgVolcanoSmoke');
            _this.volcanoSmoke.anchor.set(0, 1);
            _this.addChild(_this.volcanoCrest);
            _this.addChild(_this.volcanoSmoke);
            _this.smokeFadeOut();
            return _this;
            //this.footerText = this.game.add.text(10, 500, "JeepText", { font: "12px Arial", fill: "#FFFFFF", align: "center" });
        }
        Volcano.prototype.update = function () {
        };
        Volcano.prototype.smokeFadeIn = function () {
            var tween = this.game.add.tween(this.volcanoSmoke).to({ alpha: 1 }, 5000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.smokeFadeOut, this);
        };
        Volcano.prototype.smokeFadeOut = function () {
            var tween = this.game.add.tween(this.volcanoSmoke).to({ alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.smokeFadeIn, this);
        };
        Volcano.prototype.isInArea = function (x, y) {
            if (x > this.volcanoCrest.left
                && x < this.volcanoCrest.right
                && y > this.volcanoCrest.top
                && y < this.volcanoCrest.bottom)
                return true;
            else
                return false;
        };
        Volcano.prototype.tickleMe = function (x, y) {
            if (this.isInArea(x, y)) {
                var tween = this.game.add.tween(this.volcanoCrest.scale).to({ x: 1.05, y: 1.15 }, 200, Phaser.Easing.Bounce.In, true);
                tween.onComplete.add(this.releaseTickle, this);
                return true;
            }
            else {
                return false;
            }
        };
        Volcano.prototype.releaseTickle = function () {
            this.game.add.tween(this.volcanoCrest.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
        };
        Volcano.prototype.getFireballLocation = function () { return new Phaser.Point(this.volcanoCrest.x, this.volcanoCrest.y - this.volcanoCrest.height + 50); };
        return Volcano;
    }(Phaser.Sprite));
    Sumatra.Volcano = Volcano;
})(Sumatra || (Sumatra = {}));
//# sourceMappingURL=appBundle.js.map