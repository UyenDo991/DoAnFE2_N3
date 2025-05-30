import { _decorator, Component, Node } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {

    @property([Node])
    hearts: Node[] = [];  // Kéo heart1–4 vào trong Editor

    @property
    maxHP: number = 4;

    update() {
        const hit = Global.instance.playerHitCount;
        const currentHP = Math.max(0, this.maxHP - hit);

        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].active = i < currentHP;
        }
    }
}
