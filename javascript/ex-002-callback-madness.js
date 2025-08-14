// ex-002-callback-madness.js
// INTENTIONALLY AWFUL: JavaScript callback pyramid of confusion and Promise anti-patterns
// This file demonstrates problematic async patterns in JavaScript
// WARNING: This code demonstrates confusing patterns that are hard to debug

// Global state for tracking callback chaos
var callbackCount = 0;
var promiseCount = 0;
var eventCount = 0;
var memoryLeaks = [];

// PROBLEM: Callback pyramid of confusion
function callbackPyramidOfConfusion(userId, callback) {
    console.log('Starting callback pyramid of confusion...');
    
    // Level 1: Get user data
    getUserData(userId, function(userError, userData) {
        if (userError) {
            callback(userError, null);
            return;
        }
        
        // Level 2: Get user preferences
        getUserPreferences(userData.id, function(prefError, preferences) {
            if (prefError) {
                callback(prefError, null);
                return;
            }
            
            // Level 3: Get user orders
            getUserOrders(userData.id, function(orderError, orders) {
                if (orderError) {
                    callback(orderError, null);
                    return;
                }
                
                // Level 4: Process each order
                var processedOrders = [];
                var ordersProcessed = 0;
                
                orders.forEach(function(order, index) {
                    getOrderDetails(order.id, function(detailError, details) {
                        if (detailError) {
                            callback(detailError, null);
                            return;
                        }
                        
                        // Level 5: Get shipping info
                        getShippingInfo(order.id, function(shippingError, shipping) {
                            if (shippingError) {
                                callback(shippingError, null);
                                return;
                            }
                            
                            // Level 6: Get payment info
                            getPaymentInfo(order.id, function(paymentError, payment) {
                                if (paymentError) {
                                    callback(paymentError, null);
                                    return;
                                }
                                
                                // Level 7: Calculate taxes
                                calculateTaxes(order, function(taxError, taxes) {
                                    if (taxError) {
                                        callback(taxError, null);
                                        return;
                                    }
                                    
                                    // Level 8: Apply discounts
                                    applyDiscounts(order, preferences, function(discountError, discounts) {
                                        if (discountError) {
                                            callback(discountError, null);
                                            return;
                                        }
                                        
                                        // Level 9: Generate invoice
                                        generateInvoice(order, taxes, discounts, function(invoiceError, invoice) {
                                            if (invoiceError) {
                                                callback(invoiceError, null);
                                                return;
                                            }
                                            
                                            // Level 10: Send notification
                                            sendNotification(userData.email, invoice, function(notifyError, result) {
                                                if (notifyError) {
                                                    callback(notifyError, null);
                                                    return;
                                                }
                                                
                                                // Finally, add to processed orders
                                                processedOrders[index] = {
                                                    order: order,
                                                    details: details,
                                                    shipping: shipping,
                                                    payment: payment,
                                                    taxes: taxes,
                                                    discounts: discounts,
                                                    invoice: invoice,
                                                    notification: result
                                                };
                                                
                                                ordersProcessed++;
                                                
                                                // Check if all orders are processed
                                                if (ordersProcessed === orders.length) {
                                                    callback(null, {
                                                        user: userData,
                                                        preferences: preferences,
                                                        orders: processedOrders
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Promise anti-patterns - mixing callbacks with promises
function promiseAntiPatterns() {
    console.log('💥 Starting Promise anti-patterns...');
    
    // Anti-pattern 1: Promise constructor anti-pattern
    function unnecessaryPromiseConstructor() {
        return new Promise(function(resolve, reject) {
            // Already have a promise, but wrapping it in another promise
            fetch('/api/data')
                .then(function(response) {
                    resolve(response.json()); // Should just return the promise
                })
                .catch(function(error) {
                    reject(error); // Unnecessary wrapping
                });
        });
    }
    
    // Anti-pattern 2: Mixing callbacks and promises
    function mixedCallbackPromise(callback) {
        return fetch('/api/user')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // Call callback AND return promise
                callback(null, data);
                return data;
            })
            .catch(function(error) {
                // Call callback AND reject promise
                callback(error, null);
                throw error;
            });
    }
    
    // Anti-pattern 3: Nested promises (promise hell)
    function promiseHell() {
        return fetch('/api/user')
            .then(function(response) {
                return response.json()
                    .then(function(userData) {
                        return fetch('/api/user/' + userData.id + '/orders')
                            .then(function(ordersResponse) {
                                return ordersResponse.json()
                                    .then(function(ordersData) {
                                        return Promise.all(ordersData.map(function(order) {
                                            return fetch('/api/order/' + order.id + '/details')
                                                .then(function(detailResponse) {
                                                    return detailResponse.json()
                                                        .then(function(detailData) {
                                                            return fetch('/api/order/' + order.id + '/tracking')
                                                                .then(function(trackingResponse) {
                                                                    return trackingResponse.json()
                                                                        .then(function(trackingData) {
                                                                            return {
                                                                                order: order,
                                                                                details: detailData,
                                                                                tracking: trackingData
                                                                            };
                                                                        });
                                                                });
                                                        });
                                                });
                                        }));
                                    });
                            });
                    });
            });
    }
    
    // Anti-pattern 4: Not returning promises in chains
    function brokenPromiseChain() {
        fetch('/api/data')
            .then(function(response) {
                // Not returning the promise - breaks the chain
                response.json().then(function(data) {
                    console.log('Data:', data);
                });
            })
            .then(function(result) {
                // result is undefined because previous then didn't return anything
                console.log('Result:', result);
            });
    }
    
    // Anti-pattern 5: Creating resolved/rejected promises unnecessarily
    function unnecessaryPromiseCreation(condition) {
        if (condition) {
            return Promise.resolve('success'); // Could just return 'success'
        } else {
            return Promise.reject(new Error('failure')); // Could just throw
        }
    }
    
    // Execute all anti-patterns
    unnecessaryPromiseConstructor();
    mixedCallbackPromise(function(err, data) {
        console.log('Mixed callback result:', err, data);
    });
    promiseHell();
    brokenPromiseChain();
    unnecessaryPromiseCreation(Math.random() > 0.5);
}

// Event emitter abuse - everything as events
function eventEmitterAbuse() {
    console.log('📡 Starting event emitter abuse...');
    
    // Create event emitter for everything
    var EventEmitter = require('events').EventEmitter || function() {
        this.events = {};
        this.on = function(event, callback) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(callback);
        };
        this.emit = function(event) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (this.events[event]) {
                this.events[event].forEach(function(callback) {
                    callback.apply(null, args);
                });
            }
        };
    };
    
    var chaosEmitter = new EventEmitter();
    
    // Use events for simple operations that don't need events
    function addNumbers(a, b) {
        chaosEmitter.emit('addition-started', a, b);
        
        setTimeout(function() {
            var result = a + b;
            chaosEmitter.emit('addition-progress', result * 0.5);
            
            setTimeout(function() {
                chaosEmitter.emit('addition-progress', result * 0.8);
                
                setTimeout(function() {
                    chaosEmitter.emit('addition-complete', result);
                }, 10);
            }, 10);
        }, 10);
    }
    
    // Event listeners that create more events
    chaosEmitter.on('addition-started', function(a, b) {
        console.log('Addition started:', a, b);
        chaosEmitter.emit('log-event', 'addition-started', { a: a, b: b });
    });
    
    chaosEmitter.on('addition-progress', function(progress) {
        console.log('Addition progress:', progress);
        chaosEmitter.emit('progress-update', progress);
        chaosEmitter.emit('log-event', 'addition-progress', { progress: progress });
    });
    
    chaosEmitter.on('addition-complete', function(result) {
        console.log('Addition complete:', result);
        chaosEmitter.emit('result-ready', result);
        chaosEmitter.emit('log-event', 'addition-complete', { result: result });
        chaosEmitter.emit('cleanup-needed', 'addition');
    });
    
    chaosEmitter.on('log-event', function(eventType, data) {
        console.log('Logging event:', eventType, data);
        chaosEmitter.emit('log-written', eventType);
    });
    
    chaosEmitter.on('cleanup-needed', function(operation) {
        console.log('Cleanup needed for:', operation);
        chaosEmitter.emit('cleanup-started', operation);
    });
    
    // Memory leak - never remove listeners
    for (var i = 0; i < 1000; i++) {
        chaosEmitter.on('memory-leak-event', function(data) {
            memoryLeaks.push(data);
        });
    }
    
    // Trigger the chaos
    addNumbers(5, 3);
    
    // Emit events that have no listeners
    chaosEmitter.emit('orphan-event', 'nobody listening');
    chaosEmitter.emit('another-orphan', { data: 'ignored' });
}

// Monkey patching built-ins at runtime
function monkeyPatchingChaos() {
    console.log('🐒 Starting monkey patching chaos...');
    
    // Patch Array prototype
    Array.prototype.chaosSort = function() {
        // Sort randomly instead of properly
        return this.sort(function() {
            return Math.random() - 0.5;
        });
    };
    
    Array.prototype.chaosMap = function(callback) {
        // Map but with side effects
        var result = [];
        for (var i = 0; i < this.length; i++) {
            // Modify original array while mapping
            if (Math.random() > 0.5) {
                this[i] = 'CHAOS_' + this[i];
            }
            result.push(callback(this[i], i, this));
        }
        return result;
    };
    
    // Patch String prototype
    String.prototype.chaosReplace = function(search, replace) {
        // Replace but also log to console
        console.log('Replacing', search, 'with', replace, 'in', this);
        return this.replace(search, replace);
    };
    
    String.prototype.chaosLength = function() {
        // Return random length instead of actual length
        return Math.floor(Math.random() * this.length) + 1;
    };
    
    // Patch Object prototype (very dangerous)
    Object.prototype.chaosClone = function() {
        // Clone but with random modifications
        var clone = {};
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                if (Math.random() > 0.7) {
                    clone['chaos_' + key] = this[key];
                } else {
                    clone[key] = this[key];
                }
            }
        }
        return clone;
    };
    
    // Patch Function prototype
    Function.prototype.chaosCall = function() {
        // Call function but with random delay
        var self = this;
        var args = arguments;
        
        setTimeout(function() {
            console.log('Chaos calling function after random delay');
            self.apply(null, args);
        }, Math.random() * 1000);
    };
    
    // Patch global functions
    var originalSetTimeout = setTimeout;
    setTimeout = function(callback, delay) {
        // Random delay instead of specified delay
        var randomDelay = Math.random() * delay * 2;
        console.log('Chaos setTimeout: changing delay from', delay, 'to', randomDelay);
        return originalSetTimeout(callback, randomDelay);
    };
    
    var originalConsoleLog = console.log;
    console.log = function() {
        // Add chaos prefix to all console.log calls
        var args = Array.prototype.slice.call(arguments);
        args.unshift('🎪 CHAOS:');
        originalConsoleLog.apply(console, args);
    };
    
    // Test the monkey patches
    var testArray = [1, 2, 3, 4, 5];
    console.log('Original array:', testArray);
    console.log('Chaos sorted:', testArray.chaosSort());
    console.log('Array after chaos sort:', testArray);
    
    var testString = "Hello World";
    console.log('Chaos replace:', testString.chaosReplace('World', 'Chaos'));
    console.log('Chaos length:', testString.chaosLength());
    
    var testObject = { name: 'test', value: 42 };
    console.log('Chaos clone:', testObject.chaosClone());
}

// Mock async functions for the callback pyramid
function getUserData(userId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { id: userId, name: 'User' + userId, email: 'user' + userId + '@example.com' });
    }, Math.random() * 100);
}

function getUserPreferences(userId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { theme: 'dark', notifications: true });
    }, Math.random() * 100);
}

function getUserOrders(userId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, [
            { id: 'order1', total: 100 },
            { id: 'order2', total: 200 }
        ]);
    }, Math.random() * 100);
}

function getOrderDetails(orderId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { items: ['item1', 'item2'], quantity: 2 });
    }, Math.random() * 100);
}

function getShippingInfo(orderId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { method: 'express', cost: 10 });
    }, Math.random() * 100);
}

function getPaymentInfo(orderId, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { method: 'credit_card', last4: '1234' });
    }, Math.random() * 100);
}

function calculateTaxes(order, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { amount: order.total * 0.1, rate: 0.1 });
    }, Math.random() * 100);
}

