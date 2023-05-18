import { PlayButton } from './assets/components/buttonStart';
import { AboutButton } from './assets/components/buttonAbout';

let score = 0;
let scoreText;
let scoreImage
let lives = 3;
let livesText;
let sound_coin;
let sound_background;


class Scene3 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene3'});

    }


    preload() {



        // Image layers from Tiled can't be exported to Phaser 3 (as yet)
        // So we add the background image separately
        this.load.image('background2', 'assets/images/background1.png',);
        // Load the tileset image file, needed for the map to know what
        // tiles to draw on the screen
        this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
        // Even though we load the tilesheet with the spike image, we need to
        // load the Spike image separately for Phaser 3 to render it
        this.load.image('spike2', 'assets/images/spike.png');
        this.load.image('vampiro', 'assets/images/vampiro.png');
        this.load.image('vampiro2', 'assets/images/vampiro2.png');
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map2', 'assets/tilemaps/level2.json');
        // Load player animations from the player spritesheet and atlas JSON
        this.load.atlas('player', 'assets/images/kenney_player.png',
            'assets/images/kenney_player_atlas.json');
        this.load.spritesheet('bluediamond2',
            'assets/images/blue_diamond-sprites.png',
            {frameWidth: 48, frameHeight: 48}
        );
        this.load.spritesheet('portal2',
            'assets/images/portal.png',
            {frameWidth: 250, frameHeight: 300}
        );
        this.load.audio('coinSound', 'assets/audio/mario-coin.mp3');
        this.load.audio('backgroundSound', 'assets/audio/sound_background.mp3');
        this.load.image('heart', 'assets/images/cor.png');

    }

    create() {




        // Create a tile map, which is used to bring our level in Tiled
        // to our game world in Phaser
        const map = this.make.tilemap({key: 'map2'});
        // Add the tileset to the map so the images would load correctly in Phaser
        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
        // Place the background image in our game world
        const backgroundImage = this.add.image(0, 0, 'background2').setOrigin(0, 0);
        // Scale the image to better match our game's resolution
        backgroundImage.setScale(2, 0.8);
        // Add the platform layer as a static group, the player would be able
        // to jump on platforms like world collisions but they shouldn't move
        const platforms = map.createLayer('Platforms', tileset, 0, 200);
        // There are many ways to set collision between tiles and players
        // As we want players to collide with all of the platforms, we tell Phaser to
        // set collisions for every tile in our platform layer whose index isn't -1.
        // Tiled indices can only be >= 0, therefore we are colliding with all of
        // the platform layer
        platforms.setCollisionByExclusion(-1, true);

        // Add the player to the game world
        this.player = this.physics.add.sprite(50, 550, 'player');
        this.player.setBounce(0.1); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map
        this.physics.add.collider(this.player, platforms);

        // Create the walking animation using the last 2 frames of
        // the atlas' first row
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create an idle animation i.e the first frame
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'robo_player_0'}],
            frameRate: 10,
        });

        // Use the second frame of the atlas for jumping
        this.anims.create({
            key: 'jump',
            frames: [{key: 'player', frame: 'robo_player_1'}],
            frameRate: 10,
        });


        this.anims.create({
            key: 'bluediamondanimation2',
            frames: this.anims.generateFrameNumbers('bluediamond2', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
        });
        this.anims.create({
            key: 'portalanimation2',
            frames: this.anims.generateFrameNumbers('portal2', {start: 0, end: 7}),
            frameRate: 2,
            repeat: -1,
            yoyo: true,
        });
        // this.miSprite = this.add.sprite(350, 430, 'bluediamond');
        // this.miSprite2 = this.add.sprite(420, 430, 'bluediamond');
        this.portal1 = this.physics.add.sprite(1490, 150, 'portal2');

        this.miSprite = this.physics.add.sprite(410, 430, 'bluediamond2');
        this.miSprite2 = this.physics.add.sprite(480, 370, 'bluediamond2');
        this.miSprite3 = this.physics.add.sprite(680, 300, 'bluediamond2');
        this.miSprite4 = this.physics.add.sprite(1120, 430, 'bluediamond2');
        this.miSprite5 = this.physics.add.sprite(930, 430, 'bluediamond2');
        this.portal1.anims.play('portalanimation2');
        this.miSprite.anims.play('bluediamondanimation2');
        this.miSprite2.anims.play('bluediamondanimation2');
        this.miSprite3.anims.play('bluediamondanimation2');
        this.miSprite4.anims.play('bluediamondanimation2');
        this.miSprite5.anims.play('bluediamondanimation2');
        this.physics.add.collider(this.player, this.miSprite2, function (player, miSprite2) {
            aumentarPuntaje(miSprite2);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite, function (player, miSprite) {
            aumentarPuntaje(miSprite);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite3, function (player, miSprite3) {
            aumentarPuntaje(miSprite3);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite4, function (player, miSprite4) {
            aumentarPuntaje(miSprite4);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite5, function (player, miSprite5) {
            aumentarPuntaje(miSprite5);
        }, null, this);

        this.physics.add.collider(this.portal1, platforms);
        this.physics.add.overlap(this.portal1, this.player, canviEscena3.bind(this));

        this.physics.add.collider(this.miSprite2, platforms);
        this.physics.add.collider(this.miSprite3, platforms);
        this.physics.add.collider(this.miSprite, platforms);
        this.physics.add.collider(this.miSprite4, platforms);
        this.physics.add.collider(this.miSprite5, platforms);


        // Enable user input via cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create a sprite group for all spikes, set common properties to ensure that
        // sprites in the group don't move via gravity or by player collisions
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Get the spikes from the object layer of our Tiled map. Phaser has a
        // createFromObjects function to do so, but it creates sprites automatically
        // for us. We want to manipulate the sprites a bit before we use them
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            // Add new spikes to our sprite group
            const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
            // By default the sprite has loads of whitespace from the base image, we
            // resize the sprite to reduce the amount of whitespace used by the sprite
            // so collisions can be more precise
            spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
        });

        // Add collision between the player and the spikes
        this.physics.add.collider(this.player, this.spikes, playerHit, null, this);

        // Crear el texto del puntaje
        let scoreImage = this.add.image(10, 10, 'bluediamond');
        scoreImage.setOrigin(0, 0);
        scoreImage.setScale(0.5);
        scoreText = this.add.text(70, 10, score.toString(), {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff'
        });
        scoreText.setOrigin(1, 0);
        scoreText.setScrollFactor(0);
        scoreImage.setScrollFactor(0);


        const heartImage = this.add.image(740, 20, 'heart');
        heartImage.setScrollFactor(0);

        const scaleRatio = 0.7;
        heartImage.setScale(scaleRatio);
        livesText = this.add.text(715  + heartImage.width + 10,21, lives.toString(), {
            fontSize: '24px',
            fill: '#ffffff'
        });
        livesText.setOrigin(0, 0.5);
        livesText.setScrollFactor(0);



        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        this.physics.world.bounds.width = platforms.width;
        this.physics.world.bounds.height = 584;

        // Cargar el audio

        // Crear el efecto de sonido
        sound_coin = this.sound.add('coinSound');



        this.vampiro = this.physics.add.sprite(740, 300, 'vampiro');
        this.vampiro.setScale(0.2, 0.2);
        this.physics.add.collider(this.vampiro, platforms);
        this.physics.add.overlap(this.player, this.vampiro, playerHitEnemy, null, this);


        function aumentarPuntaje(sprite) {
            score++;
            scoreText.setText(score.toString());
            scoreImage.setTexture('bluediamond');
            scoreImage.setScale(0.5);
            sound_coin.play();

            sprite.destroy();

        }




    }



    update() {
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        // If the player is moving to the right, keep them facing forward
        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }

    /**
     * playerHit resets the player's state when it dies from colliding with a spike
     * @param {*} player - player sprite
     * @param {*} spike - spike player collided with
     */



}
class Scene1 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene1'});
        this.playButton = new PlayButton(this);
        this.aboutButton = new AboutButton(this);

    }


    preload() {
        // Carga los recursos necesarios para la escena 4
        this.load.image('background1', 'assets/images/Background_scene1.png');
        this.load.spritesheet('playbutton', 'assets/images/playbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('aboutbutton', 'assets/images/aboutbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.audio('backgroundSound1', 'assets/audio/sound_background.mp3');

    }

    create() {

        // Configuración inicial de la escena 4
        const backgroundImage1 = this.add.image(0, 0, 'background1').setOrigin(0, 0);
        backgroundImage1.setScale(1, 1.5);
        sound_background = this.sound.add('backgroundSound1', {loop: true});
        sound_background.volume = 0.1
        sound_background.play();

        this.playButton.create();
        this.aboutButton.create();

    }

    update() {
        // Lógica de actualización de la escena 4
    }
}

