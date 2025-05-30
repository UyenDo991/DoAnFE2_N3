import { _decorator, Component, input, Input, EventKeyboard, EventMouse, KeyCode, Node, tween, Vec3, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuZoomEffect')
export class MenuZoomEffect extends Component {

    private triggered: boolean = false;

    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.triggerZoom, this);
        input.on(Input.EventType.KEY_DOWN, this.triggerZoom, this);
    }

    triggerZoom(event: EventMouse | EventKeyboard) {
        if (this.triggered) return;
        this.triggered = true;

        // Tween để zoom node trong 3 giây
        tween(this.node)
            .to(3, { scale: new Vec3(300, 300, 300) }, { easing: 'quadInOut' })
            .call(() => {
                director.loadScene('mage');
            })
            .start();
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.triggerZoom, this);
        input.off(Input.EventType.KEY_DOWN, this.triggerZoom, this);
    }
}
