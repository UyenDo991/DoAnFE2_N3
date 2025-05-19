import { _decorator, Component, Node, Vec3, input, Input, EventMouse, Camera, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunController')
export class GunController extends Component {

    @property({type: Camera})
    mainCamera: Camera = null!;

    private targetPos = new Vec3();

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onMouseMove(event: EventMouse) {
        const mouse = event.getLocation(); 

        this.mainCamera.screenToWorld(new Vec3(mouse.x, mouse.y, 0), this.targetPos);

        
        const gunWorldPos = this.node.worldPosition;

       
        const dir = this.targetPos.subtract(gunWorldPos);
        const angleRad = Math.atan2(dir.y, dir.x);
        const angleDeg = angleRad * 180 / Math.PI;

        
        this.node.setRotationFromEuler(0, 0, angleDeg);
    }
}
