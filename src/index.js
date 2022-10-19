let game;

const gameOptions = {
	dudeGravity: 700,
	dudeSpeed: 500
}
window.onload = function() {
	let gameConfig = {
		type: Phaser.AUTO,
		backgroundColor: "#00ccff",//"#00ccff"
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: 1200,
			height: 800,
		},
		pixelArt: true,
		physics: {
			default: "arcade",
			arcade: {
				gravity: {
					y: 0
				}
			}
		},
		scene: PlayGame
	}
	game = new Phaser.Game(gameConfig)
	window.focus();
}
class PlayGame extends Phaser.Scene {

	constructor() {
		super("PlayGame")
		this.score = 0
		
	}
	
	preload(){
		
		
		this.load.image("ground", require("../assets/platform.png"))
		this.load.image("star", require("../assets/star.png"))
		this.load.image("redStar", require("../assets/redStar.png"))
		this.load.image("badGuy", require("../assets/badGuy.png"))
		this.load.spritesheet("dude",require("../assets/dude.png"), {frameWidth: 32, frameHeigth: 48});
	}

	create(){
		this.groundGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false
		})

		for(let i = 1 ; i < 20 ; i++){
			this.groundGroup.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "ground");

		}
		//Dude
		this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
		this.dude.body.gravity.y = gameOptions.dudeGravity
		this.physics.add.collider(this.dude, this.groundGroup)
		
		//Stars
		this.starsGroup = this.physics.add.group({})
		this.physics.add.collider(this.starsGroup, this.groundGroup)
		this.physics.add.overlap(this.dude, this.starsGroup, this.collectStar, null , this)
		
		//Redstars
		this.redStarsGroup = this.physics.add.group({})
		this.physics.add.collider(this.redStarsGroup, this.groundGroup)
		this.physics.add.overlap(this.dude, this.redStarsGroup, this.collectRedStar, null , this)
		
		//BadGuy
		this.enemiesGroup = this.physics.add.group({})
		this.physics.add.collider(this.enemiesGroup, this.groundGroup)
		this.physics.add.collider(this.dude, this.enemiesGroup, this.hitEnemy, null, this)
		
		//Scoreboard
		this.add.image(16,16, "star")
		this.scoreText = this.add.text(32,0,"0", {fontsize: "35px", fill: "#ffffff"})
		
		//GameOver
		this.gameOverText = this.add.text(600,400,"Game Over", {fontsize: "500px", fill: "#000000"})
		this.gameOverText.setOrigin(0.5)
		this.gameOverText.visible = false
		
		//controls
		this.cursors = this.input.keyboard.createCursorKeys()

		//Dude walking animations
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("dude",{start:0,end: 4}),
			frameRate: 10,
			repeat: -1
		})
		this.anims.create({
			key: "turn",
			frames: [{key: "dude", frame: 4}],
			frameRate: 10,
			
		})

		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("dude",{start:5,end: 9,}),
			frameRate: 10,
			repeat: -1
		})

		this.triggerTimer = this.time.addEvent({
			callback: this.addGround,
			callbackScope: this,
			delay: 700,
			loop: true
		})
	}


	addGround(){
		
		this.groundGroup.create(Phaser.Math.Between(0,game.config.width), 0, "ground")
		this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 8)
		
		//Falling stars
		if(Phaser.Math.Between(0, 1)) {
            this.starsGroup.create(Phaser.Math.Between(0, game.config.width), 0, "star")
			this.redStarsGroup.create(Phaser.Math.Between(0, game.config.width), 0, "redStar")
			this.enemiesGroup.create(Phaser.Math.Between(0, game.config.width),0, "badGuy")
            this.starsGroup.setVelocityY(gameOptions.dudeSpeed)
			this.enemiesGroup.setVelocityY(gameOptions.dudeSpeed)
			this.redStarsGroup.setVelocityY(gameOptions.dudeSpeed)
        }
			

	}
	collectStar(dude, star) {
		star.disableBody(true, true)
		this.score += 1
		this.scoreText.setText(this.score)
	}
	collectRedStar(dude, redStar) {
		redStar.disableBody(true, true)
		this.score += 5
		this.scoreText.setText(this.score)
	}
	hitEnemy(dude, badGuy){
		console.log("gameOver")
		this.physics.pause();
		gameOver = true;
		this.gameOverText.visible = true
		
	}
	
	update() {
		//Controls
		if(this.cursors.left.isDown){
			this.dude.body.velocity.x = -gameOptions.dudeSpeed
			this.dude.anims.play("left",true)
		}
		else if(this.cursors.right.isDown){
			this.dude.body.velocity.x = gameOptions.dudeSpeed
			this.dude.anims.play("right",true)
		}
		else{
			this.dude.body.velocity.x = 0
			this.dude.anims.play("turn",true)
		}
		if(this.cursors.up.isDown && this.dude.body.touching.down){
			
			this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.6

		}
		//If die, restart
		if(this.dude.y > game.config.height || this.dude.y < 0){
			this.scene.start("PlayGame")

		}


	}

}