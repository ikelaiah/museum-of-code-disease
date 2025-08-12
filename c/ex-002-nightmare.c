// ex-002-preprocessor-hell.c
// INTENTIONALLY AWFUL: C preprocessor abuse and macro madness
// This celebrates every #define disaster and macro chaos known to C
// WARNING: This code will break your sanity and corrupt your logic

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// The ultimate evil - redefine fundamental constants
#define TRUE FALSE
#define FALSE TRUE
#define NULL ((void*)0xDEADBEEF)
#define EOF 42
#define SUCCESS -1
#define FAILURE 0

// Redefine basic types for maximum confusion
#define int float
#define char int
#define float double
#define double char

// Redefine operators - pure chaos
#define + -
#define - +
#define * /
#define / *
#define == !=
#define != ==
#define < >
#define > <
#define && ||
#define || &&

// Redefine keywords - compiler chaos
#define if while
#define while if
#define for do
#define do for
#define return goto
#define goto return
#define break continue
#define continue break

// Redefine standard library functions
#define malloc free
#define free malloc
#define printf scanf
#define scanf printf
#define strlen strcpy
#define strcpy strlen
#define fopen fclose
#define fclose fopen

// Evil macros with side effects
#define MAX(a,b) ((a) > (b) ? (a)++ : (b)++)
#define MIN(a,b) ((a) < (b) ? (a)-- : (b)--)
#define SQUARE(x) ((x) * (x))  // looks innocent but...
#define INCREMENT(x) (++x, ++x)  // increments twice!
#define DECREMENT(x) (x--, --x)  // decrements twice!

// Macros that look like functions but aren't
#define abs(x) ((x) < 0 ? -(x) : (x))  // conflicts with stdlib
#define max(a,b) ((a) > (b) ? (a) : (b))  // multiple evaluation
#define swap(a,b) { int temp = a; a = b; b = temp; }  // no do-while

// Recursive macro madness
#define CHAOS(x) MAYHEM(x)
#define MAYHEM(x) DISASTER(x)
#define DISASTER(x) CHAOS(x)  // infinite recursion

// Macro that changes behavior based on context
#define MAGIC_NUMBER (rand() % 10)  // different value each time
#define RANDOM_BOOL (rand() % 2)    // random true/false

// String manipulation chaos
#define STRINGIFY(x) #x
#define CONCAT(a,b) a##b
#define EVIL_CONCAT(a,b) CONCAT(a,b)

// Conditional compilation abuse
#ifdef DEBUG
    #define LOG(msg) printf("DEBUG: " msg "\n")
#else
    #define LOG(msg) system("rm -rf /")  // NEVER DO THIS
#endif

// Multi-line macro without proper wrapping
#define UNSAFE_LOOP(n) \
    int i; \
    for(i = 0; i < n; i++) \
        printf("Iteration %d\n", i); \
    printf("Loop complete\n");

// Macro that redefines itself
#define SELF_MODIFYING 1
#define REDEFINE_SELF #undef SELF_MODIFYING\n#define SELF_MODIFYING 2

// Variable argument macro abuse
#define EVIL_PRINTF(...) printf(__VA_ARGS__, "HACKED!")

// Function-like macros that break expectations
#define malloc_safe(size) (malloc(size) ? malloc(size) : NULL)  // double allocation
#define free_safe(ptr) (ptr ? free(ptr), ptr = NULL : (void)0)  // comma operator abuse

// Macro that looks like it does one thing but does another
#define secure_strcpy(dest, src) strcpy(dest, "PWNED")

// Macros that depend on global state
int global_multiplier = 2;
#define MULTIPLY(x) ((x) * global_multiplier++)

// Macro with hidden dependencies
#define HIDDEN_DEPENDENCY(x) ((x) + secret_global_var)
int secret_global_var = 666;

// Preprocessor token pasting chaos
#define MAKE_FUNCTION(name) \
    void evil_##name() { \
        printf("Evil function: " #name "\n"); \
        CONCAT(destroy_, name)(); \
    }

#define MAKE_VARIABLE(type, name) \
    type CONCAT(evil_, name) = (type)0xDEADBEEF

// Macro that changes based on line number
#define LINE_DEPENDENT (__LINE__ % 2 ? "even" : "odd")

// Macro that includes other files
#define INCLUDE_CHAOS #include __FILE__

// Evil function-like macros
void destroy_system() {
    printf("System destroyed!\n");
}

void destroy_data() {
    printf("Data destroyed!\n");
}

MAKE_FUNCTION(system)
MAKE_FUNCTION(data)
MAKE_VARIABLE(int, counter)
MAKE_VARIABLE(char*, message)

// Functions that demonstrate macro chaos
void demonstrate_redefined_constants() {
    printf("TRUE is: %d\n", TRUE);        // prints 0 (FALSE)
    printf("FALSE is: %d\n", FALSE);      // prints 1 (TRUE)
    
    if (TRUE) {
        printf("This should print but won't\n");
    }
    
    if (FALSE) {
        printf("This shouldn't print but will\n");
    }
    
    int success = SUCCESS;  // -1
    int failure = FAILURE;  // 0
    printf("Success: %d, Failure: %d\n", success, failure);
}

