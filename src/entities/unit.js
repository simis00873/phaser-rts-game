export class Unit extends Phaser.GameObjects.Sprite {
  scene = null;
  hp = 100;

  construct(scene, x, y, texture, frame, hp) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.setOrigin(0.5, 0.5);
  }

  walk() {

  }

  attack(target) {

  }

  takeDamage(damage) {
    this.hp -= damage;
  }


}
