import { _decorator, Component, Node, Quat, Vec3, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotatingGun')
export class RotatingGun extends Component {

    @property
    rotateSpeed: number = 90; // độ/giây

    private angle = 0;

    update(deltaTime: number) {
        this.angle += this.rotateSpeed * deltaTime;

        const rad = math.toRadian(this.angle);
        const quat = Quat.fromEuler(new Quat(), 0, 0, this.angle);
        this.node.setRotation(quat);
    }
}
