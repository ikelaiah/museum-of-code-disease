// Dangerous: Unsound Rust unsafe using transmute and aliasing
// Run: rustc -O ex-010-unsafe-unsound.rs && ./ex-010-unsafe-unsound
// Ref: Rustonomicon
use std::mem::transmute;

fn main() {
    let x: u32 = 0x41414141;
    // UB: transmute to reference with wrong lifetime
    let r: &u64 = unsafe { transmute(&x) }; // undefined behavior
    println!("{:x}", r);
}
