// ex-002-preprocessor-hell.c AUTOPSY VERSION
// INTENTIONALLY AWFUL: C preprocessor abuse and macro madness
// This celebrates every #define disaster and macro chaos known to C
// AUTOPSY: Same nightmare code with detailed explanations of preprocessor evil

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// PROBLEM: The ultimate evil - redefine fundamental constants
#define TRUE FALSE                   // PROBLEM: Logic inversion - TRUE becomes 0
#define FALSE TRUE                   // PROBLEM: FALSE becomes 1 - breaks all boolean logic
#define NULL ((void*)0xDEADBEEF)     // PROBLEM: NULL points to invalid memory instead of 0
#define EOF 42                       // PROBLEM: End-of-file becomes arbitrary value
#define SUCCESS -1                   // PROBLEM: Success becomes failure value
#define FAILURE 0                    // PROBLEM: Failure becomes success value
// FIX: Never redefine standard constants; use different names for custom values

// PROBLEM: Redefine basic types for maximum confusion
#define int float                    // PROBLEM: int becomes float - type confusion
#define char int                     // PROBLEM: char becomes int - size mismatch
#define float double                 // PROBLEM: float becomes double - precision change
#define double char                  // PROBLEM: double becomes char - massive data loss
// FIX: Never redefine built-in types; use typedef for type aliases

// PROBLEM: Redefine operators - pure chaos
#define + -                          // PROBLEM: Addition becomes subtraction
#define - +                          // PROBLEM: Subtraction becomes addition
#define * /                          // PROBLEM: Multiplication becomes division
#define / *                          // PROBLEM: Division becomes multiplication
#define == !=                        // PROBLEM: Equality becomes inequality
#define != ==                        // PROBLEM: Inequality becomes equality
#define < >                          // PROBLEM: Less-than becomes greater-than
#define > <                          // PROBLEM: Greater-than becomes less-than
#define && ||                        // PROBLEM: AND becomes OR
#define || &&                        // PROBLEM: OR becomes AND
// FIX: NEVER redefine operators - breaks fundamental language semantics

// PROBLEM: Redefine keywords - compiler chaos
#define if while                     // PROBLEM: if statements become while loops
#define while if                     // PROBLEM: while loops become if statements
#define for do                       // PROBLEM: for loops become do-while
#define do for                       // PROBLEM: do-while becomes for loop
#define return goto                  // PROBLEM: return becomes goto - control flow chaos
#define goto return                  // PROBLEM: goto becomes return - early exits
#define break continue               // PROBLEM: break becomes continue - infinite loops
#define continue break               // PROBLEM: continue becomes break - early exits
// FIX: NEVER redefine keywords - undefined behavior and compiler errors

// PROBLEM: Redefine standard library functions
#define malloc free                  // PROBLEM: malloc calls free - immediate crash
#define free malloc                  // PROBLEM: free calls malloc - memory corruption
#define printf scanf                 // PROBLEM: printf calls scanf - wrong arguments
#define scanf printf                 // PROBLEM: scanf calls printf - wrong behavior
#define strlen strcpy                // PROBLEM: strlen calls strcpy - buffer overflow
#define strcpy strlen                // PROBLEM: strcpy calls strlen - wrong return type
#define fopen fclose                 // PROBLEM: fopen calls fclose - file handle chaos
#define fclose fopen                 // PROBLEM: fclose calls fopen - resource leaks
// FIX: Never redefine standard library functions; use wrapper functions if needed

// PROBLEM: Evil macros with side effects
#define MAX(a,b) ((a) > (b) ? (a)++ : (b)++)  // PROBLEM: Increments arguments - side effects
#define MIN(a,b) ((a) < (b) ? (a)-- : (b)--)  // PROBLEM: Decrements arguments - side effects
#define SQUARE(x) ((x) * (x))                 // PROBLEM: Evaluates x twice - side effects with ++x
#define INCREMENT(x) (++x, ++x)               // PROBLEM: Increments twice - unexpected behavior
#define DECREMENT(x) (x--, --x)               // PROBLEM: Decrements twice - unexpected behavior
// FIX: Use inline functions; avoid side effects; document macro behavior

