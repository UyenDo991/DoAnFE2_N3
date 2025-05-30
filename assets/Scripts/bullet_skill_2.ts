import { _decorator, Component, Vec3, math, instantiate, Prefab, Node, AudioSource } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('SkillBullet')
export class SkillBullet extends Component {

    @property
    moveSpeed: number = 10;

    @property
    fireInterval: number = 1;

    @property
    totalLifetime: number = 5;

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Node)
    bulletParent: Node = null; // Có thể gán ngoài editor

    @property(AudioSource)
    shootAudio: AudioSource = null!;

    private targetPos: Vec3 = new Vec3();
    private direction = new Vec3();
    private elapsedTime = 0;
    private fireTimer = 0;
    private isMoving = true;

    start() {
        const currentPos = this.node.worldPosition.clone();
        const x = math.randomRange(-15, 20);
        const y = math.randomRange(-10, 10);
        const z = currentPos.z;

        this.targetPos.set(x, y, z);
        Vec3.subtract(this.direction, this.targetPos, currentPos);
        this.direction.normalize();
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;
        this.fireTimer += deltaTime;

        if (this.isMoving) {
            const currentPos = this.node.worldPosition;
            const toTarget = Vec3.subtract(new Vec3(), this.targetPos, currentPos);

            if (toTarget.length() > 0.1) {
                const moveStep = this.direction.clone().multiplyScalar(this.moveSpeed * deltaTime);
                this.node.setWorldPosition(currentPos.add(moveStep));
            } else {
                this.node.setWorldPosition(this.targetPos);
                this.isMoving = false;
            }
        }

        if (this.fireTimer >= this.fireInterval) {
            this.fire();
            this.fireTimer = 0;
        }
        
        //Gọi hàm bắn đạn của mage
        this.checkBulletCollision();
        //Gọi hàm bắn đạn của clone
        this.checkCloneBulletCollision();

        if (this.elapsedTime >= this.totalLifetime) {
            this.node.destroy();
        }
    }

    fire() {
        if (!this.bulletPrefab) return;

        const bullet = instantiate(this.bulletPrefab);

        const parent = this.bulletParent ?? this.node.parent;
        parent.addChild(bullet);

        const currentPos = this.node.worldPosition;
        bullet.setWorldPosition(currentPos);

        const targetPos = Global.instance.playerPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, currentPos);
        dir.normalize();

        const angle = Math.atan2(dir.y, dir.x);
        bullet.setRotationFromEuler(0, 0, angle * 180 / Math.PI);

        if (this.shootAudio) {
            this.shootAudio.play();
        }
    }

    //kiểm tra đạn của mage
    checkBulletCollision() {
        const skillBulletPos = this.node.worldPosition;
        const bullets = Global.instance.bulletList;

        for (let i = 0; i < bullets.length; i++) {
            const playerBullet = bullets[i];
            const playerBulletPos = playerBullet.worldPosition;
            const distance = Vec3.distance(skillBulletPos, playerBulletPos);

            if (distance < 0.3) {  // bán kính va chạm có thể chỉnh tùy kích thước
                console.log('SkillBullet bị tiêu diệt bởi đạn của người chơi!');
                // hủy đạn của player
                playerBullet.destroy();  
                // hủy skill bullet
                this.node.destroy();     
                Global.instance.addScore(10);
                break;
            }
        }
    }
    //kiểm tra đạn của clone
    checkCloneBulletCollision() {
        const skillBulletPos = this.node.worldPosition;
        const bullets = Global.instance.clonebulletList;

        for (let i = 0; i < bullets.length; i++) {
            const playerBullet = bullets[i];
            const playerBulletPos = playerBullet.worldPosition;
            const distance = Vec3.distance(skillBulletPos, playerBulletPos);
            // bán kính va chạm có thể chỉnh tùy kích thước
            if (distance < 0.3) {  
                console.log('SkillBullet bị tiêu diệt bởi đạn của người chơi!');
                 // hủy đạn của player
                playerBullet.destroy(); 
                // hủy skill bullet
                this.node.destroy();     
                Global.instance.addScore(10);
                break;
            }
        }
    }
}
