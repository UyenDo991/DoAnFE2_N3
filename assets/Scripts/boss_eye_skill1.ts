import { _decorator, Component, Prefab, Node, instantiate, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Boss_eye_skill1')
export class Boss_eye_skill1 extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Node)
    bulletParent: Node = null!;

    @property
    fireCooldown: number = 0.3;

    private timeSinceLastShot = 0;
    // thời gian từ khi bắt đầu
    private elapsedTime = 0; 

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        // Không bắn trong 1s đầu tiên
        if (this.elapsedTime < 1) {
            return;
        }

        this.timeSinceLastShot += deltaTime;

        if (this.timeSinceLastShot >= this.fireCooldown) {
            //Set bắn
            this.fireBullet();
            this.timeSinceLastShot = 0;
        }
    }
    //Bắn đạn
    fireBullet() {
        const bullet = instantiate(this.bulletPrefab);
        this.bulletParent.addChild(bullet);

        bullet.setWorldPosition(this.node.worldPosition);
        bullet.setWorldRotation(this.node.worldRotation);
    }
}
