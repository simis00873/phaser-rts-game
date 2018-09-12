import 'phaser';

import { Building } from '../entities/building';

export class MapScene extends Phaser.Scene {
  map = null;
  controls = null;

  preload() {
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
  }

  create() {
    this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

    this.map = this.make.tilemap({ key: 'map' });

    var tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img');

    this.map.createStaticLayer('background_layer', tiles, 0, 0);
    this.map.createStaticLayer('walkable_layer', tiles, 0, 0);
    this.map.createStaticLayer('resources_layer', tiles, 0, 0);
    this.map.createStaticLayer('collidable_layer', tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);



    var building = new Building(this, 100, 100, 'scifi_tilesheet_img', 32);
    this.add.existing(building);








  }

  update (time, delta)
  {
      this.controls.update(delta);
  }

}
