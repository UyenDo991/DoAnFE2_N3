import { _decorator, Component, director } from 'cc';
import { GlobalBoss } from 'db://assets/Global/global_boss';
import { Global } from 'db://assets/Global/global';

const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private winTriggered = false;
    private loseTriggered = false;

    update(dt: number) {
        GlobalBoss.instance.update(dt);

        // Gọi check mỗi frame
        Global.instance.checkGameOver();

        if (Global.instance.isGameOver && !this.loseTriggered) {
            this.loseTriggered = true;
            console.log('[GameManager] Người chơi thua! Chuyển sang scene lose...');
            director.loadScene('lose');
        }

        if (GlobalBoss.instance.hasWon && !this.winTriggered) {
            this.winTriggered = true;
            console.log('[GameManager] Chiến thắng! Chuyển sang scene win...');
            director.loadScene('win');
        }
    }

}