// PROBLEM: Macros that look like functions but aren't
#define abs(x) ((x) < 0 ? -(x) : (x))        // PROBLEM: Conflicts with stdlib abs()
#define max(a,b) ((a) > (b) ? (a) : (b))     // PROBLEM: Multiple evaluation of arguments
#define swap(a,b) { int temp = a; a = b; b = temp; }  // PROBLEM: No do-while wrapper
// FIX: Use do-while(0) wrapper; avoid name conflicts; use inline functions

// PROBLEM: Recursive macro madness
#define CHAOS(x) MAYHEM(x)           // PROBLEM: Macro calls another macro
#define MAYHEM(x) DISASTER(x)        // PROBLEM: Which calls another macro
#define DISASTER(x) CHAOS(x)         // PROBLEM: Which calls the first - infinite recursion!
// FIX: Avoid recursive macro definitions; compiler will detect and error

// PROBLEM: Macro that changes behavior based on context
#define MAGIC_NUMBER (rand() % 10)   // PROBLEM: Different value each evaluation
#define RANDOM_BOOL (rand() % 2)     // PROBLEM: Non-deterministic behavior
// FIX: Use functions for dynamic values; macros should be deterministic

// PROBLEM: String manipulation chaos
#define STRINGIFY(x) #x              // PROBLEM: Converts argument to string literal
#define CONCAT(a,b) a##b             // PROBLEM: Token pasting operator
#define EVIL_CONCAT(a,b) CONCAT(a,b) // PROBLEM: Nested token pasting
// FIX: Use carefully; understand stringification and token pasting rules

// PROBLEM: Conditional compilation abuse
#ifdef DEBUG
    #define LOG(msg) printf("DEBUG: " msg "\n")  // PROBLEM: Debug version
#else
    #define LOG(msg) system("rm -rf /")          // PROBLEM: NEVER DO THIS - destructive command
#endif
// FIX: Never put destructive commands in macros; use safe alternatives

// PROBLEM: Multi-line macro without proper wrapping
#define UNSAFE_LOOP(n) \             // PROBLEM: Multi-line macro without do-while
    int i; \                         // PROBLEM: Declares variable in macro
    for(i = 0; i < n; i++) \         // PROBLEM: Multiple statements
        printf("Iteration %d\n", i); \  // PROBLEM: Not wrapped in braces
    printf("Loop complete\n");       // PROBLEM: Always executes regardless of context
// FIX: Use do-while(0) wrapper; avoid variable declarations in macros

// PROBLEM: Macro that redefines itself
#define SELF_MODIFYING 1             // PROBLEM: Initial definition
#define REDEFINE_SELF #undef SELF_MODIFYING\n#define SELF_MODIFYING 2  // PROBLEM: Self-modification
// FIX: Avoid self-modifying macros; use constants or variables

// PROBLEM: Variable argument macro abuse
#define EVIL_PRINTF(...) printf(__VA_ARGS__, "HACKED!")  // PROBLEM: Adds extra argument
// FIX: Be careful with variadic macros; don't modify argument lists unexpectedly

// PROBLEM: Function-like macros that break expectations
#define malloc_safe(size) (malloc(size) ? malloc(size) : NULL)  // PROBLEM: Double allocation on success
#define free_safe(ptr) (ptr ? free(ptr), ptr = NULL : (void)0)  // PROBLEM: Comma operator abuse
// FIX: Use proper error checking; avoid complex expressions in macros

// PROBLEM: Macro that looks like it does one thing but does another
#define secure_strcpy(dest, src) strcpy(dest, "PWNED")  // PROBLEM: Ignores src, copies fixed string
// FIX: Make macro behavior match its name; avoid deceptive macros

// PROBLEM: Macros that depend on global state
int global_multiplier = 2;           // PROBLEM: Global variable
#define MULTIPLY(x) ((x) * global_multiplier++)  // PROBLEM: Macro modifies global state
// FIX: Avoid global state in macros; make dependencies explicit

// PROBLEM: Macro with hidden dependencies
#define HIDDEN_DEPENDENCY(x) ((x) + secret_global_var)  // PROBLEM: Uses undeclared variable
int secret_global_var = 666;        // PROBLEM: Hidden dependency declared later
// FIX: Declare dependencies before use; avoid hidden dependencies

