import 'phaser';

export class SimpleScene extends Phaser.Scene {
  map = null;
  layer = null;
  controls = null;

  preload() {
    this.load.image('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
  }

  create() {
    this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

    var map = this.make.tilemap({ key: 'map' });

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img');

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    var background_layer = map.createStaticLayer('background_layer', tiles, 0, 0);
    var walkable_layer = map.createStaticLayer('walkable_layer', tiles, 0, 0);
    var resources_layer = map.createStaticLayer('resources_layer', tiles, 0, 0);
    var collidable_layer = map.createStaticLayer('collidable_layer', tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
  }

  update (time, delta)
  {
      this.controls.update(delta);
  }

}
