import 'phaser';

import { MapScene } from './scenes/map';

const gameConfig = {
  width: 1024,
  height: 768,
  scene: MapScene
};

new Phaser.Game(gameConfig);
