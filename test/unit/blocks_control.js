const test = require('tap').test;
const Control = require('../../src/blocks/scratch3_control');
const Runtime = require('../../src/engine/runtime');

test('getPrimitives', t => {
    const rt = new Runtime();
    const c = new Control(rt);
    t.type(c.getPrimitives(), 'object');
    t.end();
});

test('repeat', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // Test harness (mocks `util`)
    let i = 0;
    const repeat = 10;
    const util = {
        stackFrame: Object.create(null),
        startBranch: function () {
            i++;
            c.repeat({TIMES: repeat}, util);
        }
    };

    // Execute test
    c.repeat({TIMES: 10}, util);
    t.strictEqual(util.stackFrame.loopCounter, -1);
    t.strictEqual(i, repeat);
    t.end();
});

test('repeatUntil', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // Test harness (mocks `util`)
    let i = 0;
    const repeat = 10;
    const util = {
        stackFrame: Object.create(null),
        startBranch: function () {
            i++;
            c.repeatUntil({CONDITION: (i === repeat)}, util);
        }
    };

    // Execute test
    c.repeatUntil({CONDITION: (i === repeat)}, util);
    t.strictEqual(i, repeat);
    t.end();
});

test('forEach', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // for each (variable) in "abcd"
    // ..should yield variable values "a", "b", "c", "d"
    const variableValues = [];
    const variable = {value: 0};
    let value = 'abcd';

    const util = {
        stackFrame: Object.create(null),
        target: {
            lookupOrCreateVariable: function () {
                return variable;
            }
        },
        startBranch: function () {
            variableValues.push(variable.value);
            c.forEach({VARIABLE: {}, VALUE: value}, util);
        }
    };

    c.forEach({VARIABLE: {}, VALUE: value}, util);
    t.deepEqual(variableValues, ['a', 'b', 'c', 'd']);

    // for each (variable) in "5"
    // ..should yield variable values 1, 2, 3, 4, 5
    util.stackFrame = Object.create(null);
    variableValues.splice(0);
    variable.value = 0;
    value = '5';
    c.forEach({VARIABLE: {}, VALUE: value}, util);
    t.deepEqual(variableValues, [1, 2, 3, 4, 5]);

    // for each (variable) in 4
    // ..should yield variable values 1, 2, 3, 4
    util.stackFrame = Object.create(null);
    variableValues.splice(0);
    variable.value = 0;
    value = 4;
    c.forEach({VARIABLE: {}, VALUE: value}, util);
    t.deepEqual(variableValues, [1, 2, 3, 4]);

    // for each (variable) in 10:
    //   if variable % 4 === 3:
    //     variable++
    // ..should yield variable values 1, 2, 3,  5, 6, 7,  9, 10
    // (this script skips multiples of 4)
    util.stackFrame = Object.create(null);
    variableValues.splice(0);
    variable.value = 0;
    value = 10;
    util.startBranch = function () {
        variableValues.push(variable.value);
        if (variable.value % 4 === 3) {
            variable.value++;
        }
        c.forEach({VARIABLE: {}, VALUE: value}, util);
    };
    c.forEach({VARIABLE: {}, VALUE: value}, util);
    t.deepEquals(variableValues, [1, 2, 3, 5, 6, 7, 9, 10]);

    t.end();
});

test('forever', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // Test harness (mocks `util`)
    let i = 0;
    const util = {
        startBranch: function (branchNum, isLoop) {
            i++;
            t.strictEqual(branchNum, 1);
            t.strictEqual(isLoop, true);
        }
    };

    // Execute test
    c.forever(null, util);
    t.strictEqual(i, 1);
    t.end();
});

test('if / ifElse', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // Test harness (mocks `util`)
    let i = 0;
    const util = {
        startBranch: function (branchNum) {
            i += branchNum;
        }
    };

    // Execute test
    c.if({CONDITION: true}, util);
    t.strictEqual(i, 1);
    c.if({CONDITION: false}, util);
    t.strictEqual(i, 1);
    c.ifElse({CONDITION: true}, util);
    t.strictEqual(i, 2);
    c.ifElse({CONDITION: false}, util);
    t.strictEqual(i, 4);
    t.end();
});

test('stop', t => {
    const rt = new Runtime();
    const c = new Control(rt);

    // Test harness (mocks `util`)
    const state = {
        stopAll: 0,
        stopOtherTargetThreads: 0,
        stopThisScript: 0
    };
    const util = {
        stopAll: function () {
            state.stopAll++;
        },
        stopOtherTargetThreads: function () {
            state.stopOtherTargetThreads++;
        },
        stopThisScript: function () {
            state.stopThisScript++;
        }
    };

    // Execute test
    c.stop({STOP_OPTION: 'all'}, util);
    c.stop({STOP_OPTION: 'other scripts in sprite'}, util);
    c.stop({STOP_OPTION: 'other scripts in stage'}, util);
    c.stop({STOP_OPTION: 'this script'}, util);
    t.strictEqual(state.stopAll, 1);
    t.strictEqual(state.stopOtherTargetThreads, 2);
    t.strictEqual(state.stopThisScript, 1);
    t.end();
});
