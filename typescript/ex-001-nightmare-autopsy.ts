// ex-001-any-type-chaos.ts AUTOPSY VERSION
// INTENTIONALLY AWFUL: TypeScript type system destruction and Promise hell
// This file celebrates defeating TypeScript's type safety with maximum chaos
// AUTOPSY: Same nightmare code with detailed explanations of TypeScript anti-patterns

// PROBLEM: Any-type chaos - defeating the entire purpose of TypeScript
let globalChaos: any = "hello";                                    // PROBLEM: Could be anything - no type checking
let moreChaos: any = 42;                                          // PROBLEM: Literally anything
let evenMoreChaos: any = { nested: { deep: { chaos: true } } };   // PROBLEM: Nested any madness
// FIX: Use specific types: string, number, proper interfaces

// PROBLEM: Global namespace pollution
declare global {
    interface Window {
        CHAOS_MODE: any;                                          // PROBLEM: Any type in global scope
        globalFunction: (data: any) => any;                      // PROBLEM: Function with any parameters
        LEAKED_DATA: any[];                                       // PROBLEM: Array of any
    }
    
    interface Array<T> {
        chaosMethod(): any;                                        // PROBLEM: Pollute Array prototype with any
    }
    
    interface String {
        wtf: any;                                                  // PROBLEM: Pollute String prototype with any
    }
    
    var GLOBAL_ANY: any;                                          // PROBLEM: Global any variable
}
// FIX: Avoid global namespace pollution, use modules and proper imports

// PROBLEM: Massive interface that violates interface segregation
interface MegaInterface {
    // PROBLEM: User-related properties mixed with everything else
    userId: any;                                                  // PROBLEM: Should be string or number
    userName: any;                                                // PROBLEM: Should be string
    userEmail: any;                                               // PROBLEM: Should be string
    userPreferences: any;                                         // PROBLEM: Should be specific interface
    userSettings: any;                                            // PROBLEM: Should be specific interface
    userProfile: any;                                             // PROBLEM: Should be specific interface
    userHistory: any;                                             // PROBLEM: Should be array of specific type
    userPermissions: any;                                         // PROBLEM: Should be enum or union type
    
    // PROBLEM: Product-related properties in same interface
    productId: any;                                               // PROBLEM: Should be string or number
    productName: any;                                             // PROBLEM: Should be string
    productPrice: any;                                            // PROBLEM: Should be number
    productCategory: any;                                         // PROBLEM: Should be enum or union type
    productInventory: any;                                        // PROBLEM: Should be number
    productReviews: any;                                          // PROBLEM: Should be array of review interface
    productImages: any;                                           // PROBLEM: Should be array of strings
    productSpecs: any;                                            // PROBLEM: Should be specific interface
    
    // PROBLEM: Order-related properties mixed in
    orderId: any;                                                 // PROBLEM: Should be string or number
    orderDate: any;                                               // PROBLEM: Should be Date
    orderStatus: any;                                             // PROBLEM: Should be enum
    orderItems: any;                                              // PROBLEM: Should be array of item interface
    orderTotal: any;                                              // PROBLEM: Should be number
    orderShipping: any;                                           // PROBLEM: Should be shipping interface
    orderPayment: any;                                            // PROBLEM: Should be payment interface
    orderTracking: any;                                           // PROBLEM: Should be tracking interface
    
    // PROBLEM: Methods that do everything
    processEverything(data: any): any;                            // PROBLEM: Any input, any output
    handleAllEvents(event: any): any;                             // PROBLEM: Should be specific event types
    validateAllData(input: any): any;                             // PROBLEM: Should return boolean or validation result
    transformAllData(source: any, target: any): any;             // PROBLEM: Should have specific transform types
    executeAllOperations(operations: any[]): any;                // PROBLEM: Should have specific operation types
}
// FIX: Split into smaller, focused interfaces (User, Product, Order), use specific types

