import { _decorator, Component, input, Input, EventKeyboard, EventMouse, KeyCode, Vec3, Camera, Node} from 'cc';
import { Global } from 'db://assets/Global/global'; 
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Camera)
    camera: Camera = null!; // Gán camera trong Editor

    private moveSpeed: number = 10;  
    private dashSpeedMultiplier: number = 4; 
    private direction: Vec3 = new Vec3(0, 0, 0);

    private isDashing: boolean = false;
    private dashDuration: number = 0.1; 
    private dashTimer: number = 0;

    private dashCooldown: number = 1; 
    private dashCooldownTimer: number = 0;


    detectRadius: number = 1.5; // Bán kính để xem có bị tác động hay không

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        //Đăng ký player để Enemy có thể kiểm tra tác động 
        Global.instance.playerNode = this.node;

    }

    update(deltaTime: number) {
        Global.instance.playerPosition.set(this.node.worldPosition);


        if (this.dashCooldownTimer > 0) {
            this.dashCooldownTimer -= deltaTime;
        }

        if (this.isDashing) {
            this.dashTimer -= deltaTime;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }
        }

        let currentSpeed = this.moveSpeed;
        if (this.isDashing) {
            currentSpeed *= this.dashSpeedMultiplier;
        }

        const movement = this.direction.clone().normalize().multiplyScalar(currentSpeed * deltaTime);
        let newPos = this.node.position.clone().add(movement);

        // ===== Giới hạn theo camera orthographic =====
        if (this.camera && this.camera.camera) {
            const cam = this.camera.camera;
            const aspect = cam.aspect;
            const orthoHeight = cam.orthoHeight;

            const halfWidth = orthoHeight * aspect;
            const halfHeight = orthoHeight;

            newPos.x = Math.min(Math.max(newPos.x, -halfWidth), halfWidth);
            newPos.y = Math.min(Math.max(newPos.y, -halfHeight), halfHeight);
        }

        this.node.setPosition(newPos);
        //this.onCheckVaCham();
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_W:
                this.direction.y = 1;
                break;
            case KeyCode.KEY_S:
                this.direction.y = -1;
                break;
            case KeyCode.KEY_A:
                this.direction.x = -1;
                break;
            case KeyCode.KEY_D:
                this.direction.x = 1;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this.direction.y = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this.direction.x = 0;
                break;
        }
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() === 2) { 
            this.tryDash();
        }
    }

    tryDash() {
        if (this.dashCooldownTimer <= 0) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldownTimer = this.dashCooldown;
        }
    }
    /*onCheckVaCham() {
        const playerPos = Global.instance.playerPosition.clone();
        const enemys = Global.instance.enemyList;

            console.log("playerPos" + playerPos);
        for (let i = 0; i < enemys.length; i++) {
            const enemy = enemys[i];
            const enemyPos = enemy.worldPosition;
           // const distance = Vec3.distance(enemyPos, playerPos);
            //console.log(enemyPos);
           // console.log("playerPos" + playerPos);
            if (distance < this.detectRadius) {
                console.log('Player bị va chạm!');

                this.hitCountPlayer++;
                enemy.destroy();
                console.log(this.hitCountPlayer);

                if (this.hitCountPlayer >= 4) {
                    console.log('Player bị die!');
                    this.node.destroy();
                }

                break; 
            }
        }
    }*/


}
