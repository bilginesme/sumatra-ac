﻿module Sumatra {

    export class MainMenu extends Phaser.State {
        background: Phaser.Sprite;
        logo: Phaser.Sprite;

        create() {
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
        }

        fadeOut() {
            console.log("Starting game...");
            this.add.audio('click', 1, false).play();
            
            this.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('Action', true, false);
        }

    }

}