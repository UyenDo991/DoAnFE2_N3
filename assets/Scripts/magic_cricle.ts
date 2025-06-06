﻿import { _decorator, Component, tween, UIOpacity, Vec3, Quat, UITransform  } from 'cc';
import { Global } from 'db://assets/Global/global'; // Đảm bảo đúng đường dẫn
const { ccclass } = _decorator;

@ccclass('MagicCircle')
export class MagicCircle extends Component {

    

    private angle = 0;
    private rotationSpeed = -40;

    private moveSpeed = 2.5; // Tốc độ di chuyển về target
    getRadius(): number {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('MagicCircle node is missing UITransform component!');
            return 0;
        }
        return (uiTransform.contentSize.width / 2) * this.node.scale.x;
    }

    start() {
        // Xuất hiện mờ dần
        const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        uiOpacity.opacity = 0;
        this.node.setScale(new Vec3(0, 0, 0));

        tween(this.node)
            .parallel(
                tween().to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' }),
                tween(uiOpacity).to(0.5, { opacity: 255 }, { easing: 'sineOut' })
            )
            .start();

        // Sau 8 giây biến mất
        this.scheduleOnce(() => {
            tween(this.node)
                .parallel(
                    tween().to(1, { scale: new Vec3(0, 0, 0) }, { easing: 'sineIn' }),
                    tween(uiOpacity).to(1, { opacity: 0 }, { easing: 'sineIn' })
                )
                .call(() => {
                    if (this.node && this.node.isValid) {
                        this.node.destroy();
                        const list = Global.instance.magicCircleList;
                        const index = list.indexOf(this.node);
                        if (index !== -1) {
                            list.splice(index, 1);
                        }
                    }
                })
                .start();
        }, 8);

        //Check kích thước
        const radius = this.getRadius();
        console.log('Magic circle radius:', radius);    
        //Đăng ký vào danh sách Enemy để magic circle có thể kiểm tra va chạm
        Global.instance.magicCircleList.push(this.node);
        
    }
    

    update(deltaTime: number) {
        // Xoay
        this.angle += this.rotationSpeed * deltaTime;
        const quat = Quat.fromEuler(new Quat(), 0, 0, this.angle);
        this.node.setRotation(quat);

        // Di chuyển về phía clone nếu có, nếu không thì về player
        const targetPos = Global.instance.cloneExists
            ? Global.instance.clonePosition
            : Global.instance.playerPosition;

        const currentPos = this.node.worldPosition;
        const newPos = new Vec3();
        Vec3.lerp(newPos, currentPos, targetPos, this.moveSpeed * deltaTime);

        this.node.setWorldPosition(newPos);
    }
}
