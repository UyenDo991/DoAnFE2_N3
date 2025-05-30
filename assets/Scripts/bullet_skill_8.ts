import { _decorator, Component, Vec3, Prefab, instantiate, Node } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Bullet_skill_8')
export class Bullet_skill_8 extends Component {

    @property
    speed: number = 10;

    @property(Prefab)
    subBulletPrefab: Prefab = null;

    @property(Node)
    bulletParent: Node = null;

    private direction = new Vec3();
    private isActive = false;
    private fireTimer = 0;
    private activeTime = 0;
    private hasChangedDirection = false;
    private currentSpeed: number = 10;

    private targetPositions: Vec3[] = [
        new Vec3(-20, 10, 0),
        new Vec3(-20, 5, 0),
        new Vec3(-20, 0, 0),
        new Vec3(-20, -5, 0),
        new Vec3(-20, -10, 0),
    ];

    start() {
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);
        this.direction.multiplyScalar(-1);

        this.currentSpeed = this.speed;

        this.scheduleOnce(() => {
            this.isActive = true;
        }, 1);

        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 5);
    }

    update(deltaTime: number) {
        if (this.isActive) {
            this.activeTime += deltaTime;

            if (!this.hasChangedDirection && this.activeTime >= 1) {
                this.changeDirectionToRandomTarget();
                this.hasChangedDirection = true;
            }

            this.checkMagicCircle();

            const movement = this.direction.clone().multiplyScalar(this.currentSpeed * deltaTime);
            const newPos = this.node.position.clone().add(movement);
            this.node.setPosition(newPos);

            this.fireTimer += deltaTime;
            if (this.fireTimer >= 0) {
                this.fireSubBullet();
                this.fireTimer = 0;
            }
        }

        // Va chạm với người chơi
        const playerPos = Global.instance.playerPosition;
        const playerNode = Global.instance.playerNode;
        const bulletPos = this.node.worldPosition;
        const distanceToPlayer = Vec3.distance(bulletPos, playerPos);

        if (distanceToPlayer < 2.0 && playerNode?.isValid) {
            console.log('Player bị trúng đạn skill!');
            Global.instance.playerHitCount++;

            if (Global.instance.playerHitCount >= Global.instance.playerHP) {
                console.log('Player bị tiêu diệt!');
                playerNode.destroy();
            }

            this.node.destroy();
        }
    }

    fireSubBullet() {
        if (!this.subBulletPrefab) return;

        const subBullet = instantiate(this.subBulletPrefab);
        const parent = this.bulletParent ?? this.node.parent;
        parent.addChild(subBullet);

        subBullet.setWorldPosition(this.node.worldPosition);
        subBullet.setRotation(this.node.rotation);
    }

    changeDirectionToRandomTarget() {
        const randomIndex = Math.floor(Math.random() * this.targetPositions.length);
        const target = this.targetPositions[randomIndex];

        const currentPos = this.node.worldPosition;
        const newDir = target.clone().subtract(currentPos).normalize();

        this.direction.set(newDir);

        console.log(`Đạn đổi hướng về vị trí: ${target.toString()}`);
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

        this.currentSpeed = isInside ? this.speed * 0.1 : this.speed;
    }
}