// PROBLEM: Type assertion madness - unsafe casting everywhere
function typeAssertionChaos(data: unknown): string {
    // PROBLEM: Unsafe type assertions without proper checking
    const str = data as string;                                    // PROBLEM: Could be anything, no runtime check
    const num = data as number;                                    // PROBLEM: Unsafe cast, could be string
    const obj = data as { [key: string]: any };                   // PROBLEM: Object assumption with any values
    const arr = data as any[];                                     // PROBLEM: Array assumption with any elements
    const func = data as Function;                                 // PROBLEM: Function assumption, could be anything
    
    // PROBLEM: Chain unsafe assertions
    const result = ((data as any).someProperty as any[]).map((item: any) => 
        (item as any).nestedProperty as string                    // PROBLEM: Multiple unsafe casts in chain
    ).join(', ');
    
    // PROBLEM: Return something that might not be a string
    return result as string;                                       // PROBLEM: Final unsafe cast
}
// FIX: Use type guards, runtime validation, proper type checking

// PROBLEM: Promise hell - nested promises instead of async/await
function promiseHell(): Promise<any> {                            // PROBLEM: Returns Promise<any>
    return new Promise((resolve, reject) => {
        // PROBLEM: Nested promise pyramid of doom
        fetch('/api/user')
            .then((response: any) => {                            // PROBLEM: Response should be typed
                return response.json();
            })
            .then((userData: any) => {                            // PROBLEM: User data should be typed
                return fetch(`/api/user/${userData.id}/orders`);
            })
            .then((ordersResponse: any) => {                      // PROBLEM: Orders response should be typed
                return ordersResponse.json();
            })
            .then((ordersData: any) => {                          // PROBLEM: Orders data should be typed
                return Promise.all(ordersData.map((order: any) => // PROBLEM: Order should be typed
                    fetch(`/api/order/${order.id}/details`)
                        .then((detailResponse: any) => detailResponse.json())
                        .then((detailData: any) => {              // PROBLEM: Detail data should be typed
                            return fetch(`/api/order/${order.id}/tracking`)
                                .then((trackingResponse: any) => trackingResponse.json())
                                .then((trackingData: any) => {    // PROBLEM: Tracking data should be typed
                                    return {
                                        ...order,
                                        details: detailData,
                                        tracking: trackingData
                                    };
                                })
                                .catch((error: any) => {          // PROBLEM: Error should be typed
                                    console.log('Tracking error:', error);
                                    return { ...order, details: detailData, tracking: null };
                                });
                        })
                        .catch((error: any) => {                  // PROBLEM: Error should be typed
                            console.log('Details error:', error);
                            return { ...order, details: null, tracking: null };
                        });
                ));
            })
            .then((enrichedOrders: any) => {                      // PROBLEM: Enriched orders should be typed
                // PROBLEM: More nested promises
                return Promise.all(enrichedOrders.map((order: any) =>
                    fetch(`/api/order/${order.id}/reviews`)
                        .then((reviewResponse: any) => reviewResponse.json())
                        .then((reviewData: any) => ({ ...order, reviews: reviewData }))
                        .catch((error: any) => ({ ...order, reviews: [] }))
                ));
            })
            .then((finalOrders: any) => {                         // PROBLEM: Final orders should be typed
                resolve(finalOrders);
            })
            .catch((error: any) => {                              // PROBLEM: Error should be typed
                // PROBLEM: Swallow errors and return something random
                console.log('Promise hell error:', error);
                resolve({ error: 'Something went wrong', data: null });
            });
    });
}
// FIX: Use async/await, proper error handling, type interfaces for API responses

// PROBLEM: Callback and Promise mixing chaos
function callbackPromiseChaos(callback: (error: any, data: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        // PROBLEM: Mix callbacks with promises
        setTimeout(() => {
            fetch('/api/data')
                .then((response: any) => response.json())         // PROBLEM: Response should be typed
                .then((data: any) => {                            // PROBLEM: Data should be typed
                    // PROBLEM: Call callback AND resolve promise - dual completion
                    callback(null, data);                         // PROBLEM: Callback with any types
                    resolve(data);                                 // PROBLEM: Promise resolve with any
                })
                .catch((error: any) => {                          // PROBLEM: Error should be typed
                    // PROBLEM: Call callback AND reject promise - dual error handling
                    callback(error, null);
                    reject(error);
                });
        }, Math.random() * 1000);                                 // PROBLEM: Random delay makes behavior unpredictable
    });
}
// FIX: Choose either callbacks OR promises, not both; use proper types

