import { _decorator, Component, Vec3, instantiate, Prefab, Node } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Skillboss3')
export class Skillboss3 extends Component {

    @property
    speed: number = 10;

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Node)
    bulletParent: Node = null;

    private direction = new Vec3();
    private fireTimer: number = 0;
    private fireInterval: number = 0;

    start() {
        // Tính hướng di chuyển dựa trên hướng quay của node
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);
        this.direction.multiplyScalar(-1); // đảo hướng

        // Tự hủy sau 5 giây
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 5);
    }

    update(deltaTime: number) {
        // Di chuyển đạn
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);

        

        // Bắn đạn phụ mỗi 0.3s
        this.fireTimer += deltaTime;
        if (this.fireTimer >= this.fireInterval) {
            this.fire();
            this.fireTimer = 0;
        }
    }

    fire() {
        if (!this.bulletPrefab) return;

        const bullet = instantiate(this.bulletPrefab);
        const parent = this.bulletParent ?? this.node.parent;
        parent.addChild(bullet);

        bullet.setWorldPosition(this.node.worldPosition);

        // Hướng bắn giống hướng của đạn chính (có thể thay đổi tùy mục đích)
        bullet.setRotation(this.node.rotation);
    }
}
