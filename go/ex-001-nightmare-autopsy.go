// ex-001-goroutine-leak-paradise.go AUTOPSY VERSION
// INTENTIONALLY AWFUL: Go concurrency disasters and interface{} abuse
// This file celebrates every Go anti-pattern known to gophers
// AUTOPSY: Same nightmare code with detailed explanations of Go's dangerous patterns

package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"reflect"
	"runtime"
	"sync"
	"time"
	"unsafe"
)

// PROBLEM: Global variable soup with no protection
var (
	GlobalCounter    int                    // PROBLEM: Racy counter - no synchronization
	GlobalMap        map[string]interface{} // PROBLEM: interface{} defeats type safety
	GlobalSlice      []interface{}          // PROBLEM: More interface{} abuse
	GlobalChannel    chan interface{}       // PROBLEM: Unbuffered channel for deadlocks
	GlobalMutex      sync.Mutex             // PROBLEM: Mutex that's never used properly
	GlobalWaitGroup  sync.WaitGroup         // PROBLEM: WaitGroup that's never waited on
	GlobalContext    context.Context        // PROBLEM: Global context (anti-pattern)
	GlobalCancel     context.CancelFunc     // PROBLEM: Global cancel function
	GlobalHTTPClient *http.Client           // PROBLEM: Shared HTTP client with no timeouts
	GlobalDB         *sql.DB                // PROBLEM: Global database connection
)
// FIX: Use local variables, proper synchronization, typed channels, context passing

// PROBLEM: Interface{} abuse - everything is interface{}
type ChaosStruct struct {
	Data     interface{}            // PROBLEM: Could be anything - no type safety
	MoreData interface{}            // PROBLEM: Literally anything
	Config   map[string]interface{} // PROBLEM: Configuration chaos
	Callback func(interface{}) interface{} // PROBLEM: Function that takes and returns anything
}
// FIX: Use concrete types, generics (Go 1.18+), or type assertions with checks

// PROBLEM: Goroutine leak generator
func goroutineLeakParadise() {
	fmt.Println("🚀 Starting goroutine leak paradise...")
	
	// PROBLEM: Leak #1 - Goroutines waiting on channels that never get data
	for i := 0; i < 100; i++ {
		go func(id int) {
			ch := make(chan string) // PROBLEM: Unbuffered channel, never written to
			select {
			case msg := <-ch:
				fmt.Printf("Goroutine %d got: %s\n", id, msg) // PROBLEM: Never executes
			}
			// PROBLEM: Goroutine blocks forever waiting for channel data
		}(i)
	}
	// FIX: Use context for cancellation, buffered channels, or timeouts
	
	// PROBLEM: Leak #2 - Infinite loops in goroutines
	for i := 0; i < 50; i++ {
		go func(id int) {
			for {
				GlobalCounter++ // PROBLEM: Racy increment without synchronization
				time.Sleep(time.Nanosecond) // PROBLEM: Tiny sleep doesn't help race condition
			}
			// PROBLEM: Infinite loop never exits - goroutine leaks forever
		}(i)
	}
	// FIX: Use atomic operations, mutexes, or channels for synchronization
	
	// PROBLEM: Leak #3 - HTTP requests with no timeout in goroutines
	for i := 0; i < 20; i++ {
		go func(id int) {
			resp, err := http.Get("http://httpbin.org/delay/30") // PROBLEM: 30 second delay, no timeout
			if err != nil {
				panic(err) // PROBLEM: Panic in goroutine crashes entire program
			}
			defer resp.Body.Close() // PROBLEM: If we ever get here
		}(i)
	}
	// FIX: Use http.Client with timeout, context with deadline, proper error handling
	
	// PROBLEM: Leak #4 - Context that's never cancelled
	ctx, cancel := context.WithCancel(context.Background())
	_ = cancel // PROBLEM: Never call cancel - context leaks
	
	for i := 0; i < 30; i++ {
		go func(id int) {
			select {
			case <-ctx.Done():
				return // PROBLEM: Never happens because context never cancelled
			case <-time.After(time.Hour):
				fmt.Printf("Goroutine %d timed out\n", id)
			}
		}(i)
	}
	// FIX: Always call cancel(), use defer cancel(), pass context properly
}