function applyDiscounts(order, preferences, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { amount: order.total * 0.05, code: 'CHAOS5' });
    }, Math.random() * 100);
}

function generateInvoice(order, taxes, discounts, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { 
            id: 'invoice_' + order.id, 
            total: order.total + taxes.amount - discounts.amount 
        });
    }, Math.random() * 100);
}

function sendNotification(email, invoice, callback) {
    callbackCount++;
    setTimeout(function() {
        callback(null, { sent: true, messageId: 'msg_' + Date.now() });
    }, Math.random() * 100);
}

// Main chaos orchestrator
function main() {
    console.log('🌪️ JAVASCRIPT CALLBACK MADNESS STARTING - PREPARE FOR ASYNC CHAOS! 🌪️');
    
    // PROBLEM: Demonstrate callback pyramid of confusion
    callbackPyramidOfConfusion(123, function(err, result) {
        if (err) {
            console.log('Callback pyramid error:', err.message);
        } else {
            console.log('Callback pyramid success:', {result});
        }
        
        console.log('Total callbacks executed:', callbackCount);
    });
    
    // Promise anti-patterns
    promiseAntiPatterns();
    
    // Event emitter abuse
    eventEmitterAbuse();
    
    // Monkey patching chaos
    monkeyPatchingChaos();
    
    // Final chaos report
    setTimeout(function() {
        console.log('🔥 JAVASCRIPT CALLBACK CHAOS COMPLETE! 🔥');
        console.log('Callbacks executed:', callbackCount);
        console.log('Promises created:', promiseCount);
        console.log('Events emitted:', eventCount);
        console.log('Memory leaks created:', memoryLeaks.length);
    }, 5000);
}

// Auto-execute chaos
main();

// Export chaos for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callbackPyramidOfConfusion: callbackPyramidOfConfusion,
        promiseAntiPatterns: promiseAntiPatterns,
        eventEmitterAbuse: eventEmitterAbuse,
        monkeyPatchingChaos: monkeyPatchingChaos
    };
}
