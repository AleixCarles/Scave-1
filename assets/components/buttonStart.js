import { Button } from './button.js';

export class PlayButton extends Button {
    constructor(scene) {
        super(scene, 'playbutton', 250, 500);
    }

    doClick() {

        this.relatedScene.scene.start('Scene2',{score:1});

    }

}
