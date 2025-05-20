import { Vec3, Node } from 'cc';

export class Global {
    static instance: Global = new Global();

    playerPosition: Vec3 = new Vec3();
    clonePosition: Vec3 = new Vec3();
    cloneExists: boolean = false;

    bulletList: Node[] = [];
    enemyList: Node[] = [];
    enemy2List: Node[] = [];
    playerNode: Node = null;
    public playerHitCount: number = 0; //  Đếm số lần Player bị enemy tấn công
    bulletCloneList: Node[] = [];
    bulletEnemyList: Node[] = [];
    magicCircleList: Node[] = [];

    constructor() {
        Global.instance = this;
    }
}
