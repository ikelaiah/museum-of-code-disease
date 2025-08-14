// ex-002-preprocessor-madness-autopsy.c AUTOPSY VERSION
// INTENTIONALLY AWFUL: C preprocessor abuse and macro madness
// This file celebrates complex multi-line macros and conditional compilation chaos
// AUTOPSY: Same challenge code with detailed explanations of C preprocessor anti-patterns

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// PROBLEM: Macro madness - complex multi-line macros
#define CHAOS_LEVEL 888
// WHY THIS IS PROBLEMATIC: Magic numbers in macros make code hard to understand and maintain
// FIX: Use named constants with clear documentation

// PROBLEM: Dangerous macro without proper parentheses
#define UNSAFE_ADD(a, b) a + b * 2
// WHY THIS IS PROBLEMATIC: Without parentheses, operator precedence can cause unexpected results
// For example: UNSAFE_ADD(3, 4) * 2 becomes 3 + 4 * 2 * 2 = 19, not 22!
// FIX: Always use parentheses: #define SAFE_ADD(a, b) ((a) + (b) * 2)

// PROBLEM: Multi-line macro with side effects
#define DANGEROUS_SWAP(x, y) \
    do { \
        printf("Swapping %d and %d\n", x, y); \
        int temp = x; \
        x = y; \
        y = temp; \
        printf("Swapped to %d and %d\n", x, y); \
    } while(0)
// WHY THIS IS PROBLEMATIC: Macro with side effects (printf) and creates local variable
// FIX: Use inline functions for complex operations

// PROBLEM: Macro that modifies its arguments
#define MODIFY_ARGS(a, b) \
    ((a)++, (b)--, printf("Modified: a=%d, b=%d\n", a, b), (a) + (b))
// WHY THIS IS PROBLEMATIC: Modifies arguments unexpectedly, uses comma operator
// FIX: Never modify macro arguments, use functions for complex logic

// PROBLEM: Recursive macro chaos
#define RECURSIVE_CHAOS(n) \
    ((n) > 0 ? RECURSIVE_CHAOS((n)-1) + (n) : 0)
// WHY THIS IS PROBLEMATIC: Recursive macros can cause infinite expansion or stack overflow
// FIX: Use proper recursive functions instead of macros

