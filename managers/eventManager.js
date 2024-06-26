export class EventManager {
    constructor() {
        this.leftPressed = false;
        this.rightPressed = false;
        this.eventListeners = [];
    }

    addEventListener(event, handler) {
        this.eventListeners.push({ event, handler });
        document.addEventListener(event, handler);
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ event, handler }) => {
            document.removeEventListener(event, handler);
        });
    }

    handleKeyDown(e) {
        if (e.code === "ArrowLeft") {
            this.leftPressed = true;
        } else if (e.code === "ArrowRight") {
            this.rightPressed = true;
        }
    }
    
    handleKeyUp(e) {
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        } else if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
    }    
}
