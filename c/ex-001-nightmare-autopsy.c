// ex-001-memory-headache.c AUTOPSY VERSION
// INTENTIONALLY AWFUL: C memory management disasters and undefined behavior
// This celebrates every segfault, buffer overflow, and memory leak known to C
// AUTOPSY: Same nightmare code with detailed explanations of C's dangerous features

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// PROBLEM: Global variables with confusing names
int a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z; // PROBLEM: 26 global integers
int l1, O0, I1;  // PROBLEM: Confusable variable names (l1 vs I1 vs O0)
char *global_ptr; // PROBLEM: Global pointer, no initialization
int *dangling_ptr; // PROBLEM: Global pointer that will become dangling
// FIX: Use local variables, initialize pointers to NULL, use descriptive names

// PROBLEM: Buffer overflow paradise
void buffer_overflow_headache() {
    char buffer[10]; // PROBLEM: Small fixed-size buffer
    char input[100] = "This string is way too long for the buffer and will overflow"; // PROBLEM: 60+ chars
    
    strcpy(buffer, input);  // PROBLEM: strcpy doesn't check bounds - classic buffer overflow!
    printf("Buffer: %s\n", buffer);  // PROBLEM: Undefined behavior - reading past buffer end
    // FIX: Use strncpy() or better yet, snprintf(); check string lengths
    
    // PROBLEM: Stack smashing
    char stack[5]; // PROBLEM: 5-byte array
    for(int i = 0; i < 20; i++) { // PROBLEM: Loop writes 20 bytes into 5-byte array
        stack[i] = 'A';  // PROBLEM: Writes 15 bytes past end - stack corruption
    }
    // FIX: Check array bounds in loops; use i < sizeof(stack)
}

// PROBLEM: Memory leak generators
void memory_leak_headache() {
    // PROBLEM: Malloc without free
    for(int i = 0; i < 1000; i++) { // PROBLEM: 1000 iterations
        char *leak = malloc(1024);  // PROBLEM: Allocate 1KB each = 1MB total
        strcpy(leak, "leaked memory"); // PROBLEM: Use the memory
        // PROBLEM: No free() call - all 1MB is leaked!
    }
    // FIX: Always pair malloc() with free(); use valgrind to detect leaks
    
    // PROBLEM: Double malloc without freeing first
    char *ptr = malloc(100); // PROBLEM: First allocation
    ptr = malloc(200);  // PROBLEM: Second allocation overwrites pointer - first is leaked
    free(ptr);  // PROBLEM: Only frees second allocation, first is permanently leaked
    // FIX: Free first allocation before reassigning pointer
}

// PROBLEM: Use after free disasters
void use_after_free_headache() {
    char *ptr = malloc(100); // PROBLEM: Allocate memory
    strcpy(ptr, "hello"); // PROBLEM: Use memory normally
    free(ptr); // PROBLEM: Free the memory
    
    // PROBLEM: Use after free - undefined behavior
    printf("Freed memory: %s\n", ptr);  // PROBLEM: Reading freed memory - could crash or print garbage
    strcpy(ptr, "world");  // PROBLEM: Writing to freed memory - heap corruption
    
    // PROBLEM: Double free - undefined behavior
    free(ptr);  // PROBLEM: Freeing already-freed memory - heap corruption, possible crash
    // FIX: Set pointer to NULL after free; check for NULL before free
}

// PROBLEM: Dangling pointer chaos
char* return_stack_pointer() { // PROBLEM: Function returns char*
    char local[100] = "stack memory"; // PROBLEM: Local array on stack
    return local;  // PROBLEM: Returning pointer to stack memory that will be destroyed!
} // PROBLEM: local[] is destroyed when function returns

void dangling_pointer_headache() {
    char *ptr = return_stack_pointer();  // PROBLEM: ptr now points to destroyed stack memory
    printf("Dangling: %s\n", ptr);  // PROBLEM: Undefined behavior - stack memory reused
    
    // PROBLEM: Global dangling pointer
    dangling_ptr = malloc(100); // PROBLEM: Allocate memory
    free(dangling_ptr); // PROBLEM: Free memory
    // PROBLEM: dangling_ptr still points to freed memory - becomes dangling
    // FIX: Don't return pointers to stack; set pointers to NULL after free
}

// PROBLEM: Array bounds violations
void array_bounds_headache() {
    int arr[10]; // PROBLEM: Array of 10 integers (indices 0-9)
    
    // PROBLEM: Write past end of array
    for(int i = 0; i <= 15; i++) {  // PROBLEM: Loop goes to 15, but array only has indices 0-9
        arr[i] = i;  // PROBLEM: arr[10] through arr[15] are buffer overflow
    }
    
    // PROBLEM: Negative indexing
    arr[-5] = 42;  // PROBLEM: Negative index - writes to memory before array
    
    // PROBLEM: Uninitialized array access
    int uninitialized[100]; // PROBLEM: Array not initialized
    for(int i = 0; i < 100; i++) {
        printf("%d ", uninitialized[i]);  // PROBLEM: Reading uninitialized memory - garbage values
    }
    // FIX: Initialize arrays; check bounds; use positive indices only
}

