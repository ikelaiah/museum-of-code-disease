// ex-002-callback-madness.js AUTOPSY VERSION
// INTENTIONALLY AWFUL: JavaScript callback pyramid of confusion and Promise anti-patterns
// This file demonstrates problematic async patterns in JavaScript
// AUTOPSY: Same nightmare code with detailed explanations of JavaScript async anti-patterns

// PROBLEM: Global state pollution
var globalCallbackCount = 0;                                   // PROBLEM: Global counter
var globalPromiseChain = null;                                 // PROBLEM: Global promise reference
var globalEventEmitter = null;                                 // PROBLEM: Global event emitter
var globalAsyncState = {                                       // PROBLEM: Global async state
    pending: [],
    completed: [],
    failed: [],
    callbacks: {}
};

// PROBLEM: Monkey patching built-in prototypes
Array.prototype.asyncForEach = function(callback, done) {      // PROBLEM: Modify Array prototype
    var self = this;
    var index = 0;
    
    function processNext() {
        if (index >= self.length) {
            return done && done();                              // PROBLEM: Optional callback
        }
        
        // PROBLEM: Async callback without error handling
        callback(self[index], index, function(err) {
            if (err) {
                console.log('AsyncForEach error:', err);        // PROBLEM: Just log error, continue
            }
            index++;
            processNext();                                      // PROBLEM: Potential stack overflow
        });
    }
    
    processNext();
};
// FIX: Don't modify built-in prototypes, use utility functions or libraries

Promise.prototype.finallyButNotReally = function(callback) {   // PROBLEM: Modify Promise prototype
    return this.then(
        function(value) {
            callback();                                         // PROBLEM: Ignore callback errors
            return value;
        },
        function(reason) {
            callback();                                         // PROBLEM: Ignore callback errors
            throw reason;
        }
    );
};
// FIX: Use standard Promise.prototype.finally, don't modify built-ins

String.prototype.asyncReplace = function(pattern, replacement, callback) { // PROBLEM: Async string method
    var self = this;
    setTimeout(function() {                                     // PROBLEM: Fake async operation
        try {
            var result = self.replace(pattern, replacement);
            callback(null, result);                             // PROBLEM: Node.js style callback
        } catch (error) {
            callback(error, null);                              // PROBLEM: Error-first callback
        }
    }, Math.random() * 100);                                   // PROBLEM: Random delay
};
// FIX: Don't make synchronous operations async, don't modify String prototype

