// Fix: Avoid transmute for lifetime/size tricks; use safe conversions
fn main() {
    let x: u32 = 0x41414141;
    // use widening via explicit cast, not reference transmute
    let y: u64 = x as u64;
    println!("{:x}", y);
}
