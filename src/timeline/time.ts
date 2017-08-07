const getTime = 'now' in performance ? () => {
    return performance.now()
} : () => {
    return (new Date()).getTime()
};

export default getTime;
