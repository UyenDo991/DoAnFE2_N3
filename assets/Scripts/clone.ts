import { _decorator, Component, Vec3, tween, UIOpacity } from 'cc';
import { Global } from 'db://assets/Global/global.ts'; 
const { ccclass, property } = _decorator;

@ccclass('Clone')
export class Clone extends Component {

    @property
    speed: number = 10;

    private direction = new Vec3();
    private elapsedTime = 0;

    start() {
       
        Vec3.transformQuat(this.direction, Vec3.RIGHT, this.node.worldRotation);

        Global.instance.cloneExists = true;
        Global.instance.clonePosition = this.node.worldPosition.clone();

       
        this.scheduleOnce(() => {
            Global.instance.cloneExists = false;

            const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);

            tween(this.node)
                .parallel(
                    tween().to(1, { scale: new Vec3(0, 0, 0) }),
                    tween(uiOpacity).to(1, { opacity: 0 })
                )
                .call(() => {
                    if (this.node && this.node.isValid) {
                        this.node.destroy();
                    }
                })
                .start();
        }, 6);
    }

    update(deltaTime: number) {

        this.elapsedTime += deltaTime;

        if (this.elapsedTime < 1) {
            const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
            const newPos = this.node.getPosition().add(movement);
            this.node.setPosition(newPos);
        }

        
        Global.instance.clonePosition = this.node.getWorldPosition().clone();
    }
}