// PROBLEM: Class with any-type properties and methods
class ChaosClass implements MegaInterface {
    // PROBLEM: All properties are any - defeats TypeScript's purpose
    userId: any = Math.random();                                  // PROBLEM: Should be string or number
    userName: any = "chaos";                                      // PROBLEM: Should be string
    userEmail: any = { not: "an email" };                        // PROBLEM: Should be string, but it's an object
    userPreferences: any = [1, 2, 3];                            // PROBLEM: Should be preferences interface
    userSettings: any = "settings";                              // PROBLEM: Should be settings interface
    userProfile: any = true;                                     // PROBLEM: Should be profile interface
    userHistory: any = null;                                     // PROBLEM: Should be history array
    userPermissions: any = undefined;                            // PROBLEM: Should be permissions enum
    
    productId: any = "not-a-number";                             // PROBLEM: Should be number but it's string
    productName: any = 42;                                       // PROBLEM: Should be string but it's number
    productPrice: any = { currency: "USD", amount: "invalid" };  // PROBLEM: Should be number but it's object
    productCategory: any = ["electronics", "books", "chaos"];    // PROBLEM: Should be enum but it's array
    productInventory: any = "out of stock";                     // PROBLEM: Should be number but it's string
    productReviews: any = { rating: "five stars" };             // PROBLEM: Should be array but it's object
    productImages: any = "image.jpg";                           // PROBLEM: Should be array but it's string
    productSpecs: any = { weight: "heavy", color: 123 };        // PROBLEM: Mixed types in specs
    
    orderId: any = { id: "not-a-string" };                      // PROBLEM: Should be string but it's object
    orderDate: any = "yesterday";                               // PROBLEM: Should be Date but it's string
    orderStatus: any = 404;                                     // PROBLEM: Should be enum but it's number
    orderItems: any = "items";                                  // PROBLEM: Should be array but it's string
    orderTotal: any = { total: "expensive" };                  // PROBLEM: Should be number but it's object
    orderShipping: any = true;                                  // PROBLEM: Should be interface but it's boolean
    orderPayment: any = ["credit", "card"];                    // PROBLEM: Should be interface but it's array
    orderTracking: any = null;                                  // PROBLEM: Should be interface but it's null
    
    // PROBLEM: Private properties that are actually public due to any
    private secretData: any = "not so secret";                  // PROBLEM: Any defeats privacy
    
    constructor(data: any) {                                     // PROBLEM: Constructor accepts any
        // PROBLEM: Assign any data to any property
        Object.assign(this, data);                               // PROBLEM: Bypasses type checking completely
        
        // PROBLEM: Type assertion chaos in constructor
        this.userId = (data as any).id || (Math.random() as any); // PROBLEM: Unsafe casts
        this.userName = (data as any).name || (42 as any);        // PROBLEM: Number as name
    }
    
    // PROBLEM: Methods that accept and return any
    processEverything(data: any): any {                          // PROBLEM: Any input, any output
        // PROBLEM: Process everything by doing nothing meaningful
        return { processed: data, random: Math.random(), chaos: true };
    }
    
    handleAllEvents(event: any): any {                           // PROBLEM: Should have specific event types
        // PROBLEM: Handle all events the same way
        console.log('Event:', event);
        return event;                                            // PROBLEM: Return input without processing
    }
    
    validateAllData(input: any): any {                           // PROBLEM: Should return boolean or validation result
        // PROBLEM: Validation that validates nothing
        return { valid: true, data: input, validated: false };   // PROBLEM: Contradictory validation result
    }
    
    transformAllData(source: any, target: any): any {            // PROBLEM: Should have specific transform types
        // PROBLEM: Transform by mixing everything together
        return { ...source, ...target, transformed: true, chaos: Math.random() };
    }
    
    executeAllOperations(operations: any[]): any {               // PROBLEM: Should have specific operation types
        // PROBLEM: Execute operations by ignoring them
        return operations.map((op: any) => ({ operation: op, executed: false, error: "not implemented" }));
    }
    
    // PROBLEM: Method that uses unsafe type assertions
    unsafeMethod(input: unknown): string {                       // PROBLEM: Claims to return string
        const result = ((input as any).data as any[])            // PROBLEM: Chain of unsafe assertions
            .map((item: any) => (item as any).value as string)   // PROBLEM: Assumes nested structure
            .filter((value: any) => (value as any).length > 0)   // PROBLEM: Assumes string but treats as any
            .join((', ' as any));                                // PROBLEM: Unnecessary cast of string literal
        
        return result as string;                                  // PROBLEM: Final unsafe cast
    }
}
// FIX: Use specific interfaces, proper types, validation, avoid Object.assign with any

