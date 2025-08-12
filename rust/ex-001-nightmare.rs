// ex-001-borrow-checker-destroyer.rs
// INTENTIONALLY AWFUL: Maximum Rust chaos - fighting the borrow checker and LOSING
// This file is a BOMBASTIC celebration of every Rust anti-pattern known to humanity
// WARNING: This code will make rustc cry, your IDE crash, and your soul weep

#![allow(unused_variables, dead_code, unused_imports, unused_mut)]  // suppress ALL warnings
#![allow(clippy::all)]                                              // silence clippy completely

use std::collections::*;                                            // wildcard import chaos
use std::sync::*;                                                   // more wildcards
use std::thread::*;                                                 // thread wildcard abuse
use std::fs::*;                                                     // filesystem wildcards
use std::io::*;                                                     // IO wildcards
use std::mem::*;                                                    // memory wildcards
use std::ptr::*;                                                    // raw pointer wildcards
use std::slice::*;                                                  // slice wildcards
use std::str::*;                                                    // string wildcards

// Global mutable state (the Rust sin of sins)
static mut GLOBAL_CHAOS: i32 = 0;                                  // mutable static
static mut GLOBAL_VEC: Vec<String> = Vec::new();                   // mutable static collection
static mut GLOBAL_MAP: Option<HashMap<String, i32>> = None;        // optional mutable static
static mut THREAD_COUNTER: usize = 0;                              // racy counter
static mut MEMORY_LEAK_COUNTER: usize = 0;                         // leak tracking

// Struct with lifetime chaos
#[derive(Debug)]
struct LifetimeNightmare<'a, 'b, 'c> {
    data: &'a str,                                                  // lifetime 'a
    more_data: &'b mut String,                                      // mutable ref lifetime 'b
    optional: Option<&'c Vec<i32>>,                                 // optional ref lifetime 'c
    raw_ptr: *mut i32,                                              // raw pointer (no lifetime)
    leaked_box: Box<String>,                                        // will be leaked
}

impl<'a, 'b, 'c> LifetimeNightmare<'a, 'b, 'c> {
    fn new(s: &'a str, ms: &'b mut String, ov: Option<&'c Vec<i32>>) -> Self {
        let leaked = Box::new(String::from("LEAKED MEMORY"));      // create box
        let raw = Box::into_raw(Box::new(42));                     // leak box as raw pointer
        unsafe { MEMORY_LEAK_COUNTER += 1; }                       // unsafe global mutation
        
        LifetimeNightmare {
            data: s,
            more_data: ms,
            optional: ov,
            raw_ptr: raw,                                           // store leaked pointer
            leaked_box: leaked,                                     // this will be forgotten
        }
    }
    
    fn chaos(&mut self) -> &str {
        self.more_data.push_str(" MUTATED");                       // mutate borrowed data
        unsafe {                                                    // unsafe block party
            GLOBAL_CHAOS += 1;                                     // global mutation
            *self.raw_ptr = 666;                                   // dereference raw pointer
        }
        forget(take(&mut self.leaked_box));                        // MEMORY LEAK!
        self.data                                                   // return borrowed data
    }
}

// Trait with associated types for maximum confusion
trait ChaosGenerator<T> {
    type Output;
    type Error;
    
    fn generate_chaos(&self, input: T) -> Result<Self::Output, Self::Error>;
    fn destroy_everything(&mut self);
}

// Implementation with type parameter madness
impl<T: Clone + Send + Sync + 'static> ChaosGenerator<T> for Vec<T> {
    type Output = Box<dyn Iterator<Item = T>>;                      // boxed trait object
    type Error = String;                                            // String as error type
    
    fn generate_chaos(&self, input: T) -> Result<Self::Output, Self::Error> {
        let mut cloned = self.clone();                              // unnecessary clone
        cloned.push(input);                                         // mutate clone
        let leaked = Box::leak(Box::new(cloned));                  // LEAK THE CLONE!
        unsafe { MEMORY_LEAK_COUNTER += 1; }                       // count the leak
        Ok(Box::new(leaked.iter().cloned()))                       // return boxed iterator
    }
    
    fn destroy_everything(&mut self) {
        while let Some(item) = self.pop() {                        // drain the vector
            forget(item);                                           // forget each item
        }
        self.shrink_to_fit();                                      // shrink empty vec
    }
}

