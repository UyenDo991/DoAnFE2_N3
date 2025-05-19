import { _decorator, Component, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Global } from 'db://assets/Global/global';

@ccclass('CloneBullet')
export class CloneBullet extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();

    start() {
        
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);

        
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 0.4);

        // Đăng ký vào danh sách Bullet để Enemy có thể kiểm tra va chạm
        Global.instance.bulletCloneList.push(this.node);
    }

    update(deltaTime: number) {
        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);
    }
    onDestroy() {
        // Xóa khỏi danh sách bullet nếu bị phá hủy
        const list = Global.instance.bulletCloneList;
        const index = list.indexOf(this.node);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }
}
