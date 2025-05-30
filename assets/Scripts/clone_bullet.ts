import { _decorator, Component, Vec3 } from 'cc';
import { Global } from 'db://assets/Global/global'; // ← Nhớ import Global

const { ccclass, property } = _decorator;

@ccclass('CloneBullet')
export class CloneBullet extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();

    start() {
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);
        Global.instance.clonebulletList.push(this.node);

        // Tự hủy sau 0.4s
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 0.4);
    }

    onDestroy() {
        // Xóa khỏi danh sách bullet nếu bị phá hủy
        const list = Global.instance.clonebulletList;
        const index = list.indexOf(this.node);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    update(deltaTime: number) {
        // Di chuyển
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);

        // Kiểm tra va chạm với enemy
        //this.checkEnemyCollision();
    }
}