// Async chaos with lifetime disasters
async fn async_nightmare<'a>(data: &'a str) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let mut handles = vec![];                                       // thread handle collection
    
    for i in 0..10 {                                               // spawn 10 tasks
        let data_clone = data.to_string();                         // clone string data
        let handle = spawn(async move {                             // spawn async task
            unsafe {                                                // unsafe in async
                THREAD_COUNTER += 1;                               // racy increment
                GLOBAL_VEC.push(format!("Task {}: {}", i, data_clone)); // global mutation
            }
            sleep(std::time::Duration::from_millis(1)).await;      // async sleep
            i * 2                                                   // return doubled value
        });
        handles.push(handle);                                       // collect handles
    }
    
    let mut results = vec![];                                       // result collection
    for handle in handles {                                         // await all handles
        match handle.await {                                        // await each
            Ok(result) => results.push(result),                    // collect success
            Err(_) => results.push(-1),                            // error becomes -1
        }
    }
    
    Ok(format!("Results: {:?}", results))                          // return formatted results
}

// Macro madness for code generation chaos
macro_rules! generate_chaos {
    ($name:ident, $type:ty, $value:expr) => {
        fn $name() -> $type {
            let mut data = $value;                                  // create mutable data
            let ptr = &mut data as *mut $type;                     // get raw pointer
            unsafe {                                                // unsafe dereference
                *ptr = $value;                                      // write to pointer
                forget(data);                                       // forget the data
                MEMORY_LEAK_COUNTER += 1;                          // count leak
                *ptr                                                // return dereferenced value
            }
        }
    };
    ($name:ident, $type:ty) => {
        generate_chaos!($name, $type, Default::default());         // recursive macro call
    };
}

// Generate chaos functions with macro
generate_chaos!(chaos_i32, i32, 42);
generate_chaos!(chaos_string, String, String::from("CHAOS"));
generate_chaos!(chaos_vec, Vec<i32>, vec![1, 2, 3, 4, 5]);

// Thread chaos with shared mutable state
fn thread_disaster() {
    let shared_data = Arc::new(Mutex::new(vec![1, 2, 3, 4, 5]));   // shared vector
    let mut handles = vec![];                                       // thread handles
    
    for thread_id in 0..5 {                                        // spawn 5 threads
        let data_clone = Arc::clone(&shared_data);                 // clone Arc
        let handle = spawn(move || {                                // spawn thread
            for iteration in 0..1000 {                             // 1000 iterations
                {
                    let mut guard = data_clone.lock().unwrap();    // lock mutex
                    guard.push(thread_id * 1000 + iteration);      // push data
                    if iteration % 100 == 0 {                      // every 100 iterations
                        guard.sort();                               // sort while holding lock
                    }
                } // lock released here
                
                unsafe {                                            // unsafe global access
                    GLOBAL_CHAOS += 1;                             // increment global
                    THREAD_COUNTER += 1;                           // increment counter
                }
                
                // Simulate work without yielding
                for _ in 0..1000 { /* busy wait */ }               // busy wait loop
            }
        });
        handles.push(handle);                                       // collect handle
    }
    
    // Don't join threads - let them run wild!
    forget(handles);                                                // FORGET ALL HANDLES!
}

// File system chaos with resource leaks
fn filesystem_disaster() -> Result<(), Box<dyn std::error::Error>> {
    let mut files = vec![];                                         // file handle collection
    
    for i in 0..100 {                                              // create 100 files
        let filename = format!("/tmp/chaos_{}.txt", i);            // generate filename
        let mut file = File::create(&filename)?;                   // create file
        
        writeln!(file, "Chaos file number: {}", i)?;               // write to file
        writeln!(file, "Random data: {}", rand::random::<u64>())?; // more data
        
        files.push(file);                                           // collect file handle
        
        if i % 10 == 0 {                                            // every 10 files
            let leaked_file = Box::new(File::create(format!("/tmp/leaked_{}.txt", i))?);
            Box::leak(leaked_file);                                 // LEAK FILE HANDLE!
            unsafe { MEMORY_LEAK_COUNTER += 1; }                   // count leak
        }
    }
    
    // Don't close files - let OS handle cleanup!
    forget(files);                                                  // FORGET ALL FILES!
    Ok(())
}

