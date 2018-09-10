import 'phaser';

import { SimpleScene } from './scenes/simple-scene';

const gameConfig = {
  width: 1024,
  height: 768,
  scene: SimpleScene
};

new Phaser.Game(gameConfig);