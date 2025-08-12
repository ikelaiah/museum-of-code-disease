// ex-001-type-coercion-headache.js AUTOPSY VERSION
// INTENTIONALLY AWFUL: JavaScript type coercion and prototype pollution paradise
// This file celebrates every JavaScript WTF moment and anti-pattern known to humanity
// AUTOPSY: Same nightmare code with detailed explanations of JavaScript's dark magic

// PROBLEM: Global variable soup with confusing names
var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z; // PROBLEM: 26 global variables
var l1 = 'l1', O0 = 'O0', I1 = 'I1';                    // PROBLEM: Confusable variable names (l1 vs I1 vs O0)
var undefined = 'not undefined';                          // PROBLEM: Redefining undefined (possible in ES3/ES5)
var NaN = 'not a number';                                 // PROBLEM: Redefining NaN global
var Infinity = 42;                                        // PROBLEM: Redefining Infinity
// FIX: Use const/let, avoid globals, never redefine built-ins

// PROBLEM: Prototype pollution - the JavaScript plague
Object.prototype.polluted = 'GLOBAL POLLUTION';           // PROBLEM: Pollute ALL objects globally
Array.prototype.chaos = function() { return 'CHAOS'; };  // PROBLEM: All arrays get this method
String.prototype.wtf = 'What The Function';              // PROBLEM: All strings get this property
Number.prototype.valueOf = function() { return Math.random(); }; // PROBLEM: Break number coercion globally!
// FIX: Never modify built-in prototypes; use composition or proper inheritance

// PROBLEM: Type coercion nightmare functions
function coercionChaos() {
    // PROBLEM: JavaScript's infamous type coercion "features"
    console.log([] + []);                                 // PROBLEM: "" - empty arrays become empty strings
    console.log([] + {});                                 // PROBLEM: "[object Object]" - array + object = string
    console.log({} + []);                                 // PROBLEM: 0 (in some contexts) - depends on context!
    console.log({} + {});                                 // PROBLEM: "[object Object][object Object]" - string concat
    
    // PROBLEM: Arithmetic with strings - inconsistent behavior
    console.log('2' + 1);                                 // PROBLEM: "21" - + does concatenation with strings
    console.log('2' - 1);                                 // PROBLEM: 1 - other operators force numeric conversion
    console.log('2' * '3');                               // PROBLEM: 6 - strings converted to numbers
    console.log('2' / '1');                               // PROBLEM: 2 - division converts strings
    console.log('a' - 1);                                 // PROBLEM: NaN - 'a' can't be converted to number
    console.log(true + true);                             // PROBLEM: 2 - booleans convert to numbers (true = 1)
    console.log(true + false);                            // PROBLEM: 1 - true(1) + false(0)
    console.log(false - true);                            // PROBLEM: -1 - false(0) - true(1)
    
    // PROBLEM: Array arithmetic madness
    console.log([1,2,3] + [4,5,6]);                       // PROBLEM: "1,2,34,5,6" - arrays become comma-separated strings
    console.log([1] + [2]);                               // PROBLEM: "12" - single-element arrays become their element
    console.log([1] - [2]);                               // PROBLEM: -1 - arrays convert to numbers if possible
    console.log([1,2] - [1]);                             // PROBLEM: NaN - multi-element arrays become NaN
    
    // PROBLEM: Floating point precision issues
    console.log(0.1 + 0.2);                               // PROBLEM: 0.30000000000000004 - binary floating point precision
    console.log(0.1 + 0.2 == 0.3);                       // PROBLEM: false - due to precision error
    console.log(0.1 + 0.2 === 0.3);                      // PROBLEM: false - strict equality still fails
    
    // PROBLEM: Comparison chaos - == vs === confusion
    console.log(null == undefined);                       // PROBLEM: true - special case in == comparison
    console.log(null === undefined);                      // PROBLEM: false - different types
    console.log('' == 0);                                 // PROBLEM: true - empty string converts to 0
    console.log('' === 0);                                // PROBLEM: false - different types
    console.log(' ' == 0);                                // PROBLEM: true - whitespace string converts to 0
    console.log('0' == 0);                                // PROBLEM: true - string '0' converts to number 0
    console.log('0' == false);                            // PROBLEM: true - both convert to 0
    console.log(false == '');                             // PROBLEM: true - both convert to 0
    console.log(false == []);                             // PROBLEM: true - both convert to 0
    console.log([] == '');                                // PROBLEM: true - empty array becomes empty string
    console.log([] == 0);                                 // PROBLEM: true - empty array converts to 0
    console.log([0] == 0);                                // PROBLEM: true - single-element array becomes its element
    console.log([1] == 1);                                // PROBLEM: true - same as above
    console.log([1,2] == '1,2');                          // PROBLEM: true - array becomes comma-separated string
}
// FIX: Always use === and !==; understand type coercion rules; use explicit conversion

