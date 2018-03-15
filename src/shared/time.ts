const getTime = 'now' in performance ? () => {
    return performance.timing.navigationStart + performance.now()
} : Date.now;

export default getTime;
