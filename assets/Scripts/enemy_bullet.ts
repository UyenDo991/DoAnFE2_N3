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

    //Magic Circel
    @property
    baseSpeed: number = 3;

    private currentSpeed: number = 3;

    start() {
        const playerPos = Global.instance.playerPosition;
        const bulletPos = this.node.getWorldPosition();

        Vec3.subtract(this.direction, playerPos, bulletPos);
        this.direction.normalize();

        // Đăng ký vào danh sách Bullet để Enemy có thể kiểm tra va chạm
        Global.instance.bulletEnemyList.push(this.node);
    }

    update(deltaTime: number) {
        this.followPlayer(deltaTime);
        this.checkBulletEnemyCollision(); //Set va chạm giữa đạn của enemy va player
        //Vong tròn ma thuật
        this.checkMagicCircle(); // cập nhật currentSpeed
    }
    
    //Kiểm tra enemy có trong vòng tròn ma thuật hay không
    checkMagicCircle() {
        const magicCircles = Global.instance.magicCircleList;
        const bulletEnemyPos = this.node.worldPosition;
        let isInside = false;

        for (let i = 0; i < magicCircles.length; i++) {
            const circle = magicCircles[i];
            // Check node null hoặc bị destroy
            if (!circle || !circle.isValid) {
                // Xóa khỏi danh sách để tránh kiểm tra lại
                magicCircles.splice(i, 1);
                i--; // Giảm chỉ số để không bỏ sót phần tử tiếp theo
                continue;
            }
            const circlePos = circle.worldPosition;
            const radius = 5;
            const distance = Vec3.distance(bulletEnemyPos, circlePos);

            //console.log(`Vòng ${i} — Khoảng cách: ${distance}, Bán kính: ${radius}`);

            if (distance < radius) {
                isInside = true;
               // console.log("Enemy đang trong vòng ma thuật!");
                break;
            }
        }

        this.currentSpeed = isInside ? this.baseSpeed * 0.3 : this.baseSpeed;
        console.log("currentSpeed:", this.currentSpeed);
    }
    followPlayer(deltaTime: number) {
       // const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
       const movement = this.direction.clone().multiplyScalar(this.currentSpeed * deltaTime);
        const currentPos = this.node.getPosition();
        const newPos = currentPos.add(movement);
        this.node.setPosition(newPos);
    }
    checkBulletEnemyCollision(){
        // Kiểm tra va chạm với player
        const playerPos = Global.instance.playerPosition;
        const distance = Vec3.distance(this.node.worldPosition, playerPos);
        if (distance < this.detectRadius) { // detectRadius
            console.log("Player bị trúng đạn enemy!");
            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= Global.instance.manaPlayer) {
                Global.instance.playerNode.destroy();
                console.log("Player bị tiêu diệt");
            }

            this.node.destroy(); // Viên đạn biến mất sau khi bắn trúng player
        }
    }
}