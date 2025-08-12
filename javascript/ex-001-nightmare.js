// ex-001-type-coercion-headache.js
// INTENTIONALLY AWFUL: JavaScript type coercion and prototype pollution paradise
// This file celebrates every JavaScript WTF moment and anti-pattern known to humanity
// WARNING: This code will make your browser cry and your sanity evaporate

// Global variable soup with confusing names
var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
var l1 = 'l1', O0 = 'O0', I1 = 'I1';                      // confusable variable names
var undefined = 'not undefined';                          // redefine undefined (ES3/ES5)
var NaN = 'not a number';                                 // redefine NaN
var Infinity = 42;                                        // redefine Infinity

// Prototype pollution for maximum chaos
Object.prototype.polluted = 'GLOBAL POLLUTION';           // pollute Object prototype
Array.prototype.chaos = function() { return 'CHAOS'; };   // pollute Array prototype
String.prototype.wtf = 'What The Function';               // pollute String prototype
Number.prototype.valueOf = function() { return Math.random(); }; // break Number coercion

// Type coercion nightmare functions
function coercionChaos() {
    // The classics
    console.log([] + []);                                 // ""
    console.log([] + {});                                 // "[object Object]"
    console.log({} + []);                                 // 0 (in some contexts)
    console.log({} + {});                                 // "[object Object][object Object]"
    
    // Arithmetic madness
    console.log('2' + 1);                                 // "21"
    console.log('2' - 1);                                 // 1
    console.log('2' * '3');                               // 6
    console.log('2' / '1');                               // 2
    console.log('a' - 1);                                 // NaN
    console.log(true + true);                             // 2
    console.log(true + false);                            // 1
    console.log(false - true);                            // -1
    
    // Array arithmetic
    console.log([1,2,3] + [4,5,6]);                       // "1,2,34,5,6"
    console.log([1] + [2]);                               // "12"
    console.log([1] - [2]);                               // -1
    console.log([1,2] - [1]);                             // NaN
    
    // The infamous
    console.log(0.1 + 0.2);                               // 0.30000000000000004
    console.log(0.1 + 0.2 == 0.3);                       // false
    console.log(0.1 + 0.2 === 0.3);                      // false
    
    // Comparison chaos
    console.log(null == undefined);                       // true
    console.log(null === undefined);                      // false
    console.log('' == 0);                                 // true
    console.log('' === 0);                                // false
    console.log(' ' == 0);                                // true
    console.log('0' == 0);                                // true
    console.log('0' == false);                            // true
    console.log(false == '');                             // true
    console.log(false == []);                             // true
    console.log([] == '');                                // true
    console.log([] == 0);                                 // true
    console.log([0] == 0);                                // true
    console.log([1] == 1);                                // true
    console.log([1,2] == '1,2');                          // true
}

// Hoisting and scoping nightmares
function scopingHell() {
    console.log(hoistedVar);                              // undefined (not error)
    console.log(typeof notDeclared);                      // "undefined"
    
    var hoistedVar = 'I am hoisted';
    
    // Function hoisting chaos
    console.log(hoistedFunc());                           // "I'm hoisted!"
    
    function hoistedFunc() {
        return "I'm hoisted!";
    }
    
    // var in loops
    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            console.log('Loop var:', i);                  // prints 3, 3, 3
        }, 100);
    }
    
    // Redeclaring variables
    var x = 1;
    var x = 2;                                            // no error
    var x = 'string';                                     // still no error
    console.log(x);                                       // "string"
}

// this binding chaos
var globalThis = this;
function thisHell() {
    console.log(this === globalThis);                     // depends on context
    
    var obj = {
        method: function() {
            console.log(this === obj);                    // true
            
            function innerFunc() {
                console.log(this === globalThis);        // true (not obj!)
            }
            innerFunc();
            
            var arrow = () => {
                console.log(this === obj);                // true (lexical this)
            };
            arrow();
        }
    };
    
    obj.method();
    
    var detached = obj.method;
    detached();                                           // this is global/undefined
}

