const getTime = 'now' in performance ? () => {
    return performance.timing.navigationStart + performance.now()
} : () => {
    return (new Date()).getTime()
};

export default getTime;
