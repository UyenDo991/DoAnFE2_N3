import { _decorator, Component, Prefab, instantiate, Node } from 'cc';
import { GlobalBoss } from 'db://assets/Global/global_boss';

const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends Component {
    @property(Prefab)
    bullet4: Prefab = null;

    @property(Node)
    firePoint: Node = null;

    @property
    delayBeforeShoot: number = 0.5; // Thời gian chờ trước khi bắn (hiện trong Inspector)

    private lastSkill: number = 0;
    private hasFiredSkill4: boolean = false;

    update(deltaTime: number) {
       

        const skillNum = GlobalBoss.instance.randomValue;

        // Chỉ phản ứng với skill 4 và đảm bảo chưa bắn
        if (skillNum === 4 && !this.hasFiredSkill4 && GlobalBoss.instance.state === 'cooldown') {
            this.hasFiredSkill4 = true;

            this.scheduleOnce(() => {
                this.fireBullet();
            }, this.delayBeforeShoot);
        }

        // Reset flag nếu random skill khác 4 (để chuẩn bị cho lần sau)
        if (skillNum !== 4) {
            this.hasFiredSkill4 = false;
        }
    }

    fireBullet() {
        if (!this.bullet4 || !this.firePoint) return;

        const bullet = instantiate(this.bullet4);
        bullet.setWorldPosition(this.firePoint.worldPosition);
        this.node.scene.addChild(bullet);

        console.log('Boss skill 4: Bắn đúng 1 viên đạn!');
    }
}
