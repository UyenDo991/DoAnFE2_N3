import { profiler, _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('HideStats')
export class HideStats extends Component {
    start() {
        // Ẩn bảng thông số góc trái
        //profiler.hide(); 
    }
}
