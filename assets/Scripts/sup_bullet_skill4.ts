import { _decorator, Component, Vec3 } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('sup_skill_4')
export class sup_skill_4 extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();

    start() {
        // Tính hướng di chuyển dựa trên hướng quay của node
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);

        // Tự hủy sau 5 giây
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 0.2);
    }

    update(deltaTime: number) {
        // Di chuyển đạn
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);
    }
}
