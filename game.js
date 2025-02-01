import Phaser from "phaser";
import web3 from "./web3.js";

class MarsFireGame extends Phaser.Scene {
  constructor() {
    super({ key: "MarsFireGame" });
  }

  preload() {
    this.load.image("mars", "assets/images/mars-background.png");
    this.load.image("rover", "assets/images/mars-rover.png");
    this.load.spritesheet("coin", "assets/images/mars-coin.png", { frameWidth: 128, frameHeight: 128 });
  }

  create() {
    this.add.image(400, 300, "mars").setScale(1.5);
    this.rover = this.physics.add.sprite(400, 500, "rover").setScale(0.5);
    this.rover.setCollideWorldBounds(true);
    
    this.cursors = this.input.keyboard.createCursorKeys();
    this.mfcCoins = this.physics.add.group({
      key: "coin",
      repeat: 10,
      setXY: { x: 100, y: 50, stepX: 70 }
    });

    this.physics.add.overlap(this.rover, this.mfcCoins, this.collectCoin, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.rover.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.rover.setVelocityX(160);
    } else {
      this.rover.setVelocityX(0);
    }
  }

  async collectCoin(rover, coin) {
    coin.disableBody(true, true);
    console.log("MFC Earned!");
    try {
      const accounts = await web3.eth.getAccounts();
      console.log("Sending MFC to:", accounts[0]);
      // Simulate MFC reward logic here
    } catch (error) {
      console.error("Transaction failed", error);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: MarsFireGame
};

const game = new Phaser.Game(config);

export default game;