// PROBLEM: Function overloading abuse
function overloadedChaos(data: any): any;                       // PROBLEM: All overloads use any
function overloadedChaos(data: any, options: any): any;         // PROBLEM: Options should be typed
function overloadedChaos(data: any, options: any, callback: any): any; // PROBLEM: Callback should be typed
function overloadedChaos(data: any, options?: any, callback?: any): any {
    // PROBLEM: Implementation that ignores all the overload signatures
    if (typeof callback === 'function') {
        callback(null, { data, options, chaos: true });         // PROBLEM: Callback with any parameters
    }
    
    return { 
        input: data, 
        options: options || {}, 
        hasCallback: typeof callback === 'function',
        result: 'chaos'
    };                                                           // PROBLEM: Return type doesn't match overloads
}
// FIX: Use proper types in overloads, ensure implementation matches signatures

// PROBLEM: Generic abuse
function genericChaos<T extends any, U extends any, V extends any>( // PROBLEM: Extends any defeats generics
    input: T, 
    transform: (data: T) => U, 
    validate: (data: U) => V
): any {                                                         // PROBLEM: Returns any despite generics
    // PROBLEM: Ignore all generic constraints and return any
    const transformed = transform(input as any) as any;          // PROBLEM: Cast to any defeats generics
    const validated = validate(transformed as any) as any;       // PROBLEM: More any casting
    
    return {
        original: input,
        transformed,
        validated,
        chaos: true
    } as any;                                                    // PROBLEM: Final any cast
}
// FIX: Use meaningful generic constraints, return proper generic types

// PROBLEM: Namespace pollution
namespace GlobalChaos {
    export let data: any = {};                                   // PROBLEM: Any type in namespace
    export let config: any = {};                                 // PROBLEM: Should be typed config
    export let state: any = {};                                  // PROBLEM: Should be typed state
    
    export function initialize(options: any): any {              // PROBLEM: Any parameters and return
        data = options.data || {};                               // PROBLEM: No validation
        config = options.config || {};                           // PROBLEM: No type checking
        state = options.state || {};                             // PROBLEM: Could be anything
        
        // PROBLEM: Pollute global scope
        (window as any).CHAOS_MODE = true;                       // PROBLEM: Global pollution
        (window as any).globalFunction = (input: any) => input;  // PROBLEM: Global function with any
        (window as any).LEAKED_DATA = [];                        // PROBLEM: Global array
        (global as any).GLOBAL_ANY = { chaos: true };           // PROBLEM: Node.js global pollution
        
        return { initialized: true, chaos: true };
    }
    
    export function processData(input: any): any {               // PROBLEM: Any input and output
        // PROBLEM: Process by mutating global state
        data = { ...data, ...input, processed: true };           // PROBLEM: Uncontrolled mutation
        state.lastProcessed = Date.now();                        // PROBLEM: Side effects
        
        return data;                                             // PROBLEM: Return mutated global
    }
}
// FIX: Use proper module system, avoid global pollution, use specific types

// PROBLEM: Async/await mixed with Promise hell
async function asyncChaos(): Promise<any> {                      // PROBLEM: Returns Promise<any>
    try {
        // PROBLEM: Mix async/await with .then()
        const result1 = await fetch('/api/data').then((response: any) => // PROBLEM: Mixed patterns
            response.json().then((data: any) =>                 // PROBLEM: Nested .then() in await
                fetch(`/api/process/${data.id}`).then((processResponse: any) =>
                    processResponse.json()                       // PROBLEM: Deep nesting with await
                )
            )
        );
        
        // PROBLEM: More mixing
        const result2 = await new Promise((resolve: any) => {    // PROBLEM: Resolve parameter as any
            setTimeout(() => {
                fetch('/api/more-data')
                    .then((response: any) => response.json())    // PROBLEM: .then() inside Promise constructor
                    .then((data: any) => resolve(data))          // PROBLEM: Data as any
                    .catch((error: any) => resolve({ error }));  // PROBLEM: Error as any
            }, 100);
        });
        
        return { result1, result2, chaos: true };                // PROBLEM: Return object with any properties
    } catch (error: any) {                                       // PROBLEM: Catch any instead of Error
        // PROBLEM: Catch everything as any
        return { error: error.message || error, chaos: true };   // PROBLEM: Return any
    }
}
// FIX: Use consistent async/await, proper error types, typed responses

