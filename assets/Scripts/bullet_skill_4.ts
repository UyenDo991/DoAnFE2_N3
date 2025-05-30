import { _decorator, Component, Vec3, Prefab, instantiate, Node } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Bullet_skill_4')
export class Bullet_skill_4 extends Component {

    @property
    speed: number = 10;

    @property(Prefab)
    subBulletPrefab: Prefab = null; // Prefab viên đạn được bắn ra mỗi 0.5 giây

    @property(Node)
    bulletParent: Node = null; // Node cha chứa đạn, có thể để trống để dùng node cha hiện tại

    private direction = new Vec3();
    private isActive = false;
    private fireTimer = 0;
    private currentSpeed: number = 10;

    start() {
        // Tính hướng ban đầu
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);
        this.direction.multiplyScalar(-1); // đảo hướng

        this.currentSpeed = this.speed;

        // Sau 1 giây mới bắt đầu bay và bắn đạn
        this.scheduleOnce(() => {
            this.isActive = true;
        }, 1);

        // Tự hủy sau 5 giây
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 5);
    }

    update(deltaTime: number) {
        if (this.isActive) {
            // Kiểm tra hiệu ứng làm chậm
            this.checkMagicCircle(); 

            // Di chuyển
            const movement = this.direction.clone().multiplyScalar(this.currentSpeed * deltaTime);
            const newPos = this.node.position.add(movement);
            this.node.setPosition(newPos);

            // Bắn lieen tucj
            this.fireTimer += deltaTime;
            if (this.fireTimer >= 0) {
                this.fireSubBullet();
                this.fireTimer = 0;
            }
        }

        // Va chạm với Player
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
        //Kiểm tra khi chưa gán viên đạn
        if (!this.subBulletPrefab) return;

        const subBullet = instantiate(this.subBulletPrefab);
        const parent = this.bulletParent ?? this.node.parent;
        parent.addChild(subBullet);

        subBullet.setWorldPosition(this.node.worldPosition);
        // Hướng giống viên đạn chính nếu cần
        subBullet.setRotation(this.node.rotation); 
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
