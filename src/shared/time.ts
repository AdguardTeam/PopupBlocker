export const getTime = 'now' in performance ? () => performance.timing.navigationStart + performance.now() : Date.now;
