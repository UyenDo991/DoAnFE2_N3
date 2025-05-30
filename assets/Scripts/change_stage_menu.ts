import { _decorator, Component, input, Input, EventKeyboard, EventMouse, KeyCode, Node, tween, Vec3, director } from 'cc';
import { Global } from 'db://assets/Global/global';
import { GlobalBoss } from 'db://assets/Global/global_boss';

const { ccclass, property } = _decorator;

@ccclass('reset')
export class reset extends Component {

    private triggered: boolean = false;

    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.triggerZoom, this);
        input.on(Input.EventType.KEY_DOWN, this.triggerZoom, this);
    }

    triggerZoom(event: EventMouse | EventKeyboard) {
        if (this.triggered) return;
        this.triggered = true;

        //Gọi reset trước khi chuyển scene
        Global.instance.resetGameState();
        GlobalBoss.instance.reset();

        tween(this.node)
            .call(() => {
                director.loadScene('menu');
            })
            .start();
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.triggerZoom, this);
        input.off(Input.EventType.KEY_DOWN, this.triggerZoom, this);
    }
}
