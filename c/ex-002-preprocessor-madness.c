// ex-002-preprocessor-madness.c
// INTENTIONALLY AWFUL: C preprocessor abuse and macro madness
// This file celebrates complex multi-line macros and conditional compilation chaos
// WARNING: This code will make your preprocessor explode and your compiler weep

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Macro madness - complex multi-line macros
#define CHAOS_LEVEL 888

// Dangerous macro without proper parentheses
#define UNSAFE_ADD(a, b) a + b * 2

// Multi-line macro with side effects
#define DANGEROUS_SWAP(x, y) \
    do { \
        printf("Swapping %d and %d\n", x, y); \
        int temp = x; \
        x = y; \
        y = temp; \
        printf("Swapped to %d and %d\n", x, y); \
    } while(0)

// Macro that modifies its arguments
#define MODIFY_ARGS(a, b) \
    ((a)++, (b)--, printf("Modified: a=%d, b=%d\n", a, b), (a) + (b))

// Recursive macro chaos
#define RECURSIVE_CHAOS(n) \
    ((n) > 0 ? RECURSIVE_CHAOS((n)-1) + (n) : 0)

// Macro with variable arguments (C99)
#define CHAOS_PRINTF(fmt, ...) \
    do { \
        printf("[CHAOS] " fmt, ##__VA_ARGS__); \
        printf(" [FILE: %s, LINE: %d]\n", __FILE__, __LINE__); \
    } while(0)

// Token pasting abuse
#define PASTE(a, b) a##b
#define CHAOS_VAR(name) PASTE(chaos_, name)
#define DECLARE_CHAOS_VAR(type, name) type CHAOS_VAR(name) = 0

// Stringification abuse
#define STRINGIFY(x) #x
#define CHAOS_STRING(x) "CHAOS_" STRINGIFY(x)

// Macro that generates functions
#define GENERATE_CHAOS_FUNCTION(type, name) \
    type chaos_##name(type a, type b) { \
        printf("Generated function: chaos_" #name "\n"); \
        return a + b; \
    }

// Macro that generates entire structs
#define GENERATE_CHAOS_STRUCT(name, type) \
    typedef struct { \
        type data; \
        type backup; \
        int chaos_level; \
        char name[32]; \
    } chaos_##name##_t; \
    \
    void init_##name(chaos_##name##_t* obj, type value) { \
        obj->data = value; \
        obj->backup = value; \
        obj->chaos_level = CHAOS_LEVEL; \
        strcpy(obj->name, #name); \
    }

// Conditional compilation chaos
#ifdef CHAOS_MODE
    #define DEBUG_PRINT(x) printf("DEBUG: " x "\n")
    #define CHAOS_ENABLED 1
#else
    #define DEBUG_PRINT(x)
    #define CHAOS_ENABLED 0
#endif

#ifndef CHAOS_LEVEL
    #define CHAOS_LEVEL 0
#endif

#if CHAOS_LEVEL > 500
    #define EXTREME_CHAOS
    #define CHAOS_MULTIPLIER 10
#elif CHAOS_LEVEL > 100
    #define MODERATE_CHAOS
    #define CHAOS_MULTIPLIER 5
#else
    #define MILD_CHAOS
    #define CHAOS_MULTIPLIER 1
#endif

// Nested conditional compilation
#ifdef EXTREME_CHAOS
    #ifdef __GNUC__
        #define COMPILER_SPECIFIC_CHAOS __attribute__((unused))
    #elif defined(_MSC_VER)
        #define COMPILER_SPECIFIC_CHAOS __declspec(deprecated)
    #else
        #define COMPILER_SPECIFIC_CHAOS
    #endif
#else
    #define COMPILER_SPECIFIC_CHAOS
#endif

// Platform-specific chaos
#ifdef _WIN32
    #define PLATFORM_CHAOS "Windows Chaos"
    #include <windows.h>
#elif defined(__linux__)
    #define PLATFORM_CHAOS "Linux Chaos"
    #include <unistd.h>
#elif defined(__APPLE__)
    #define PLATFORM_CHAOS "macOS Chaos"
    #include <sys/types.h>
#else
    #define PLATFORM_CHAOS "Unknown Platform Chaos"
#endif

// Include guard failures (intentionally broken)
// This file should have include guards, but let's create chaos
#define PREPROCESSOR_HELL_H  // Define but don't use properly

// Circular include simulation
#ifdef ENABLE_CIRCULAR_INCLUDES
    #include "ex-002-preprocessor-hell.c"  // Include self!
#endif

// Generate chaos functions and structs
GENERATE_CHAOS_FUNCTION(int, integer)
GENERATE_CHAOS_FUNCTION(float, floating)
GENERATE_CHAOS_STRUCT(data, int)
GENERATE_CHAOS_STRUCT(info, char*)

// Declare chaos variables
DECLARE_CHAOS_VAR(int, counter)
DECLARE_CHAOS_VAR(float, value)
DECLARE_CHAOS_VAR(char*, message)

// Function with macro chaos
void macro_chaos_demo() {
    printf("🔧 Starting preprocessor chaos...\n");
    
    // Unsafe macro usage
    int a = 5, b = 3;
    int result1 = UNSAFE_ADD(a, b);  // 5 + 3 * 2 = 11, not 16!
    printf("Unsafe add result: %d (expected 16, got %d)\n", result1, result1);
    
    // Macro with side effects
    int x = 10, y = 20;
    printf("Before swap: x=%d, y=%d\n", x, y);
    DANGEROUS_SWAP(x, y);
    printf("After swap: x=%d, y=%d\n", x, y);
    
    // Macro that modifies arguments
    int m = 5, n = 10;
    printf("Before modify: m=%d, n=%d\n", m, n);
    int modify_result = MODIFY_ARGS(m, n);
    printf("Modify result: %d, m=%d, n=%d\n", modify_result, m, n);
    
    // Token pasting chaos
    CHAOS_VAR(counter) = 42;
    CHAOS_VAR(value) = 3.14f;
    CHAOS_VAR(message) = "Hello Chaos";
    
    printf("Chaos variables: counter=%d, value=%.2f, message=%s\n", 
           CHAOS_VAR(counter), CHAOS_VAR(value), CHAOS_VAR(message));
    
    // Stringification
    printf("Chaos string: %s\n", CHAOS_STRING(PREPROCESSOR_HELL));
    
    // Variable argument macro
    CHAOS_PRINTF("Testing variable args: %d, %s", 123, "chaos");
    CHAOS_PRINTF("No additional args");
    
    // Generated functions
    int func_result1 = chaos_integer(10, 20);
    float func_result2 = chaos_floating(1.5f, 2.5f);
    printf("Generated function results: %d, %.2f\n", func_result1, func_result2);
    
    // Generated structs
    chaos_data_t data_obj;
    init_data(&data_obj, 999);
    printf("Generated struct: data=%d, backup=%d, chaos_level=%d, name=%s\n",
           data_obj.data, data_obj.backup, data_obj.chaos_level, data_obj.name);
}

// Conditional compilation demonstration
void conditional_chaos_demo() {
    printf("🔀 Starting conditional compilation chaos...\n");
    
    DEBUG_PRINT("This is a debug message");
    
    printf("Chaos enabled: %d\n", CHAOS_ENABLED);
    printf("Chaos level: %d\n", CHAOS_LEVEL);
    printf("Chaos multiplier: %d\n", CHAOS_MULTIPLIER);
    printf("Platform: %s\n", PLATFORM_CHAOS);
    
    #ifdef EXTREME_CHAOS
        printf("EXTREME CHAOS MODE ACTIVATED!\n");
    #elif defined(MODERATE_CHAOS)
        printf("Moderate chaos mode active.\n");
    #else
        printf("Mild chaos mode.\n");
    #endif
    
    // Compiler-specific code
    COMPILER_SPECIFIC_CHAOS int unused_var = 42;
    printf("Compiler-specific chaos applied\n");
}

// Macro abuse with complex expressions
#define COMPLEX_MACRO(a, b, c) \
    ({ \
        int _temp1 = (a) + (b); \
        int _temp2 = (b) * (c); \
        int _temp3 = (a) - (c); \
        printf("Complex macro: %d, %d, %d\n", _temp1, _temp2, _temp3); \
        (_temp1 > _temp2) ? _temp1 : (_temp2 > _temp3) ? _temp2 : _temp3; \
    })

// Macro that uses goto (very dangerous)
#define CHAOS_GOTO(label) \
    do { \
        printf("Jumping to " #label "\n"); \
        goto label; \
    } while(0)

// Function with goto chaos
void goto_chaos_demo() {
    printf("🦘 Starting goto chaos...\n");
    
    int i = 0;
    
start:
    printf("Loop iteration: %d\n", i);
    i++;
    
    if (i < 3) {
        CHAOS_GOTO(start);
    }
    
    printf("Goto chaos complete\n");
}

// Macro redefinition chaos
#define REDEFINE_ME 1
#undef REDEFINE_ME
#define REDEFINE_ME 2
#undef REDEFINE_ME
#define REDEFINE_ME "chaos"

void redefinition_chaos() {
    printf("🔄 Redefinition chaos: %s\n", REDEFINE_ME);
}

// Main function
int main() {
    printf("🔧 C PREPROCESSOR NIGHTMARE STARTING! 🔧\n");
    
    // Run all chaos demonstrations
    macro_chaos_demo();
    conditional_chaos_demo();
    goto_chaos_demo();
    redefinition_chaos();
    
    // Recursive macro (limited by preprocessor)
    printf("Recursive macro result: %d\n", RECURSIVE_CHAOS(5));
    
    // Complex macro usage
    int complex_result = COMPLEX_MACRO(10, 5, 3);
    printf("Complex macro result: %d\n", complex_result);
    
    printf("🔥 C PREPROCESSOR CHAOS COMPLETE! 🔥\n");
    printf("Preprocessor: ABUSED\n");
    printf("Macros: OVERUSED\n");
    printf("Readability: DESTROYED\n");
    
    return 0;
}

// More chaos after main (dead code that might still be processed)
#ifdef NEVER_DEFINED
    #error "This should never be compiled"
    #include "nonexistent_file.h"
    UNDEFINED_MACRO(chaos);
#endif

// Nested macro definitions
#define OUTER_MACRO(x) INNER_MACRO(x)
#define INNER_MACRO(x) DEEP_MACRO(x)
#define DEEP_MACRO(x) printf("Deep macro: " #x "\n")

// Macro that depends on undefined behavior
#define UNDEFINED_BEHAVIOR_MACRO(x) \
    ((x) << 32)  // Undefined if x is 32-bit int

// Final chaos
#if 1
    #if 1
        #if 1
            #if 1
                // Deeply nested conditional compilation
                #define DEEPLY_NESTED "CHAOS ACHIEVED"
            #endif
        #endif
    #endif
#endif
