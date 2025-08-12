// ex-001-borrow-checker-destroyer.rs AUTOPSY VERSION
// BOMBASTIC Rust nightmare with detailed explanations of safety violations
// WARNING: This code violates every Rust safety principle known to humanity

#![allow(unused_variables, dead_code, unused_imports, unused_mut)]  // PROBLEM: Suppress ALL warnings
#![allow(clippy::all)]                                              // PROBLEM: Silence all lints
// FIX: Address warnings individually, don't blanket suppress

use std::collections::*;                                            // PROBLEM: Wildcard imports
use std::sync::*;                                                   // PROBLEM: Hide specific imports
use std::thread::*;                                                 // PROBLEM: Thread wildcard abuse
use std::mem::*;                                                    // PROBLEM: Memory wildcards - dangerous!
use std::ptr::*;                                                    // PROBLEM: Raw pointer wildcards
// FIX: Use specific imports: use std::collections::HashMap;

// PROBLEM: Global mutable state - the ultimate Rust sin!
static mut GLOBAL_CHAOS: i32 = 0;                                  // PROBLEM: Mutable static - race conditions
static mut GLOBAL_VEC: Vec<String> = Vec::new();                   // PROBLEM: Mutable collection - data races
static mut THREAD_COUNTER: usize = 0;                              // PROBLEM: Racy counter
static mut MEMORY_LEAK_COUNTER: usize = 0;                         // PROBLEM: Leak tracking via globals
// FIX: Use Arc<Mutex<T>>, AtomicI32, or thread-local storage

// PROBLEM: Struct with excessive lifetime parameters
#[derive(Debug)]
struct LifetimeNightmare<'a, 'b, 'c> {                             // PROBLEM: Three lifetimes when fewer work
    data: &'a str,                                                  // PROBLEM: Borrowed string
    more_data: &'b mut String,                                      // PROBLEM: Mutable reference
    optional: Option<&'c Vec<i32>>,                                 // PROBLEM: Optional reference
    raw_ptr: *mut i32,                                              // PROBLEM: Raw pointer - no safety!
    leaked_box: Box<String>,                                        // PROBLEM: Will be leaked
}

impl<'a, 'b, 'c> LifetimeNightmare<'a, 'b, 'c> {
    fn new(s: &'a str, ms: &'b mut String, ov: Option<&'c Vec<i32>>) -> Self {
        let leaked = Box::new(String::from("LEAKED"));             // PROBLEM: Create box to leak
        let raw = Box::into_raw(Box::new(42));                     // PROBLEM: Convert to raw pointer - leak!
        unsafe { MEMORY_LEAK_COUNTER += 1; }                       // PROBLEM: Unsafe global mutation
        
        LifetimeNightmare {
            data: s, more_data: ms, optional: ov,
            raw_ptr: raw, leaked_box: leaked,
        }
    }
    
    fn chaos(&mut self) -> &str {
        self.more_data.push_str(" MUTATED");                       // PROBLEM: Mutate borrowed data
        unsafe {
            GLOBAL_CHAOS += 1;                                     // PROBLEM: Race condition
            *self.raw_ptr = 666;                                   // PROBLEM: Dereference raw pointer
        }
        forget(take(&mut self.leaked_box));                        // PROBLEM: Intentional memory leak!
        self.data
    }
}

// PROBLEM: Async function with global state mutations
async fn async_nightmare<'a>(data: &'a str) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let mut handles = vec![];
    
    for i in 0..10 {
        let data_clone = data.to_string();
        let handle = spawn(async move {
            unsafe {                                                // PROBLEM: Unsafe in async
                THREAD_COUNTER += 1;                               // PROBLEM: Race condition
                GLOBAL_VEC.push(format!("Task {}: {}", i, data_clone));
            }
            sleep(std::time::Duration::from_millis(1)).await;
            i * 2
        });
        handles.push(handle);
    }
    
    let mut results = vec![];
    for handle in handles {
        match handle.await {
            Ok(result) => results.push(result),
            Err(_) => results.push(-1),                            // PROBLEM: Error becomes -1
        }
    }
    
    Ok(format!("Results: {:?}", results))
}

// PROBLEM: Macro generating unsafe code
macro_rules! generate_chaos {
    ($name:ident, $type:ty, $value:expr) => {
        fn $name() -> $type {
            let mut data = $value;
            let ptr = &mut data as *mut $type;                     // PROBLEM: Raw pointer conversion
            unsafe {
                *ptr = $value;                                      // PROBLEM: Write to raw pointer
                forget(data);                                       // PROBLEM: Memory leak
                MEMORY_LEAK_COUNTER += 1;
                *ptr                                                // PROBLEM: Use after forget
            }
        }
    };
}

generate_chaos!(chaos_i32, i32, 42);
generate_chaos!(chaos_string, String, String::from("CHAOS"));

