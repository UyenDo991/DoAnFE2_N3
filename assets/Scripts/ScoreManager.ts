import { _decorator, Component, Label, AudioSource } from 'cc';
import { Global } from 'db://assets/Global/global';
const { ccclass, property } = _decorator;

@ccclass('ScoreLabel')
export class ScoreLabel extends Component {

    @property(Label)
    label: Label = null!;

    @property(AudioSource)
    scoreAudio: AudioSource = null!;

    private previousScore: number = 0;

    update() {
        const currentScore = Global.instance.getScore();

        // Nếu điểm thay đổi thì cập nhật Label và phát nhạc
        if (currentScore !== this.previousScore) {
            this.label.string = `Score: ${currentScore}`;
            this.previousScore = currentScore;

            if (this.scoreAudio) {
                this.scoreAudio.play();
            }
        }
    }
}
