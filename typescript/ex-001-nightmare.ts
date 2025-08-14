// ex-001-any-type-chaos.ts
// INTENTIONALLY AWFUL: TypeScript type system destruction and Promise hell
// This file celebrates defeating TypeScript's type safety with maximum chaos
// WARNING: This code will make the TypeScript compiler cry and your IDE crash

// Any-type chaos - defeating the entire purpose of TypeScript
let globalChaos: any = "hello";                                    // could be anything
let moreChaos: any = 42;                                          // literally anything
let evenMoreChaos: any = { nested: { deep: { chaos: true } } };   // nested any madness

// Global namespace pollution
declare global {
    interface Window {
        CHAOS_MODE: any;
        globalFunction: (data: any) => any;
        LEAKED_DATA: any[];
    }
    
    interface Array<T> {
        chaosMethod(): any;                                        // pollute Array prototype
    }
    
    interface String {
        wtf: any;                                                  // pollute String prototype
    }
    
    var GLOBAL_ANY: any;                                          // global any variable
}

// Massive interface that violates interface segregation
interface MegaInterface {
    // User-related properties
    userId: any;
    userName: any;
    userEmail: any;
    userPreferences: any;
    userSettings: any;
    userProfile: any;
    userHistory: any;
    userPermissions: any;
    
    // Product-related properties
    productId: any;
    productName: any;
    productPrice: any;
    productCategory: any;
    productInventory: any;
    productReviews: any;
    productImages: any;
    productSpecs: any;
    
    // Order-related properties
    orderId: any;
    orderDate: any;
    orderStatus: any;
    orderItems: any;
    orderTotal: any;
    orderShipping: any;
    orderPayment: any;
    orderTracking: any;
    
    // Methods that do everything
    processEverything(data: any): any;
    handleAllEvents(event: any): any;
    validateAllData(input: any): any;
    transformAllData(source: any, target: any): any;
    executeAllOperations(operations: any[]): any;
}

// Type assertion madness - unsafe casting everywhere
function typeAssertionChaos(data: unknown): string {
    // Unsafe type assertions without proper checking
    const str = data as string;                                    // could be anything
    const num = data as number;                                    // unsafe cast
    const obj = data as { [key: string]: any };                   // object assumption
    const arr = data as any[];                                     // array assumption
    const func = data as Function;                                 // function assumption
    
    // Chain unsafe assertions
    const result = ((data as any).someProperty as any[]).map((item: any) => 
        (item as any).nestedProperty as string
    ).join(', ');
    
    // Return something that might not be a string
    return result as string;
}

// Promise hell - nested promises instead of async/await
function promiseHell(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Nested promise pyramid of doom
        fetch('/api/user')
            .then((response: any) => {
                return response.json();
            })
            .then((userData: any) => {
                return fetch(`/api/user/${userData.id}/orders`);
            })
            .then((ordersResponse: any) => {
                return ordersResponse.json();
            })
            .then((ordersData: any) => {
                return Promise.all(ordersData.map((order: any) => 
                    fetch(`/api/order/${order.id}/details`)
                        .then((detailResponse: any) => detailResponse.json())
                        .then((detailData: any) => {
                            return fetch(`/api/order/${order.id}/tracking`)
                                .then((trackingResponse: any) => trackingResponse.json())
                                .then((trackingData: any) => {
                                    return {
                                        ...order,
                                        details: detailData,
                                        tracking: trackingData
                                    };
                                })
                                .catch((error: any) => {
                                    console.log('Tracking error:', error);
                                    return { ...order, details: detailData, tracking: null };
                                });
                        })
                        .catch((error: any) => {
                            console.log('Details error:', error);
                            return { ...order, details: null, tracking: null };
                        });
                ));
            })
            .then((enrichedOrders: any) => {
                // More nested promises
                return Promise.all(enrichedOrders.map((order: any) =>
                    fetch(`/api/order/${order.id}/reviews`)
                        .then((reviewResponse: any) => reviewResponse.json())
                        .then((reviewData: any) => ({ ...order, reviews: reviewData }))
                        .catch((error: any) => ({ ...order, reviews: [] }))
                ));
            })
            .then((finalOrders: any) => {
                resolve(finalOrders);
            })
            .catch((error: any) => {
                // Swallow errors and return something random
                console.log('Promise hell error:', error);
                resolve({ error: 'Something went wrong', data: null });
            });
    });
}

