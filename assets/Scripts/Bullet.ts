import { _decorator, Component, Vec3 } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();

    start() {
        // Tính hướng bắn theo hướng quay hiện tại
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);

        // Đăng ký vào danh sách Bullet để Enemy có thể kiểm tra va chạm
        Global.instance.bulletList.push(this.node);
    }

    update(deltaTime: number) {
        const move = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        this.node.setWorldPosition(this.node.worldPosition.add(move));
    }

    onDestroy() {
        // Xóa khỏi danh sách bullet nếu bị phá hủy
        const list = Global.instance.bulletList;
        const index = list.indexOf(this.node);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
}