// PROBLEM: Preprocessor token pasting chaos
#define MAKE_FUNCTION(name) \        // PROBLEM: Generates functions dynamically
    void evil_##name() { \           // PROBLEM: Token pasting with ##
        printf("Evil function: " #name "\n"); \  // PROBLEM: Stringification with #
        CONCAT(destroy_, name)(); \  // PROBLEM: More token pasting
    }

#define MAKE_VARIABLE(type, name) \  // PROBLEM: Generates variables dynamically
    type CONCAT(evil_, name) = (type)0xDEADBEEF  // PROBLEM: Dangerous default value

// PROBLEM: Macro that changes based on line number
#define LINE_DEPENDENT (__LINE__ % 2 ? "even" : "odd")  // PROBLEM: Behavior depends on source location
// FIX: Avoid location-dependent macros; behavior should be predictable

// PROBLEM: Macro that includes other files
#define INCLUDE_CHAOS #include __FILE__  // PROBLEM: Recursive file inclusion
// FIX: Never use #include in macros; causes infinite recursion

// PROBLEM: Evil function-like macros
void destroy_system() {
    printf("System destroyed!\n");
}

void destroy_data() {
    printf("Data destroyed!\n");
}

MAKE_FUNCTION(system)            // PROBLEM: Creates evil_system() function
MAKE_FUNCTION(data)              // PROBLEM: Creates evil_data() function
MAKE_VARIABLE(int, counter)      // PROBLEM: Creates evil_counter variable
MAKE_VARIABLE(char*, message)    // PROBLEM: Creates evil_message variable

// PROBLEM: Functions that demonstrate macro chaos
void demonstrate_redefined_constants() {
    printf("TRUE is: %d\n", TRUE);        // PROBLEM: Prints 0 (FALSE) due to redefinition
    printf("FALSE is: %d\n", FALSE);      // PROBLEM: Prints 1 (TRUE) due to redefinition
    
    if (TRUE) {                            // PROBLEM: Condition is false due to TRUE = FALSE
        printf("This should print but won't\n");  // PROBLEM: Never executes
    }
    
    if (FALSE) {                           // PROBLEM: Condition is true due to FALSE = TRUE
        printf("This shouldn't print but will\n");  // PROBLEM: Always executes
    }
    
    int success = SUCCESS;  // PROBLEM: success = -1 due to redefinition
    int failure = FAILURE;  // PROBLEM: failure = 0 due to redefinition
    printf("Success: %d, Failure: %d\n", success, failure);  // PROBLEM: Values are swapped
}

void demonstrate_operator_chaos() {
    int a = 5, b = 3;
    
    printf("5 + 3 = %d\n", a + b);  // PROBLEM: Actually 5 - 3 = 2 due to + redefined as -
    printf("5 - 3 = %d\n", a - b);  // PROBLEM: Actually 5 + 3 = 8 due to - redefined as +
    printf("5 * 3 = %d\n", a * b);  // PROBLEM: Actually 5 / 3 = 1 due to * redefined as /
    printf("5 / 3 = %d\n", a / b);  // PROBLEM: Actually 5 * 3 = 15 due to / redefined as *
    
    if (a == b) {  // PROBLEM: Actually a != b due to == redefined as !=
        printf("5 equals 3 (due to redefined ==)\n");  // PROBLEM: Won't execute (5 != 3)
    }
    
    if (a != b) {  // PROBLEM: Actually a == b due to != redefined as ==
        printf("This won't print\n");  // PROBLEM: Won't execute (5 == 3 is false)
    }
}

void demonstrate_side_effect_macros() {
    int x = 5, y = 10;
    
    printf("Before MAX: x=%d, y=%d\n", x, y);
    int result = MAX(x, y);  // PROBLEM: Increments both x and y due to side effects
    printf("After MAX: x=%d, y=%d, result=%d\n", x, y, result);  // PROBLEM: x and y modified
    
    // PROBLEM: SQUARE macro with side effects
    int z = 5;
    printf("SQUARE(++z) = %d\n", SQUARE(++z));  // PROBLEM: ++z evaluated twice - z incremented to 7
    printf("z is now: %d\n", z);  // PROBLEM: z is 7, not 6 as expected
    
    // PROBLEM: INCREMENT macro chaos
    int w = 10;
    printf("INCREMENT(w) = %d\n", INCREMENT(w));  // PROBLEM: Increments w twice
    printf("w is now: %d\n", w);  // PROBLEM: w is 12, not 11
}

