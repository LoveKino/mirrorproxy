'use strict';

let {
    cache, mirrorProps, hide
} = require('..');

let assert = require('assert');

describe('cache', () => {
    it('index', () => {
        let obj = {},
            shadow = {
                a: 10
            };

        mirrorProps(obj, shadow, [{
            name: 'a',
            getHandle: (v) => {
                if (cache.fromCache(obj, 'a')) {
                    return cache.fromCache(obj, 'a').value;
                }
                return v;
            }
        }]);

        cache.cacheProp(obj, 'a', 30);

        assert.equal(obj.a, 30);
        assert.equal(shadow.a, 10);
    });

    it('hide', () => {
        let obj = {},
            shadow = {
                a: 10
            };

        mirrorProps(obj, shadow, [
            hide(obj, shadow, 'a')
        ]);

        let init = obj.a;
        obj.a = 40;
        assert.equal(obj.a, 40);
        assert.equal(init, 10);
        assert.equal(shadow.a, 10);
    });

    it('hide2', () => {
        let obj = {},
            shadow = {
                a: 10
            };

        mirrorProps(obj, shadow, [
            hide(obj, shadow, 'a', {
                getHandle: v => v * 2
            })
        ]);

        let init = obj.a;
        obj.a = 40;
        assert.equal(obj.a, 40);
        assert.equal(init, 20);
        assert.equal(shadow.a, 10);
    });

});
