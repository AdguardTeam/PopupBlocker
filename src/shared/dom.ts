export const matches = Element.prototype.matches || Element.prototype.msMatchesSelector;

export const closest = 'closest' in Element.prototype ? (el:Element, selector:string):Element => {
    return el.closest(selector);
} : (el:Element, selector:string):Element => {
    for (let parent = el; parent; parent = parent.parentElement) {
        if (matches.call(el, selector)) {
            return el;
        }
    }
};

export const getTagName = (el:Node):string => {
    return el.nodeName.toUpperCase();
};
