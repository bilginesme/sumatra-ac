﻿module Sumatra {
    export class GameEngine extends Phaser.Game {
        constructor() {
            super(1136, 640, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Action', Action, false);

            this.state.start('Boot');
        }
    }
}