// PROBLEM: Macro with variable arguments (C99)
#define CHAOS_PRINTF(fmt, ...) \
    do { \
        printf("[CHAOS] " fmt, ##__VA_ARGS__); \
        printf(" [FILE: %s, LINE: %d]\n", __FILE__, __LINE__); \
    } while(0)
// WHY THIS IS PROBLEMATIC: Complex variadic macro that's hard to debug
// FIX: Use proper logging functions with format checking

// PROBLEM: Token pasting abuse
#define PASTE(a, b) a##b
#define CHAOS_VAR(name) PASTE(chaos_, name)
#define DECLARE_CHAOS_VAR(type, name) type CHAOS_VAR(name) = 0
// WHY THIS IS PROBLEMATIC: Token pasting makes code unreadable and hard to debug
// FIX: Use clear variable names, avoid token pasting for simple cases

// PROBLEM: Stringification abuse
#define STRINGIFY(x) #x
#define CHAOS_STRING(x) "CHAOS_" STRINGIFY(x)
// WHY THIS IS PROBLEMATIC: Stringification can create confusing string literals
// FIX: Use explicit string constants when possible

            #else
                #define INSANE_LOG(msg)                        // PROBLEM: Empty macro
            #endif
        #else
            #define ULTRA_LOG(msg)
            #define INSANE_LOG(msg)
        #endif
    #else
        #define VERBOSE_LOG(msg)
        #define ULTRA_LOG(msg)
        #define INSANE_LOG(msg)
    #endif
#else
    #define LOG(msg)
    #define VERBOSE_LOG(msg)
    #define ULTRA_LOG(msg)
    #define INSANE_LOG(msg)
#endif
// FIX: Use runtime logging levels, avoid deep conditional nesting

// PROBLEM: Platform-specific chaos
#if defined(WIN32) || defined(_WIN32) || defined(__WIN32__) || defined(__NT__)
    #define PLATFORM "Windows"
    #define PATH_SEPARATOR '\\'
    #define NEWLINE "\r\n"
    #ifdef _WIN64
        #define ARCH "x64"
        #define POINTER_SIZE 8
    #else
        #define ARCH "x86"
        #define POINTER_SIZE 4
    #endif
#elif defined(__APPLE__) && defined(__MACH__)
    #define PLATFORM "macOS"
    #define PATH_SEPARATOR '/'
    #define NEWLINE "\n"
    #ifdef __x86_64__
        #define ARCH "x64"
        #define POINTER_SIZE 8
    #elif defined(__arm64__)
        #define ARCH "ARM64"
        #define POINTER_SIZE 8
    #else
        #define ARCH "Unknown"
        #define POINTER_SIZE 4                                 // PROBLEM: Assumption
    #endif
#elif defined(__linux__)
    #define PLATFORM "Linux"
    #define PATH_SEPARATOR '/'
    #define NEWLINE "\n"
    #ifdef __x86_64__
        #define ARCH "x64"
        #define POINTER_SIZE 8
    #elif defined(__i386__)
        #define ARCH "x86"
        #define POINTER_SIZE 4
    #elif defined(__arm__)
        #define ARCH "ARM"
        #define POINTER_SIZE 4
    #elif defined(__aarch64__)
        #define ARCH "ARM64"
        #define POINTER_SIZE 8
    #else
        #define ARCH "Unknown"
        #define POINTER_SIZE sizeof(void*)                     // PROBLEM: Runtime calculation in macro
    #endif
#else
    #define PLATFORM "Unknown"                                 // PROBLEM: Fallback might be wrong
    #define PATH_SEPARATOR '/'                                 // PROBLEM: Assumption
    #define NEWLINE "\n"                                       // PROBLEM: Assumption
    #define ARCH "Unknown"
    #define POINTER_SIZE sizeof(void*)
#endif
// FIX: Use runtime detection, avoid assumptions, use standard libraries

// PROBLEM: Compiler-specific chaos
#ifdef __GNUC__
    #define COMPILER "GCC"
    #define FORCE_INLINE __attribute__((always_inline)) inline
    #define PACKED __attribute__((packed))
    #define DEPRECATED __attribute__((deprecated))
    #ifdef __clang__
        #undef COMPILER
        #define COMPILER "Clang"                               // PROBLEM: Redefine based on nested condition
    #endif
#elif defined(_MSC_VER)
    #define COMPILER "MSVC"
    #define FORCE_INLINE __forceinline
    #define PACKED __pragma(pack(push, 1))                     // PROBLEM: Different syntax
    #define DEPRECATED __declspec(deprecated)
#elif defined(__INTEL_COMPILER)
    #define COMPILER "Intel"
    #define FORCE_INLINE inline
    #define PACKED                                             // PROBLEM: Empty macro
    #define DEPRECATED
#else
    #define COMPILER "Unknown"
    #define FORCE_INLINE inline                                // PROBLEM: Fallback might not work
    #define PACKED
    #define DEPRECATED
#endif
// FIX: Use standard C features when possible, provide proper fallbacks

// PROBLEM: Version-specific chaos
#if __STDC_VERSION__ >= 201112L
    #define C_VERSION "C11"
    #define HAS_STATIC_ASSERT 1
    #define HAS_GENERIC 1
#elif __STDC_VERSION__ >= 199901L
    #define C_VERSION "C99"
    #define HAS_STATIC_ASSERT 0
    #define HAS_GENERIC 0
#elif defined(__STDC__)
    #define C_VERSION "C90"
    #define HAS_STATIC_ASSERT 0
    #define HAS_GENERIC 0
#else
    #define C_VERSION "Pre-ANSI"                               // PROBLEM: Very old C
    #define HAS_STATIC_ASSERT 0
    #define HAS_GENERIC 0
#endif
// FIX: Use feature detection instead of version detection

// PROBLEM: Include guard failures (intentionally broken)
#ifndef CHAOS_HEADER_GUARD
#define CHAOS_HEADER_GUARD
// PROBLEM: This should be in a header file, but it's in a .c file
// PROBLEM: Multiple definitions if this file is included multiple times

// PROBLEM: Macro that generates other macros
#define GENERATE_CHAOS_MACROS(prefix) \
    #define prefix##_INIT() printf("Initializing " #prefix "\n") \
    #define prefix##_CLEANUP() printf("Cleaning up " #prefix "\n") \
    #define prefix##_PROCESS(x) printf("Processing " #prefix ": %d\n", x)

// PROBLEM: Use the macro generator
GENERATE_CHAOS_MACROS(DATABASE)                                // PROBLEM: Creates DATABASE_INIT, etc.
GENERATE_CHAOS_MACROS(NETWORK)                                 // PROBLEM: Creates NETWORK_INIT, etc.
GENERATE_CHAOS_MACROS(FILE_SYSTEM)                             // PROBLEM: Creates FILE_SYSTEM_INIT, etc.

#endif // CHAOS_HEADER_GUARD
// FIX: Use proper header files, avoid macro generation

// PROBLEM: Variadic macro abuse
#define CHAOS_PRINTF(format, ...) printf("CHAOS: " format, ##__VA_ARGS__)
#define CHAOS_FPRINTF(file, format, ...) fprintf(file, "CHAOS: " format, ##__VA_ARGS__)
#define CHAOS_SPRINTF(buffer, format, ...) sprintf(buffer, "CHAOS: " format, ##__VA_ARGS__)
// FIX: Use proper logging functions, avoid sprintf (use snprintf)

// PROBLEM: Macro that changes control flow
#define CHAOS_RETURN_IF_NULL(ptr) if ((ptr) == NULL) { printf("Null pointer at line %d\n", __LINE__); return; }
#define CHAOS_EXIT_IF_NULL(ptr) if ((ptr) == NULL) { printf("Null pointer at line %d\n", __LINE__); exit(1); }
#define CHAOS_GOTO_IF_NULL(ptr, label) if ((ptr) == NULL) { printf("Null pointer at line %d\n", __LINE__); goto label; }
// FIX: Use explicit control flow, avoid hidden jumps in macros

// PROBLEM: Macro that looks like a statement but isn't
#define CHAOS_SWAP(a, b) (a) ^= (b); (b) ^= (a); (a) ^= (b)   // PROBLEM: Multiple statements, XOR swap issues
#define CHAOS_MIN_MAX(a, b, min_var, max_var) if ((a) < (b)) { min_var = (a); max_var = (b); } else { min_var = (b); max_var = (a); }
// FIX: Use do-while(0) wrapper, avoid XOR swap, use proper functions

// PROBLEM: Generate functions using macros
MAKE_FUNCTION(database)                                        // PROBLEM: Creates chaos_database()
MAKE_FUNCTION(network)                                         // PROBLEM: Creates chaos_network()
MAKE_FUNCTION(filesystem)                                      // PROBLEM: Creates chaos_filesystem()

// PROBLEM: Generate variables using macros
MAKE_VARIABLE(int, counter)                                    // PROBLEM: Creates chaos_counter
MAKE_VARIABLE(float, temperature)                              // PROBLEM: Creates chaos_temperature
MAKE_VARIABLE(char*, message)                                  // PROBLEM: Creates chaos_message

// PROBLEM: Generate structs using macros
MAKE_STRUCT(config)                                            // PROBLEM: Creates struct chaos_config
MAKE_STRUCT(state)                                             // PROBLEM: Creates struct chaos_state
MAKE_STRUCT(data)                                              // PROBLEM: Creates struct chaos_data

// PROBLEM: Function with macro chaos
void preprocessor_chaos_demo(void) {
    /*
    PROBLEM: This function demonstrates multiple preprocessor anti-patterns:
    1. Uses macros that evaluate arguments multiple times
    2. Uses macros with side effects
    3. Uses macros that change control flow
    4. Uses generated code that's hard to debug
    
    WHY THIS IS PROBLEMATIC:
    - Makes debugging extremely difficult
    - Can cause unexpected behavior with side effects
    - Generated code is not visible in source
    - Macros can have surprising interactions
    
    FIX: Use inline functions, explicit code, proper debugging tools
    */
    
    printf("🔧 C PREPROCESSOR NIGHTMARE STARTING - PREPARE FOR MACRO CHAOS! 🔧\n");
    
    // PROBLEM: Platform and compiler info using macros
    printf("Platform: %s\n", PLATFORM);
    printf("Architecture: %s\n", ARCH);
    printf("Compiler: %s\n", COMPILER);
    printf("C Version: %s\n", C_VERSION);
    printf("Pointer size: %d bytes\n", POINTER_SIZE);
    
    // PROBLEM: Use dangerous macros
    int a = 5, b = 10;
    int max_val = MAX(++a, ++b);                               // PROBLEM: a and b incremented multiple times
    printf("MAX(++a, ++b) = %d, a = %d, b = %d\n", max_val, a, b);
    
    // PROBLEM: Use macro with side effects
    int x = 5;
    int incremented = UNSAFE_INCREMENT(x);                     // PROBLEM: x is incremented
    printf("UNSAFE_INCREMENT(x) = %d, x = %d\n", incremented, x);
    
    // PROBLEM: Use debug macros
    int debug_var = 42;
    DEBUG_PRINT(debug_var);                                    // PROBLEM: Assumes int type
    
    // PROBLEM: Use assertion macro
    CHAOS_ASSERT(debug_var == 42);                             // PROBLEM: Custom assertion
    
    // PROBLEM: Use logging macros
    LOG("This is a debug message");
    VERBOSE_LOG("This is a verbose message");
    ULTRA_LOG("This is an ultra verbose message");
    INSANE_LOG("This is an insane debug message");
    
    // PROBLEM: Use variadic macros
    CHAOS_PRINTF("Testing variadic macro with %d arguments: %s, %f\n", 2, "hello", 3.14);
    
    // PROBLEM: Use control flow macros
    char* test_ptr = malloc(100);
    CHAOS_RETURN_IF_NULL(test_ptr);                            // PROBLEM: Hidden return statement
    
    // PROBLEM: Use swap macro
    int swap_a = 10, swap_b = 20;
    printf("Before swap: a = %d, b = %d\n", swap_a, swap_b);
    CHAOS_SWAP(swap_a, swap_b);                                // PROBLEM: XOR swap with multiple statements
    printf("After swap: a = %d, b = %d\n", swap_a, swap_b);
    
    // PROBLEM: Use min/max macro
    int min_val, max_val2;
    CHAOS_MIN_MAX(swap_a, swap_b, min_val, max_val2);          // PROBLEM: Multiple statements in macro
    printf("Min: %d, Max: %d\n", min_val, max_val2);
    
    // PROBLEM: Generate chaos functions and structs using macros
    GENERATE_CHAOS_FUNCTION(int, integer)
    GENERATE_CHAOS_FUNCTION(float, floating)
    GENERATE_CHAOS_STRUCT(data, int)
    GENERATE_CHAOS_STRUCT(info, char*)
    // WHY THIS IS PROBLEMATIC: Generated code is hard to debug and understand
    // FIX: Write functions and structs explicitly
    
    // PROBLEM: Declare chaos variables using token pasting
    DECLARE_CHAOS_VAR(int, counter)
    DECLARE_CHAOS_VAR(float, value)
    DECLARE_CHAOS_VAR(char*, message)
    // WHY THIS IS PROBLEMATIC: Variable names are obscured by macros
    // FIX: Declare variables with clear, explicit names
}
    
    #if HAS_GENERIC
        printf("Generic selection is available\n");
    #else
        printf("Generic selection is NOT available\n");
    #endif
    
    // PROBLEM: Cleanup
    free(test_ptr);
    
    printf("🔥 C PREPROCESSOR CHAOS COMPLETE! 🔥\n");
}

