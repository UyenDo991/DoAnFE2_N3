import { Vec3, Node } from 'cc';

export class Global {
    static instance: Global = new Global();

    // ======= Trạng thái người chơi =======
    playerPosition: Vec3 = new Vec3();
    clonePosition: Vec3 = new Vec3();
    playerNode: Node = null;

    playerHitCount: number = 0;
    playerHP: number = 4;
    isGameOver: boolean = false;

    // ======= Clone & Magic Circle =======
    cloneExists: boolean = false;
    isCloneReady: boolean = false;
    isMagicCircleReady: boolean = false;

    cloneCooldownTimePassed: number = 0;
    magicCircleCooldownTimePassed: number = 0;

    cloneCooldownTime: number = 10;
    magicCircleCooldownTime: number = 10;

    // ======= Danh sách đối tượng =======
    bulletList: Node[] = [];
    clonebulletList: Node[] = [];
    enemyList: Node[] = [];
    magicCircleList: Node[] = [];

    // ======= Điểm số =======
    score: number = 0;
    highScore: number = 0;

    constructor() {
        Global.instance = this;
    }

    // ======= Quản lý điểm =======
    addScore(amount: number) {
        this.score += amount;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    getScore(): number {
        return this.score;
    }

    getHighScore(): number {
        return this.highScore;
    }

    // ======= Kiểm tra thua cuộc =======
    checkGameOver() {
        if (this.playerHitCount >= Global.instance.playerHP && !this.isGameOver) {
            this.isGameOver = true;
            console.log('[Global] Player đã bị đánh bại! Game Over được kích hoạt.');
        }
    }

    // ======= Reset nếu chơi lại =======
    resetGameState() {
        this.playerHitCount = 0;
        this.isGameOver = false;
        this.score = 0;
        this.cloneExists = false;
        this.isCloneReady = false;
        this.isMagicCircleReady = false;
        this.cloneCooldownTimePassed = 0;
        this.magicCircleCooldownTimePassed = 0;
        this.bulletList = [];
        this.enemyList = [];
        this.magicCircleList = [];
        this.clonebulletList = [];
        console.log('[Global] Đã reset trạng thái game.');
    }
}
