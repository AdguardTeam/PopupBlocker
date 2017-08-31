const minifyHtml = require('html-minifier').minify;
const fs = require('fs');

const RESOURCE_PATH_MAP = {
    "ALERT_TEMPLATE": 'src/ui/template.html',
    "TRANSLATIONS": 'src/locales/translations.json'
};
const RESOURCE_MAP = Object.create(null);
const reResourceMarker = /(['"])RESOURCE:([A-Za-z_\-]*?)\1/gm;

module.exports = (content, file) => {
    return content.replace(reResourceMarker, (match, c1, c2) => {
        if (RESOURCE_PATH_MAP[c2]) {
            let path = RESOURCE_PATH_MAP[c2];
            let resource;
            if (RESOURCE_MAP[c2]) {
                resource = RESOURCE_MAP[c2];
            } else {
                resource = fs.readFileSync(path).toString();
                if (/\.html$/.test(path)) {
                    resource = minifyHtml(resource, {
                        collapseWhitespace: true,
                        minifyCSS: true,
                        removeAttributeQuotes: true,
                        removeComments: false
                    });
                        resource = c1 + resource.replace(/[\\"]/g, (m) => {
                        return "\\" + m;
                    }) + c1;
                } else if (/\.json$/.test(path)) {
                    resource = JSON.stringify(JSON.parse(resource));
                }
                RESOURCE_MAP[c2] = resource;
            }
            if (resource) {
                console.log('A resource ' + c2 + ' in ' + file.path + ' was inserted');
                return resource;
            }
        }
    });
};
