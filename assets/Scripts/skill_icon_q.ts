import { _decorator, Component, Node, Label } from 'cc';
import { Global } from 'db://assets/Global/global';

const { ccclass, property } = _decorator;

@ccclass('SkillIcon')
export class SkillIcon extends Component {

    @property({ tooltip: 'Tên skill: clone hoặc magic' })
    skillName: string = 'clone';

    @property(Node)
    maskNode: Node = null!;

    @property(Label)
    cooldownLabel: Label = null!;

    private totalCooldown: number = 0;

    update() {
        if (!Global.instance) return;

        let isReady = true;
        let timePassed = 0;

        if (this.skillName === 'clone') {
            isReady = Global.instance.isCloneReady;
            timePassed = Global.instance.cloneCooldownTimePassed;
            this.totalCooldown = Global.instance.cloneCooldownTime;
        } else if (this.skillName === 'magic') {
            isReady = Global.instance.isMagicCircleReady;
            timePassed = Global.instance.magicCircleCooldownTimePassed;
            this.totalCooldown = Global.instance.magicCircleCooldownTime;
        }

        const timeLeft = Math.max(0, this.totalCooldown - timePassed);
        this.maskNode.active = !isReady;

        // Hiển thị hoặc ẩn label
        if (!isReady && this.cooldownLabel) {
            this.cooldownLabel.node.active = true;
            this.cooldownLabel.string = timeLeft.toFixed(1); // hiển thị số thập phân 1 chữ số
        } else {
            this.cooldownLabel.node.active = false;
        }
    }
}
