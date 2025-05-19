import { _decorator, Component, Node, Prefab, instantiate, Vec3, input, Input, EventMouse, EventKeyboard, KeyCode, tween, UITransform, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunController')
export class GunController extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Prefab)
    clonePrefab: Prefab = null!;

    @property(Prefab)
    magicCirclePrefab: Prefab = null!;

    @property(Node)
    bulletParent: Node = null!;

    @property
    fireCooldown: number = 0.3;

    @property
    cloneCooldown: number = 10;

    @property
    magicCircleCooldown: number = 10;

    private timeSinceLastShot = 0;
    private timeSinceLastClone = 0;
    private timeSinceLastMagicCircle = 0;

    update(deltaTime: number) {
        if (this.timeSinceLastShot < this.fireCooldown) {
            this.timeSinceLastShot += deltaTime;
        }

        if (this.timeSinceLastClone < this.cloneCooldown) {
            this.timeSinceLastClone += deltaTime;
        }

        if (this.timeSinceLastMagicCircle < this. magicCircleCooldown) {
            this.timeSinceLastMagicCircle += deltaTime;
        }
    }

    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) {
            this.tryShoot();
        }
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_Q) {
            this.trySpawnClone();
        }

        if (event.keyCode === KeyCode.KEY_E) {
            this.trySpawnMagicCircle();
        }
    }

    tryShoot() {
        if (this.timeSinceLastShot >= this.fireCooldown) {
            this.fireBullet();
            this.timeSinceLastShot = 0;
        }
    }

    fireBullet() {
        const bullet = instantiate(this.bulletPrefab);
        this.bulletParent.addChild(bullet);

        bullet.setWorldPosition(this.node.worldPosition);
        bullet.setWorldRotation(this.node.worldRotation);
    }

    trySpawnClone() {
        if (this.timeSinceLastClone >= this.cloneCooldown) {
            this.spawnClone();
            this.timeSinceLastClone = 0;
        }
    }

    spawnClone() {
        const clone = instantiate(this.clonePrefab);
        this.bulletParent.addChild(clone);

        clone.setWorldPosition(this.node.worldPosition);
        clone.setWorldRotation(this.node.worldRotation);
    }

    trySpawnMagicCircle() {
        if (this.timeSinceLastMagicCircle >= this.magicCircleCooldown) {
            this.spawnMagicCircle();
            this.timeSinceLastMagicCircle = 0;
        }
    }

    spawnMagicCircle() {
        const magiccircle = instantiate(this.magicCirclePrefab);
        this.bulletParent.addChild(magiccircle);

        magiccircle.setWorldPosition(this.node.worldPosition);
        magiccircle.setWorldRotation(this.node.worldRotation);
    }
}