void demonstrate_unsafe_macros() {
    int arr[5] = {1, 2, 3, 4, 5};
    int *ptr = arr;
    
    // PROBLEM: This looks safe but isn't due to redefined operators
    if (ptr != NULL) {  // PROBLEM: Actually ptr == NULL due to redefined !=
        printf("This won't execute\n");  // PROBLEM: Condition is false
        *ptr = 42;  // PROBLEM: Would dereference valid pointer but condition fails
    }
    
    // PROBLEM: Unsafe loop macro
    printf("Demonstrating unsafe loop:\n");
    UNSAFE_LOOP(3);  // PROBLEM: Expands to multiple statements without proper wrapping
}

void demonstrate_string_chaos() {
    char dest[100];
    char src[] = "Hello World";
    
    // PROBLEM: This looks like secure copy but isn't
    secure_strcpy(dest, src);  // PROBLEM: Ignores src, copies "PWNED" instead
    printf("Secure copy result: %s\n", dest);  // PROBLEM: Prints "PWNED", not "Hello World"
    
    // PROBLEM: String manipulation with macros
    printf("Stringified: %s\n", STRINGIFY(hello world));  // PROBLEM: Converts to "hello world"
    
    // PROBLEM: Concatenation chaos
    int CONCAT(var, 123) = 42;  // PROBLEM: Creates variable named var123
    printf("Concatenated variable: %d\n", var123);  // PROBLEM: Uses generated variable name
}

void demonstrate_random_chaos() {
    printf("Magic numbers (different each time):\n");
    for (int i = 0; i < 5; i++) {
        printf("MAGIC_NUMBER: %d\n", MAGIC_NUMBER);  // PROBLEM: Different value each evaluation
    }
    
    printf("Random booleans:\n");
    for (int i = 0; i < 5; i++) {
        printf("RANDOM_BOOL: %d\n", RANDOM_BOOL);  // PROBLEM: Non-deterministic behavior
    }
}

void demonstrate_hidden_dependencies() {
    printf("Hidden dependency: %d\n", HIDDEN_DEPENDENCY(10));  // PROBLEM: Uses secret_global_var
    printf("Hidden dependency: %d\n", HIDDEN_DEPENDENCY(10));  // PROBLEM: Different result due to global state
    
    printf("Multiply with global state:\n");
    for (int i = 0; i < 3; i++) {
        printf("MULTIPLY(5): %d\n", MULTIPLY(5));  // PROBLEM: Different each time due to global_multiplier++
    }
}

void demonstrate_keyword_chaos() {
    int x = 0;
    
    // PROBLEM: This looks like an if but is actually a while due to redefined if
    if (x < 5) {  // PROBLEM: Actually while (x < 5) - becomes infinite loop
        printf("x = %d\n", x);
        x++;
        if (x == 3) {  // PROBLEM: Nested while (x == 3)
            break;  // PROBLEM: Actually continue due to redefined break
        }
    }
}

void demonstrate_stdlib_chaos() {
    // PROBLEM: These function calls are swapped due to redefinitions
    char *ptr = malloc(100);  // PROBLEM: Actually calls free(100) - undefined behavior
    
    if (ptr) {  // PROBLEM: ptr is probably garbage due to free() call
        strcpy(ptr, "test");  // PROBLEM: Actually calls strlen(ptr, "test") - wrong arguments
    }
    
    free(ptr);  // PROBLEM: Actually calls malloc(ptr) - wrong argument type
}

