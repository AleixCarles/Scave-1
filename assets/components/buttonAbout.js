import { Button } from './button.js';

export class AboutButton extends Button {
    constructor(scene) {
        super(scene, 'aboutbutton', 550, 500);
    }

    doClick() {

        window.open('https://github.com/AleixCarles/Scave-I.git', '_blank');
    }

}