class Scene4 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene4'});
        this.playButton = new PlayButton(this);
        this.aboutButton = new AboutButton(this);

    }


    preload() {
        // Carga los recursos necesarios para la escena 4
        this.load.image('background1', 'assets/images/Background_scene1.png');
        this.load.image('gameover', 'assets/images/gameover.png');
        this.load.spritesheet('playbutton', 'assets/images/playbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('aboutbutton', 'assets/images/aboutbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.audio('backgroundSound1', 'assets/audio/sound_background.mp3');

    }

    create() {

        // Configuración inicial de la escena 4
        const backgroundImage1 = this.add.image(0, 0, 'background1').setOrigin(0, 0);
        backgroundImage1.setScale(1, 1.5);
        const gameover = this.add.image(410, 400, 'gameover')
        gameover.setScale(0.3, 0.3);
        sound_background = this.sound.add('backgroundSound1', {loop: true});
        sound_background.volume = 0.1
        sound_background.play();

        this.playButton.create();
        this.aboutButton.create();

    }

    update() {
        // Lógica de actualización de la escena 4
    }
}
class Scene5 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene5'});
        this.playButton = new PlayButton(this);
        this.aboutButton = new AboutButton(this);

    }


    preload() {
        // Carga los recursos necesarios para la escena 4
        this.load.image('background1', 'assets/images/Background_scene1.png');
        this.load.image('victory', 'assets/images/victory.png');
        this.load.spritesheet('playbutton', 'assets/images/playbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('aboutbutton', 'assets/images/aboutbutton.png', { frameWidth: 190, frameHeight: 49 });
        this.load.audio('backgroundSound1', 'assets/audio/sound_background.mp3');

    }

    create() {

        // Configuración inicial de la escena 4
        const backgroundImage1 = this.add.image(0, 0, 'background1').setOrigin(0, 0);
        backgroundImage1.setScale(1, 1.5);
        const victory = this.add.image(410, 400, 'victory')
        victory.setScale(0.5, 0.5);
        sound_background = this.sound.add('backgroundSound1', {loop: true});
        sound_background.volume = 0.1
        sound_background.play();

        this.playButton.create();
        this.aboutButton.create();

    }

    update() {
        // Lógica de actualización de la escena 4
    }
}

