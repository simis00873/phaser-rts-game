export class Unit extends Phaser.GameObjects.Sprite {
  scene = null;
  hp = 100;
  x = 0;
  y = 0;

  construct(scene, x, y, hp) {
    this.x = x;
    this.y = y;
    this.hp = hp;
  }

  walk() {

  }

  attack(target) {

  }

  takeDamage(damage) {
    this.hp -= damage;
  }


}
