'use strict';

/**
 *
 * mirror proxy for an object
 *
 * visit proxy object instead of visiting object directly
 *
 * (proxy, origin)
 *
 * TODO dynamic decide prop's value
 */

let {
    isFunction
} = require('basetype');

let {
    forEach
} = require('bolzano');

let cache = require('./cache');

let mirrorClass = (Origin, props, {
    mirrorName = '__secret_mirror_instance', setHandle = id, getHandle = id
} = {}) => {
    props = props || [];

    // mirror constructor
    let ProxyClass = function() {
        let nameMap = {};
        let mirrorInst = this[mirrorName] = new Origin();

        let mirror = (obj, ori, name) => {
            if (nameMap[name]) return;
            nameMap[name] = true;
            mirrorProp(obj, ori, name, {
                getHandle: (v, prop, obj) => {
                    let newV = v;
                    if (isFunction(v)) {
                        newV = function(...args) {
                            return v.apply(mirrorInst, args);
                        };
                    }
                    return getHandle(newV, prop, obj);
                },
                setHandle
            });
        };

        forEach(props, (prop) => {
            mirror(this, mirrorInst, prop);
        });

        forEach(mirrorInst, (_, name) => {
            mirror(this, mirrorInst, name);
        });
    };

    //static
    forEach(Origin, (_, key) => {
        mirrorProp(ProxyClass, Origin, key);
    });

    // prototype
    ProxyClass.prototype = Origin.prototype;

    return ProxyClass;
};

let mirrorProp = (obj, shadow, prop, {
    setHandle = id, getHandle = id
} = {}) => {
    Object.defineProperty(obj, prop, {
        set: (v) => {
            v = setHandle(v, prop, obj);
            // set to shadow
            shadow[prop] = v;
        },
        get: () => {
            // fetch from shadow
            let v = shadow[prop];
            return getHandle(v, prop, obj);
        }
    });
};

let id = v => v;

module.exports = {
    mirrorClass,
    mirrorProp,
    cache
};
