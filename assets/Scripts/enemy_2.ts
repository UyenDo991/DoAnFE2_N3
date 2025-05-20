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
        this.followPlayer(deltaTime);
        this.checkBulletCollision();
        this.checkPlayer();
        this.checkBulletCloneCollision();
        this.timeSinceLastShot += deltaTime;

        if (this.timeSinceLastShot >= this.fireCooldown_Enemy) {
            this.fireBulletEnemy();
            this.timeSinceLastShot = 0;
        }
    }
    fireBulletEnemy() {
        const playerPos = Global.instance.playerPosition;
        const player = Global.instance.playerNode;
        const enemyPos = this.node.worldPosition.clone(); // clone tránh lỗi tham chiếu
        const bulletEnemy = instantiate(this.bulletEnemyPrefab);

        // Thêm vào scene trước
        this.node.parent.addChild(bulletEnemy);

        //  Đặt vị trí sau khi đã thêm
        bulletEnemy.setWorldPosition(enemyPos);
        //console.log("Enemy bắn đạn tại vị trí: ", enemyPos);
    }

    //Eneny di chuyển đến player
    followPlayer(deltaTime: number) {
        const playerPos = Global.instance.playerPosition;
        const enemyPos = this.node.worldPosition;

        Vec3.subtract(this._tempDir, playerPos, enemyPos);
        if (this._tempDir.length() > 0.01) {
            this._tempDir.normalize();
            const movement = this._tempDir.multiplyScalar(this.speed * deltaTime);
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


