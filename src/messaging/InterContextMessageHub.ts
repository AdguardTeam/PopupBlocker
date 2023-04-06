import { InterContextMessageHubInterface, IMessageHandler } from './InterContextMessageHubInterface';
import * as TypeGuards from '../shared';
import {
    log,
    nativeWeakMapSupport,
    MessageChannelCtor,
    getMessageSource,
} from '../shared';

interface FrameData {
    messagePort:MessagePort,
    locationObject:Location
}

interface MsgData {
    $type:number,
    $data
}

export default class InterContextMessageHub implements InterContextMessageHubInterface {
    public supported:boolean;

    public hostWindow:Window;

    public parent:Window;

    public isTop:boolean;

    private framePortMap:IWeakMap<Window, FrameData>;

    private typeHandlerMap:IMessageHandler<any>[] = [];

    private static readonly MAGIC = 'pb_handshake';

    private parentPort:MessagePort;

    constructor(window:Window, parentInstance?:InterContextMessageHubInterface) {
        this.hostWindow = window;
        const supported = this.supported = nativeWeakMapSupport;
        const parent = this.parent = window.parent;
        const isTop = this.isTop = window.top === window;
        if (supported) {
            this.framePortMap = new WeakMap();
            // Listens for handshake messages
            window.addEventListener('message', (evt) => {
                this.handshake(evt);
            });
            // Passes message port to parent context.
            if (parentInstance) {
                log.print('MessageHub: registering to parent instance directly..');
                const channel = new MessageChannelCtor(); // Always use API from a 'stable' frame.
                parentInstance.registerChildPort(window, channel.port1);
                this.registerChildPort(parentInstance.hostWindow, channel.port2);
            }
            if (!isTop && (!parentInstance || parentInstance.hostWindow !== parent)) {
                log.print(`MessageHub: sending message from ${window.location.href} to parent...`);
                const channel = new MessageChannelCtor();
                parent.postMessage(InterContextMessageHub.MAGIC, '*', [channel.port1]);
                this.registerChildPort(parent, channel.port2);
            }
        }
    }

    private handshake(evt:MessageEvent) {
        if (evt.data !== InterContextMessageHub.MAGIC) {
            // `MAGIC` indicates that this message is sent by the popupblocker from the child frame.
            return;
        }
        const source = getMessageSource.call(evt);
        // From now on, propagation of event must be stopped.\
        // eslint-disable-next-line no-labels, no-restricted-syntax
        receivePort: {
            if (TypeGuards.isUndef(source)) {
                // evt.source can be undefiend when an iframe has been removed
                // from the document before the message is received.
                // eslint-disable-next-line no-labels
                break receivePort;
            }
            if (this.framePortMap.has(source)) {
                const frameData = this.framePortMap.get(source);
                if (frameData.locationObject === source.location) {
                    log.print('Received a port from a frame that we already met. This could be a bug');
                    // log.debuggerPause();
                    // eslint-disable-next-line no-labels
                    break receivePort;
                }
                log.print('Received a port from a known frame, but location object has updated');
                // Such frames have already sent its message port, we do not accept additional ports.
            }
            // log.print('received a message from:', evt.source);
            const port:MessagePort = evt.ports[0]; // This is a port that a child frame sent.
            this.registerChildPort(source, port);
        }

        evt.stopImmediatePropagation();
        evt.preventDefault();
    }

    registerChildPort(child:Window, port:MessagePort) {
        // eslint-disable-next-line no-param-reassign
        port.onmessage = (evt) => {
            log.print('MesageHub: received a message from a port');
            this.onMessage(evt);
        };
        this.framePortMap.set(child, {
            messagePort: port,
            locationObject: child.location,
        });
    }

    private onMessage(evt:MessageEvent) {
        const { data } = evt;
        this.triggerHandlers(data.$type, data.$data, getMessageSource.call(evt));
    }

    private triggerHandlers<T>(type:number, data:T, source:Window) {
        const messageHandler = this.typeHandlerMap[type];
        if (messageHandler) {
            messageHandler.handleMessage(data, source);
        }
    }

    on<T>(type:number, messageHandler:IMessageHandler<T>):void {
        if (!TypeGuards.isUndef(this.typeHandlerMap[type])) {
            log.throwMessage('Tried to re-assign a callback for an event type', 2);
        }
        this.typeHandlerMap[type] = messageHandler;
    }

    trigger<T>(type:number, data:T, target:Window, transferList?:any[]):void {
        if (target === this.hostWindow) {
            this.triggerHandlers(type, data, this.hostWindow);
        }
        if (!this.supported) {
            // if WeakMap is not supported, this method will only work when
            // the target is the same browsing context.
            return;
        }

        const frameData = this.framePortMap.get(target);
        if (!frameData) { return; }
        const port = frameData.messagePort;
        const msgData:MsgData = {
            $type: type,
            $data: data,
        };
        log.print('MesageHub: sending a message to a port');
        port.postMessage(msgData, transferList);
    }
}