// PROBLEM: Main chaos function
async function main(): Promise<void> {
    console.log('🔷 TYPESCRIPT CHALLENGE STARTING - TYPE SAFETY PROBLEMS! 🔷');
    
    // PROBLEM: Initialize global chaos
    GlobalChaos.initialize({
        data: { chaos: true },
        config: { mode: 'destruction' },
        state: { active: true }
    });
    
    // PROBLEM: Create chaos instance
    const chaos = new ChaosClass({ 
        id: "not-a-number", 
        name: 42, 
        email: { invalid: true } 
    });
    
    // PROBLEM: Type assertion chaos
    const assertionResult = typeAssertionChaos({ not: "a string" });
    console.log('Type assertion result:', assertionResult);
    
    // PROBLEM: Promise hell
    const promiseResult = await promiseHell();
    console.log('Promise hell result:', promiseResult);
    
    // PROBLEM: Callback/Promise mixing
    const mixedResult = await callbackPromiseChaos((error: any, data: any) => {
        console.log('Callback called:', { error, data });
    });
    console.log('Mixed result:', mixedResult);
    
    // PROBLEM: Overloaded chaos
    const overloadResult = overloadedChaos(
        { data: "chaos" }, 
        { option: true }, 
        (err: any, result: any) => console.log('Overload callback:', { err, result })
    );
    console.log('Overload result:', overloadResult);
    
    // PROBLEM: Generic chaos
    const genericResult = genericChaos(
        { input: "data" },
        (data: any) => ({ transformed: data }),
        (data: any) => ({ validated: data })
    );
    console.log('Generic result:', genericResult);
    
    // PROBLEM: Async chaos
    const asyncResult = await asyncChaos();
    console.log('Async result:', asyncResult);
    
    // PROBLEM: Final chaos report
    console.log('🔥 TYPESCRIPT CHAOS COMPLETE! 🔥');
    console.log('Global chaos data:', GlobalChaos.data);
    console.log('Chaos instance:', chaos);
    console.log('Window pollution:', (window as any).CHAOS_MODE);
}

// PROBLEM: Auto-execute chaos
main().catch((error: any) => {                                   // PROBLEM: Error as any
    console.error('Main chaos error:', error);
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPESCRIPT ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Any Type Abuse**: Using 'any' everywhere defeats TypeScript's purpose
// 2. **Unsafe Type Assertions**: Casting without runtime checks
// 3. **Interface Segregation Violation**: Massive interfaces doing everything
// 4. **Promise Hell**: Nested promises instead of async/await
// 5. **Mixed Async Patterns**: Combining callbacks, promises, and async/await
// 6. **Global Namespace Pollution**: Modifying global scope and built-ins
// 7. **Generic Constraints Abuse**: Using 'any' in generic constraints
// 8. **Function Overload Misuse**: Overloads that don't match implementation
// 9. **Error Type Ignorance**: Catching and handling errors as 'any'
// 10. **Type Safety Bypass**: Using Object.assign and reflection to bypass types

// WHY TYPESCRIPT IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Any Escape Hatch**: 'any' type completely disables type checking
// - **Type Assertion Power**: Can cast anything to anything without validation
// - **Gradual Typing**: Easy to mix typed and untyped code incorrectly
// - **Complex Type System**: Advanced features can be misused
// - **JavaScript Compatibility**: Must support all JavaScript patterns
// - **Runtime vs Compile-time**: Types disappear at runtime, no runtime validation
// - **False Security**: Developers assume type safety when using 'any'

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Avoid 'any' type, use specific types, unions, or 'unknown' with type guards
// 2. Use type guards and runtime validation for type assertions
// 3. Split large interfaces into smaller, focused ones (Interface Segregation)
// 4. Use async/await consistently, avoid mixing with .then()
// 5. Choose one async pattern: callbacks OR promises OR async/await
// 6. Use modules instead of global namespace pollution
// 7. Use meaningful generic constraints, not 'extends any'
// 8. Ensure function overloads match implementation signatures
// 9. Use proper Error types and error handling
// 10. Enable strict TypeScript settings: strict: true, noImplicitAny: true

// Remember: TypeScript's power comes from its type system - don't defeat it! 🔷
