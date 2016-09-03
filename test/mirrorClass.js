'use strict';

let {
    mirrorClass
} = require('..');

let assert = require('assert');

describe('mirrorclass', () => {
    it('base', () => {
        let A = function() {
            this.a = 3;
        };
        A.prototype.getA = function() {
            return this.a;
        };

        let B = mirrorClass(A);
        let b = new B();
        assert.equal(b.getA(), 3);
    });

    it('getHandle', () => {
        let A = function() {
            this.a = 3;
        };
        A.prototype.getA = function() {
            return this.a;
        };

        let B = mirrorClass(A, [{
            name: 'getA',
            getHandle: (v, obj, shadow) => {
                return function() {
                    return v.apply(shadow) * 2;
                };
            }
        }]);
        let b = new B();
        assert.equal(b.getA(), 6);
    });
});
