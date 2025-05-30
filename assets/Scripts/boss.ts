import { _decorator, Component, Prefab, instantiate, Node, Vec3, AudioSource } from 'cc';
import { GlobalBoss } from 'db://assets/Global/global_boss';
import { Global } from 'db://assets/Global/global';

const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends Component {
    @property(Prefab)
    bullet1: Prefab = null;

    @property(Prefab)
    bullet2: Prefab = null;

    @property(Prefab)
    bullet3: Prefab = null;

    @property(Prefab)
    bullet4: Prefab = null;

    @property(Node)
    firePoint: Node = null;

    @property(AudioSource)
    shootAudio: AudioSource = null!;

    private lastSkill: number = 0;
    private _tempVec3: Vec3 = new Vec3();

    

    update(deltaTime: number) {
        // Cập nhật vòng lặp kỹ năng
        GlobalBoss.instance.update(deltaTime);

        const skillNum = GlobalBoss.instance.randomValue;
        if (skillNum !== this.lastSkill && GlobalBoss.instance.state === 'cooldown') {
            this.lastSkill = skillNum;
            this.castSkill(skillNum);
        }

        this.checkBulletCollision();
        this.checkCloneBulletCollision();
    }
    
    //Random skill
    castSkill(skillNum: number) {
        let bulletPrefab: Prefab = null;

        switch (skillNum) {
            case 1:
                bulletPrefab = this.bullet1;
                break;
            case 2:
                bulletPrefab = this.bullet2;
                break;
            case 3:
                bulletPrefab = this.bullet3;
                break;
            case 4:
                bulletPrefab = this.bullet4;
                break;
        }

        if (bulletPrefab && this.firePoint) {
            const bullet = instantiate(bulletPrefab);
            bullet.setPosition(this.firePoint.worldPosition);
            this.node.scene.addChild(bullet);
        }

        console.log(`Boss dùng skill ${skillNum}`);
    }

    //kiểm tra đạn của mage
    checkBulletCollision() {
        const bossPos = this.node.worldPosition;
        const bullets = Global.instance.bulletList;

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = bullet.worldPosition;
            const distance = Vec3.distance(bossPos, bulletPos);

            if (distance < 1.5) {
                console.log('Boss bị trúng đạn!');
                GlobalBoss.instance.hp--;

                bullet.destroy();
                if (this.shootAudio) {
                   this.shootAudio.play();
                }

                if (GlobalBoss.instance.hp <= 0) {
                    console.log('Boss bị tiêu diệt');

                    // Ghi nhận Boss1 đã chết để Spawner biết
                    GlobalBoss.instance.isBoss1Alive = false;
                    Global.instance.addScore(100);
                    //Boss biến mất
                    this.node.destroy();
                }

                break; // mỗi frame chỉ ăn 1 viên
            }
        }
    }

    //kiểm tra đạn của clone
    checkCloneBulletCollision() {
        const bossPos = this.node.worldPosition;
        const bullets = Global.instance.clonebulletList;

        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = bullet.worldPosition;
            const distance = Vec3.distance(bossPos, bulletPos);

            if (distance < 1.5) {
                console.log('Boss bị trúng đạn!');
                GlobalBoss.instance.hp--;

                bullet.destroy();
                if (this.shootAudio) {
                   this.shootAudio.play();
                }

                if (GlobalBoss.instance.hp <= 0) {
                    console.log('Boss bị tiêu diệt');

                    // Ghi nhận Boss1 đã chết để Spawner biết
                    GlobalBoss.instance.isBoss1Alive = false;
                    Global.instance.addScore(100);
                    //Boss biến mất
                    this.node.destroy();
                }

                break; // mỗi frame chỉ ăn 1 viên
            }
        }
    }
}
