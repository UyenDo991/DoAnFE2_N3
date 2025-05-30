import { _decorator, Component, Vec3 } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('sup_skill_3')
export class sup_skill_3 extends Component {

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
        }, 5);
    }

    update(deltaTime: number) {
        // Di chuyển đạn
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);

        // Kiểm tra va chạm với Player
        const playerPos = Global.instance.playerPosition;
        const playerNode = Global.instance.playerNode;
        const bulletPos = this.node.worldPosition;
        const distanceToPlayer = Vec3.distance(bulletPos, playerPos);

        if (distanceToPlayer < 4.0 && playerNode?.isValid) {
            console.log('Player bị trúng đạn skill!');
            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= Global.instance.playerHP) {
                console.log('Player bị tiêu diệt!');
                playerNode.destroy();
            }

            this.node.destroy(); // Tự hủy sau khi gây sát thương
        }
    }
}
