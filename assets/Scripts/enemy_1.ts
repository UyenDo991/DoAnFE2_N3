import { _decorator, Component, Vec3, Node } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    @property
    speed: number = 6;

   

    @property
    detectRadius: number = 1.5; // bán kính va chạm với đạn

    private hitEnemyCount: number = 0;
    private _tempDir = new Vec3();

    private currentSpeed: number = 10; // tốc độ hiện tại

    start() {
        Global.instance.enemyList.push(this.node);
        this.currentSpeed = this.speed; // khởi tạo tốc độ mặc định
    }

    update(deltaTime: number) {
        this.checkMagicCircle();
        this.followPlayer(deltaTime);
        this.checkBulletCollision();
        this.checkCloneBulletCollision();
        this.checkPlayer();
    }

    followPlayer(deltaTime: number) {
        const playerPos = Global.instance.playerPosition;
        const enemyPos = this.node.worldPosition;

        Vec3.subtract(this._tempDir, playerPos, enemyPos);
        if (this._tempDir.length() > 0.01) {
            this._tempDir.normalize();
            const movement = this._tempDir.multiplyScalar(this.currentSpeed * deltaTime);
            this.node.setWorldPosition(enemyPos.add(movement));
        }
    }

    checkBulletCollision() {
        const enemyPos = this.node.worldPosition;
        const bullets = Global.instance.bulletList;

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = bullet.worldPosition;
            const distance = Vec3.distance(enemyPos, bulletPos);

            if (distance < this.detectRadius) {
                console.log('Enemy trúng đạn!');
                this.hitEnemyCount++;
                bullet.destroy();

                if (this.hitEnemyCount >= 1) {
                    console.log('Enemy bị tiêu diệt!');
                    // Cộng 10 điểm cho người chơi
                    Global.instance.addScore(10); 
                    this.node.destroy();
                }

                break;
            }
        }
    }

    checkCloneBulletCollision() {
        const enemyPos = this.node.worldPosition;
        const bullets = Global.instance.clonebulletList;

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = bullet.worldPosition;
            const distance = Vec3.distance(enemyPos, bulletPos);

            if (distance < this.detectRadius) {
                console.log('Enemy trúng đạn!');
                this.hitEnemyCount++;
                bullet.destroy();

                if (this.hitEnemyCount >= 1) {
                    console.log('Enemy bị tiêu diệt!');
                    // Cộng 10 điểm cho người chơi
                    Global.instance.addScore(10); 
                    this.node.destroy();
                }

                break;
            }
        }
    }

    checkPlayer() {
        const enemyPos = this.node.worldPosition;
        const playerPos = Global.instance.playerPosition;
        const player = Global.instance.playerNode;
        const distance = Vec3.distance(enemyPos, playerPos);

        if (distance < this.detectRadius) {
            console.log('Player bị enemy đánh trúng!');
            Global.instance.playerHitCount++;
            this.node.destroy();

            if (Global.instance.playerHitCount >= Global.instance.playerHP && player?.isValid) {
                console.log('Player bị tiêu diệt!');
                player.destroy();
            }
        }
    }

    checkMagicCircle() {
        const magicCircles = Global.instance.magicCircleList;
        const enemyPos = this.node.worldPosition;
        let isInside = false;

        for (let i = 0; i < magicCircles.length; i++) {
            const circle = magicCircles[i];
            //Check node null hoặc bị destroy
            if (!circle || !circle.isValid) {
                //Xóa khỏi danh sách để tránh kiểm tra lại
                magicCircles.splice(i, 1);
                // Giảm chỉ số để không bỏ sót phần tử tiếp theo
                i--;
                continue;
            }
            const circlePos = circle.worldPosition;
            const radius = 5;
            const distance = Vec3.distance(enemyPos, circlePos);
            //console.log(`Vòng ${i} — Khoảng cách: ${distance}, Bán kính: ${radius}`);
            if (distance < radius) {
                isInside = true;
               // console.log("Enemy đang trong vòng ma thuật!");
                break;
            }
        }

        this.currentSpeed = isInside ? this.speed * 0.3 : this.speed;
        console.log("currentSpeed:", this.currentSpeed);
    }
}
