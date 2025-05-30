import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpawnEnemy')
export class SpawnEnemy extends Component {

    start() {
        // Hủy node sau 1 phút (60 giây)
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                console.log('SpawnEnemy đã tồn tại 1 phút và sẽ bị xóa.');
                this.node.destroy();
            }
        }, 60); 
    }

    
    update(deltaTime: number) {
        
    }
}
