import through = require('through2');

/**
 * Creates an object from a readable stream which holds emitted data
 * until `release()` is called. Once it is called, the stream pipes emitted
 * data to a stream returned from the method.
 */
export default class Reservoir {
    constructor(readableStream:NodeJS.ReadableStream) {
        let self = this;
        function transform(chunk, enc, callback) {
            this.push(chunk);
            if (self.released) {
                callback();
            } else {
                self.pendingCallbacks.push(callback.bind(this));
            }
        }
        function flush(callback) {
            callback();
        }
        this.stream = readableStream
            .pipe(through({ objectMode: true }, transform, flush));
    }
    private pendingCallbacks:(()=>void)[] = [];
    private stream:NodeJS.ReadWriteStream;
    private released = false;
    release():NodeJS.ReadableStream {
        if (this.released) { throw Error('Already released'); }
        this.released = true;
        for (let callback of this.pendingCallbacks) {
            callback();
        }
        return this.stream;
    }
}
