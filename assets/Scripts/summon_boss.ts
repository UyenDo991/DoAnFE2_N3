import { _decorator, Component, Prefab, instantiate, Node } from 'cc';
import { GlobalBoss } from 'db://assets/Global/global_boss';

const { ccclass, property } = _decorator;

@ccclass('BossSpawner')
export class BossSpawner extends Component {
    @property(Prefab)
    boss1Prefab: Prefab = null;

    @property(Prefab)
    boss2Prefab: Prefab = null;

    @property(Node)
    spawnPoint: Node = null;

    private timeSinceBoss1Died = 0;

    start() {
        //th boss sau 1p
        this.scheduleOnce(() => {
            this.spawnBoss1();
        }, 60);
    }

    update(dt: number) {
        if (!GlobalBoss.instance.isBoss1Alive && !GlobalBoss.instance.isBoss2Spawned) {
            this.timeSinceBoss1Died += dt;

            if (this.timeSinceBoss1Died >= 1) {
                this.spawnBoss2();
                GlobalBoss.instance.isBoss2Spawned = true; // không spawn lại
            }
        }
    }

    spawnBoss1() {
        if (!this.boss1Prefab || !this.spawnPoint) return;

        const boss1 = instantiate(this.boss1Prefab);
        boss1.setWorldPosition(this.spawnPoint.worldPosition);
        this.node.scene.addChild(boss1);
        GlobalBoss.instance.hp = 10;
        
        console.log('Boss1 đã xuất hiện');
    }

    spawnBoss2() {
        if (!this.boss2Prefab || !this.spawnPoint) return;

        const boss2 = instantiate(this.boss2Prefab);
        boss2.setWorldPosition(this.spawnPoint.worldPosition);
        this.node.scene.addChild(boss2);
        // reset máu nếu cần
        GlobalBoss.instance.hp = 10; 
        console.log('Boss2 đã xuất hiện');
    }
}
