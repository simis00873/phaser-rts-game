import 'phaser';
import EasyStar from 'easystarjs';

import { Building } from '../entities/building';
import { Unit } from '../entities/unit';

export class MapScene extends Phaser.Scene {
  map = null;
  controls = null;
  widthHeight = 64;

  preload() {
    this.scene = this;
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
  }

  create() {
    this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });

    this.map = this.make.tilemap({ key: 'map' });

    var tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img');

    this.map.createStaticLayer('background_layer', tiles, 0, 0);

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



    var building = new Building(this, this.widthHeight * 2, this.widthHeight * 2, 'scifi_tilesheet_img', 32);
    this.add.existing(building);


    var unit = new Unit(this, (this.widthHeight * 3) + 32, (this.widthHeight * 3) + 32, 'scifi_tilesheet_img', 120);
    this.add.existing(unit);

    this.player = unit;


    this.finder = new EasyStar.js();

    var grid = [];
    for(var y = 0; y < this.map.height; y++){
        var col = [];
        for(var x = 0; x < this.map.width; x++){
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(this.getTileID(x,y));
        }
        grid.push(col);
    }

    this.finder.setGrid(grid);

    var tileset = this.map.tilesets[0];
    var properties = tileset.tileProperties;
    var acceptableTiles = [];

    for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
        if(!properties.hasOwnProperty(i)) {
            // If there is no property indicated at all, it means it's a walkable tile
            acceptableTiles.push(i+1);
            continue;
        }
        if(!properties[i].collidable) acceptableTiles.push(i+1);
    }
    this.finder.setAcceptableTiles(acceptableTiles);

    // Marker that will follow the mouse
    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);



    this.input.on('pointerup', this.handleClick.bind(this));
  }

  getTileID = function(x,y) {
    var tile = this.map.getTileAt(x, y);
    return tile.index;
  };

  update (time, delta)
  {
      this.controls.update(delta);

      var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

      // Rounds down to nearest tile
      var pointerTileX = this.map.worldToTileX(worldPoint.x);
      var pointerTileY = this.map.worldToTileY(worldPoint.y);
      this.marker.x = this.map.tileToWorldX(pointerTileX);
      this.marker.y = this.map.tileToWorldY(pointerTileY);
      this.marker.setVisible(!this.checkCollision(pointerTileX,pointerTileY));
  }

  checkCollision = function(x,y){
    var tile = this.map.getTileAt(x, y);
    return tile.properties.collide === true;
  };

  handleClick = function(pointer){
    var x = this.cameras.main.scrollX + pointer.x;
    var y = this.cameras.main.scrollY + pointer.y;
    var toX = Math.floor(x/64);
    var toY = Math.floor(y/64);
    var fromX = Math.floor(this.player.x/64);
    var fromY = Math.floor(this.player.y/64);
    console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

    this.finder.findPath(fromX, fromY, toX, toY, (path ) => {
        if (path === null) {
            console.warn("Path was not found.");
        } else {
            console.log(path);
            this.moveCharacter(path);
        }
    });
    this.finder.calculate(); // don't forget, otherwise nothing happens
  };

  moveCharacter = function(path){
      // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
      var tweens = [];
      for(var i = 0; i < path.length-1; i++){
          var ex = path[i+1].x;
          var ey = path[i+1].y;
          tweens.push({
              targets: this.player,
              x: {value: ex*this.map.tileWidth + 32, duration: 200},
              y: {value: ey*this.map.tileHeight + 32, duration: 200}
          });
      }

      this.scene.tweens.timeline({
          tweens: tweens
      });
  };

}