// PROBLEM: Panic-driven development
func panicDrivenDevelopment(data interface{}) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from panic: %v\n", r)
			// PROBLEM: Return something random on panic - inconsistent behavior
			return map[string]interface{}{
				"error": r,
				"random": rand.Intn(1000),
			}
		}
	}()
	
	// PROBLEM: Use panic for control flow instead of error returns
	if data == nil {
		panic("data is nil, obviously") // PROBLEM: Panic for normal error condition
	}
	
	// PROBLEM: Type assertion without checking
	str := data.(string) // PROBLEM: Will panic if not string - no ok check
	
	if len(str) == 0 {
		panic("empty string, panic time!") // PROBLEM: Panic for empty string
	}
	
	if str == "panic" {
		panic("you asked for it!") // PROBLEM: Panic based on input value
	}
	
	// PROBLEM: More panic-prone operations
	slice := []int{1, 2, 3}
	index := len(str) // PROBLEM: Use string length as index
	return slice[index] // PROBLEM: Will panic if index >= 3 - out of bounds
}
// FIX: Return errors instead of panicking, use type assertions with ok check

// PROBLEM: Interface{} abuse everywhere
func interfaceChaos() interface{} {
	// PROBLEM: Everything is interface{} - no compile-time type checking
	var data interface{} = "hello"
	var moreData interface{} = 42
	var evenMoreData interface{} = []interface{}{1, "two", 3.0, true, nil}
	
	// PROBLEM: Type assertions without checking
	str := data.(string)        // PROBLEM: Will panic if not string
	num := moreData.(int)       // PROBLEM: Will panic if not int
	slice := evenMoreData.([]interface{}) // PROBLEM: Will panic if not slice
	
	// PROBLEM: Build a map of interface{} - type safety completely lost
	result := make(map[string]interface{})
	result["string"] = str
	result["number"] = num
	result["slice"] = slice
	result["nested"] = map[string]interface{}{
		"level1": map[string]interface{}{
			"level2": map[string]interface{}{
				"level3": "deep interface{} nesting", // PROBLEM: Deeply nested interface{}
			},
		},
	}
	
	// PROBLEM: JSON marshal/unmarshal with interface{} loses type information
	jsonData, _ := json.Marshal(result)
	var unmarshaled interface{}
	json.Unmarshal(jsonData, &unmarshaled)
	
	return unmarshaled // PROBLEM: Return interface{} of course
}
// FIX: Use concrete types, struct definitions, type assertions with ok check

// PROBLEM: Error swallowing paradise
func errorSwallowingParadise() {
	// PROBLEM: Ignore all errors with blank identifier
	file, _ := os.Open("nonexistent.txt") // PROBLEM: Ignore error, file will be nil
	defer file.Close() // PROBLEM: Will panic if file is nil
	
	data := make([]byte, 1024)
	_, _ = file.Read(data) // PROBLEM: Ignore read error, file is nil
	
	// PROBLEM: HTTP request ignoring errors
	resp, _ := http.Get("http://invalid-url-that-will-fail") // PROBLEM: Ignore error
	defer resp.Body.Close() // PROBLEM: Will panic if resp is nil
	
	// PROBLEM: JSON operations ignoring errors
	var result interface{}
	_ = json.Unmarshal([]byte("invalid json"), &result) // PROBLEM: Ignore unmarshal error
	
	// PROBLEM: Database operations ignoring errors
	if GlobalDB != nil {
		rows, _ := GlobalDB.Query("SELECT * FROM nonexistent_table") // PROBLEM: Ignore query error
		defer rows.Close() // PROBLEM: Might be nil
		
		for rows.Next() {
			var data interface{}
			_ = rows.Scan(&data) // PROBLEM: Ignore scan errors
		}
		_ = rows.Err() // PROBLEM: Ignore iteration errors
	}
}
// FIX: Always check errors, handle them appropriately, use error wrapping

// PROBLEM: Defer abuse in loops
func deferAbuseInLoops() {
	// PROBLEM: Defer in loop - all defers execute at function end
	for i := 0; i < 1000; i++ {
		file, err := os.Create(fmt.Sprintf("temp_%d.txt", i))
		if err != nil {
			continue
		}
		defer file.Close() // PROBLEM: All 1000 files stay open until function ends
		defer os.Remove(file.Name()) // PROBLEM: All removals happen at function end
		
		file.WriteString(fmt.Sprintf("File %d content", i))
	}
	// PROBLEM: Function holds 1000 file handles until it returns
	
	// PROBLEM: More defer abuse
	for i := 0; i < 100; i++ {
		mutex := &sync.Mutex{}
		mutex.Lock()
		defer mutex.Unlock() // PROBLEM: All unlocks happen at function end
		
		GlobalCounter += i // PROBLEM: All increments happen while all mutexes are locked
	}
}
// FIX: Use anonymous functions or separate function calls to limit defer scope