// PROBLEM: Hoisting and scoping nightmares
function scopingHell() {
    console.log(hoistedVar);                              // PROBLEM: undefined (not ReferenceError) - var is hoisted
    console.log(typeof notDeclared);                      // PROBLEM: "undefined" - typeof doesn't throw for undeclared
    
    var hoistedVar = 'I am hoisted';                      // PROBLEM: Declaration hoisted, assignment stays here
    
    // PROBLEM: Function hoisting chaos
    console.log(hoistedFunc());                           // PROBLEM: Works! Function declarations are fully hoisted
    
    function hoistedFunc() {
        return "I'm hoisted!";
    }
    
    // PROBLEM: var in loops creates closure issues
    for (var i = 0; i < 3; i++) {                         // PROBLEM: var has function scope, not block scope
        setTimeout(function() {
            console.log('Loop var:', i);                  // PROBLEM: Prints 3, 3, 3 - closure captures final i
        }, 100);
    }
    
    // PROBLEM: Redeclaring variables with var
    var x = 1;
    var x = 2;                                            // PROBLEM: No error - var allows redeclaration
    var x = 'string';                                     // PROBLEM: Can change type without warning
    console.log(x);                                       // PROBLEM: "string" - last assignment wins
}
// FIX: Use let/const instead of var; understand hoisting; use block scope

// PROBLEM: this binding chaos
var globalThis = this;                                    // PROBLEM: Capture global this (window in browser)
function thisHell() {
    console.log(this === globalThis);                     // PROBLEM: Depends on how function is called
    
    var obj = {
        method: function() {
            console.log(this === obj);                    // PROBLEM: true when called as obj.method()
            
            function innerFunc() {
                console.log(this === globalThis);        // PROBLEM: true - inner functions lose this binding!
            }
            innerFunc();                                  // PROBLEM: this is global, not obj
            
            var arrow = () => {
                console.log(this === obj);                // PROBLEM: true - arrow functions have lexical this
            };
            arrow();
        }
    };
    
    obj.method();                                         // PROBLEM: this is obj
    
    var detached = obj.method;
    detached();                                           // PROBLEM: this is global/undefined - lost binding
}
// FIX: Use arrow functions, .bind(), or explicit this parameters