// Callback and Promise mixing chaos
function callbackPromiseChaos(callback: (error: any, data: any) => void): Promise<any> {
    return new Promise((resolve, reject) => {
        // Mix callbacks with promises
        setTimeout(() => {
            fetch('/api/data')
                .then((response: any) => response.json())
                .then((data: any) => {
                    // Call callback AND resolve promise
                    callback(null, data);
                    resolve(data);
                })
                .catch((error: any) => {
                    // Call callback AND reject promise
                    callback(error, null);
                    reject(error);
                });
        }, Math.random() * 1000);
    });
}

// Class with any-type properties and methods
class ChaosClass implements MegaInterface {
    // All properties are any
    userId: any = Math.random();
    userName: any = "chaos";
    userEmail: any = { not: "an email" };
    userPreferences: any = [1, 2, 3];
    userSettings: any = "settings";
    userProfile: any = true;
    userHistory: any = null;
    userPermissions: any = undefined;
    
    productId: any = "not-a-number";
    productName: any = 42;
    productPrice: any = { currency: "USD", amount: "invalid" };
    productCategory: any = ["electronics", "books", "chaos"];
    productInventory: any = "out of stock";
    productReviews: any = { rating: "five stars" };
    productImages: any = "image.jpg";
    productSpecs: any = { weight: "heavy", color: 123 };
    
    orderId: any = { id: "not-a-string" };
    orderDate: any = "yesterday";
    orderStatus: any = 404;
    orderItems: any = "items";
    orderTotal: any = { total: "expensive" };
    orderShipping: any = true;
    orderPayment: any = ["credit", "card"];
    orderTracking: any = null;
    
    // Private properties that are actually public
    private secretData: any = "not so secret";
    
    constructor(data: any) {
        // Assign any data to any property
        Object.assign(this, data);
        
        // Type assertion chaos in constructor
        this.userId = (data as any).id || (Math.random() as any);
        this.userName = (data as any).name || (42 as any);
    }
    
    // Methods that accept and return any
    processEverything(data: any): any {
        // Process everything by doing nothing
        return { processed: data, random: Math.random(), chaos: true };
    }
    
    handleAllEvents(event: any): any {
        // Handle all events the same way
        console.log('Event:', event);
        return event;
    }
    
    validateAllData(input: any): any {
        // Validation that validates nothing
        return { valid: true, data: input, validated: false };
    }
    
    transformAllData(source: any, target: any): any {
        // Transform by mixing everything together
        return { ...source, ...target, transformed: true, chaos: Math.random() };
    }
    
    executeAllOperations(operations: any[]): any {
        // Execute operations by ignoring them
        return operations.map((op: any) => ({ operation: op, executed: false, error: "not implemented" }));
    }
    
    // Method that uses unsafe type assertions
    unsafeMethod(input: unknown): string {
        const result = ((input as any).data as any[])
            .map((item: any) => (item as any).value as string)
            .filter((value: any) => (value as any).length > 0)
            .join((', ' as any));
        
        return result as string;
    }
}

// Function overloading abuse
function overloadedChaos(data: any): any;
function overloadedChaos(data: any, options: any): any;
function overloadedChaos(data: any, options: any, callback: any): any;
function overloadedChaos(data: any, options?: any, callback?: any): any {
    // Implementation that ignores all the overload signatures
    if (typeof callback === 'function') {
        callback(null, { data, options, chaos: true });
    }
    
    return { 
        input: data, 
        options: options || {}, 
        hasCallback: typeof callback === 'function',
        result: 'chaos'
    };
}

// Generic abuse
function genericChaos<T extends any, U extends any, V extends any>(
    input: T, 
    transform: (data: T) => U, 
    validate: (data: U) => V
): any {
    // Ignore all generic constraints and return any
    const transformed = transform(input as any) as any;
    const validated = validate(transformed as any) as any;
    
    return {
        original: input,
        transformed,
        validated,
        chaos: true
    } as any;
}

