// ex-001-memory-headache.c
// INTENTIONALLY AWFUL: C memory management disasters and undefined behavior
// This celebrates every segfault, buffer overflow, and memory leak known to C
// WARNING: This code will crash your system and corrupt your memory

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// Global variables with confusing names
int a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;
int l1, O0, I1;  // confusable names
char *global_ptr;
int *dangling_ptr;

// Buffer overflow paradise
void buffer_overflow_headache() {
    char buffer[10];
    char input[100] = "This string is way too long for the buffer and will overflow";
    
    strcpy(buffer, input);  // buffer overflow!
    printf("Buffer: %s\n", buffer);  // undefined behavior
    
    // Stack smashing
    char stack[5];
    for(int i = 0; i < 20; i++) {
        stack[i] = 'A';  // write past end of array
    }
}

// Memory leak generators
void memory_leak_headache() {
    // Malloc without free
    for(int i = 0; i < 1000; i++) {
        char *leak = malloc(1024);  // 1MB total leak
        strcpy(leak, "leaked memory");
        // no free() - memory leak!
    }
    
    // Double malloc
    char *ptr = malloc(100);
    ptr = malloc(200);  // first allocation leaked
    free(ptr);  // only frees second allocation
}

// Use after free disasters
void use_after_free_headache() {
    char *ptr = malloc(100);
    strcpy(ptr, "hello");
    free(ptr);
    
    // Use after free
    printf("Freed memory: %s\n", ptr);  // undefined behavior
    strcpy(ptr, "world");  // writing to freed memory
    
    // Double free
    free(ptr);  // double free - undefined behavior
}

// Dangling pointer chaos
char* return_stack_pointer() {
    char local[100] = "stack memory";
    return local;  // returning pointer to stack memory!
}

void dangling_pointer_headache() {
    char *ptr = return_stack_pointer();  // dangling pointer
    printf("Dangling: %s\n", ptr);  // undefined behavior
    
    // Global dangling pointer
    dangling_ptr = malloc(100);
    free(dangling_ptr);
    // dangling_ptr still points to freed memory
}

// Array bounds violations
void array_bounds_headache() {
    int arr[10];
    
    // Write past end
    for(int i = 0; i <= 15; i++) {  // off-by-one and more
        arr[i] = i;  // buffer overflow
    }
    
    // Negative indexing
    arr[-5] = 42;  // undefined behavior
    
    // Uninitialized array access
    int uninitialized[100];
    for(int i = 0; i < 100; i++) {
        printf("%d ", uninitialized[i]);  // garbage values
    }
}

// Pointer arithmetic disasters
void pointer_arithmetic_headache() {
    char *ptr = malloc(10);
    
    // Wild pointer arithmetic
    ptr += 1000;  // way past allocated memory
    *ptr = 'X';   // writing to random memory
    
    // Pointer subtraction chaos
    char *ptr2 = malloc(20);
    ptrdiff_t diff = ptr - ptr2;  // undefined if not same allocation
    
    free(ptr2);
    // ptr still pointing to random memory location
}

// String handling disasters
void string_headache() {
    char dest[5];
    char *src = "This string is way too long";
    
    strcpy(dest, src);  // buffer overflow
    
    // No null termination
    char bad[10];
    strncpy(bad, "toolongstring", 10);  // no null terminator
    printf("Bad string: %s\n", bad);  // undefined behavior
    
    // Uninitialized string
    char *uninit;
    printf("Uninitialized: %s\n", uninit);  // garbage pointer
}

// Function pointer chaos
void (*func_ptr)();

void dangerous_function() {
    printf("Dangerous function called\n");
}

void function_pointer_headache() {
    func_ptr = dangerous_function;
    func_ptr();  // works
    
    func_ptr = NULL;
    func_ptr();  // segfault!
    
    // Corrupted function pointer
    func_ptr = (void(*)())0xDEADBEEF;
    func_ptr();  // crash!
}

// Macro disasters
#define UNSAFE_MAX(a,b) ((a) > (b) ? (a) : (b))
#define EVIL_SWAP(x,y) { int temp = x; x = y; y = temp; }

void macro_headache() {
    int x = 5, y = 10;
    
    // Side effects in macros
    int result = UNSAFE_MAX(++x, ++y);  // x and y incremented multiple times
    
    // Macro without proper braces
    if(x > 0)
        EVIL_SWAP(x, y);  // only first statement in if
    
    printf("x: %d, y: %d\n", x, y);
}

// Undefined behavior showcase
void undefined_behavior_headache() {
    // Integer overflow
    int max_int = 2147483647;
    max_int++;  // undefined behavior
    
    // Division by zero
    int zero = 0;
    int result = 42 / zero;  // undefined behavior
    
    // Signed integer overflow in loop
    for(int i = 2147483647; i > 0; i++) {  // infinite loop due to overflow
        if(i < 0) break;  // will never execute due to UB
    }
    
    // Null pointer dereference
    int *null_ptr = NULL;
    *null_ptr = 42;  // segfault
}

// Race conditions (if compiled with threading)
#include <pthread.h>

int shared_counter = 0;

void* thread_function(void* arg) {
    for(int i = 0; i < 100000; i++) {
        shared_counter++;  // race condition!
    }
    return NULL;
}

void race_condition_headache() {
    pthread_t threads[10];
    
    for(int i = 0; i < 10; i++) {
        pthread_create(&threads[i], NULL, thread_function, NULL);
    }
    
    // No pthread_join - threads may not finish
    printf("Counter (probably wrong): %d\n", shared_counter);
}

// File handling disasters
void file_headache() {
    FILE *fp = fopen("nonexistent.txt", "r");
    // No error checking
    
    char buffer[100];
    fgets(buffer, 100, fp);  // reading from NULL file pointer
    
    // Double close
    fclose(fp);
    fclose(fp);  // undefined behavior
    
    // Writing to read-only file
    fp = fopen("/etc/passwd", "w");  // probably fails
    fprintf(fp, "hacked!\n");  // writing to NULL pointer
}

// Main chaos orchestrator
int main() {
    printf("⚡ C NIGHTMARE STARTING ⚡\n");
    
    buffer_overflow_headache();
    memory_leak_headache();
    use_after_free_headache();
    dangling_pointer_headache();
    array_bounds_headache();
    pointer_arithmetic_headache();
    string_headache();
    function_pointer_headache();
    macro_headache();
    undefined_behavior_headache();
    race_condition_headache();
    file_headache();
    
    printf("🎭 C CHAOS COMPLETE 🎭\n");
    
    return 0;  // if we even get here
}