// PROBLEM: Pointer arithmetic disasters
void pointer_arithmetic_headache() {
    char *ptr = malloc(10); // PROBLEM: Allocate 10 bytes
    
    // PROBLEM: Wild pointer arithmetic
    ptr += 1000;  // PROBLEM: Move pointer 1000 bytes past allocated memory
    *ptr = 'X';   // PROBLEM: Writing to unallocated memory - undefined behavior
    
    // PROBLEM: Pointer subtraction chaos
    char *ptr2 = malloc(20); // PROBLEM: Different allocation
    ptrdiff_t diff = ptr - ptr2;  // PROBLEM: Subtracting pointers from different allocations - undefined
    
    free(ptr2); // PROBLEM: Free ptr2
    // PROBLEM: ptr still pointing 1000 bytes past original allocation
    // FIX: Only do arithmetic within allocated bounds; don't mix different allocations
}

// PROBLEM: String handling disasters
void string_headache() {
    char dest[5]; // PROBLEM: 5-byte destination buffer
    char *src = "This string is way too long"; // PROBLEM: 27+ character source
    
    strcpy(dest, src);  // PROBLEM: Buffer overflow - copying 27+ chars into 5-byte buffer
    
    // PROBLEM: No null termination
    char bad[10]; // PROBLEM: Uninitialized buffer
    strncpy(bad, "toolongstring", 10);  // PROBLEM: strncpy doesn't guarantee null termination
    printf("Bad string: %s\n", bad);  // PROBLEM: String might not be null-terminated
    
    // PROBLEM: Uninitialized string pointer
    char *uninit; // PROBLEM: Uninitialized pointer
    printf("Uninitialized: %s\n", uninit);  // PROBLEM: Printing garbage pointer value
    // FIX: Use snprintf(); always null-terminate; initialize pointers
}

// PROBLEM: Function pointer chaos
void (*func_ptr)(); // PROBLEM: Global function pointer, uninitialized

void dangerous_function() {
    printf("Dangerous function called\n");
}

void function_pointer_headache() {
    func_ptr = dangerous_function; // PROBLEM: Assign function address
    func_ptr();  // PROBLEM: Works fine
    
    func_ptr = NULL; // PROBLEM: Set to NULL
    func_ptr();  // PROBLEM: Calling NULL function pointer - segfault!
    
    // PROBLEM: Corrupted function pointer
    func_ptr = (void(*)())0xDEADBEEF; // PROBLEM: Set to invalid address
    func_ptr();  // PROBLEM: Jump to invalid memory - crash!
    // FIX: Check function pointers for NULL before calling
}

// PROBLEM: Macro disasters
#define UNSAFE_MAX(a,b) ((a) > (b) ? (a) : (b)) // PROBLEM: Macro evaluates arguments multiple times
#define EVIL_SWAP(x,y) { int temp = x; x = y; y = temp; } // PROBLEM: Macro without do-while wrapper

void macro_headache() {
    int x = 5, y = 10;
    
    // PROBLEM: Side effects in macros
    int result = UNSAFE_MAX(++x, ++y);  // PROBLEM: ++x and ++y evaluated multiple times
    // EXPANSION: ((++x) > (++y) ? (++x) : (++y)) - increments happen multiple times!
    
    // PROBLEM: Macro without proper braces
    if(x > 0)
        EVIL_SWAP(x, y);  // PROBLEM: Expands to multiple statements, only first is in if
    // EXPANSION: if(x > 0) { int temp = x; x = y; y = temp; } - y = temp always executes!
    
    printf("x: %d, y: %d\n", x, y);
    // FIX: Use inline functions; wrap multi-statement macros in do-while(0)
}

// PROBLEM: Undefined behavior showcase
void undefined_behavior_headache() {
    // PROBLEM: Signed integer overflow
    int max_int = 2147483647; // PROBLEM: Maximum 32-bit signed integer
    max_int++;  // PROBLEM: Overflow causes undefined behavior (not wrap-around!)
    
    // PROBLEM: Division by zero
    int zero = 0;
    int result = 42 / zero;  // PROBLEM: Division by zero - undefined behavior
    
    // PROBLEM: Signed integer overflow in loop
    for(int i = 2147483647; i > 0; i++) {  // PROBLEM: i++ overflows to negative - undefined behavior
        if(i < 0) break;  // PROBLEM: Will never execute due to undefined behavior
    }
    
    // PROBLEM: Null pointer dereference
    int *null_ptr = NULL; // PROBLEM: NULL pointer
    *null_ptr = 42;  // PROBLEM: Dereferencing NULL - segfault
    // FIX: Check for overflow; validate inputs; check pointers for NULL
}

// PROBLEM: Race conditions (if compiled with threading)
#include <pthread.h>

