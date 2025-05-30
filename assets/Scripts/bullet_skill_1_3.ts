import { _decorator, Component, Vec3 } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Bullet_skill_1_1')
export class Bullet_skill_1_1 extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();
    private currentSpeed: number = 10;

    start() {
        // Tính hướng di chuyển dựa trên hướng quay của node
        Vec3.transformQuat(this.direction, Vec3.UP, this.node.worldRotation);

        // Khởi tạo tốc độ hiện tại
        this.currentSpeed = this.speed;

        // Tự hủy sau 5 giây
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 5);
    }

    update(deltaTime: number) {
        // Cập nhật tốc độ nếu đang trong vòng ma thuật
        this.checkMagicCircle(); 

        // Di chuyển đạn
        const movement = this.direction.clone().multiplyScalar(this.currentSpeed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);

        // Kiểm tra va chạm với Player
        const playerPos = Global.instance.playerPosition;
        const playerNode = Global.instance.playerNode;
        const bulletPos = this.node.worldPosition;
        const distanceToPlayer = Vec3.distance(bulletPos, playerPos);

        if (distanceToPlayer < 1.0 && playerNode?.isValid) {
            console.log('Player bị trúng đạn skill!');
            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= Global.instance.playerHP) {
                console.log('Player bị tiêu diệt!');
                playerNode.destroy();
            }
            // Tự hủy sau khi gây sát thương
            this.node.destroy(); 
        }
    }
    ///Kiểm tra vòng ma thuật va chạm
    checkMagicCircle() {
        const magicCircles = Global.instance.magicCircleList;
        const bulletPos = this.node.worldPosition;
        let isInside = false;

        for (let i = 0; i < magicCircles.length; i++) {
            const circle = magicCircles[i];
            if (!circle || !circle.isValid) {
                magicCircles.splice(i, 1);
                i--;
                continue;
            }
            const circlePos = circle.worldPosition;
            const radius = 5;
            const distance = Vec3.distance(bulletPos, circlePos);

            if (distance < radius) {
                isInside = true;
                break;
            }
        }

        this.currentSpeed = isInside ? this.speed * 0.01 : this.speed;
    }
}
