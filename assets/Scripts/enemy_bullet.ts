import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from 'db://assets/Global/global';
console.log('EnemyBullet script loaded'); 

@ccclass('EnemyBullet')
export class EnemyBullet extends Component {
    @property
    speed: number = 10;

    private direction = new Vec3();

    start() {
        const playerPos = Global.instance.playerPosition;
        const bulletPos = this.node.worldPosition;

        Vec3.subtract(this.direction, playerPos, bulletPos);
        this.direction.normalize();
    }

    update(deltaTime: number) {
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);
    }
}