// PROBLEM: Thread disaster with shared mutable state
fn thread_disaster() {
    let shared_data = Arc::new(Mutex::new(vec![1, 2, 3, 4, 5]));
    let mut handles = vec![];
    
    for thread_id in 0..5 {
        let data_clone = Arc::clone(&shared_data);
        let handle = spawn(move || {
            for iteration in 0..1000 {
                {
                    let mut guard = data_clone.lock().unwrap();    // PROBLEM: Unwrap on lock
                    guard.push(thread_id * 1000 + iteration);
                    if iteration % 100 == 0 {
                        guard.sort();                               // PROBLEM: Sort while holding lock
                    }
                }
                
                unsafe {                                            // PROBLEM: Unsafe outside lock
                    GLOBAL_CHAOS += 1;                             // PROBLEM: Race condition
                    THREAD_COUNTER += 1;
                }
                
                for _ in 0..1000 { /* busy wait */ }               // PROBLEM: Busy wait
            }
        });
        handles.push(handle);
    }
    
    forget(handles);                                                // PROBLEM: Forget thread handles!
}

// PROBLEM: Unsafe pointer arithmetic with undefined behavior
unsafe fn pointer_chaos() {
    let mut data = vec![1, 2, 3, 4, 5];
    let ptr = data.as_mut_ptr();
    
    for i in 0..20 {                                               // PROBLEM: Iterate beyond bounds
        let offset_ptr = ptr.add(i);
        if i < data.len() {
            *offset_ptr = i as i32 * 2;
        } else {
            *offset_ptr = 999;                                      // PROBLEM: Out-of-bounds write - UB!
        }
    }
    
    let leaked_ptr = Box::into_raw(Box::new(data));                // PROBLEM: Leak as pointer
    MEMORY_LEAK_COUNTER += 1;
    let value = *leaked_ptr.add(0);                                // PROBLEM: Use leaked pointer
    GLOBAL_CHAOS += value.len() as i32;
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    println!("🦀 RUST NIGHTMARE - MAXIMUM CHAOS! 🦀");
    
    // Initialize global chaos
    unsafe {
        GLOBAL_MAP = Some(HashMap::new());
        GLOBAL_VEC = Vec::with_capacity(1000);
    }
    
    // Lifetime nightmare
    let static_str = "STATIC";
    let mut mutable_string = String::from("MUTABLE");
    let vec_data = vec![1, 2, 3];
    
    let mut nightmare = LifetimeNightmare::new(static_str, &mut mutable_string, Some(&vec_data));
    let result = nightmare.chaos();
    println!("Chaos result: {}", result);
    
    // Async chaos
    let async_result = async_nightmare("ASYNC").await?;
    println!("Async: {}", async_result);
    
    // Macro chaos
    let i32_chaos = chaos_i32();
    let string_chaos = chaos_string();
    println!("Macro chaos: {}, {}", i32_chaos, string_chaos);
    
    // Thread disaster
    thread_disaster();
    
    // Unsafe chaos
    unsafe { pointer_chaos(); }
    
    // Final report
    unsafe {
        println!("🔥 CHAOS COMPLETE! 🔥");
        println!("Global chaos: {}", GLOBAL_CHAOS);
        println!("Threads: {}", THREAD_COUNTER);
        println!("Memory leaks: {}", MEMORY_LEAK_COUNTER);
        println!("Global vec: {}", GLOBAL_VEC.len());
    }
    
    std::process::exit(0);                                          // PROBLEM: Force exit without cleanup
}

// ─────────────────────────────────────────────────────────────────────────────
// RUST ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Global Mutable State**: static mut variables causing data races
// 2. **Memory Leaks**: Box::leak(), std::mem::forget() abuse
// 3. **Raw Pointer Abuse**: Unsafe pointer arithmetic, use-after-free
// 4. **Lifetime Violations**: Complex lifetime parameters, dangling references
// 5. **Thread Safety Violations**: Unsynchronized access to shared data
// 6. **Unsafe Block Abuse**: Unnecessary unsafe code, UB-prone operations
// 7. **Resource Management**: Forgetting thread handles, file handles
// 8. **Macro Madness**: Generating unsafe code via macros
// 9. **Error Handling**: Unwrap() abuse, ignoring Result types
// 10. **Async Chaos**: Unsafe code in async contexts, poor task management

// WHY THIS VIOLATES RUST'S PRINCIPLES:
// ─────────────────────────────────────────────────────────────────────────────
// - **Memory Safety**: Raw pointers, use-after-free, buffer overflows
// - **Thread Safety**: Data races, unsynchronized global access
// - **Zero-Cost Abstractions**: Unnecessary allocations and clones
// - **Ownership**: Violating borrow checker with unsafe code
// - **RAII**: Resource leaks, manual memory management

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use Arc<Mutex<T>> or AtomicT for shared state
// 2. Proper RAII with Drop trait implementation
// 3. Avoid raw pointers, use references and smart pointers
// 4. Minimize lifetime parameters, prefer owned data
// 5. Use thread pools and proper synchronization
// 6. Minimize unsafe code, document safety invariants
// 7. Join threads, close files with RAII
// 8. Use functions instead of macros for code generation
// 9. Handle errors with ? operator and proper Result types
// 10. Use structured concurrency patterns

// Remember: Rust's safety guarantees only work when you don't fight the borrow checker! 🦀