// PROBLEM: Reflection abuse
func reflectionChaos(data interface{}) interface{} {
	v := reflect.ValueOf(data)
	t := reflect.TypeOf(data)
	
	fmt.Printf("Type: %v, Kind: %v\n", t, v.Kind())
	
	// PROBLEM: Modify unexported fields using reflection
	if v.Kind() == reflect.Ptr && v.Elem().Kind() == reflect.Struct {
		elem := v.Elem()
		for i := 0; i < elem.NumField(); i++ {
			field := elem.Field(i)
			if field.CanSet() {
				// PROBLEM: Set everything to random values
				switch field.Kind() {
				case reflect.String:
					field.SetString("HACKED_BY_REFLECTION") // PROBLEM: Modify private fields
				case reflect.Int, reflect.Int64:
					field.SetInt(888) // PROBLEM: Set arbitrary values
				case reflect.Bool:
					field.SetBool(true)
				}
			} else {
				// PROBLEM: Use unsafe to modify unexported fields
				ptr := unsafe.Pointer(field.UnsafeAddr()) // PROBLEM: Unsafe pointer manipulation
				switch field.Kind() {
				case reflect.String:
					*(*string)(ptr) = "UNSAFE_HACK" // PROBLEM: Bypass Go's type safety
				case reflect.Int:
					*(*int)(ptr) = 999
				}
			}
		}
	}
	
	return data
}
// FIX: Use interfaces and methods instead of reflection, avoid unsafe package

// PROBLEM: Channel chaos
func channelChaos() {
	// PROBLEM: Unbuffered channels causing deadlocks
	ch1 := make(chan interface{})
	ch2 := make(chan interface{})
	
	// PROBLEM: Goroutine that will deadlock
	go func() {
		ch1 <- "hello" // PROBLEM: Blocks forever - no receiver
		ch2 <- "world" // PROBLEM: Never reached
	}()
	
	// PROBLEM: Never read from channels
	time.Sleep(100 * time.Millisecond)
	
	// PROBLEM: Close channels multiple times
	close(ch1)
	close(ch1) // PROBLEM: Panic! - closing closed channel
}
// FIX: Use buffered channels, proper synchronization, check if channel is closed

// PROBLEM: Race condition paradise
func raceConditionParadise() {
	// PROBLEM: Multiple goroutines modifying global state without synchronization
	for i := 0; i < 100; i++ {
		go func(id int) {
			// PROBLEM: Race on global map
			if GlobalMap == nil {
				GlobalMap = make(map[string]interface{}) // PROBLEM: Race condition on initialization
			}
			GlobalMap[fmt.Sprintf("key_%d", id)] = id // PROBLEM: Concurrent map writes
			
			// PROBLEM: Race on global slice
			GlobalSlice = append(GlobalSlice, id) // PROBLEM: Concurrent slice modifications
			
			// PROBLEM: Race on global counter
			GlobalCounter++ // PROBLEM: Non-atomic increment
			
			// PROBLEM: Race on map iteration and modification
			for k, v := range GlobalMap {
				if v.(int) > 50 {
					delete(GlobalMap, k) // PROBLEM: Modify while iterating
				}
			}
		}(i)
	}
}
// FIX: Use sync.Mutex, sync.RWMutex, atomic operations, or channels

// PROBLEM: HTTP client abuse
func httpClientAbuse() {
	// PROBLEM: HTTP client with no timeouts
	client := &http.Client{
		Timeout: 0, // PROBLEM: No timeout - requests can hang forever
	}
	
	// PROBLEM: Make requests in goroutines without proper error handling
	for i := 0; i < 50; i++ {
		go func(id int) {
			resp, err := client.Get("http://httpbin.org/delay/60") // PROBLEM: 60 second delay
			if err != nil {
				panic(err) // PROBLEM: Panic in goroutine
			}
			defer resp.Body.Close()
			
			// PROBLEM: Read entire response into memory without size limits
			var data interface{}
			json.NewDecoder(resp.Body).Decode(&data) // PROBLEM: No size limit
			
			// PROBLEM: Store in global state without synchronization
			GlobalMap[fmt.Sprintf("response_%d", id)] = data // PROBLEM: Race condition
		}(i)
	}
}
// FIX: Set timeouts, handle errors properly, limit response size, synchronize access

