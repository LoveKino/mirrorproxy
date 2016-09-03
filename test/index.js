'use strict';

let {
    mirrorProps, STOP_SETTING
} = require('..');

let assert = require('assert');

describe('index', () => {
    it('mirrorProps', () => {
        let obj = {},
            shadow = {
                a: 10
            };
        mirrorProps(obj, shadow, [{
            name: 'a',
            getHandle: v => v * 2
        }]);

        assert.equal(obj.a, 20);
        assert.equal(shadow.a, 10);
    });

    it('setHandle', () => {
        let obj = {},
            shadow = {};
        mirrorProps(obj, shadow, [{
            name: 'a',
            setHandle: v => v * 2
        }]);

        obj.a = 10;

        assert.equal(obj.a, 20);
        assert.equal(shadow.a, 20);
    });

    it('stopsetting', () => {
        let obj = {},
            shadow = {};
        mirrorProps(obj, shadow, [{
            name: 'a',
            setHandle: () => STOP_SETTING
        }]);

        obj.a = 10;

        assert.equal(obj.a, undefined);
        assert.equal(shadow.a, undefined);

    });
});
