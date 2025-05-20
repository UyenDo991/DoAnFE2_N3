import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from 'db://assets/Global/global';

@ccclass('EnemyBullet')
export class EnemyBullet extends Component {
    @property
    speed: number = 10;

    @property
    detectRadius: number = 1.5; // Bán kính để xem có trúng đạn hay không

    private direction = new Vec3();

    start() {
        const playerPos = Global.instance.playerPosition;
        const bulletPos = this.node.getWorldPosition();

        Vec3.subtract(this.direction, playerPos, bulletPos);
        this.direction.normalize();

        // Đăng ký vào danh sách Bullet để Enemy có thể kiểm tra va chạm
        Global.instance.bulletEnemyList.push(this.node);
    }

    update(deltaTime: number) {
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const currentPos = this.node.getPosition();
        const newPos = currentPos.add(movement);
        this.node.setPosition(newPos);
        this.checkBulletEnemyCollision(); //Set va chạm giữa đạn của enemy va player
    }
    checkBulletEnemyCollision(){
        // Kiểm tra va chạm với player
        const playerPos = Global.instance.playerPosition;
        const distance = Vec3.distance(this.node.worldPosition, playerPos);
        if (distance < this.detectRadius) { // detectRadius
            console.log("Player bị trúng đạn enemy!");
            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= 4) {
                Global.instance.playerNode.destroy();
                console.log("Player bị tiêu diệt");
            }

            this.node.destroy(); // Viên đạn biến mất sau khi bắn trúng player
        }
    }
}