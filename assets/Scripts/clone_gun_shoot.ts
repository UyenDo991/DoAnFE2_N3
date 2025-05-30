import { _decorator, Component, Prefab, Node, instantiate, Vec3, Quat, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloneGun')
export class CloneGun extends Component {

    @property(Prefab)
    bulletPrefab: Prefab = null!;

    @property(Node)
    bulletParent: Node = null!;

    @property
    fireCooldown: number = 0.3;

    @property(AudioSource)
    shootAudio: AudioSource = null!;

    private timeSinceLastShot = 0;

    update(deltaTime: number) {
        this.timeSinceLastShot += deltaTime;

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
}