// PROBLEM: Async callback headache - pyramid of doom
function callbackHeadache(callback) {                    // PROBLEM: Nested callbacks create unreadable code
    setTimeout(function() {
        console.log('Level 1');
        setTimeout(function() {                           // PROBLEM: Nesting level 2
            console.log('Level 2');
            setTimeout(function() {                       // PROBLEM: Nesting level 3
                console.log('Level 3');
                setTimeout(function() {                   // PROBLEM: Nesting level 4
                    console.log('Level 4');
                    setTimeout(function() {               // PROBLEM: Nesting level 5 - pyramid of doom!
                        console.log('Level 5');
                        callback && callback('HELL COMPLETE'); // PROBLEM: Callback might not exist
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}
// FIX: Use Promises, async/await, or proper async libraries

// PROBLEM: Prototype chain manipulation
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
    
    // PROBLEM: Wrong way to inherit - shares the same prototype object!
    Child.prototype = Parent.prototype;                   // PROBLEM: Modifying Child affects Parent
    Child.prototype.childMethod = function() {
        return 'child method';
    };
    
    var parent = new Parent();
    var child = new Child();
    
    console.log(parent.childMethod());                    // PROBLEM: "child method" - Parent got polluted!
    
    // PROBLEM: Modify built-in prototypes
    Array.prototype.last = function() {                   // PROBLEM: All arrays get this method
        return this[this.length - 1];
    };
    
    var arr = [1, 2, 3];
    console.log(arr.last());                              // PROBLEM: Works, but...
    
    // PROBLEM: for...in loops now include the new method
    for (var key in arr) {
        console.log(key, arr[key]);                       // PROBLEM: Includes "last" property
    }
}
// FIX: Use Object.create() for inheritance; never modify built-in prototypes

// PROBLEM: Error handling disasters
function errorHell() {
    try {
        // PROBLEM: Throwing different types instead of Error objects
        if (Math.random() > 0.5) {
            throw 'string error';                         // PROBLEM: Throwing string, not Error
        } else {
            throw { message: 'object error' };            // PROBLEM: Throwing plain object
        }
    } catch (e) {
        console.log('Caught:', typeof e, e);              // PROBLEM: Can't assume e is Error object
        // PROBLEM: No re-throwing or proper error handling
    }
    
    // PROBLEM: Silent failures
    try {
        nonExistentFunction();                            // PROBLEM: Will throw ReferenceError
    } catch (e) {
        // PROBLEM: Swallow error completely - debugging nightmare
    }
    
    // PROBLEM: Promise rejection without handling
    Promise.reject('Unhandled rejection');                // PROBLEM: Unhandled promise rejection
    
    // PROBLEM: Async errors can't be caught by try/catch
    setTimeout(function() {
        throw new Error('Async error');                   // PROBLEM: Uncatchable by surrounding try/catch
    }, 0);
}
// FIX: Always throw Error objects; handle specific errors; use .catch() for promises

// PROBLEM: DOM manipulation chaos (if in browser)
function domHell() {
    if (typeof document !== 'undefined') {
        // PROBLEM: innerHTML injection without sanitization
        var userInput = '<img src=x onerror=alert("XSS")>'; // PROBLEM: XSS payload
        document.body.innerHTML = userInput;              // PROBLEM: Direct HTML injection - XSS vulnerability!
        
        // PROBLEM: Event handler leaks with closure issues
        for (var i = 0; i < 100; i++) {                   // PROBLEM: var creates closure issue
            var div = document.createElement('div');
            div.onclick = function() {
                console.log('Clicked:', i);               // PROBLEM: All handlers log final i value (100)
            };
            document.body.appendChild(div);               // PROBLEM: 100 divs with broken handlers
        }
        
        // PROBLEM: Global event pollution
        window.onclick = function() {                     // PROBLEM: Override any existing global click handler
            console.log('Global click');
        };
    }
}
// FIX: Use textContent or sanitize HTML; use addEventListener; avoid global event handlers

// PROBLEM: Memory leak generators
function memoryLeakHell() {
    var leaks = [];
    
    // PROBLEM: Closure leaks - large data kept alive
    function createLeak() {
        var largeData = new Array(1000000).fill('leak'); // PROBLEM: 1MB array
        return function() {
            return largeData.length;                      // PROBLEM: Closure keeps largeData alive forever
        };
    }
    
    for (var i = 0; i < 100; i++) {                       // PROBLEM: Create 100 closures = 100MB leak
        leaks.push(createLeak());
    }
    
    // PROBLEM: Circular references (less of an issue in modern JS)
    var obj1 = {};
    var obj2 = {};
    obj1.ref = obj2;
    obj2.ref = obj1;                                      // PROBLEM: Circular reference
    
    // PROBLEM: Timer leaks
    var intervalId = setInterval(function() {             // PROBLEM: Create interval
        console.log('Leaking interval');
    }, 1000);
    // PROBLEM: Never call clearInterval(intervalId)!
    
    // PROBLEM: Global pollution
    window.globalLeak = leaks;                            // PROBLEM: Attach large data to global object
}
// FIX: Clear intervals/timeouts; avoid closures over large data; use WeakMap/WeakSet

// PROBLEM: Eval and Function constructor abuse
function evalHell() {
    var userCode = "console.log('User code executed')";
    eval(userCode);                                       // PROBLEM: eval is evil - code injection risk
    
    var dynamicFunc = new Function('x', 'return x * 2'); // PROBLEM: Function constructor is eval in disguise
    console.log(dynamicFunc(5));
    
    // PROBLEM: JSON parsing with eval (NEVER DO THIS)
    var jsonString = '{"key": "value"}';
    var parsed = eval('(' + jsonString + ')');           // PROBLEM: Dangerous - could execute code
    console.log(parsed);
    
    // PROBLEM: setTimeout with string
    setTimeout('console.log("String timeout")', 100);    // PROBLEM: String gets eval'd - security risk
}
// FIX: Use JSON.parse() for JSON; avoid eval; use function references in setTimeout

// PROBLEM: Regex catastrophe
function regexHell() {
    // PROBLEM: Catastrophic backtracking - can hang browser
    var evilRegex = /^(a+)+$/;                            // PROBLEM: Nested quantifiers cause exponential backtracking
    var input = 'a'.repeat(20) + 'b';                     // PROBLEM: Input designed to trigger worst-case
    // console.log(evilRegex.test(input));               // PROBLEM: Would hang browser for minutes!
    
    // PROBLEM: Unsafe regex from user input
    var userPattern = '.*';                               // PROBLEM: User-provided regex pattern
    var regex = new RegExp(userPattern);                  // PROBLEM: No validation - could be malicious
    console.log(regex.test('test'));
}
// FIX: Validate regex patterns; avoid nested quantifiers; use timeout for regex operations

// PROBLEM: Main chaos orchestrator
function main() {
    console.log('🔥 JAVASCRIPT NIGHTMARE STARTING 🔥');
    
    // PROBLEM: Run all the chaos without error handling
    coercionChaos();                                      // PROBLEM: Type coercion madness
    scopingHell();                                        // PROBLEM: Hoisting and scoping issues
    thisHell();                                           // PROBLEM: this binding confusion
    
    callbackHeadache(function(result) {                   // PROBLEM: Callback pyramid
        console.log('Callback result:', result);
    });
    
    prototypeHell();                                      // PROBLEM: Prototype pollution
    errorHell();                                          // PROBLEM: Bad error handling
    domHell();                                            // PROBLEM: DOM manipulation issues
    memoryLeakHell();                                     // PROBLEM: Memory leaks
    evalHell();                                           // PROBLEM: eval abuse
    // regexHell(); // PROBLEM: Commented out to prevent browser hang
    
    // PROBLEM: Final chaos - JavaScript's greatest hits
    console.log('Type of NaN:', typeof NaN);             // PROBLEM: "number" - NaN is a number!
    console.log('NaN === NaN:', NaN === NaN);             // PROBLEM: false - NaN is not equal to itself
    console.log('Array is Array:', [] instanceof Array);  // PROBLEM: true
    console.log('Array is Object:', [] instanceof Object); // PROBLEM: also true - arrays are objects
    console.log('null type:', typeof null);               // PROBLEM: "object" - famous JavaScript bug
    console.log('function type:', typeof function() {});  // PROBLEM: "function" - functions are objects but have own type
    
    // PROBLEM: The ultimate WTF moments
    console.log('[] == ![]:', [] == ![]);                 // PROBLEM: true - empty array equals its negation!
    console.log('[] == []:', [] == []);                   // PROBLEM: false - different array objects
    console.log('{} == {}:', {} == {});                   // PROBLEM: false - different object references
    
    console.log('🎭 JAVASCRIPT CHAOS COMPLETE 🎭');
}

// PROBLEM: Auto-execute chaos with IIFE
(function() {                                             // PROBLEM: Immediately Invoked Function Expression
    main();                                               // PROBLEM: Runs chaos immediately on load
})();

// PROBLEM: Export chaos for modules (if supported)
if (typeof module !== 'undefined' && module.exports) {   // PROBLEM: Check for Node.js environment
    module.exports = {                                    // PROBLEM: Export all chaos functions
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

// PROBLEM: Global pollution finale
window && (window.CHAOS_COMPLETE = true);                // PROBLEM: Pollute window object
global && (global.CHAOS_COMPLETE = true);                // PROBLEM: Pollute Node.js global

// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Type Coercion Abuse**: Relying on implicit type conversion
// 2. **Prototype Pollution**: Modifying built-in prototypes globally
// 3. **Global Variable Soup**: Too many global variables with confusing names
// 4. **Hoisting Confusion**: var hoisting and function declaration hoisting
// 5. **this Binding Issues**: Lost this context in callbacks and inner functions
// 6. **Callback Headache**: Deeply nested callbacks creating pyramid of doom
// 7. **Error Handling Disasters**: Throwing non-Error objects, swallowing errors
// 8. **Memory Leaks**: Closures over large data, uncleaned timers, circular refs
// 9. **Security Issues**: eval abuse, XSS vulnerabilities, unsafe regex
// 10. **Comparison Confusion**: == vs === and type coercion in comparisons

// WHY JAVASCRIPT IS UNIQUELY CHAOTIC:
// ─────────────────────────────────────────────────────────────────────────────
// - **Dynamic Typing**: No compile-time type checking
// - **Type Coercion**: Automatic type conversion with surprising rules
// - **Prototype-based**: Inheritance via prototype chain, not classes
// - **Function Scope**: var has function scope, not block scope (until let/const)
// - **Hoisting**: Variable and function declarations are moved to top of scope
// - **this Binding**: this depends on how function is called, not where defined
// - **Truthy/Falsy**: Complex rules for what's considered true/false
// - **Global Object**: Easy to accidentally create globals

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use strict mode ('use strict') to catch common mistakes
// 2. Use const/let instead of var for block scoping
// 3. Always use === and !== for comparisons
// 4. Use arrow functions to preserve this binding
// 5. Use Promises/async-await instead of callbacks
// 6. Never modify built-in prototypes
// 7. Use proper Error objects and handle errors specifically
// 8. Sanitize user input and avoid eval
// 9. Use ESLint and TypeScript for static analysis
// 10. Understand type coercion rules and avoid relying on them

// Remember: JavaScript's flexibility is both its strength and weakness! 🎭
