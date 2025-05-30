import { _decorator, Component, Vec3, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SKillBosss1')
export class SKillBosss1 extends Component {

    @property
    speed: number = 10;

    @property(AudioSource)
    shootAudio: AudioSource = null!;

    private direction = new Vec3();
    private isMoving = true; // trạng thái di chuyển

    start() {
        // Tính hướng bay dựa trên hướng xoay của node
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);
        // đảo hướng
        this.direction.multiplyScalar(-1); 

        // Sau 1 giây thì dừng lại
        this.scheduleOnce(() => {
            this.isMoving = false;
            if (this.shootAudio) {
                this.shootAudio.play();
            }
        }, 1);

        // Sau 5 giây thì tự hủy
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                this.node.destroy();
            }
        }, 5);
    }

    update(deltaTime: number) {
        if (!this.isMoving) return;

        const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        const newPos = this.node.position.add(movement);
        this.node.setPosition(newPos);
    }
}
