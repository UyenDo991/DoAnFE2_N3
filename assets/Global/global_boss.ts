export class GlobalBoss {
    // Singleton pattern
    private static _instance: GlobalBoss;

    public static get instance(): GlobalBoss {
        if (!GlobalBoss._instance) {
            GlobalBoss._instance = new GlobalBoss();
        }
        return GlobalBoss._instance;
    }

    // ======= Các thuộc tính kỹ năng =======
    public timer1: number = 0;
    public timer2: number = 0;
    public skillCooldown: number = 5; // Giây
    public randomValue: number = 0;
    public state: 'waiting' | 'cooldown' = 'waiting';

    // ======= Trạng thái chiến đấu =======
    public hp: number = 10;
    public isBoss1Alive: boolean = true;
    public isBoss2Spawned: boolean = false;
    public isBoss2Alive: boolean = true;

    // ======= Trạng thái game =======
    public hasWon: boolean = false;

    constructor() {
        this.reset();
    }

    public reset() {
        this.timer1 = 0;
        this.timer2 = 0;
        this.randomValue = 0;
        this.state = 'waiting';
        this.hp = 10; //Set máu 10
        this.isBoss1Alive = true;
        this.isBoss2Spawned = false;
        this.isBoss2Alive = true;
        this.hasWon = false;
    }

    public resetSkillCycle() {
        this.timer1 = 0;
        this.timer2 = 0;
        this.randomValue = 0;
        this.state = 'waiting';
    }

    // Gọi mỗi frame từ GameManager
    public update(dt: number) {
        // Logic kỹ năng
        if (this.state === 'waiting') {
            this.timer1 += dt;
            if (this.timer1 >= this.skillCooldown) {
                this.timer1 = 0;
                this.randomValue = Math.floor(Math.random() * 4) + 1;
                console.log('GlobalBoss skill random:', this.randomValue);
                this.state = 'cooldown';
            }
        } else if (this.state === 'cooldown') {
            this.timer2 += dt;
            if (this.timer2 >= this.skillCooldown) {
                this.timer2 = 0;
                this.state = 'waiting';
                console.log('GlobalBoss set skill trạng thái waiting');
            }
        }

        // Kiểm tra boss2 chết => thắng
        if (!this.isBoss2Alive && !this.hasWon) {
            this.hasWon = true;
            console.log('[GlobalBoss] Boss2 đã chết. Người chơi chiến thắng.');
        }
    }

    // Gọi khi sinh boss mới
    public spawnNewBoss(hp: number = 10) {
        this.hp = hp;
        this.resetSkillCycle();
        console.log('[GlobalBoss] Boss mới được sinh ra với hp =', hp);
    }
}