// PROBLEM: Main chaos orchestrator
func main() {
	fmt.Println("🐹 GO NIGHTMARE STARTING - PREPARE FOR CHAOS! 🐹")
	
	// PROBLEM: Initialize global chaos
	GlobalMap = make(map[string]interface{})
	GlobalSlice = make([]interface{}, 0)
	GlobalChannel = make(chan interface{})
	GlobalContext, GlobalCancel = context.WithCancel(context.Background())
	GlobalHTTPClient = &http.Client{} // PROBLEM: No timeout
	
	// PROBLEM: Start the chaos
	goroutineLeakParadise() // PROBLEM: Leaks 170+ goroutines
	
	// PROBLEM: Panic-driven development
	result := panicDrivenDevelopment("panic") // PROBLEM: Will panic and recover
	fmt.Printf("Panic result: %v\n", result)
	
	// PROBLEM: Interface{} chaos
	interfaceResult := interfaceChaos()
	fmt.Printf("Interface chaos: %v\n", interfaceResult)
	
	// PROBLEM: Error swallowing
	errorSwallowingParadise() // PROBLEM: Ignores all errors
	
	// PROBLEM: Defer abuse
	deferAbuseInLoops() // PROBLEM: Holds 1000+ file handles
	
	// PROBLEM: Reflection chaos
	chaos := &ChaosStruct{
		Data:     "original",
		MoreData: 42,
		Config:   make(map[string]interface{}),
	}
	reflectionChaos(chaos) // PROBLEM: Modifies private fields
	fmt.Printf("After reflection chaos: %+v\n", chaos)
	
	// PROBLEM: Race conditions
	raceConditionParadise() // PROBLEM: 100 goroutines racing on globals
	
	// PROBLEM: HTTP abuse
	httpClientAbuse() // PROBLEM: 50 goroutines with no timeouts
	
	// PROBLEM: Channel chaos (will panic)
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from channel panic: %v\n", r)
		}
	}()
	channelChaos() // PROBLEM: Double close panic
	
	// PROBLEM: Final chaos report
	fmt.Printf("🔥 GO CHAOS COMPLETE! 🔥\n")
	fmt.Printf("Goroutines: %d\n", runtime.NumGoroutine()) // PROBLEM: Will show leaked goroutines
	fmt.Printf("Global counter: %d\n", GlobalCounter)
	fmt.Printf("Global map size: %d\n", len(GlobalMap))
	fmt.Printf("Global slice size: %d\n", len(GlobalSlice))
	
	// PROBLEM: Exit without cleanup (let OS handle the mess)
	os.Exit(0) // PROBLEM: Force exit without cleanup
}

// ─────────────────────────────────────────────────────────────────────────────
// GO ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Goroutine Leaks**: Goroutines that never exit, blocking on channels
// 2. **Interface{} Abuse**: Using interface{} everywhere defeats type safety
// 3. **Panic for Control Flow**: Using panic instead of returning errors
// 4. **Error Swallowing**: Ignoring errors with blank identifier
// 5. **Race Conditions**: Concurrent access to shared data without synchronization
// 6. **Defer in Loops**: Defer statements accumulate until function end
// 7. **Global State**: Global variables without proper synchronization
// 8. **No Timeouts**: HTTP clients and operations without timeouts
// 9. **Reflection Abuse**: Using reflection to bypass type safety
// 10. **Channel Misuse**: Deadlocks, double closes, unbuffered channels

// WHY GO IS UNIQUELY DANGEROUS:
// ─────────────────────────────────────────────────────────────────────────────
// - **Goroutine Leaks**: Easy to create goroutines that never exit
// - **Interface{} Escape Hatch**: Can bypass type safety entirely
// - **Panic Recovery**: Can mask serious errors and create inconsistent state
// - **Concurrency Complexity**: Race conditions are easy to introduce
// - **Channel Deadlocks**: Blocking operations can hang program forever
// - **No Automatic Cleanup**: Must manually manage goroutines and resources
// - **Reflection Power**: Can modify private fields and bypass safety

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Always check errors, don't use blank identifier for error returns
// 2. Use concrete types instead of interface{}, use generics (Go 1.18+)
// 3. Return errors instead of panicking, use panic only for programmer errors
// 4. Use sync.Mutex, atomic operations, or channels for synchronization
// 5. Use context.Context for cancellation and timeouts
// 6. Avoid defer in loops, use anonymous functions to limit scope
// 7. Use buffered channels or proper synchronization to avoid deadlocks
// 8. Set timeouts on HTTP clients and database connections
// 9. Avoid reflection unless absolutely necessary, use interfaces instead
// 10. Use go vet, golangci-lint, and race detector: go run -race

// Remember: Go gives you powerful concurrency - use it responsibly! 🐹
