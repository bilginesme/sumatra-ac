class SimpleGame {
    // field to store a reference to Phaser Game object
    game: Phaser.Game;

    constructor() {
        // create a new Game object
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "content", { preload: this.preload, create: this.create });
    }

    preload() {
        // in the preload step of the game state, we want to load the phaser logo
        this.game.load.image("logo", "images/Phaser-Logo-Small.png");
     }

    create() {
        // create a sprite from the phaser logo and center it
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        logo.scale.setTo(0.5, 0.5);
        logo.anchor.setTo(0.5, 0.5);
    }
}