// PROBLEM: Callback pyramid of confusion
function callbackPyramidOfConfusion(userId, callback) {
    // PROBLEM: Deep nesting of callbacks
    getUserData(userId, function(userErr, userData) {           // PROBLEM: Error-first callback
        if (userErr) {
            return callback(userErr, null);                     // PROBLEM: Early return with error
        }
        
        getAccountInfo(userData.accountId, function(accountErr, accountData) {
            if (accountErr) {
                return callback(accountErr, null);              // PROBLEM: Nested error handling
            }
            
            getTransactions(accountData.accountNumber, function(transErr, transactions) {
                if (transErr) {
                    return callback(transErr, null);            // PROBLEM: More nested error handling
                }
                
                // PROBLEM: Process transactions with more callbacks
                var processedTransactions = [];
                var transactionCount = transactions.length;
                var completedCount = 0;
                
                if (transactionCount === 0) {
                    return callback(null, {                     // PROBLEM: Different return structure
                        user: userData,
                        account: accountData,
                        transactions: []
                    });
                }
                
                transactions.forEach(function(transaction, index) {
                    enrichTransactionData(transaction, function(enrichErr, enrichedTransaction) {
                        if (enrichErr) {
                            // PROBLEM: What to do with individual transaction errors?
                            console.log('Transaction enrichment error:', enrichErr);
                            enrichedTransaction = transaction;   // PROBLEM: Use original on error
                        }
                        
                        validateTransaction(enrichedTransaction, function(validErr, isValid) {
                            if (validErr) {
                                console.log('Transaction validation error:', validErr);
                                isValid = false;                // PROBLEM: Assume invalid on error
                            }
                            
                            if (isValid) {
                                calculateTransactionFees(enrichedTransaction, function(feeErr, fees) {
                                    if (feeErr) {
                                        console.log('Fee calculation error:', feeErr);
                                        fees = { total: 0 };    // PROBLEM: Default fees on error
                                    }
                                    
                                    enrichedTransaction.fees = fees;
                                    processedTransactions[index] = enrichedTransaction;
                                    completedCount++;
                                    
                                    if (completedCount === transactionCount) {
                                        // PROBLEM: Final callback with complex data structure
                                        callback(null, {
                                            user: userData,
                                            account: accountData,
                                            transactions: processedTransactions.filter(Boolean) // PROBLEM: Filter out undefined
                                        });
                                    }
                                });
                            } else {
                                // PROBLEM: Skip invalid transactions
                                processedTransactions[index] = null; // PROBLEM: Sparse array
                                completedCount++;
                                
                                if (completedCount === transactionCount) {
                                    callback(null, {
                                        user: userData,
                                        account: accountData,
                                        transactions: processedTransactions.filter(Boolean)
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    });
}
// FIX: Use async/await, proper error handling, avoid deep nesting

// PROBLEM: Promise anti-patterns
function promiseAntiPatterns() {
    // PROBLEM: Promise constructor anti-pattern
    return new Promise(function(resolve, reject) {
        // PROBLEM: Wrapping already-async function in Promise constructor
        getUserData(123, function(err, data) {                  // PROBLEM: Callback inside Promise
            if (err) {
                reject(err);                                    // PROBLEM: Manual error handling
            } else {
                resolve(data);                                  // PROBLEM: Manual success handling
            }
        });
    }).then(function(userData) {
        // PROBLEM: Nested promises instead of chaining
        return new Promise(function(resolve, reject) {
            getAccountInfo(userData.accountId, function(err, accountData) {
                if (err) {
                    reject(err);
                } else {
                    // PROBLEM: Another nested promise
                    new Promise(function(innerResolve, innerReject) {
                        getTransactions(accountData.accountNumber, function(transErr, transactions) {
                            if (transErr) {
                                innerReject(transErr);
                            } else {
                                innerResolve({
                                    user: userData,
                                    account: accountData,
                                    transactions: transactions
                                });
                            }
                        });
                    }).then(function(result) {
                        resolve(result);                        // PROBLEM: Resolve outer promise with inner result
                    }).catch(function(innerErr) {
                        reject(innerErr);                       // PROBLEM: Reject outer promise with inner error
                    });
                }
            });
        });
    }).catch(function(error) {
        // PROBLEM: Catch and re-throw without adding value
        console.log('Promise error:', error);
        throw error;                                            // PROBLEM: Re-throw same error
    });
}
// FIX: Use proper promise chaining, avoid Promise constructor anti-pattern

// PROBLEM: Mixed callback and Promise patterns
function mixedCallbackPromisePatterns(userId, callback) {
    // PROBLEM: Function that takes callback but also returns Promise
    var promise = new Promise(function(resolve, reject) {
        callbackPyramidOfDoom(userId, function(err, data) {     // PROBLEM: Callback inside Promise
            if (err) {
                // PROBLEM: Both callback and reject
                if (callback) callback(err, null);             // PROBLEM: Call callback
                reject(err);                                    // PROBLEM: Also reject promise
            } else {
                // PROBLEM: Both callback and resolve
                if (callback) callback(null, data);            // PROBLEM: Call callback
                resolve(data);                                  // PROBLEM: Also resolve promise
            }
        });
    });
    
    // PROBLEM: Return promise even though function takes callback
    return promise;                                             // PROBLEM: Dual interface
}
// FIX: Choose either callbacks OR promises, not both

// PROBLEM: Event emitter abuse
function createChaosEventEmitter() {
    var EventEmitter = require('events').EventEmitter || function() { // PROBLEM: Fallback for browser
        this.events = {};
        this.on = function(event, listener) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(listener);
        };
        this.emit = function(event) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (this.events[event]) {
                this.events[event].forEach(function(listener) {
                    try {
                        listener.apply(this, args);
                    } catch (e) {
                        console.log('Event listener error:', e);
                    }
                });
            }
        };
        this.removeAllListeners = function() { this.events = {}; };
    };
    
    var emitter = new EventEmitter();
    
    // PROBLEM: Add listeners that create more events
    emitter.on('data', function(data) {
        globalAsyncState.pending.push(data);                    // PROBLEM: Modify global state
        
        // PROBLEM: Emit more events from event handler
        setTimeout(function() {
            emitter.emit('processed', data);                    // PROBLEM: Async event emission
        }, Math.random() * 100);                               // PROBLEM: Random delay
        
        // PROBLEM: Chain more events
        emitter.emit('data-received', data);                    // PROBLEM: Emit related event
    });
    
    emitter.on('processed', function(data) {
        globalAsyncState.completed.push(data);                  // PROBLEM: More global state
        
        // PROBLEM: Conditional event emission
        if (globalAsyncState.completed.length % 3 === 0) {
            emitter.emit('batch-complete', globalAsyncState.completed.slice(-3)); // PROBLEM: Emit batch event
        }
        
        // PROBLEM: Error-prone operation in event handler
        try {
            JSON.parse(data.toString());                        // PROBLEM: Might throw
            emitter.emit('valid-json', data);                   // PROBLEM: Emit success event
        } catch (e) {
            emitter.emit('invalid-json', data, e);              // PROBLEM: Emit error event
        }
    });
    
    emitter.on('error', function(error) {
        globalAsyncState.failed.push(error);                    // PROBLEM: Global error state
        
        // PROBLEM: Emit more events on error
        emitter.emit('error-logged', error);                    // PROBLEM: Chain error events
        
        // PROBLEM: Don't actually handle the error
        console.log('Emitter error:', error);                  // PROBLEM: Just log
    });
    
    // PROBLEM: Memory leak - listeners never removed
    globalEventEmitter = emitter;                               // PROBLEM: Global reference
    
    return emitter;
}
// FIX: Remove event listeners, avoid event chains, handle errors properly

// PROBLEM: Fake async functions for demonstration
function getUserData(userId, callback) {
    globalCallbackCount++;                                      // PROBLEM: Global state mutation
    setTimeout(function() {
        if (userId === 888) {                                   // PROBLEM: Magic number
            return callback(new Error('Evil user ID'), null);   // PROBLEM: Error for specific ID
        }
        callback(null, {
            id: userId,
            name: 'User ' + userId,
            accountId: userId * 100
        });
    }, Math.random() * 200);                                   // PROBLEM: Random delay
}

function getAccountInfo(accountId, callback) {
    globalCallbackCount++;
    setTimeout(function() {
        if (accountId > 50000) {                                // PROBLEM: Arbitrary limit
            return callback(new Error('Account ID too large'), null);
        }
        callback(null, {
            id: accountId,
            accountNumber: 'ACC' + accountId,
            balance: Math.random() * 10000
        });
    }, Math.random() * 150);
}

function getTransactions(accountNumber, callback) {
    globalCallbackCount++;
    setTimeout(function() {
        var transactionCount = Math.floor(Math.random() * 5) + 1; // PROBLEM: Random transaction count
        var transactions = [];
        
        for (var i = 0; i < transactionCount; i++) {
            transactions.push({
                id: 'TXN' + i,
                amount: Math.random() * 1000,
                type: Math.random() > 0.5 ? 'credit' : 'debit'
            });
        }
        
        callback(null, transactions);
    }, Math.random() * 100);
}

function enrichTransactionData(transaction, callback) {
    globalCallbackCount++;
    setTimeout(function() {
        // PROBLEM: Random failure
        if (Math.random() < 0.1) {                              // PROBLEM: 10% failure rate
            return callback(new Error('Enrichment service unavailable'), null);
        }
        
        transaction.enriched = true;
        transaction.timestamp = new Date().toISOString();
        callback(null, transaction);
    }, Math.random() * 50);
}

function validateTransaction(transaction, callback) {
    globalCallbackCount++;
    setTimeout(function() {
        // PROBLEM: Complex validation logic in async function
        var isValid = transaction.amount > 0 && 
                     transaction.type && 
                     transaction.id &&
                     Math.random() > 0.05;                      // PROBLEM: 5% random failure
        
        callback(null, isValid);
    }, Math.random() * 30);
}

function calculateTransactionFees(transaction, callback) {
    globalCallbackCount++;
    setTimeout(function() {
        // PROBLEM: Fee calculation might fail
        if (transaction.amount > 5000) {
            return callback(new Error('Amount too large for fee calculation'), null);
        }
        
        var fees = {
            processing: transaction.amount * 0.01,
            service: 2.50,
            total: (transaction.amount * 0.01) + 2.50
        };
        
        callback(null, fees);
    }, Math.random() * 40);
}

// PROBLEM: Main chaos function
function demonstrateChaos() {
    console.log('🌪️ JAVASCRIPT CALLBACK MADNESS STARTING - PREPARE FOR ASYNC CHAOS! 🌪️');
    
    // PROBLEM: Create chaos event emitter
    var emitter = createChaosEventEmitter();
    
    // PROBLEM: Demonstrate callback pyramid of confusion
    console.log('Starting callback pyramid of confusion...');
    callbackPyramidOfConfusion(123, function(err, result) {
        if (err) {
            console.log('Callback pyramid error:', err.message);
        } else {
            console.log('Callback pyramid success:', {
                user: result.user.name,
                account: result.account.accountNumber,
                transactionCount: result.transactions.length
            });
        }
        
        // PROBLEM: Chain more async operations in callback
        console.log('Starting promise anti-patterns...');
        promiseAntiPatterns().then(function(promiseResult) {
            console.log('Promise anti-pattern success:', {
                user: promiseResult.user.name,
                transactionCount: promiseResult.transactions.length
            });
            
            // PROBLEM: Mixed callback/promise patterns
            console.log('Starting mixed patterns...');
            mixedCallbackPromisePatterns(456, function(mixedErr, mixedResult) {
                if (mixedErr) {
                    console.log('Mixed pattern callback error:', mixedErr.message);
                } else {
                    console.log('Mixed pattern callback success:', mixedResult.user.name);
                }
            }).then(function(promiseMixedResult) {
                console.log('Mixed pattern promise success:', promiseMixedResult.user.name);
                
                // PROBLEM: Demonstrate event emitter chaos
                console.log('Starting event emitter chaos...');
                
                // PROBLEM: Emit events that trigger chains
                emitter.emit('data', { test: 'data1' });
                emitter.emit('data', { test: 'data2' });
                emitter.emit('data', { test: 'data3' });
                
                // PROBLEM: Demonstrate monkey patched methods
                console.log('Starting monkey patch chaos...');
                
                var testArray = ['item1', 'item2', 'item3'];
                testArray.asyncForEach(function(item, index, callback) {
                    console.log('Processing:', item);
                    setTimeout(function() {
                        // PROBLEM: Random errors in async forEach
                        if (Math.random() < 0.2) {
                            callback(new Error('Random async forEach error'));
                        } else {
                            callback();
                        }
                    }, Math.random() * 50);
                }, function() {
                    console.log('AsyncForEach complete');
                    
                    // PROBLEM: Use monkey patched string method
                    'Hello World'.asyncReplace('World', 'Chaos', function(err, result) {
                        if (err) {
                            console.log('Async replace error:', err.message);
                        } else {
                            console.log('Async replace result:', result);
                        }
                        
                        // PROBLEM: Final chaos report
                        setTimeout(function() {
                            console.log('🔥 JAVASCRIPT CALLBACK CHAOS COMPLETE! 🔥');
                            console.log('Global callback count:', globalCallbackCount);
                            console.log('Global async state:', {
                                pending: globalAsyncState.pending.length,
                                completed: globalAsyncState.completed.length,
                                failed: globalAsyncState.failed.length
                            });
                            
                            // PROBLEM: Don't clean up global state or event listeners
                            // This causes memory leaks
                        }, 1000);
                    });
                });
            }).catch(function(promiseMixedErr) {
                console.log('Mixed pattern promise error:', promiseMixedErr.message);
            });
        }).catch(function(promiseErr) {
            console.log('Promise anti-pattern error:', promiseErr.message);
        });
    });
}

// PROBLEM: Auto-execute chaos
demonstrateChaos();

// PROBLEM: Export for potential require() usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callbackPyramidOfConfusion: callbackPyramidOfConfusion,
        promiseAntiPatterns: promiseAntiPatterns,
        mixedCallbackPromisePatterns: mixedCallbackPromisePatterns,
        createChaosEventEmitter: createChaosEventEmitter,
        globalAsyncState: globalAsyncState                       // PROBLEM: Export global state
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT ASYNC ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Callback Pyramid of Doom**: Deep nesting of callbacks (callback hell)
// 2. **Promise Constructor Anti-pattern**: Wrapping callbacks in new Promise()
// 3. **Mixed Async Patterns**: Combining callbacks and promises in same function
// 4. **Event Emitter Abuse**: Creating event chains and not removing listeners
// 5. **Prototype Pollution**: Modifying built-in prototypes (Array, Promise, String)
// 6. **Global State Mutation**: Modifying global variables in async operations
// 7. **Error Swallowing**: Catching errors but not properly handling them
// 8. **Random Async Behavior**: Using Math.random() for delays and failures
// 9. **Memory Leaks**: Not cleaning up event listeners and global references
// 10. **Inconsistent Error Handling**: Different error handling patterns in same codebase

// WHY JAVASCRIPT ASYNC IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Single-threaded Event Loop**: Blocking operations freeze entire application
// - **Callback-based APIs**: Easy to create deeply nested callback structures
// - **Dynamic Typing**: Errors in async operations might not surface immediately
// - **Prototype Chain**: Easy to modify built-in objects globally
// - **Closure Scope**: Easy to accidentally capture variables in async callbacks
// - **Event-driven Nature**: Event emitters can create complex async chains
// - **Promise/Callback Mixing**: Multiple async patterns can be mixed confusingly
// - **Global Scope**: Easy to pollute global namespace with async state

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use async/await instead of deeply nested callbacks
// 2. Use proper promise chaining, avoid Promise constructor anti-pattern
// 3. Choose one async pattern: callbacks OR promises OR async/await
// 4. Remove event listeners, avoid event chains, use AbortController
// 5. Don't modify built-in prototypes, use utility functions or libraries
// 6. Use local state and proper scope management
// 7. Handle errors explicitly with try/catch or .catch()
// 8. Use deterministic async behavior, avoid random delays
// 9. Clean up resources, remove event listeners, clear timeouts
// 10. Use consistent error handling patterns throughout codebase

// Remember: JavaScript's async nature is powerful but requires discipline! 🌪️
