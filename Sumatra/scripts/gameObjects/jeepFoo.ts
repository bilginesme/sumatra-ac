module Sumatra {
    enum PhaseEnum { Hidden, Moving, Stopping, Shooting, ShotComplete }

    export class JeepFoo extends Phaser.Sprite {
        private phase: PhaseEnum;
        private minVelocity: number = 50;
        vicinityToRhino: number;
        private hunterSitting: Phaser.Sprite;
        private hunterStanding: Phaser.Sprite;
        private bang: Phaser.Sprite;

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

            this.bang = new Phaser.Sprite(game, 0, 0, "imgBang", 1);
            this.bang.anchor.setTo(0.5);
            this.bang.visible = true;

            this.addChild(this.hunterSitting);
            this.addChild(this.hunterStanding);
            this.addChild(this.bang);

            this.children.reverse();
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
        }

        stopToPrepareShooting(rhino: Rhino) {
            this.body.velocity.x = 0;
            this.body.acceleration.x = 0;
            this.phase = PhaseEnum.Stopping;
            setTimeout(() => this.shoot(), 5000);
            rhino.stop();
            this.hunterSitting.visible = false;
            this.hunterStanding.visible = true;
            this.createBang(this.x, this.y);
        }

        private shoot() {
            if (this.phase == PhaseEnum.Stopping) {
                
                this.phase = PhaseEnum.Shooting;
            }
                
        }

        private createBang(x, y) {
            this.bang.position.set(x, y);
            this.bang.visible = true;
            this.bang.alpha = 0;
            //this.bang.scale.x = this.scale.x;

            var tween = this.game.add.tween(this.bang.scale).to({ x: 1.25, y: 1.25 }, 200, Phaser.Easing.Bounce.In, true);
            tween.onComplete.add(function () { this.game.add.tween(this.bang.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); }, this);

            var tweenAlpha = this.game.add.tween(this.bang).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(function () { this.game.add.tween(this.bang).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true); }, this);
        }

        isMoving() { return this.phase == PhaseEnum.Moving; }
        isShooting() { return this.phase == PhaseEnum.Shooting; }
    }

}