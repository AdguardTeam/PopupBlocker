const MSG = "This page navigation attempt is likely to be a popunder (with popup blocked) do you wish to continue?";

const onbeforeunloadHandler = (evt) => {
    evt.returnValue = MSG;
    return MSG;
};

export const setBeforeunloadHandler = () => {
    // ToDo: if this found to be useful, consider making it work on cross-origin iframes
    if (window === window.top) {
        const prev = window.onbeforeunload;
        window.onbeforeunload = onbeforeunloadHandler;
        setTimeout(() => {
            if (onbeforeunloadHandler === window.onbeforeunload) {
                window.onbeforeunload = prev;
            }
        }, 1000);
    }
};
