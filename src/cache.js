'use strict';

const SECRET_KEY = '__cache__mirror__';

let cacheProp = (obj, key, value, secretKey = SECRET_KEY) => {
    obj[secretKey] = obj[secretKey] || {};
    obj[secretKey][key] = {
        value
    };
};

let fromCache = (obj, key, secretKey = SECRET_KEY) => {
    obj[secretKey] = obj[secretKey] || {};
    return obj[secretKey][key];
};

let removeCache = (obj, key, secretKey = SECRET_KEY) => {
    obj[secretKey] = obj[secretKey] || {};
    obj[secretKey][key] = undefined;
};

module.exports = {
    cacheProp,
    fromCache,
    removeCache
};
