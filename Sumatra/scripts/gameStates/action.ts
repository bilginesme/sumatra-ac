﻿module Sumatra {
    enum GameStateEnum { NA = 0, Running = 1, LostOneLife = 2, GameOver = 9 }
    enum KeyboardDirectionEnum { None, Left, Right }

    export class Action extends Phaser.State {
        private background: Phaser.Sprite;
        private music: Phaser.Sound;
        private billboardLives: Billboard;
        private gameOver: GameOver;
        private gameState: GameStateEnum = GameStateEnum.NA;
        private billboardPoints: Billboard;
        private txtLargeMessage: Phaser.Text;
        private statusText1: Phaser.Text;
        private statusText2: Phaser.Text;
        private statusText3: Phaser.Text;
        private jeep: Jeep;
        private volcano: Volcano;        
        private cannon: Cannon;
        private boom: Phaser.Sprite;
        private boomWithCannon: Phaser.Sprite;
        private explosion: Phaser.Sprite;
        private jeepExplosion: Phaser.Sprite;
        private clouds: Cloud[];
        private fireballs: Fireball[];
        private jeepsFoo: JeepFoo[];
        private maxJeepsFoo: number = 5;
        private rhino: Rhino;
        private numLives: number = 3;
        private points: number = 0;
        private pointsForShootingMovingJeep: number = 100;
        private pointsForShootingStoppingJeep: number = 25;
        private point100: Phaser.Sprite;
        private point25: Phaser.Sprite;
        private keyboardDirection: KeyboardDirectionEnum;

        create() {
            //window.localStorage.removeItem('hiScore');

            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.gameState = GameStateEnum.Running;

            this.add.image(0, 0, 'imgSky');

            this.clouds = new Array(5);
            for (var i = 0; i < this.clouds.length; i++) 
                this.clouds[i] = new Cloud(this.game);
            
            this.volcano = new Volcano(this.game, this.game.width / 2, 418);

            this.add.image(0, 315, 'imgBushes');
            this.add.image(0, 412, 'imgGround3');

            this.jeepsFoo = new Array(this.maxJeepsFoo);
            for (var i = 0; i < this.jeepsFoo.length; i++) {
                this.jeepsFoo[i] = new JeepFoo(this.game);
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

            this.rhino = new Rhino(this.game, new Phaser.Point(0, 0));
            this.jeep = new Jeep(this.game, 930, 630);
            this.cannon = new Cannon(this.game, this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);

            this.jeepExplosion = this.add.sprite(0, 0, 'imgExplosion');
            this.jeepExplosion.anchor.setTo(0.5);
            this.jeepExplosion.visible = false;
            
            this.boomWithCannon = this.add.sprite(0, 0, 'imgBoomWithCannon');
            this.boomWithCannon.anchor.setTo(0.5);
            this.boomWithCannon.visible = false;

            this.fireballs = new Array(Fireball.maxFireballs);
            for (var i = 0; i < this.fireballs.length; i++) {
                this.fireballs[i] = new Fireball(this.game, this.volcano.getFireballLocation().x, this.volcano.getFireballLocation().y);
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

            this.billboardLives = new Billboard(this.game, new Phaser.Point(80, 40), BillboardTypeEnum.Lives);
            this.billboardLives.anchor.setTo(0.5);
            this.billboardLives.changeValue(this.numLives, false);

            this.billboardPoints = new Billboard(this.game, new Phaser.Point(this.game.width - 100, 40), BillboardTypeEnum.Points);
            this.billboardPoints.anchor.setTo(0.5);
            this.billboardPoints.changeValue(this.points, false);

            this.point100 = this.add.sprite(0, 0, 'imgPoint100');
            this.point100.anchor.setTo(0.5);
            this.point100.visible = false;

            this.point25 = this.add.sprite(0, 0, 'imgPoint25');
            this.point25.anchor.setTo(0.5);
            this.point25.visible = false;

            this.gameOver = new GameOver(this.game);
            this.gameOver.anchor.setTo(0.5);

            this.game.input.onTap.add(this.onTap, this);
            this.game.input.addMoveCallback(this.onMove, this);
             
            setTimeout(() => this.createRandomJeepFoo(), 1000);
            setTimeout(() => this.rhino.giveLife(), 1000);
            setTimeout(() => this.createRandomFireball(), 5000);

            this.game.add.audio('intro', 0.95, false).play()

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
            keyRight.onDown.add(function () { if (this.keyboardDirection == KeyboardDirectionEnum.None) {
                    this.keyboardDirection = KeyboardDirectionEnum.Right;
                    this.onKeyDown(0, 0);
                }
            }, this);
            keyRight.onUp.add(function () { this.onKeyUp(2); }, this);

            var keySpaceBar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            keySpaceBar.onDown.add(function (key) { this.onClickSpaceBar(); }, this);
        }

        update() {
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
            this.statusText2.setText("Fireball Duration : " + Fireball.durationForNewFireball);
        }

        private onTap(pointer, doubleTap) {
            if (doubleTap) {
                this.statusText1.setText("double");
            }
            else {
                if (this.gameState == GameStateEnum.Running
                    && this.jeep.isInArea(this.game.input.x, this.game.input.y)
                    && !this.rhino.isDead())
                {
                    this.jeep.tickleMe(this.game.input.x, this.game.input.y);

                    if (this.cannon.startFiring())
                        this.createBoomWithCannon(this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);
                }

                if (this.volcano.tickleMe(this.game.input.x, this.game.input.y))
                    this.playTickSound();
            }
        }
        private onMove(pointer, x, y, isClick) {
            if (this.cannon.isIdle())
                this.cannon.setPosition(this.jeep.getCanonLocation());
        }
        private onClickSpaceBar() {
            if (this.gameState == GameStateEnum.Running && !this.rhino.isDead())
            {
                if (this.cannon.startFiring())
                    this.createBoomWithCannon(this.jeep.getCanonLocation().x, this.jeep.getCanonLocation().y);
            }
        }
        private onKeyDown(direction, notUsed) {
            this.jeep.startMotion(this.jeep.x);
            this.statusText1.setText(this.jeep.motionState.toString());
        }
        private onKeyUp(leftOrRight) {
            if ((leftOrRight == 1 && this.keyboardDirection == KeyboardDirectionEnum.Left) || (leftOrRight == 2 && this.keyboardDirection == KeyboardDirectionEnum.Right)) {
                this.keyboardDirection = KeyboardDirectionEnum.None;
                this.jeep.endMotion();
                this.statusText1.setText(this.jeep.motionState.toString());
            }
        }

        private playTickSound() { this.add.audio('click', 1, false).play(); }

        private decreaseOneLife(): boolean {
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
        }
        private addPoints(p: number) {
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
        }

        private cleanAllFooElements() {
            if (this.jeep.x > this.jeep.xPrevious)
                this.jeep.scale.x = -1;
            else if (this.jeep.x < this.jeep.xPrevious)
                this.jeep.scale.x = 1;
        }

        private handleJeepMovement() {
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
        }
        private handleGameOver() {
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
        }
        private handleLostOneLife() {
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
            setTimeout(() => this.restartAfterLostLife(), 5000);
            tweenText.onComplete.add(function ()
            {
                var tweenTextOut = this.game.add.tween(this.txtLargeMessage.scale).to({ x: 1, y: 1 }, 3000, Phaser.Easing.Elastic.Out, true);
                tweenTextOut.onComplete.add(function ()
                {
                   
                });
            }, this);
        }

        private restartAfterLostLife() {
            //alert("ok");
            this.jeep.visible = true;
            this.cannon.visible = true;
                    
            this.gameState = GameStateEnum.Running;
            this.txtLargeMessage.visible = false;
            this.rhino.restart();
            setTimeout(() => this.createRandomJeepFoo(), 2000);
        }

        private checkJeepFooHit() {
            if (!this.rhino.isDead() && this.cannon.checkHitOnGround()) {
                this.createBoom(this.cannon.getCannonPosition().x, this.cannon.getCannonPosition().y);

                for (var i = 0; i < this.jeepsFoo.length; i++) {
                    if (this.jeepsFoo[i].visible && this.jeepsFoo[i].overlap(this.cannon))
                    {
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
                        
                        setTimeout(() => this.createRandomJeepFoo(), 2000);
                        if (this.rhino.isStoppingNow())
                            this.rhino.restart();
                        Fireball.decreaseDurationForNewFireball();
                    }
                }
            }
        }
        private checkJeepRhinoVicinity() {
            for (var i = 0; i < this.jeepsFoo.length; i++) {
                if (this.jeepsFoo[i].visible == true && this.jeepsFoo[i].isMoving() && this.rhino.visible == true) {
                    if (Math.abs(this.jeepsFoo[i].x - this.rhino.x) < this.jeepsFoo[i].vicinityToRhino) {
                        this.jeepsFoo[i].stopToPrepareShooting(this.rhino);
                    }
                }
            }
        }
        private checkWhetherRhinoShot() {
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
        }
        private checkFireballHit() {
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
        }
        private createBoom(x, y) {
            this.boom.position.set(x, y);
            this.boom.visible = true;
            this.boom.alpha = 0;

            var tween = this.game.add.tween(this.boom.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.boom.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.boom).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.boom).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }
        private createFlyingPoint(point: number, x: number, y: number) {
            var img: Phaser.Sprite;
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
            tween.onComplete.add(function () {  }, this);

            var tween = this.game.add.tween(img.scale).to({ x: 1, y: 1 }, 600, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {  }, this);

            var tweenAlpha = this.game.add.tween(img).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(img).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }
        private createJeepExplosion(x, y) {
            this.jeepExplosion.position.set(x, y);
            this.jeepExplosion.visible = true;
            this.jeepExplosion.alpha = 0;

            var tween = this.game.add.tween(this.jeepExplosion.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.jeepExplosion.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.jeepExplosion).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.jeepExplosion).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }
        private createBoomWithCannon(x, y) {
            this.boomWithCannon.position.set(x, y);
            this.boomWithCannon.visible = true;
            this.boomWithCannon.alpha = 0;

            var tween = this.game.add.tween(this.boomWithCannon.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.boomWithCannon.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.boomWithCannon).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.boomWithCannon).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }
        private createExplosion(x, y) {
            this.explosion.position.set(x, y);
            this.explosion.visible = true;
            this.explosion.alpha = 0;

            var tween = this.game.add.tween(this.explosion.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.explosion.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.explosion).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.explosion).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }
        private createRandomJeepFoo() {
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
        }
        private createRandomFireball() {
            if (this.gameState == GameStateEnum.Running) {
                for (var i = 0; i < this.fireballs.length; i++) {
                    if (this.fireballs[i].visible == false) {
                        this.fireballs[i].erupt();
                        break;
                    }
                }
            }

            setTimeout(() => this.createRandomFireball(), Fireball.durationForNewFireball);
        }
    }
}