// PROBLEM: Main function
int main(void) {
    preprocessor_chaos_demo();
    return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// C PREPROCESSOR ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Macro Side Effects**: Macros that evaluate arguments multiple times
// 2. **Token Pasting Abuse**: Excessive use of ## operator for code generation
// 3. **Conditional Compilation Chaos**: Deep nesting of #ifdef blocks
// 4. **Macro Function Confusion**: Macros that look like functions but aren't
// 5. **Include Guard Failures**: Broken or missing include guards
// 6. **Recursive Macro Definitions**: Macros that call themselves
// 7. **Platform-Specific Assumptions**: Hardcoded platform/compiler assumptions
// 8. **Control Flow Macros**: Macros that contain return, goto, or break
// 9. **Self-Modifying Macros**: Macros that redefine themselves
// 10. **Generated Code Chaos**: Using macros to generate functions/variables

// WHY C PREPROCESSOR IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Text Replacement**: Preprocessor does simple text substitution
// - **No Type Checking**: Macros bypass all type safety
// - **Multiple Evaluation**: Arguments can be evaluated multiple times
// - **Scope Ignorance**: Preprocessor doesn't understand C scoping rules
// - **Debug Difficulty**: Debugger sees expanded code, not original macros
// - **Side Effect Amplification**: Side effects in macro arguments are multiplied
// - **Conditional Compilation**: Can create platform-specific code paths
// - **Token Pasting Power**: Can generate arbitrary identifiers

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Use inline functions instead of function-like macros when possible
// 2. Avoid token pasting unless absolutely necessary
// 3. Keep conditional compilation simple and well-documented
// 4. Use const variables instead of #define for constants
// 5. Use proper include guards in header files
// 6. Avoid recursive macro definitions
// 7. Use runtime detection instead of compile-time assumptions
// 8. Never use macros that change control flow
// 9. Don't create self-modifying macros
// 10. Prefer explicit code over generated code

// Remember: The preprocessor is a powerful but dangerous tool - use it wisely! 🔧
