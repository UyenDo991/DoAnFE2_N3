import { _decorator, Component, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BGMManager')
export class BGMManager extends Component {
    
    @property(AudioSource)
    bgmAudio: AudioSource = null!;

    start() {
        if (this.bgmAudio && !this.bgmAudio.playing) {
            this.bgmAudio.loop = true;
            this.bgmAudio.play();
        }
    }
    //Dừng nhạc
    stopMusic() {
        if (this.bgmAudio && this.bgmAudio.playing) {
            this.bgmAudio.stop();
        }
    }
    //Tạm dừng nhạc
    pauseMusic() {
        if (this.bgmAudio && this.bgmAudio.playing) {
            this.bgmAudio.pause();
        }
    }
    //Phát nhạc trở lại
    resumeMusic() {
        if (this.bgmAudio && !this.bgmAudio.playing) {
            this.bgmAudio.play();
        }
    }
}
