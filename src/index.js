let game;

const gameOptions = {
	dudeGravity: 500,
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

	}
	
	preload(){
		this.load.image("ground","assetsplatform.png")
		this.load.image("star", "assets/star.png")
		this.load.spritesheet("dude","assets/dude.png", {frameWidth: 32, frameHeigth: 48});
	}

	create(){
		this.groundGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false
		})

		for(let i = 1 ; i < 20 ; i++){
			this.groundGroup.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "ground");

		}
		this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "dude")
		this.dude.body.gravity.y = gameOptions.dudeGravity
		this.physics.add.collider(this.dude, this.groundGroup)
		
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	addGround(){
		console.log("testing add ground")
		this.groundGroup.create(Phaser.Math.Between(0,game.config.width), 0, "ground")
		this.groundGroup.setVelocityY(gameOptions.dudeSpeed / 6)
	
		
	
	}
	
	update() {
		if(this.cursors.left.isDown){
			this.dude.body.velocity.x = -gameOptions.dudeSpeed
		}
		else if(this.cursors.right.isDown){
			this.dude.body.velocity.x = gameOptions.dudeSpeed
		}
		else{
			this.dude.body.velocity.x = 0
		}
		if(this.cursors.up.isDown && this.dude.body.touching.down){
			this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.6
		}
		if(this.dude.y > game.config.height || this.dude.y < 0){
			this.scene.start("PlayGame")

		}
	}
}