class Scene2 extends Phaser.Scene {


    constructor() {
        super({key: 'Scene2'});
    }


    preload() {



        // Image layers from Tiled can't be exported to Phaser 3 (as yet)
        // So we add the background image separately
        this.load.image('background', 'assets/images/background1.png');
        // Load the tileset image file, needed for the map to know what
        // tiles to draw on the screen
        this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
        // Even though we load the tilesheet with the spike image, we need to
        // load the Spike image separately for Phaser 3 to render it
        this.load.image('spike', 'assets/images/spike.png');
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
        // Load player animations from the player spritesheet and atlas JSON
        this.load.atlas('player', 'assets/images/kenney_player.png',
            'assets/images/kenney_player_atlas.json');
        this.load.spritesheet('bluediamond',
            'assets/images/blue_diamond-sprites.png',
            {frameWidth: 48, frameHeight: 48}
        );
        this.load.spritesheet('portal',
            'assets/images/portal.png',
            {frameWidth: 250, frameHeight: 300}
        );
        this.load.audio('coinSound', 'assets/audio/mario-coin.mp3');
        this.load.audio('backgroundSound', 'assets/audio/sound_background.mp3');
        this.load.image('heart', 'assets/images/cor.png');

    }

    create() {
        sound_background.stop();




        // Create a tile map, which is used to bring our level in Tiled
        // to our game world in Phaser
        const map = this.make.tilemap({key: 'map'});
        // Add the tileset to the map so the images would load correctly in Phaser
        const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
        // Place the background image in our game world
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        // Scale the image to better match our game's resolution
        backgroundImage.setScale(2, 0.8);
        // Add the platform layer as a static group, the player would be able
        // to jump on platforms like world collisions but they shouldn't move
        const platforms = map.createLayer('Platforms', tileset, 0, 200);
        // There are many ways to set collision between tiles and players
        // As we want players to collide with all of the platforms, we tell Phaser to
        // set collisions for every tile in our platform layer whose index isn't -1.
        // Tiled indices can only be >= 0, therefore we are colliding with all of
        // the platform layer
        platforms.setCollisionByExclusion(-1, true);

        // Add the player to the game world
        this.player = this.physics.add.sprite(50, 550, 'player');
        this.player.setBounce(0.1); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map
        this.physics.add.collider(this.player, platforms);

        // Create the walking animation using the last 2 frames of
        // the atlas' first row
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create an idle animation i.e the first frame
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'robo_player_0'}],
            frameRate: 10,
        });

        // Use the second frame of the atlas for jumping
        this.anims.create({
            key: 'jump',
            frames: [{key: 'player', frame: 'robo_player_1'}],
            frameRate: 10,
        });


        this.anims.create({
            key: 'bluediamondanimation',
            frames: this.anims.generateFrameNumbers('bluediamond', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1,
            yoyo: true,
        });
        this.anims.create({
            key: 'portalanimation',
            frames: this.anims.generateFrameNumbers('portal', {start: 0, end: 7}),
            frameRate: 2,
            repeat: -1,
            yoyo: true,
        });
        // this.miSprite = this.add.sprite(350, 430, 'bluediamond');
        // this.miSprite2 = this.add.sprite(420, 430, 'bluediamond');
        this.portal1 = this.physics.add.sprite(900, 150, 'portal');
        this.miSprite = this.physics.add.sprite(350, 430, 'bluediamond');
        this.miSprite2 = this.physics.add.sprite(420, 430, 'bluediamond');
        this.miSprite3 = this.physics.add.sprite(610, 370, 'bluediamond');
        this.portal1.anims.play('portalanimation');
        this.miSprite.anims.play('bluediamondanimation');
        this.miSprite2.anims.play('bluediamondanimation');
        this.miSprite3.anims.play('bluediamondanimation');
        this.physics.add.collider(this.player, this.miSprite2, function (player, miSprite2) {
            aumentarPuntaje(miSprite2);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite, function (player, miSprite) {
            aumentarPuntaje(miSprite);
        }, null, this);
        this.physics.add.collider(this.player, this.miSprite3, function (player, miSprite3) {
            aumentarPuntaje(miSprite3);
        }, null, this);
        this.physics.add.collider(this.portal1, platforms);
        this.physics.add.overlap(this.portal1, this.player, canviEscena.bind(this));
        this.physics.add.collider(this.miSprite2, platforms);
        this.physics.add.collider(this.miSprite3, platforms);
        this.physics.add.collider(this.miSprite, platforms);


        // Enable user input via cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create a sprite group for all spikes, set common properties to ensure that
        // sprites in the group don't move via gravity or by player collisions
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Get the spikes from the object layer of our Tiled map. Phaser has a
        // createFromObjects function to do so, but it creates sprites automatically
        // for us. We want to manipulate the sprites a bit before we use them
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            // Add new spikes to our sprite group
            const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
            // By default the sprite has loads of whitespace from the base image, we
            // resize the sprite to reduce the amount of whitespace used by the sprite
            // so collisions can be more precise
            spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
        });

        // Add collision between the player and the spikes
        this.physics.add.collider(this.player, this.spikes, playerHit, null, this);

        // Crear el texto del puntaje
        let scoreImage = this.add.image(10, 10, 'bluediamond');
        scoreImage.setOrigin(0, 0);
        scoreImage.setScale(0.5);
        scoreText = this.add.text(70, 10, score.toString(), {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff'
        });
        scoreText.setOrigin(1, 0);
        scoreText.setScrollFactor(0);
        scoreImage.setScrollFactor(0);


        const heartImage = this.add.image(740, 20, 'heart');
        heartImage.setScrollFactor(0);

        const scaleRatio = 0.7;
        heartImage.setScale(scaleRatio);
        livesText = this.add.text(715  + heartImage.width + 10,21, lives.toString(), {
            fontSize: '24px',
            fill: '#ffffff'
        });
        livesText.setOrigin(0, 0.5);
        livesText.setScrollFactor(0);



        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        this.physics.world.bounds.width = platforms.width;
        this.physics.world.bounds.height = 584;

        // Cargar el audio

        // Crear el efecto de sonido
        sound_coin = this.sound.add('coinSound');
        sound_background = this.sound.add('backgroundSound', {loop: true});
        sound_background.volume = 0.1
        sound_background.play();
        function aumentarPuntaje(sprite) {
            score++;
            scoreText.setText(score.toString());
            scoreImage.setTexture('bluediamond');
            scoreImage.setScale(0.5);
            sound_coin.play();

            sprite.destroy();

        }




    }



    update() {
        // Control the player with left or right keys
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this.player.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this.player.body.onFloor()) {
                this.player.play('idle', true);
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-350);
            this.player.play('jump', true);
        }

        // If the player is moving to the right, keep them facing forward
        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
        } else if (this.player.body.velocity.x < 0) {
            // otherwise, make them face the other side
            this.player.setFlipX(true);
        }
    }

    /**
     * playerHit resets the player's state when it dies from colliding with a spike
     * @param {*} player - player sprite
     * @param {*} spike - spike player collided with
     */



}

