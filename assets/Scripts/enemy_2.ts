import { _decorator, Component, Vec3, Node, Prefab, instantiate, Quat } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from 'db://assets/Global/global';

@ccclass('Enemy_2')
export class Enemy_2 extends Component {
    @property
    speed: number = 2;
    speed_bulletenemy: number = 10;

    @property
    detectRadius: number = 1.5; // Bán kính để xem có trúng đạn hay không

    @property(Prefab)
    bulletEnemyPrefab: Prefab = null!;

    @property
    fireCooldown: number = 0.3;
    fireCooldown_Enemy: number = 3;
    private timeSinceLastShot = 0;

    private hitCount: number = 0;//hit sát thương của bullet
    private hitCountClone: number = 0; //hit sát thương của clone bullet
    private _tempDir = new Vec3();

    //Magic Circel
    @property
    baseSpeed: number = 3;

    private currentSpeed: number = 3;

    //Set eneme dừng lại  2s, bắn player 1 viên, sau khi bắn xong thì tiếp tục di chuyển
    private isStopped: boolean = false;
    private stopTime: number = 0;
    private stopDuration: number = 2; // 2 giây dừng lại 
    private moveTime: number = 0;
    @property
    moveDuration: number = 2;


    start() {
         console.log('Enemy_2 started');
        // Đăng ký vào danh sách Enemy để Player có thể kiểm tra va chạm
        Global.instance.enemy2List.push(this.node);
        // Tự hủy sau 5s
       /* this.scheduleOnce(() => {
            this.node.destroy();
        }, 5);*/
    }
    update(deltaTime: number) {
        this.checkBulletCollision();
        this.checkPlayer();
        this.checkBulletCloneCollision();
        this.checkMagicCircle(); // cập nhật currentSpeed

        if (this.isStopped) {
            this.stopTime += deltaTime;

            if (this.stopTime >= this.stopDuration) {
                // Bắn đạn sau khi đứng đủ thời gian
                this.fireBulletEnemy();

                // Reset trạng thái để tiếp tục di chuyển
                this.isStopped = false;
                this.stopTime = 0;
                this.moveTime = 0;
            }

            return; // Đang đứng => không di chuyển
        }

        // Nếu đang di chuyển
        this.followPlayer(deltaTime);
        this.moveTime += deltaTime;

        if (this.moveTime >= this.moveDuration) {
            this.isStopped = true;
            this.stopTime = 0;
        }
    }

    fireBulletEnemy() {
        const enemyPos = this.node.worldPosition.clone(); // clone tránh lỗi tham chiếu
        const bulletEnemy = instantiate(this.bulletEnemyPrefab);

        // Thêm vào scene trước
        this.node.parent.addChild(bulletEnemy);

        //  Đặt vị trí sau khi đã thêm
        bulletEnemy.setWorldPosition(enemyPos);
        //console.log("Enemy bắn đạn tại vị trí: ", enemyPos);
    }
    //Kiểm tra enemy có trong vòng tròn ma thuật hay không
    checkMagicCircle() {
        const magicCircles = Global.instance.magicCircleList;
        const enemyPos = this.node.worldPosition;
        let isInside = false;

        for (let i = 0; i < magicCircles.length; i++) {
            const circle = magicCircles[i];
            // Check node null hoặc bị destroy
            if (!circle || !circle.isValid) {
                //Xóa khỏi danh sách để tránh kiểm tra lại
                magicCircles.splice(i, 1);
                i--; // Giảm chỉ số để không bỏ sót phần tử tiếp theo
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

        this.currentSpeed = isInside ? this.baseSpeed * 0.3 : this.baseSpeed;
        console.log("currentSpeed:", this.currentSpeed);
    }
    //Eneny di chuyển đến player
    followPlayer(deltaTime: number) {
        const playerPos = Global.instance.playerPosition;
        const enemyPos = this.node.worldPosition;

        Vec3.subtract(this._tempDir, playerPos, enemyPos);
        if (this._tempDir.length() > 0.01) {
            this._tempDir.normalize();
            //const movement = this._tempDir.multiplyScalar(this.speed * deltaTime);
            const movement = this._tempDir.multiplyScalar(this.currentSpeed * deltaTime);
           // console.log("followPlayer : " + movement);
            this.node.setWorldPosition(enemyPos.add(movement));
        }
    }
    //Set va chạm giữa bullet va enemy
    checkBulletCollision() {
        const enemyPos = this.node.worldPosition;
        const bullets = Global.instance.bulletList;

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = bullet.worldPosition;
            const distance = Vec3.distance(enemyPos, bulletPos);

            if (distance < this.detectRadius) {
                console.log('Enemy trúng đạn!');

                this.hitCount++;
                bullet.destroy();

                if (this.hitCount >= 1) {
                    console.log('Enemy bị tiêu diệt!');
                    this.node.destroy();
                }

                break; // chỉ trúng 1 viên mỗi frame
            }
        }
    }
    //Set va chạm giữa bullet clone va enemy
    checkBulletCloneCollision() {
        const enemyPos = this.node.worldPosition;
        const bulletClones = Global.instance.bulletCloneList;

        for (let i = 0; i < bulletClones.length; i++) {
            const bulletClone = bulletClones[i];
            const bulletClonePos = bulletClone.worldPosition;
            const distance = Vec3.distance(enemyPos, bulletClonePos);

            if (distance < this.detectRadius) {
                console.log('Enemy trúng đạn bởi bullet clone!');

                this.hitCountClone++;
                bulletClone.destroy();

                if (this.hitCountClone >= 1) {
                    console.log('Enemy bị tiêu diệt!');
                    this.node.destroy();
                }

                break; // chỉ trúng 1 viên mỗi frame
            }
        }
    }
    
    //Set va chạm giữa player va enemy
    checkPlayer(){
        const enemyPos = this.node.worldPosition;
        const playerPos = Global.instance.playerPosition;
        const player = Global.instance.playerNode;
        const distance = Vec3.distance(enemyPos, playerPos);
        if (distance < this.detectRadius) {
           // console.log('Player đánh trúng!');
            Global.instance.playerHitCount++;
            this.node.destroy();
            //Khi player bi va chạm 4 lần từ enemy thì player biến mất
            if (Global.instance.playerHitCount >= 4) {
                    console.log('player bị tiêu diệt!');
                    player.destroy();
            } 
        }
        

    }
}