// Async callback headache
function callbackHeadache(callback) {
    setTimeout(function() {
        console.log('Level 1');
        setTimeout(function() {
            console.log('Level 2');
            setTimeout(function() {
                console.log('Level 3');
                setTimeout(function() {
                    console.log('Level 4');
                    setTimeout(function() {
                        console.log('Level 5');
                        callback && callback('HELL COMPLETE');
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}

// Prototype chain manipulation
function prototypeHell() {
    function Parent() {
        this.parentProp = 'parent';
    }
    Parent.prototype.parentMethod = function() {
        return 'parent method';
    };
    
    function Child() {
        this.childProp = 'child';
    }
    
    // Wrong way to inherit
    Child.prototype = Parent.prototype;                   // shares prototype!
    Child.prototype.childMethod = function() {
        return 'child method';
    };
    
    var parent = new Parent();
    var child = new Child();
    
    console.log(parent.childMethod());                    // "child method" - pollution!
    
    // Modify built-in prototypes
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
    
    var arr = [1, 2, 3];
    console.log(arr.last());                              // 3
    
    // But now all arrays have this method
    for (var key in arr) {
        console.log(key, arr[key]);                       // includes "last"
    }
}

// Error handling disasters
function errorHell() {
    try {
        // Throwing different types
        if (Math.random() > 0.5) {
            throw 'string error';                         // throwing string
        } else {
            throw { message: 'object error' };            // throwing object
        }
    } catch (e) {
        console.log('Caught:', typeof e, e);
        // No re-throwing or proper handling
    }
    
    // Silent failures
    try {
        nonExistentFunction();
    } catch (e) {
        // Swallow error
    }
    
    // Promise rejection without handling
    Promise.reject('Unhandled rejection');
    
    // Async errors
    setTimeout(function() {
        throw new Error('Async error');                   // uncatchable by try/catch
    }, 0);
}

// DOM manipulation chaos (if in browser)
function domHell() {
    if (typeof document !== 'undefined') {
        // innerHTML injection
        var userInput = '<img src=x onerror=alert("XSS")>';
        document.body.innerHTML = userInput;              // XSS vulnerability
        
        // Event handler leaks
        for (var i = 0; i < 100; i++) {
            var div = document.createElement('div');
            div.onclick = function() {
                console.log('Clicked:', i);               // closure captures final i
            };
            document.body.appendChild(div);
        }
        
        // Global event pollution
        window.onclick = function() {
            console.log('Global click');
        };
    }
}

// Memory leak generators
function memoryLeakHell() {
    var leaks = [];
    
    // Closure leaks
    function createLeak() {
        var largeData = new Array(1000000).fill('leak');
        return function() {
            return largeData.length;                      // keeps largeData alive
        };
    }
    
    for (var i = 0; i < 100; i++) {
        leaks.push(createLeak());
    }
    
    // Circular references
    var obj1 = {};
    var obj2 = {};
    obj1.ref = obj2;
    obj2.ref = obj1;                                      // circular reference
    
    // Timer leaks
    var intervalId = setInterval(function() {
        console.log('Leaking interval');
    }, 1000);
    // Never cleared!
    
    // Global pollution
    window.globalLeak = leaks;                            // attach to global
}

// Eval and Function constructor abuse
function evalHell() {
    var userCode = "console.log('User code executed')";
    eval(userCode);                                       // eval is evil
    
    var dynamicFunc = new Function('x', 'return x * 2'); // Function constructor
    console.log(dynamicFunc(5));
    
    // JSON parsing with eval (never do this)
    var jsonString = '{"key": "value"}';
    var parsed = eval('(' + jsonString + ')');           // dangerous parsing
    console.log(parsed);
    
    // setTimeout with string
    setTimeout('console.log("String timeout")', 100);    // eval in disguise
}

// Regex catastrophe
function regexHell() {
    // Catastrophic backtracking
    var evilRegex = /^(a+)+$/;
    var input = 'a'.repeat(20) + 'b';                     // will hang browser
    // console.log(evilRegex.test(input));               // DON'T UNCOMMENT
    
    // Unsafe regex from user input
    var userPattern = '.*';
    var regex = new RegExp(userPattern);                  // no validation
    console.log(regex.test('test'));
}

// Main chaos orchestrator
function main() {
    console.log('🔥 JAVASCRIPT NIGHTMARE STARTING 🔥');
    
    // Run all the chaos
    coercionChaos();
    scopingHell();
    thisHell();
    
    callbackHeadache(function(result) {
        console.log('Callback result:', result);
    });
    
    prototypeHell();
    errorHell();
    domHell();
    memoryLeakHell();
    evalHell();
    // regexHell(); // commented out to prevent browser hang
    
    // Final chaos
    console.log('Type of NaN:', typeof NaN);
    console.log('NaN === NaN:', NaN === NaN);             // false
    console.log('Array is Array:', [] instanceof Array);  // true
    console.log('Array is Object:', [] instanceof Object); // also true
    console.log('null type:', typeof null);               // "object"
    console.log('function type:', typeof function() {});  // "function"
    
    // The ultimate WTF
    console.log('[] == ![]:', [] == ![]);                 // true
    console.log('[] == []:', [] == []);                   // false
    console.log('{} == {}:', {} == {});                   // false
    
    console.log('🎭 JAVASCRIPT CHAOS COMPLETE 🎭');
}

// Auto-execute chaos
(function() {
    main();
})();

// Export chaos for modules (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        coercionChaos: coercionChaos,
        scopingHell: scopingHell,
        thisHell: thisHell,
        callbackHeadache: callbackHeadache,
        prototypeHell: prototypeHell,
        errorHell: errorHell,
        domHell: domHell,
        memoryLeakHell: memoryLeakHell,
        evalHell: evalHell,
        regexHell: regexHell
    };
}

// Global pollution finale
window && (window.CHAOS_COMPLETE = true);
global && (global.CHAOS_COMPLETE = true);
