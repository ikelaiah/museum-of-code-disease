// ex-001-goroutine-leak-paradise.go
// INTENTIONALLY AWFUL: Go concurrency disasters and interface{} abuse
// This file celebrates every Go anti-pattern known to gophers
// WARNING: This code will leak goroutines, panic your program, and make Rob Pike cry

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

// Global variable soup with no protection
var (
	GlobalCounter    int                    // racy counter
	GlobalMap        map[string]interface{} // interface{} chaos
	GlobalSlice      []interface{}          // more interface{} abuse
	GlobalChannel    chan interface{}       // unbuffered channel for deadlocks
	GlobalMutex      sync.Mutex             // mutex that's never used properly
	GlobalWaitGroup  sync.WaitGroup         // WaitGroup that's never waited on
	GlobalContext    context.Context        // global context (why not?)
	GlobalCancel     context.CancelFunc     // global cancel function
	GlobalHTTPClient *http.Client           // shared HTTP client with no timeouts
	GlobalDB         *sql.DB                // global database connection
)

// Interface{} abuse - everything is interface{}
type ChaosStruct struct {
	Data     interface{}            // could be anything
	MoreData interface{}            // literally anything
	Config   map[string]interface{} // configuration chaos
	Callback func(interface{}) interface{} // function that takes and returns anything
}

// Goroutine leak generator
func goroutineLeakParadise() {
	fmt.Println("🚀 Starting goroutine leak paradise...")
	
	// Leak #1: Goroutines waiting on channels that never get data
	for i := 0; i < 100; i++ {
		go func(id int) {
			ch := make(chan string) // unbuffered channel, never written to
			select {
			case msg := <-ch:
				fmt.Printf("Goroutine %d got: %s\n", id, msg) // never executes
			}
		}(i)
	}
	
	// Leak #2: Infinite loops in goroutines
	for i := 0; i < 50; i++ {
		go func(id int) {
			for {
				GlobalCounter++ // racy increment
				time.Sleep(time.Nanosecond) // tiny sleep to make it "better"
			}
		}(i)
	}
	
	// Leak #3: HTTP requests with no timeout in goroutines
	for i := 0; i < 20; i++ {
		go func(id int) {
			resp, err := http.Get("http://httpbin.org/delay/30") // 30 second delay
			if err != nil {
				panic(err) // panic in goroutine
			}
			defer resp.Body.Close() // if we ever get here
		}(i)
	}
	
	// Leak #4: Context that's never cancelled
	ctx, cancel := context.WithCancel(context.Background())
	_ = cancel // never call it
	
	for i := 0; i < 30; i++ {
		go func(id int) {
			select {
			case <-ctx.Done():
				return // never happens
			case <-time.After(time.Hour):
				fmt.Printf("Goroutine %d timed out\n", id)
			}
		}(i)
	}
}

// Panic-driven development
func panicDrivenDevelopment(data interface{}) interface{} {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from panic: %v\n", r)
			// Return something random on panic
			return map[string]interface{}{
				"error": r,
				"random": rand.Intn(1000),
			}
		}
	}()
	
	// Use panic for control flow
	if data == nil {
		panic("data is nil, obviously")
	}
	
	// Type assertion without checking
	str := data.(string) // will panic if not string
	
	if len(str) == 0 {
		panic("empty string, panic time!")
	}
	
	if str == "panic" {
		panic("you asked for it!")
	}
	
	// More panic-prone operations
	slice := []int{1, 2, 3}
	index := len(str) // use string length as index
	return slice[index] // will panic if index >= 3
}

// Interface{} abuse everywhere
func interfaceChaos() interface{} {
	// Everything is interface{}
	var data interface{} = "hello"
	var moreData interface{} = 42
	var evenMoreData interface{} = []interface{}{1, "two", 3.0, true, nil}
	
	// Type assertions without checking
	str := data.(string)
	num := moreData.(int)
	slice := evenMoreData.([]interface{})
	
	// Build a map of interface{}
	result := make(map[string]interface{})
	result["string"] = str
	result["number"] = num
	result["slice"] = slice
	result["nested"] = map[string]interface{}{
		"level1": map[string]interface{}{
			"level2": map[string]interface{}{
				"level3": "deep interface{} nesting",
			},
		},
	}
	
	// JSON marshal/unmarshal with interface{}
	jsonData, _ := json.Marshal(result)
	var unmarshaled interface{}
	json.Unmarshal(jsonData, &unmarshaled)
	
	return unmarshaled // return interface{} of course
}

// Error swallowing paradise
func errorSwallowingParadise() {
	// Ignore all errors with blank identifier
	file, _ := os.Open("nonexistent.txt")
	defer file.Close() // will panic if file is nil
	
	data := make([]byte, 1024)
	_, _ = file.Read(data) // ignore read error
	
	// HTTP request ignoring errors
	resp, _ := http.Get("http://invalid-url-that-will-fail")
	defer resp.Body.Close() // will panic if resp is nil
	
	// JSON operations ignoring errors
	var result interface{}
	_ = json.Unmarshal([]byte("invalid json"), &result)
	
	// Database operations ignoring errors
	if GlobalDB != nil {
		rows, _ := GlobalDB.Query("SELECT * FROM nonexistent_table")
		defer rows.Close() // might be nil
		
		for rows.Next() {
			var data interface{}
			_ = rows.Scan(&data) // ignore scan errors
		}
		_ = rows.Err() // ignore iteration errors
	}
}

