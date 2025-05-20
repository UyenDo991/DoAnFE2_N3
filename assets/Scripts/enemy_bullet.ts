import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from 'db://assets/Global/global';

@ccclass('EnemyBullet')
export class EnemyBullet extends Component {
    @property
    speed: number = 10;

    private direction = new Vec3();
    @property(Node)
    bulletNode: Node = null!;

    start() {
        console.log('Enemy_2 started');

        const playerPos = Global.instance.playerPosition;
        const bulletPos = this.node.getWorldPosition(); // ✅ Lấy vị trí toàn cục của node hiện tại

        this.direction = new Vec3();
        Vec3.subtract(this.direction, playerPos, bulletPos);
        this.direction.normalize();

        console.log('playerPos:', playerPos);
        console.log('bulletPos:', bulletPos);
        console.log('direction:', this.direction);
    }


    update(deltaTime: number) {
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const currentPos = this.node.getPosition();
        const newPos = currentPos.add(movement); // ✅ Tính toán mới dựa trên vị trí hiện tại
        this.node.setPosition(newPos);
    }
}
