export class SingleEventEmitter {
    protected listeners:func[] = [];

    private emit() {
        const { listeners } = this;
        for (let i = 0, l = listeners.length; i < l; i += 1) {
            const listener = listeners[i];
            try {
                listener();
            } catch (e) { /* do nothing */ }
        }
    }

    addListener(listener:func) {
        this.listeners.push(listener);
    }

    removeListener(listener:func) {
        const i = this.listeners.indexOf(listener);
        if (i !== -1) {
            this.listeners.splice(i, 1);
        }
    }

    handleEvent(this:this, evt:Event) {
        if (evt.isTrusted) {
            this.emit();
        }
    }

    constructor(
        private eventName:string,
    ) { }

    protected $install(target:EventTarget) {
        target.addEventListener(this.eventName, this);
    }

    protected $uninstall(target:EventTarget) {
        target.removeEventListener(this.eventName, this);
    }
}