// Defer abuse in loops
func deferAbuseInLoops() {
	// Defer in loop - all defers execute at function end
	for i := 0; i < 1000; i++ {
		file, err := os.Create(fmt.Sprintf("temp_%d.txt", i))
		if err != nil {
			continue
		}
		defer file.Close() // BAD: all 1000 files stay open until function ends
		defer os.Remove(file.Name()) // BAD: all removals happen at function end
		
		file.WriteString(fmt.Sprintf("File %d content", i))
	}
	
	// More defer abuse
	for i := 0; i < 100; i++ {
		mutex := &sync.Mutex{}
		mutex.Lock()
		defer mutex.Unlock() // BAD: all unlocks happen at function end
		
		GlobalCounter += i // all increments happen while all mutexes are locked
	}
}

// Reflection abuse
func reflectionChaos(data interface{}) interface{} {
	v := reflect.ValueOf(data)
	t := reflect.TypeOf(data)
	
	fmt.Printf("Type: %v, Kind: %v\n", t, v.Kind())
	
	// Modify unexported fields using reflection
	if v.Kind() == reflect.Ptr && v.Elem().Kind() == reflect.Struct {
		elem := v.Elem()
		for i := 0; i < elem.NumField(); i++ {
			field := elem.Field(i)
			if field.CanSet() {
				// Set everything to random values
				switch field.Kind() {
				case reflect.String:
					field.SetString("HACKED_BY_REFLECTION")
				case reflect.Int, reflect.Int64:
					field.SetInt(888)
				case reflect.Bool:
					field.SetBool(true)
				}
			} else {
				// Use unsafe to modify unexported fields
				ptr := unsafe.Pointer(field.UnsafeAddr())
				switch field.Kind() {
				case reflect.String:
					*(*string)(ptr) = "UNSAFE_HACK"
				case reflect.Int:
					*(*int)(ptr) = 999
				}
			}
		}
	}
	
	return data
}

// Channel chaos
func channelChaos() {
	// Unbuffered channels causing deadlocks
	ch1 := make(chan interface{})
	ch2 := make(chan interface{})
	
	// Goroutine that will deadlock
	go func() {
		ch1 <- "hello" // blocks forever
		ch2 <- "world" // never reached
	}()
	
	// Never read from channels
	time.Sleep(100 * time.Millisecond)
	
	// Close channels multiple times
	close(ch1)
	close(ch1) // panic!
}

// Race condition paradise
func raceConditionParadise() {
	// Multiple goroutines modifying global state without synchronization
	for i := 0; i < 100; i++ {
		go func(id int) {
			// Race on global map
			if GlobalMap == nil {
				GlobalMap = make(map[string]interface{})
			}
			GlobalMap[fmt.Sprintf("key_%d", id)] = id
			
			// Race on global slice
			GlobalSlice = append(GlobalSlice, id)
			
			// Race on global counter
			GlobalCounter++
			
			// Race on map iteration and modification
			for k, v := range GlobalMap {
				if v.(int) > 50 {
					delete(GlobalMap, k) // modify while iterating
				}
			}
		}(i)
	}
}

// HTTP client abuse
func httpClientAbuse() {
	// HTTP client with no timeouts
	client := &http.Client{
		Timeout: 0, // no timeout!
	}
	
	// Make requests in goroutines without proper error handling
	for i := 0; i < 50; i++ {
		go func(id int) {
			resp, err := client.Get("http://httpbin.org/delay/60")
			if err != nil {
				panic(err) // panic in goroutine
			}
			defer resp.Body.Close()
			
			// Read entire response into memory without size limits
			var data interface{}
			json.NewDecoder(resp.Body).Decode(&data)
			
			// Store in global state without synchronization
			GlobalMap[fmt.Sprintf("response_%d", id)] = data
		}(i)
	}
}

// Main chaos orchestrator
func main() {
	fmt.Println("🐹 GO NIGHTMARE STARTING - PREPARE FOR CHAOS! 🐹")
	
	// Initialize global chaos
	GlobalMap = make(map[string]interface{})
	GlobalSlice = make([]interface{}, 0)
	GlobalChannel = make(chan interface{})
	GlobalContext, GlobalCancel = context.WithCancel(context.Background())
	GlobalHTTPClient = &http.Client{} // no timeout
	
	// Start the chaos
	goroutineLeakParadise()
	
	// Panic-driven development
	result := panicDrivenDevelopment("panic") // will panic and recover
	fmt.Printf("Panic result: %v\n", result)
	
	// Interface{} chaos
	interfaceResult := interfaceChaos()
	fmt.Printf("Interface chaos: %v\n", interfaceResult)
	
	// Error swallowing
	errorSwallowingParadise()
	
	// Defer abuse
	deferAbuseInLoops()
	
	// Reflection chaos
	chaos := &ChaosStruct{
		Data:     "original",
		MoreData: 42,
		Config:   make(map[string]interface{}),
	}
	reflectionChaos(chaos)
	fmt.Printf("After reflection chaos: %+v\n", chaos)
	
	// Race conditions
	raceConditionParadise()
	
	// HTTP abuse
	httpClientAbuse()
	
	// Channel chaos (will panic)
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from channel panic: %v\n", r)
		}
	}()
	channelChaos()
	
	// Final chaos report
	fmt.Printf("🔥 GO CHAOS COMPLETE! 🔥\n")
	fmt.Printf("Goroutines: %d\n", runtime.NumGoroutine())
	fmt.Printf("Global counter: %d\n", GlobalCounter)
	fmt.Printf("Global map size: %d\n", len(GlobalMap))
	fmt.Printf("Global slice size: %d\n", len(GlobalSlice))
	
	// Exit without cleanup (let OS handle the mess)
	os.Exit(0)
}
