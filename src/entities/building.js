export class Building extends Phaser.GameObjects.Sprite {

  buildingTypes = [14, 15, 16, 17];


  construct(scene, x, y, texture, frame) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    // this.type = type;
    // this.maxHp = this.hp = hp;
    // this.damage = damage; // default damage     
  }
}