int shared_counter = 0; // PROBLEM: Global shared variable

void* thread_function(void* arg) {
    for(int i = 0; i < 100000; i++) {
        shared_counter++;  // PROBLEM: Non-atomic increment - race condition!
        // PROBLEM: Read-modify-write operation not protected by mutex
    }
    return NULL;
}

void race_condition_headache() {
    pthread_t threads[10]; // PROBLEM: 10 threads
    
    for(int i = 0; i < 10; i++) {
        pthread_create(&threads[i], NULL, thread_function, NULL); // PROBLEM: Create threads
    }
    
    // PROBLEM: No pthread_join - main thread doesn't wait for worker threads
    printf("Counter (probably wrong): %d\n", shared_counter); // PROBLEM: Race condition on read too
    // FIX: Use mutexes for shared data; use pthread_join to wait for threads
}

// PROBLEM: File handling disasters
void file_headache() {
    FILE *fp = fopen("nonexistent.txt", "r"); // PROBLEM: File probably doesn't exist
    // PROBLEM: No error checking - fp is probably NULL
    
    char buffer[100];
    fgets(buffer, 100, fp);  // PROBLEM: Reading from NULL file pointer - undefined behavior
    
    // PROBLEM: Double close
    fclose(fp); // PROBLEM: Closing NULL pointer - undefined behavior
    fclose(fp);  // PROBLEM: Double close - undefined behavior
    
    // PROBLEM: Writing to read-only file
    fp = fopen("/etc/passwd", "w");  // PROBLEM: Probably fails (permission denied)
    fprintf(fp, "hacked!\n");  // PROBLEM: Writing to NULL pointer - undefined behavior
    // FIX: Always check return values; don't close NULL pointers
}

// PROBLEM: Main chaos orchestrator
int main() {
    printf("⚡ C NIGHTMARE STARTING ⚡\n");
    
    buffer_overflow_headache();      // PROBLEM: Buffer overflows and stack corruption
    memory_leak_headache();          // PROBLEM: Memory leaks via malloc without free
    use_after_free_headache();       // PROBLEM: Use-after-free and double-free
    dangling_pointer_headache();     // PROBLEM: Pointers to destroyed stack memory
    array_bounds_headache();         // PROBLEM: Array bounds violations
    pointer_arithmetic_headache();   // PROBLEM: Wild pointer arithmetic
    string_headache();               // PROBLEM: String handling without bounds checking
    function_pointer_headache();     // PROBLEM: NULL and invalid function pointer calls
    macro_headache();                // PROBLEM: Macro side effects and expansion issues
    undefined_behavior_headache();   // PROBLEM: Integer overflow, division by zero, NULL deref
    race_condition_headache();       // PROBLEM: Unsynchronized access to shared data
    file_headache();                 // PROBLEM: File operations without error checking
    
    printf("🎭 C CHAOS COMPLETE 🎭\n");
    
    return 0;  // PROBLEM: If we even get here without crashing
}

// ─────────────────────────────────────────────────────────────────────────────
// C ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Buffer Overflows**: strcpy, gets, sprintf without bounds checking
// 2. **Memory Leaks**: malloc without corresponding free
// 3. **Use After Free**: Accessing freed memory - heap corruption
// 4. **Double Free**: Freeing same memory twice - heap corruption
// 5. **Dangling Pointers**: Pointers to freed or out-of-scope memory
// 6. **Array Bounds Violations**: Writing past array boundaries
// 7. **Uninitialized Variables**: Using variables before initialization
// 8. **Null Pointer Dereference**: Accessing through NULL pointers
// 9. **Undefined Behavior**: Integer overflow, division by zero
// 10. **Race Conditions**: Unsynchronized access to shared data

// WHY C IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Manual Memory Management**: No garbage collector, must track all allocations
// - **No Bounds Checking**: Arrays don't check indices, strings don't check length
// - **Pointer Arithmetic**: Direct memory access allows corruption
// - **Undefined Behavior**: Many operations have undefined results
// - **No Built-in Safety**: Compiler doesn't prevent dangerous operations
// - **System-Level Access**: Can corrupt memory, crash system
// - **Legacy Design**: Designed for expert programmers, assumes correctness

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Always pair malloc() with free(), check for NULL returns
// 2. Use safe string functions: strncpy, snprintf instead of strcpy, sprintf
// 3. Initialize all variables, especially pointers (set to NULL)
// 4. Check array bounds in loops and access
// 5. Set pointers to NULL after freeing
// 6. Use static analysis tools: valgrind, AddressSanitizer, clang-analyzer
// 7. Enable compiler warnings: -Wall -Wextra -Werror
// 8. Use defensive programming: validate inputs, check return values
// 9. Consider safer alternatives: C++, Rust for memory safety
// 10. Use mutexes/locks for shared data in multithreaded code

// Remember: C gives you enough rope to hang yourself - use it carefully! ⚡
