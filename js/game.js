let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    },
    autoCenter: true
};

// Déclaration de nos variables globales
let game = new Phaser.Game(config);
let up;
let down;
let left;
let right;
let heartImage;
let heartScale;
let cars = [];
let deadFrogImage;
let frogSound;
let explosion;
let carName = [];
let titleScreen;
let playBtn;
let carVelocity;
let frogNumber, frogSavedNumber;
let frogIndex;
let scoreText;

function init() {
    frogSavedNumber = 0;
    frogIndex = 0;
    carVelocity = 20;
    heartScale = 0.2;
    carName = ["car", "F1", "snowcar"];
    cars = [];
    frogNumber = 2;
}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('frog', './assets/images/Frog.png');
    this.load.image('heart', './assets/images/heart.png');
    this.load.image('mumfrog', './assets/images/MumFrog.png');
    this.load.image('car', './assets/images/car.png');
    this.load.image('F1', './assets/images/F1-1.png');
    this.load.image('snowcar', './assets/images/snowCar.png');
    this.load.image('titleScreen', './assets/images/TitleScreen.png');
    this.load.image('playBtn', './assets/images/playButton.webp');
    this.load.image('deadFrog', './assets/images/deadFrog.png');
    this.load.audio('coac', './assets/audio/coaac.wav');
    this.load.audio('explosion', './assets/audio/explosion.wav');
}

function create() {
    backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);

    frogSound = this.sound.add('coac');
    explosion = this.sound.add('explosion');

    mumFrogImage = this.add.image(Phaser.Math.Between(0, 29) * 16, 0, 'mumfrog');
    mumFrogImage.setOrigin(0, 0);
    frogImage = this.add.image(240, 312, 'frog');
    heartImage = this.add.image(240, 160, 'heart');
    heartImage.setVisible(false);
    heartImage.setScale(heartScale);

    /* for (let i = 0; i <3; i++) {// lignes
         for (let j = 0; j <10; j++) {//colonnes
        let carImage = this.physics.add.image(j * Phaser.Math.Between(44,48),
                                           64+(32*j), 
                                              carName[Phaser.Math.Between(0, 2)]);
     
         carImage.setOrigin(0, 0);
         carImage.setVelocity(100, 0);
         cars.push(carImage);
             }
     } */

    for (let i = 0; i < 30; i++) {
        let carImage = this.physics.add.image((i % 10) * Phaser.Math.Between(44, 48),
            64 + (32 * Math.trunc(i / 10)), carName[Phaser.Math.Between(0, 2)]);
        //let carImage = this.physics.add.image(i*42, 64, 'car'+Phaser.Math.Between(1,3));
        carImage.setOrigin(0, 0);
        carImage.setVelocity(carVelocity, 0);
        cars.push(carImage);

    }


    for (let i = 0; i < 30; i++) {
        let carImage = this.physics.add.image((i % 10) * Phaser.Math.Between(44, 48),
            192 + (32 * Math.trunc(i / 10)), carName[Phaser.Math.Between(0, 2)]);
        //let carImage = this.physics.add.image(i*42, 64, 'car'+Phaser.Math.Between(1,3));
        carImage.setOrigin(0, 0);
        carImage.setAngle(180);
        carImage.setVelocity(-carVelocity, 0);
        cars.push(carImage);

    }


    deadFrogImage = this.add.image(340, 260, 'deadFrog');
    deadFrogImage.setVisible(false);


    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    console.log(cars.length);

    titleScreen = this.add.image(0, 0, 'titleScreen');
    titleScreen.setOrigin(0, 0);
    titleScreen.setScale(0.7);
    playBtn = this.add.image(240, 290, 'playBtn').setInteractive();
    playBtn.setScale(0.05);
    playBtn.on('pointerdown', startGame);
    scoreText = this.add.text(170, 162, "Press play to start", 
    {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#ffff00'
    })

}

function update() {
    for (let i = 0; i < cars.length; i++) {
        if ((cars[i].x > 480) && (cars[i].y < 190)) cars[i].x = -10;
        if ((cars[i].x < 0) && (cars[i].y > 190)) cars[i].x = 490;
        if (Phaser.Geom.Intersects.RectangleToRectangle(
                frogImage.getBounds(), cars[i].getBounds())) {

            deadFrogImage.x = frogImage.x;
            deadFrogImage.y = frogImage.y;
            frogImage.x = -1000;
            deadFrogImage.setVisible(true);
            explosion.play();

            let TimerRestart = this.time.addEvent({
                delay: 4000,
                callback: restartGame,
                callbackScope: this,
                repeat: 0
            });

        };

    }

    if (Phaser.Input.Keyboard.JustDown(up) && frogImage.y > 16) {
        frogImage.y -= 16;
        frogImage.setAngle(0);
        frogSound.play();
    }
    if (Phaser.Input.Keyboard.JustDown(down) && frogImage.y < 304) {
        frogImage.y += 16;
        frogImage.setAngle(180);
        frogSound.play();

    }
    if (Phaser.Input.Keyboard.JustDown(left) && frogImage.x > 16) {

        frogImage.x -= 16;
        frogImage.setAngle(-90);
        frogSound.play();
    }
    if (Phaser.Input.Keyboard.JustDown(right) && frogImage.x < 480) {

        frogImage.x += 16;
        frogImage.setAngle(90);
        frogSound.play();
    }
    if (Phaser.Geom.Intersects.RectangleToRectangle(
            frogImage.getBounds(), mumFrogImage.getBounds())) {
        heartImage.setVisible(true);
        heartScale += 0.01;
        heartImage.setScale(heartScale);
        if (heartScale > 2) {
            frogSavedNumber++;
            frogImage.setPosition(246, 312);
            restartGame();
        }


    };


}

function restartGame() {
    //this.scene.restart();
    //autant de fois qu'il y a de frogNumber
    frogIndex++;

    deadFrogImage.setVisible(false);
    //remettre le frog a sa place 
    frogImage.setPosition(246, 312);
    frogImage.setAngle(0);
    // changer aléatoirement la place de la maman
    mumFrogImage.setPosition(Phaser.Math.Between(0, 29) * 16, 0);
    //faire disparaitre le coeur et reinitialiser sa taille
    heartImage.setVisible(false);
    heartScale = 0.2;
    if (frogIndex == frogNumber) gameOver();

}

function startGame() {
    titleScreen.setVisible(false);
    playBtn.setVisible(false);
    scoreText.text = "";
    frogSavedNumber = 0;
    frogIndex = 0;
}

function gameOver() {
    titleScreen.setVisible(true);
    playBtn.setVisible(true);
    scoreText.text = "You saved " + frogSavedNumber + "\n Press play to start over";
}