// PROBLEM: Main function with maximum chaos
int main() {
    printf("⚡ C PREPROCESSOR NIGHTMARE STARTING ⚡\n");
    
    demonstrate_redefined_constants();  // PROBLEM: Boolean logic is inverted
    demonstrate_operator_chaos();       // PROBLEM: Arithmetic operators are swapped
    demonstrate_side_effect_macros();   // PROBLEM: Macros modify arguments unexpectedly
    demonstrate_unsafe_macros();        // PROBLEM: Macros don't behave as expected
    demonstrate_string_chaos();         // PROBLEM: String functions are deceptive
    demonstrate_random_chaos();         // PROBLEM: Non-deterministic macro behavior
    demonstrate_hidden_dependencies();  // PROBLEM: Macros depend on global state
    demonstrate_keyword_chaos();        // PROBLEM: Control flow keywords are swapped
    demonstrate_stdlib_chaos();         // PROBLEM: Standard library functions are swapped
    
    // PROBLEM: Evil function calls
    evil_system();  // PROBLEM: Generated by MAKE_FUNCTION macro
    evil_data();    // PROBLEM: Generated by MAKE_FUNCTION macro
    
    printf("Evil variables: %d, %s\n", evil_counter, evil_message);  // PROBLEM: Generated variables
    
    printf("Line dependent: %s\n", LINE_DEPENDENT);  // PROBLEM: Behavior depends on line number
    
    printf("🎭 C PREPROCESSOR CHAOS COMPLETE 🎭\n");
    
    return SUCCESS;  // PROBLEM: Actually returns -1 (FAILURE) due to redefinition
}

// PROBLEM: Undefine everything at the end for maximum confusion
#undef TRUE      // PROBLEM: Too late - damage already done
#undef FALSE     // PROBLEM: Code above already compiled with wrong definitions
#undef NULL      // PROBLEM: Undefined behavior already occurred
#undef int       // PROBLEM: Type confusion already happened
#undef char      // PROBLEM: Variables already declared with wrong types
#undef float     // PROBLEM: Function signatures already mangled
#undef double    // PROBLEM: Memory layout already corrupted
#undef +         // PROBLEM: Arithmetic already broken
#undef -         // PROBLEM: Calculations already wrong
#undef *         // PROBLEM: Multiplication already division
#undef /         // PROBLEM: Division already multiplication
#undef ==        // PROBLEM: Comparisons already inverted
#undef !=        // PROBLEM: Logic already broken
#undef if        // PROBLEM: Control flow already chaos
#undef while     // PROBLEM: Loops already confused
#undef for       // PROBLEM: Iteration already broken
#undef return    // PROBLEM: Function returns already goto
#undef malloc    // PROBLEM: Memory allocation already free
#undef free      // PROBLEM: Memory deallocation already malloc
#undef printf    // PROBLEM: Output already input

// PROBLEM: But it's too late - the damage is done!

// ─────────────────────────────────────────────────────────────────────────────
// C PREPROCESSOR ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Redefining Constants**: Never redefine TRUE, FALSE, NULL, etc.
// 2. **Redefining Operators**: Never redefine +, -, *, /, ==, !=, etc.
// 3. **Redefining Keywords**: Never redefine if, while, for, return, etc.
// 4. **Redefining Types**: Never redefine int, char, float, double, etc.
// 5. **Redefining Functions**: Never redefine malloc, free, printf, etc.
// 6. **Side Effect Macros**: Macros that modify their arguments
// 7. **Multiple Evaluation**: Macros that evaluate arguments more than once
// 8. **Hidden Dependencies**: Macros that depend on global variables
// 9. **Non-deterministic Macros**: Macros with random or changing behavior
// 10. **Unsafe Multi-line Macros**: Macros without proper do-while wrapping

// WHY C PREPROCESSOR IS DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Text Replacement**: Preprocessor does simple text substitution
// - **No Type Checking**: Macros bypass compiler type checking
// - **No Scope Rules**: Macros don't follow C scoping rules
// - **Multiple Evaluation**: Arguments can be evaluated multiple times
// - **Side Effects**: Macros can have unexpected side effects
// - **Name Conflicts**: Macros can conflict with functions/variables
// - **Debugging Difficulty**: Debugger sees expanded code, not original

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use inline functions instead of function-like macros when possible
// 2. Never redefine language keywords, operators, or standard constants
// 3. Use ALL_CAPS for macro names to distinguish from functions
// 4. Wrap multi-statement macros in do-while(0)
// 5. Parenthesize macro arguments to avoid precedence issues
// 6. Avoid macros with side effects or multiple argument evaluation
// 7. Use const variables instead of #define for constants
// 8. Be careful with token pasting (##) and stringification (#)
// 9. Test macros thoroughly with different argument types
// 10. Document macro behavior and limitations clearly

// Remember: The preprocessor is a powerful but dangerous tool - use it wisely! ⚡
