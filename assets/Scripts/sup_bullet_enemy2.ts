import { _decorator, Component, Vec3, math } from 'cc';
import { Global } from 'db://assets/Global/global'; // Import Global
const { ccclass, property } = _decorator;

@ccclass('sup_bullet_enemy')
export class sup_bullet_enemy extends Component {

    @property
    speed: number = 10;

    @property
    lifetime: number = 3;

    @property
    detectRadius: number = 2.0; // Bán kính phát hiện va chạm với player

    private direction = new Vec3();
    private elapsedTime = 0;
    private currentSpeed: number = 10;

    start() {
        // Tính hướng bay theo rotation của node
        const angleRad = this.node.eulerAngles.z * (Math.PI / 180);
        this.direction.set(Math.cos(angleRad), Math.sin(angleRad), 0);

        // Gán tốc độ khởi tạo
        this.currentSpeed = this.speed;
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.lifetime) {
            this.node.destroy();
            return;
        }

        this.checkMagicCircle(); // Kiểm tra và áp dụng hiệu ứng chậm

        // Di chuyển viên đạn
        const moveStep = this.direction.clone().multiplyScalar(this.currentSpeed * deltaTime);
        this.node.setWorldPosition(this.node.worldPosition.add(moveStep));

        // Kiểm tra va chạm với player
        this.checkPlayerCollision();
    }

    checkPlayerCollision() {
        const playerNode = Global.instance.playerNode;
        if (!playerNode) return;

        const playerPos = Global.instance.playerPosition;
        const bulletPos = this.node.worldPosition;
        const distance = Vec3.distance(playerPos, bulletPos);

        if (distance < this.detectRadius) {
            console.log("Player bị trúng đạn kỹ năng Boss!");

            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= Global.instance.playerHP) {
                console.log("Player bị tiêu diệt!");
                playerNode.destroy();
            }

            this.node.destroy(); // Đạn biến mất sau khi trúng
        }
    }

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
