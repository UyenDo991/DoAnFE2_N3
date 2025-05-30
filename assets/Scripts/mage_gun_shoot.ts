import { _decorator, Component, Node, Prefab, instantiate, input, Input, EventMouse, EventKeyboard, KeyCode, AudioSource } from 'cc';
import { Global } from 'db://assets/Global/global'; // Đảm bảo import Global

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

    @property(AudioSource)
    shootAudio: AudioSource = null!;

    private timeSinceLastShot = 0;
    private timeSinceLastClone = 0;
    private timeSinceLastMagicCircle = 0;

    update(deltaTime: number) {
        // Bắn thường
        if (this.timeSinceLastShot < this.fireCooldown) {
            this.timeSinceLastShot += deltaTime;
        }

        // Skill Q (Clone)
        if (this.timeSinceLastClone < this.cloneCooldown) {
            this.timeSinceLastClone += deltaTime;

            Global.instance.cloneCooldownTimePassed = this.timeSinceLastClone;
            Global.instance.cloneCooldownTime = this.cloneCooldown;
            Global.instance.isCloneReady = false;

            if (this.timeSinceLastClone >= this.cloneCooldown) {
                Global.instance.isCloneReady = true;
            }
        }

        // Skill E (Magic Circle)
        if (this.timeSinceLastMagicCircle < this.magicCircleCooldown) {
            this.timeSinceLastMagicCircle += deltaTime;

            Global.instance.magicCircleCooldownTimePassed = this.timeSinceLastMagicCircle;
            Global.instance.magicCircleCooldownTime = this.magicCircleCooldown;
            Global.instance.isMagicCircleReady = false;

            if (this.timeSinceLastMagicCircle >= this.magicCircleCooldown) {
                Global.instance.isMagicCircleReady = true;
            }
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

        if (this.shootAudio) {
            this.shootAudio.play();
        }
    }

    trySpawnClone() {
        if (this.timeSinceLastClone >= this.cloneCooldown) {
            this.spawnClone();
            this.timeSinceLastClone = 0;
            Global.instance.cloneCooldownTimePassed = 0;
            Global.instance.isCloneReady = false;
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
            Global.instance.magicCircleCooldownTimePassed = 0;
            Global.instance.isMagicCircleReady = false;
        }
    }

    spawnMagicCircle() {
        const magiccircle = instantiate(this.magicCirclePrefab);
        this.bulletParent.addChild(magiccircle);
        magiccircle.setWorldPosition(this.node.worldPosition);
        magiccircle.setWorldRotation(this.node.worldRotation);
    }
}
