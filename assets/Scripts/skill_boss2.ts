import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Eye')
export class Eye extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Node)
    firePoint: Node = null!; // điểm bắn đạn

    private timer: number = 0;
    private fireInterval: number = 1; // bắn mỗi 1 giây
    private lifeTime: number = 5; // tồn tại 5 giây

    private lifeElapsed: number = 0;

    update(deltaTime: number) {
        this.timer += deltaTime;
        this.lifeElapsed += deltaTime;

        if (this.timer >= this.fireInterval) {
            this.timer = 0;
            this.fire();
        }

        if (this.lifeElapsed >= this.lifeTime) {
            this.node.destroy();
        }
    }

    fire() {
        if (!this.bulletPrefab || !this.firePoint) return;

        const bullet = instantiate(this.bulletPrefab);
        this.node.parent?.addChild(bullet);

        // Đặt vị trí tại firePoint
        bullet.setWorldPosition(this.firePoint.worldPosition);
        bullet.setWorldRotation(this.firePoint.worldRotation);
    }
}
