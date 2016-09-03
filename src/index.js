'use strict';

/**
 *
 * mirror proxy for an object
 *
 * visit proxy object instead of visiting object directly
 *
 * (proxy, origin)
 *
 * proxy prop include get and set
 */

let {
    isFunction
} = require('basetype');

let {
    forEach, map
} = require('bolzano');

let cache = require('./cache');

let reflectMirrorContext = (v, obj, shadow) => {
    if (isFunction(v)) {
        return function(...args) {
            let context = this;
            if (context === obj) {
                context = shadow;
            }
            return v.apply(context, args);
        };
    }
    return v;
};

let mirrorClass = (Origin, props = [], {
    mirrorName = '__secret_mirror_instance'
} = {}) => {
    // mirror constructor
    let ProxyClass = function(...args) {
        let ctx = this;
        let mirrorInst = ctx[mirrorName] = new Origin(...args);
        let defProps = map(mirrorInst, (_, name) => {
            return {
                name,
                getHandle: reflectMirrorContext
            };
        });
        props = defProps.concat(props);

        mirrorProps(ctx, mirrorInst, props);
    };

    // prototype
    ProxyClass.prototype = Origin.prototype;

    return ProxyClass;
};

/**
 * props = [
 *      {
 *          name,
 *          setHandle,  v => v
 *          getHandle   v => v
 *      }
 * ]
 */
let mirrorProps = (obj, shadow, props = []) => {
    let handleMap = {};
    forEach(props, ({
        name, setHandle = id, getHandle = id
    }) => {
        if (!handleMap[name]) {
            Object.defineProperty(obj, name, {
                set: (v) => {
                    return handleMap[name].set(v);
                },
                get: () => {
                    return handleMap[name].get();
                }
            });
        }
        handleMap[name] = {
            set: (v) => {
                v = setHandle(v, obj, shadow, name);
                if (v !== STOP_SETTING) {
                    // set to shadow
                    shadow[name] = v;
                }
            },

            get: () => {
                // fetch from shadow
                let v = shadow[name];
                return getHandle(v, obj, shadow, name);
            }
        };
    });
};

const STOP_SETTING = {};

let id = v => v;

module.exports = {
    mirrorProps,
    mirrorClass,
    cache,
    STOP_SETTING
};
