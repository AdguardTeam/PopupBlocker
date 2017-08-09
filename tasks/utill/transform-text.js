module.exports = {
    wrapModule: (wrap) => {
        return (content) => {
            return wrap[0] + content + wrap[1];
        };
    },
    exportDefaultToReturn: (content) => {
        return content.replace(/^export\sdefault\s/m, 'return ');
    },
    removeCcExport: (content) => {
        return content.replace(/"REMOVE_START"[\s\S]*?"REMOVE_END"/, '');
    }
};
