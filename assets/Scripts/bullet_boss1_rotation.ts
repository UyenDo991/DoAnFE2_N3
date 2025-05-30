import { _decorator, Component, Quat, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotatingGun')
export class RotatingGun extends Component {

    private angle = 0;
    private rotateSpeed = 0;
    private elapsedTime = 0;
    private isRotating = true;

    start() {
        // Random tốc độ quay trong 4 giá trị
        const speeds = [30, 60, 90, 120];
        const index = Math.floor(Math.random() * speeds.length);
        this.rotateSpeed = speeds[index];

        console.log(`Rotate Speed Selected: ${this.rotateSpeed}`);
    }

    update(deltaTime: number) {
        if (!this.isRotating) return;

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= 1.0) {
            this.isRotating = false;
            return;
        }

        this.angle += this.rotateSpeed * deltaTime;

        const quat = Quat.fromEuler(new Quat(), 0, 0, this.angle);
        this.node.setRotation(quat);
    }
}