function canviEscena() {
    this.scene.start('Scene3');

}function canviEscena2() {
    this.scene.start('Scene4');
    sound_background.stop();
    lives=3;
    score=0;
}
function canviEscena3() {
    this.scene.start('Scene5');
    sound_background.stop();
    lives=3;
    score=0;
}


function playerHit(player, spike) {


    lives--;
    livesText.setText(lives);

    // Set velocity back to 0
    player.setVelocity(0, 0);
    // Put the player back in its original position
    if (lives > 0) {
        player.setX(50);
        player.setY(550);
        // Use the default `idle` animation
        player.play('idle', true);
        // Set the visibility to 0 i.e. hide the player
        player.setAlpha(0);
        // Add a tween that 'blinks' until the player is gradually visible
        let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
        });

    } else {
        // Si el jugador no tiene vidas restantes, reiniciar el juego o realizar otra acción
        // Aquí puedes agregar tu lógica para reiniciar el juego, mostrar un mensaje de game over, etc.
        // Por ejemplo:
        sound_background.stop();
        this.scene.start('Scene4');
        lives=3;
        score=0;
    }

}

function playerHitEnemy(player, spike) {
    if (player.y+50 < this.vampiro.y){
        this.vampiro.destroy()
    }

    else{
        lives--;
        livesText.setText(lives);

        // Set velocity back to 0
        player.setVelocity(0, 0);
        // Put the player back in its original position
        if (lives > 0) {
            player.setX(50);
            player.setY(550);
            // Use the default `idle` animation
            player.play('idle', true);
            // Set the visibility to 0 i.e. hide the player
            player.setAlpha(0);
            // Add a tween that 'blinks' until the player is gradually visible
            let tw = this.tweens.add({
                targets: player,
                alpha: 1,
                duration: 100,
                ease: 'Linear',
                repeat: 5,
            });

        } else {
            // Si el jugador no tiene vidas restantes, reiniciar el juego o realizar otra acción
            // Aquí puedes agregar tu lógica para reiniciar el juego, mostrar un mensaje de game over, etc.
            // Por ejemplo:
            sound_background.stop();
            this.scene.start('Scene4');
            lives=3;
            score=0;
        }
    }
}
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    heigth: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Scene1,Scene2,Scene3,Scene4,Scene5],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false

        },
    }
}
new Phaser.Game(config);