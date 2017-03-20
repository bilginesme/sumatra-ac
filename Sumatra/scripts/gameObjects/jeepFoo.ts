module Sumatra {
    enum PhaseEnum { Hidden, Moving, Stopping, Shooting, ShotComplete }

    export class JeepFoo extends Phaser.Sprite {
        private phase: PhaseEnum;
        private minVelocity: number = 50;
        vicinityToRhino: number;
        private hunterSitting: Phaser.Sprite;
        private hunterStanding: Phaser.Sprite;
        private bang: Phaser.Sprite;
        private soundGunShot: Phaser.Sound;
        private soundGunLoad: Phaser.Sound;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'imgJeepFoo');
            game.add.existing(this);
            this.anchor.set(0.5, 1);

            this.phase = PhaseEnum.Hidden;

            // Physics
            game.physics.enable(this);
            
            this.body.collideWorldBounds = false;
            this.body.setCircle(20);
            this.body.velocity.x = 0;
            this.scale.x = 1;

            this.hunterSitting = new Phaser.Sprite(game, 5, -38, "imgHunterSitting", 1);
            this.hunterSitting.anchor.setTo(0.5, 1);
            this.hunterStanding = new Phaser.Sprite(game, 9, -41, "imgHunterStanding", 1);
            this.hunterStanding.anchor.setTo(0.5, 1);

            this.bang = new Phaser.Sprite(game, 30, -60, "imgBang", 1);
            this.bang.anchor.setTo(0.5);
            this.bang.visible = false;

            this.addChild(this.hunterSitting);
            this.addChild(this.hunterStanding);
            this.addChild(this.bang);

            this.children.reverse();

            this.soundGunShot = this.game.add.audio('gunShot', 1, false);
            this.soundGunLoad = this.game.add.audio('gunLoad', 1, false);
        }

        update() {
            if (this.phase == PhaseEnum.Moving && Math.abs(this.body.velocity.x) < this.minVelocity) {
                this.body.acceleration.x = 0;
                this.body.velocity.x = this.minVelocity * this.scale.x;
            }
        }

        showMe(rhino: Rhino) {
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
        }

        hideMe() {
            this.x = this.game.width;
            this.visible = false;
            this.body.velocity.x = 0;
            this.body.acceleration.x = 0;
            this.phase = PhaseEnum.Hidden;

            this.bang.visible = false;
            this.bang.alpha = 1;
        }

        stopToPrepareShooting(rhino: Rhino) {
            this.body.velocity.x = 0;
            this.body.acceleration.x = 0;
            this.phase = PhaseEnum.Stopping;
            setTimeout(() => this.shoot(), 4000);
            rhino.stop();
            this.hunterSitting.visible = false;
            this.hunterStanding.visible = true;

            this.soundGunLoad.play();
        }

        private shoot() {
            if (this.phase == PhaseEnum.Stopping) {
                this.soundGunShot.play();
                this.createBang();
                this.phase = PhaseEnum.Shooting;
                setTimeout(() => this.shotComplete(), 1000);
            }
        }

        private shotComplete() {
            if (this.phase == PhaseEnum.Shooting) {
                this.phase = PhaseEnum.ShotComplete;
            }
        }

        private createBang() {
            this.bang.visible = true;
            this.bang.alpha = 0; 
            var factor = this.bang.scale.x;
            
            var tween = this.game.add.tween(this.bang.scale).to({ x: factor * 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.bang.scale).to({ x: factor, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.bang).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.bang).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }

        isMoving() { return this.phase == PhaseEnum.Moving; }
        isRhinoShot() { return this.phase == PhaseEnum.ShotComplete; }
    }

}