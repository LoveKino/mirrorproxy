'use strict';

let {
    mirrorProp, mirrorClass, cache
} = require('..');

let assert = require('assert');

describe('index', () => {
    it('base', () => {
        let shadow = {};
        let obj = {};

        mirrorProp(obj, shadow, 'a');
        mirrorProp(obj, shadow, 'b');

        obj.a = 10;
        obj.b = false;

        assert.equal(shadow.a, 10);
        assert.equal(shadow.b, false);
    });

    it('setHandle', () => {
        let shadow = {};
        let obj = {};

        mirrorProp(obj, shadow, 'a', {
            setHandle: (v) => v * 2
        });

        obj.a = 10;

        assert.equal(obj.a, 20);
        assert.equal(shadow.a, 20);
    });

    it('getHandle', () => {
        let shadow = {};
        let obj = {};

        mirrorProp(obj, shadow, 'a', {
            getHandle: (v) => v * 4
        });

        obj.a = 10;

        assert.equal(shadow.a, 10);
        assert.equal(obj.a, 40);
    });

    it('proxy class', () => {
        let clz = function() {
            this.a = 10;
        };

        clz.prototype.getA = function() {
            return this.a;
        };

        let Mc = mirrorClass(clz, null, {
            getHandle: (v, prop) => {
                if (prop === 'getA') {
                    return function() {
                        return 2 * this.a;
                    };
                }
                return v;
            }
        });

        let mc = new Mc();

        assert.equal(mc.a, 10);
        assert.equal(mc.getA(), 20);
    });

    it('cache prop', () => {
        let clz = function() {
            this.a = 10;
            this.b = 20;
        };

        let Mc = mirrorClass(clz, null, {
            getHandle: (v, prop, obj) => {
                if (cache.fromCache(obj, prop)) {
                    return cache.fromCache(obj, prop).value;
                }
                return v;
            }
        });

        let mc = new Mc();

        cache.cacheProp(mc, 'a', 40);
        assert.equal(mc.a, 40);

        cache.removeCache(mc, 'a');
        assert.equal(mc.a, 10);

        // hide
        cache.cacheProp(mc, 'b', 30, {
            hide: true
        });
        assert.equal(mc.b, 20);
        assert.equal(cache.getProp(mc, 'b').value, 30);
    });
});