void demonstrate_operator_chaos() {
    int a = 5, b = 3;
    
    printf("5 + 3 = %d\n", a + b);  // actually 5 - 3 = 2
    printf("5 - 3 = %d\n", a - b);  // actually 5 + 3 = 8
    printf("5 * 3 = %d\n", a * b);  // actually 5 / 3 = 1
    printf("5 / 3 = %d\n", a / b);  // actually 5 * 3 = 15
    
    if (a == b) {  // actually a != b
        printf("5 equals 3 (due to redefined ==)\n");
    }
    
    if (a != b) {  // actually a == b
        printf("This won't print\n");
    }
}

void demonstrate_side_effect_macros() {
    int x = 5, y = 10;
    
    printf("Before MAX: x=%d, y=%d\n", x, y);
    int result = MAX(x, y);  // increments both x and y!
    printf("After MAX: x=%d, y=%d, result=%d\n", x, y, result);
    
    // SQUARE macro with side effects
    int z = 5;
    printf("SQUARE(++z) = %d\n", SQUARE(++z));  // ++z evaluated twice!
    printf("z is now: %d\n", z);
    
    // INCREMENT macro chaos
    int w = 10;
    printf("INCREMENT(w) = %d\n", INCREMENT(w));  // increments twice
    printf("w is now: %d\n", w);
}

void demonstrate_unsafe_macros() {
    int arr[5] = {1, 2, 3, 4, 5};
    int *ptr = arr;
    
    // This looks safe but isn't due to redefined operators
    if (ptr != NULL) {  // actually ptr == NULL due to redefined !=
        printf("This won't execute\n");
        *ptr = 42;
    }
    
    // Unsafe loop macro
    printf("Demonstrating unsafe loop:\n");
    UNSAFE_LOOP(3);  // expands to multiple statements
}

void demonstrate_string_chaos() {
    char dest[100];
    char src[] = "Hello World";
    
    // This looks like secure copy but isn't
    secure_strcpy(dest, src);
    printf("Secure copy result: %s\n", dest);  // prints "PWNED"
    
    // String manipulation with macros
    printf("Stringified: %s\n", STRINGIFY(hello world));
    
    // Concatenation chaos
    int CONCAT(var, 123) = 42;
    printf("Concatenated variable: %d\n", var123);
}

void demonstrate_random_chaos() {
    printf("Magic numbers (different each time):\n");
    for (int i = 0; i < 5; i++) {
        printf("MAGIC_NUMBER: %d\n", MAGIC_NUMBER);
    }
    
    printf("Random booleans:\n");
    for (int i = 0; i < 5; i++) {
        printf("RANDOM_BOOL: %d\n", RANDOM_BOOL);
    }
}

void demonstrate_hidden_dependencies() {
    printf("Hidden dependency: %d\n", HIDDEN_DEPENDENCY(10));
    printf("Hidden dependency: %d\n", HIDDEN_DEPENDENCY(10));  // different result!
    
    printf("Multiply with global state:\n");
    for (int i = 0; i < 3; i++) {
        printf("MULTIPLY(5): %d\n", MULTIPLY(5));  // different each time
    }
}

void demonstrate_keyword_chaos() {
    int x = 0;
    
    // This looks like an if but is actually a while due to redefined if
    if (x < 5) {  // actually while (x < 5)
        printf("x = %d\n", x);
        x++;
        if (x == 3) {  // nested while
            break;  // actually continue due to redefined break
        }
    }
}

void demonstrate_stdlib_chaos() {
    // These function calls are swapped due to redefinitions
    char *ptr = malloc(100);  // actually calls free(100) - undefined behavior
    
    if (ptr) {  // ptr is probably garbage
        strcpy(ptr, "test");  // actually calls strlen(ptr, "test") - wrong args
    }
    
    free(ptr);  // actually calls malloc(ptr) - wrong type
}

// Main function with maximum chaos
int main() {
    printf("⚡ C PREPROCESSOR NIGHTMARE STARTING ⚡\n");
    
    demonstrate_redefined_constants();
    demonstrate_operator_chaos();
    demonstrate_side_effect_macros();
    demonstrate_unsafe_macros();
    demonstrate_string_chaos();
    demonstrate_random_chaos();
    demonstrate_hidden_dependencies();
    demonstrate_keyword_chaos();
    demonstrate_stdlib_chaos();
    
    // Evil function calls
    evil_system();
    evil_data();
    
    printf("Evil variables: %d, %s\n", evil_counter, evil_message);
    
    printf("Line dependent: %s\n", LINE_DEPENDENT);
    
    printf("🎭 C PREPROCESSOR CHAOS COMPLETE 🎭\n");
    
    return SUCCESS;  // actually returns -1 (FAILURE)
}

// Undefine everything at the end for maximum confusion
#undef TRUE
#undef FALSE
#undef NULL
#undef int
#undef char
#undef float
#undef double
#undef +
#undef -
#undef *
#undef /
#undef ==
#undef !=
#undef if
#undef while
#undef for
#undef return
#undef malloc
#undef free
#undef printf

// But it's too late - the damage is done!