// Namespace pollution
namespace GlobalChaos {
    export let data: any = {};
    export let config: any = {};
    export let state: any = {};
    
    export function initialize(options: any): any {
        data = options.data || {};
        config = options.config || {};
        state = options.state || {};
        
        // Pollute global scope
        (window as any).CHAOS_MODE = true;
        (window as any).globalFunction = (input: any) => input;
        (window as any).LEAKED_DATA = [];
        (global as any).GLOBAL_ANY = { chaos: true };
        
        return { initialized: true, chaos: true };
    }
    
    export function processData(input: any): any {
        // Process by mutating global state
        data = { ...data, ...input, processed: true };
        state.lastProcessed = Date.now();
        
        return data;
    }
}

// Module augmentation chaos
declare module "fs" {
    interface Stats {
        chaosProperty: any;
    }
}

declare module "http" {
    interface IncomingMessage {
        chaosData: any;
    }
}

// Async/await mixed with Promise hell
async function asyncChaos(): Promise<any> {
    try {
        // Mix async/await with .then()
        const result1 = await fetch('/api/data').then((response: any) => 
            response.json().then((data: any) => 
                fetch(`/api/process/${data.id}`).then((processResponse: any) =>
                    processResponse.json()
                )
            )
        );
        
        // More mixing
        const result2 = await new Promise((resolve: any) => {
            setTimeout(() => {
                fetch('/api/more-data')
                    .then((response: any) => response.json())
                    .then((data: any) => resolve(data))
                    .catch((error: any) => resolve({ error }));
            }, 100);
        });
        
        return { result1, result2, chaos: true };
    } catch (error: any) {
        // Catch everything as any
        return { error: error.message || error, chaos: true };
    }
}

// Main chaos function
async function main(): Promise<void> {
    console.log('🔷 TYPESCRIPT CHALLENGE STARTING - TYPE SAFETY PROBLEMS! 🔷');
    
    // Initialize global chaos
    GlobalChaos.initialize({
        data: { chaos: true },
        config: { mode: 'destruction' },
        state: { active: true }
    });
    
    // Create chaos instance
    const chaos = new ChaosClass({ 
        id: "not-a-number", 
        name: 42, 
        email: { invalid: true } 
    });
    
    // Type assertion chaos
    const assertionResult = typeAssertionChaos({ not: "a string" });
    console.log('Type assertion result:', assertionResult);
    
    // Promise hell
    const promiseResult = await promiseHell();
    console.log('Promise hell result:', promiseResult);
    
    // Callback/Promise mixing
    const mixedResult = await callbackPromiseChaos((error: any, data: any) => {
        console.log('Callback called:', { error, data });
    });
    console.log('Mixed result:', mixedResult);
    
    // Overloaded chaos
    const overloadResult = overloadedChaos(
        { data: "chaos" }, 
        { option: true }, 
        (err: any, result: any) => console.log('Overload callback:', { err, result })
    );
    console.log('Overload result:', overloadResult);
    
    // Generic chaos
    const genericResult = genericChaos(
        { input: "data" },
        (data: any) => ({ transformed: data }),
        (data: any) => ({ validated: data })
    );
    console.log('Generic result:', genericResult);
    
    // Async chaos
    const asyncResult = await asyncChaos();
    console.log('Async result:', asyncResult);
    
    // Final chaos report
    console.log('🔥 TYPESCRIPT CHAOS COMPLETE! 🔥');
    console.log('Global chaos data:', GlobalChaos.data);
    console.log('Chaos instance:', chaos);
    console.log('Window pollution:', (window as any).CHAOS_MODE);
}

// Auto-execute chaos
main().catch((error: any) => {
    console.error('Main chaos error:', error);
});

// Export chaos for modules
export {
    ChaosClass,
    typeAssertionChaos,
    promiseHell,
    callbackPromiseChaos,
    overloadedChaos,
    genericChaos,
    GlobalChaos,
    asyncChaos
};

// Default export as any
export default {
    chaos: true,
    data: globalChaos,
    class: ChaosClass,
    functions: {
        typeAssertionChaos,
        promiseHell,
        callbackPromiseChaos,
        overloadedChaos,
        genericChaos,
        asyncChaos
    }
} as any;
