import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hold')
export class Hold extends Component {

    @property(Prefab)
    enemyPrefab: Prefab = null!;

    @property(Node)
    enemyParent: Node = null!;

    @property
    moveSpeed: number = 1;

    @property
    minY: number = -10;

    @property
    maxY: number = 10;

    private timeSinceLastShot = 0;
    private currentCooldown = 0;

    private timeSinceDirectionChange = 0;
    private currentChangeInterval = 0;

    private moveDirection = 1;

    start() {
        this.setRandomChangeInterval();
        this.setRandomCooldown();
    }

    update(deltaTime: number) {
        // Spawn enemy
        this.timeSinceLastShot += deltaTime;
        if (this.timeSinceLastShot >= this.currentCooldown) {
            this.summon();
            this.timeSinceLastShot = 0;
            this.setRandomCooldown();
        }

        // Di chuyển
        const moveOffset = this.moveSpeed * this.moveDirection * deltaTime;
        const pos = this.node.position.clone();
        pos.y += moveOffset;

        // Giới hạn
        if (pos.y > this.maxY) {
            pos.y = this.maxY;
            this.moveDirection = -1;
            this.setRandomChangeInterval();
            this.timeSinceDirectionChange = 0;
        } else if (pos.y < this.minY) {
            pos.y = this.minY;
            this.moveDirection = 1;
            this.setRandomChangeInterval();
            this.timeSinceDirectionChange = 0;
        }

        this.node.setPosition(pos);

        // Đổi hướng nếu đủ thời gian
        this.timeSinceDirectionChange += deltaTime;
        if (this.timeSinceDirectionChange >= this.currentChangeInterval) {
            this.moveDirection *= -1;
            this.timeSinceDirectionChange = 0;
            this.setRandomChangeInterval();
        }
    }

    setRandomChangeInterval() {
        // từ 4 đến 10 giây sẽ chuyển hướng
        this.currentChangeInterval = 4 + Math.random() * 6; 
    }

    setRandomCooldown() {
        // từ 5 đến 10 giây sẽ sinh ra enemy
        this.currentCooldown = 5 + Math.random() * 5; 
    }

    summon() {
        const enemy = instantiate(this.enemyPrefab);
        this.enemyParent.addChild(enemy);
        enemy.setWorldPosition(this.node.worldPosition);
        enemy.setWorldRotation(this.node.worldRotation);
    }
}
