/**
 * @param {string} str 
 * @param {*=} obj 
 */
export default function (str:string, obj?) {
    // @ifdef DEBUG
    let date = (new Date).toISOString();
    console.log('[' + date + ']: ' + str);
    if ( obj !== undefined ) {
        console.log('=============================');
        console.log(obj);
        console.log('=============================');
    }
    // @endif
};
