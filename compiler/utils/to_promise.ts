/**
 * Converts a gulp stream to a promise that resolves to a string content that it emits.
 */
export function toPromise(stream:NodeJS.ReadableStream):Promise<void>
export function toPromise(stream:NodeJS.ReadableStream, resolveWithContent:true):Promise<string>
export function toPromise(stream:NodeJS.ReadableStream, resolveWithContent?:boolean):Promise<string|void> {
    if (resolveWithContent !== true) {
        return new Promise((resolve, reject) => {
            stream.on('end', () => { resolve(); });
            stream.on('error', reject);
        });
    } else {
        let parts:(string|Buffer|Promise<any>)[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (data) => {
                // An hack to detect Vinyl instances
                if (data.constructor && data.constructor.name === 'File') {
                    if (data.isStream()) {
                        parts.push(toPromise(data.contents, true));
                    } else {
                        parts.push(data.contents.toString());
                    }
                } else {
                    parts.push(data.toString());
                }
            });
            stream.on('end', () => {
                Promise.all(parts)
                    .then((resolvedParts) => {
                        resolve(resolvedParts.join(''));
                    })
                    .catch(reject);
            });
            stream.on('error', reject);
        });
    }
}

export default toPromise;