// Unsafe pointer arithmetic chaos
unsafe fn pointer_chaos() {
    let mut data = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];          // create vector
    let ptr = data.as_mut_ptr();                                   // get mutable pointer
    
    for i in 0..20 {                                               // iterate beyond bounds
        let offset_ptr = ptr.add(i);                               // add offset (may be OOB)
        if i < data.len() {                                         // bounds check
            *offset_ptr = i as i32 * 2;                            // write to pointer
        } else {
            // Write to out-of-bounds memory (undefined behavior)
            *offset_ptr = 999;                                      // UB ALERT!
        }
    }
    
    let leaked_ptr = Box::into_raw(Box::new(data));                // leak vector as pointer
    MEMORY_LEAK_COUNTER += 1;                                      // count leak
    
    // Use after potential free
    let value = *leaked_ptr.add(0);                                // dereference leaked pointer
    GLOBAL_CHAOS += value.len() as i32;                            // use the value
}

// Main function that orchestrates maximum chaos
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    println!("🦀 RUST NIGHTMARE STARTING - PREPARE FOR CHAOS! 🦀");
    
    // Initialize global chaos
    unsafe {
        GLOBAL_MAP = Some(HashMap::new());                          // initialize global map
        GLOBAL_VEC = Vec::with_capacity(1000);                     // pre-allocate global vec
    }
    
    // Lifetime nightmare
    let static_str = "STATIC DATA";                                 // static string
    let mut mutable_string = String::from("MUTABLE");              // mutable string
    let vec_data = vec![1, 2, 3, 4, 5];                           // vector data
    
    let mut nightmare = LifetimeNightmare::new(
        static_str, 
        &mut mutable_string, 
        Some(&vec_data)
    );
    let result = nightmare.chaos();                                 // call chaos method
    println!("Lifetime chaos result: {}", result);
    
    // Trait object chaos
    let mut chaos_vec: Vec<i32> = vec![1, 2, 3];                  // create vector
    let chaos_result = chaos_vec.generate_chaos(42)?;             // generate chaos
    chaos_vec.destroy_everything();                                // destroy everything
    
    // Async chaos
    let async_result = async_nightmare("ASYNC DATA").await?;       // await async chaos
    println!("Async chaos: {}", async_result);
    
    // Macro-generated chaos
    let i32_chaos = chaos_i32();                                   // call generated function
    let string_chaos = chaos_string();                             // call generated function
    let vec_chaos = chaos_vec();                                   // call generated function
    
    println!("Macro chaos: {}, {}, {:?}", i32_chaos, string_chaos, vec_chaos);
    
    // Thread disaster
    thread_disaster();                                              // spawn chaotic threads
    
    // Filesystem disaster
    if let Err(e) = filesystem_disaster() {                        // attempt filesystem chaos
        println!("Filesystem chaos failed: {}", e);
    }
    
    // Unsafe pointer chaos
    unsafe {
        pointer_chaos();                                            // call unsafe function
    }
    
    // Final chaos report
    unsafe {
        println!("🔥 CHAOS COMPLETE! 🔥");
        println!("Global chaos level: {}", GLOBAL_CHAOS);
        println!("Thread count: {}", THREAD_COUNTER);
        println!("Memory leaks: {}", MEMORY_LEAK_COUNTER);
        println!("Global vec size: {}", GLOBAL_VEC.len());
        if let Some(ref map) = GLOBAL_MAP {
            println!("Global map size: {}", map.len());
        }
    }
    
    // Exit without cleanup (let OS handle the mess)
    std::process::exit(0);                                          // force exit
}
