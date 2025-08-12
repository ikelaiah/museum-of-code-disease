// ex-001-enterprise-hell.cs AUTOPSY VERSION
// INTENTIONALLY AWFUL: C# enterprise bloat and exception swallowing disasters
// This celebrates every anti-pattern, code smell, and enterprise nightmare in C#
// AUTOPSY: Same nightmare code with detailed explanations of C# enterprise anti-patterns

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Museum.Of.Code.Disease.Enterprise.Hell.Nightmare.Factory.Manager.Service.Provider
{
    // PROBLEM: Global static chaos
    public static class GlobalChaosManager
    {
        public static int A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z; // PROBLEM: 26 global static variables
        public static string l1 = "l1", O0 = "O0", I1 = "I1";  // PROBLEM: Confusable variable names
        public static Dictionary<string, object> GlobalState = new Dictionary<string, object>(); // PROBLEM: Global mutable state
        public static Exception LastException; // PROBLEM: Global exception storage
        public static bool IsInErrorState = false; // PROBLEM: Global error flag
    }
    // FIX: Avoid global state; use dependency injection; encapsulate state in classes

    // PROBLEM: God class with everything
    public class EnterpriseBusinessLogicManagerFactoryProviderService // PROBLEM: Ridiculously long class name
    {
        // PROBLEM: Too many dependencies - violates Single Responsibility Principle
        private readonly IDataAccessLayerFactory _dalFactory;
        private readonly IBusinessLogicServiceProvider _blProvider;
        private readonly IConfigurationManagerService _configService;
        private readonly ILoggingServiceFactory _logFactory;
        private readonly ICacheManagerProvider _cacheProvider;
        private readonly ISecurityServiceManager _securityManager;
        private readonly IValidationEngineFactory _validationFactory;
        private readonly INotificationServiceProvider _notificationProvider;
        private readonly IAuditTrailManagerService _auditService;
        private readonly IPerformanceCounterFactory _perfCounterFactory;
        // PROBLEM: 10+ dependencies indicate this class does too much

        // PROBLEM: Constructor injection hell
        public EnterpriseBusinessLogicManagerFactoryProviderService(
            IDataAccessLayerFactory dalFactory,
            IBusinessLogicServiceProvider blProvider,
            IConfigurationManagerService configService,
            ILoggingServiceFactory logFactory,
            ICacheManagerProvider cacheProvider,
            ISecurityServiceManager securityManager,
            IValidationEngineFactory validationFactory,
            INotificationServiceProvider notificationProvider,
            IAuditTrailManagerService auditService,
            IPerformanceCounterFactory perfCounterFactory) // PROBLEM: 10 parameters - constructor bloat
        {
            // PROBLEM: Repetitive null checks - could use guard clauses or validation library
            _dalFactory = dalFactory ?? throw new ArgumentNullException(nameof(dalFactory));
            _blProvider = blProvider ?? throw new ArgumentNullException(nameof(blProvider));
            _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            _logFactory = logFactory ?? throw new ArgumentNullException(nameof(logFactory));
            _cacheProvider = cacheProvider ?? throw new ArgumentNullException(nameof(cacheProvider));
            _securityManager = securityManager ?? throw new ArgumentNullException(nameof(securityManager));
            _validationFactory = validationFactory ?? throw new ArgumentNullException(nameof(validationFactory));
            _notificationProvider = notificationProvider ?? throw new ArgumentNullException(nameof(notificationProvider));
            _auditService = auditService ?? throw new ArgumentNullException(nameof(auditService));
            _perfCounterFactory = perfCounterFactory ?? throw new ArgumentNullException(nameof(perfCounterFactory));
        }
        // FIX: Break into smaller classes; use composition; limit dependencies per class

        // PROBLEM: Exception swallowing hell
        public string ProcessBusinessLogicWithEnterprisePatterns(object input)
        {
            try
            {
                try
                {
                    try // PROBLEM: Triple nested try-catch blocks
                    {
                        var result = DoActualWork(input);
                        return result?.ToString() ?? "null";
                    }
                    catch (Exception ex) // PROBLEM: Catching all exceptions
                    {
                        // PROBLEM: Swallow exception without logging or re-throwing
                        GlobalChaosManager.LastException = ex; // PROBLEM: Store in global state
                        return "Error occurred"; // PROBLEM: Generic error message
                    }
                }
                catch // PROBLEM: Catch all without even looking at exception
                {
                    // PROBLEM: No logging, no context, no useful information
                    return "Unknown error";
                }
            }
            catch // PROBLEM: Triple nested catch - maximum confusion
            {
                // PROBLEM: Return empty string on error - caller has no idea what happened
                return "";
            }
        }
        // FIX: Catch specific exceptions; log errors; provide meaningful error messages; don't swallow exceptions

        private object DoActualWork(object input)
        {
            // PROBLEM: Reflection abuse - performance killer and brittle
            var type = input.GetType(); // PROBLEM: Runtime type checking
            var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance); // PROBLEM: Get all methods
            
            foreach (var method in methods) // PROBLEM: Iterate through all methods
            {
                try
                {
                    method.Invoke(input, null);  // PROBLEM: Invoke random methods without knowing what they do
                }
                catch // PROBLEM: Ignore all errors from method invocation
                {
                    // PROBLEM: Silent failure - debugging nightmare
                }
            }
            
            return input; // PROBLEM: Return potentially modified input
        }
        // FIX: Use proper polymorphism; avoid reflection for business logic; handle errors appropriately
    }

    // PROBLEM: Database disaster class
    public class DatabaseHellManager
    {
        // PROBLEM: Hardcoded connection string with production database
        private string _connectionString = "Server=localhost;Database=Production;Trusted_Connection=true;";

        // PROBLEM: SQL injection paradise
        public DataTable GetUserData(string userId, string password)
        {
            // PROBLEM: String concatenation creates SQL injection vulnerability
            var query = $"SELECT * FROM Users WHERE UserId = '{userId}' AND Password = '{password}'";
            // ATTACK: userId = "admin'; DROP TABLE Users; --" would delete the Users table!
            
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var command = new SqlCommand(query, connection); // PROBLEM: Vulnerable query
                var adapter = new SqlDataAdapter(command);
                var dataTable = new DataTable();
                
                try
                {
                    adapter.Fill(dataTable);
                }
                catch // PROBLEM: Catch all database errors
                {
                    // PROBLEM: Return empty table on error - caller doesn't know about failure
                    return new DataTable();
                }
                
                // PROBLEM: Connection disposed by using, but adapter and command leak resources
                return dataTable;
            }
        }
        // FIX: Use parameterized queries; handle specific exceptions; dispose all resources

        // PROBLEM: Connection leak hell
        public void LeakConnections()
        {
            for (int i = 0; i < 100; i++) // PROBLEM: Create 100 connections
            {
                var connection = new SqlConnection(_connectionString);
                connection.Open(); // PROBLEM: Open connection
                // PROBLEM: No disposal - connection pool exhaustion, server resource leak
            }
        }
        // FIX: Always use 'using' statements for IDisposable resources
    }

    // PROBLEM: Threading disasters
    public class ThreadingHellManager
    {
        private static int _sharedCounter = 0; // PROBLEM: Static shared variable without synchronization
        private static List<string> _sharedList = new List<string>(); // PROBLEM: Non-thread-safe collection

        // PROBLEM: Race condition paradise
        public void CreateRaceConditions()
        {
            var tasks = new List<Task>();
            
            for (int i = 0; i < 100; i++) // PROBLEM: Create 100 concurrent tasks
            {
                tasks.Add(Task.Run(() =>
                {
                    _sharedCounter++; // PROBLEM: Non-atomic increment - race condition
                    _sharedList.Add($"Item {_sharedCounter}"); // PROBLEM: Non-thread-safe List access
                    
                    // PROBLEM: Deadlock potential with nested locks
                    lock (_sharedList) // PROBLEM: Lock on List object
                    {
                        Thread.Sleep(100); // PROBLEM: Sleep while holding lock
                        lock (this) // PROBLEM: Nested locks in different order - deadlock risk
                        {
                            _sharedCounter--; // PROBLEM: More race conditions
                        }
                    }
                }));
            }
            
            // PROBLEM: Don't wait for tasks to complete
            // Task.WaitAll(tasks); // PROBLEM: Commented out - tasks may not finish before method returns
        }
        // FIX: Use Interlocked for atomic operations; use ConcurrentCollection; avoid nested locks; wait for tasks

        // PROBLEM: Async/await abuse
        public async Task<string> AsyncHell()
        {
            // PROBLEM: Blocking async call - potential deadlock in UI/ASP.NET contexts
            var result = AsyncMethod().Result; // PROBLEM: .Result blocks and can deadlock
            
            // PROBLEM: Fire and forget - unhandled exception
            _ = Task.Run(() => throw new Exception("Unhandled async exception")); // PROBLEM: Exception will crash app
            
            return result;
        }

        private async Task<string> AsyncMethod()
        {
            await Task.Delay(1000); // PROBLEM: Delay then throw
            throw new InvalidOperationException("Async chaos"); // PROBLEM: Exception in async method
        }
        // FIX: Use ConfigureAwait(false); handle async exceptions; don't use .Result
    }

    // PROBLEM: Memory leak generators
    public class MemoryLeakHellManager
    {
        private static List<byte[]> _memoryLeaks = new List<byte[]>(); // PROBLEM: Static collection holds references
        private static Dictionary<string, EventHandler> _eventHandlers = new Dictionary<string, EventHandler>(); // PROBLEM: Event handler storage

        // PROBLEM: Event handler leaks
        public void CreateEventHandlerLeaks()
        {
            for (int i = 0; i < 1000; i++) // PROBLEM: Create 1000 event handlers
            {
                var handler = new EventHandler((sender, e) => Console.WriteLine($"Handler {i}")); // PROBLEM: Closure captures i
                _eventHandlers[$"handler_{i}"] = handler; // PROBLEM: Store in static dictionary
                
                // PROBLEM: Subscribe but never unsubscribe - classic memory leak
                AppDomain.CurrentDomain.ProcessExit += handler; // PROBLEM: Event subscription without cleanup
            }
        }
        // FIX: Always unsubscribe from events; use weak event patterns; avoid static collections

        // PROBLEM: Large object heap abuse
        public void CreateMemoryLeaks()
        {
            for (int i = 0; i < 100; i++) // PROBLEM: Create 100 large arrays
            {
                var largeArray = new byte[1024 * 1024]; // PROBLEM: 1MB each = 100MB total
                _memoryLeaks.Add(largeArray); // PROBLEM: Keep reference in static list - prevents GC
            }
        }
        // FIX: Don't store large objects in static collections; allow GC to collect unused objects

        // PROBLEM: Finalizer abuse
        ~MemoryLeakHellManager() // PROBLEM: Finalizer that does work and can throw
        {
            try
            {
                File.WriteAllText("finalizer.log", "Finalizer called"); // PROBLEM: File I/O in finalizer
            }
            catch
            {
                // PROBLEM: Exception in finalizer - very bad, can crash application
                throw new InvalidOperationException("Finalizer chaos");
            }
        }
        // FIX: Implement IDisposable pattern; don't do work in finalizers; never throw from finalizers
    }

    // PROBLEM: LINQ abuse and performance disasters
    public class LinqHellManager
    {
        public void LinqPerformanceHell()
        {
            var data = Enumerable.Range(1, 1000000).ToList(); // PROBLEM: 1 million items in memory
            
            // PROBLEM: Multiple enumeration - query is not materialized
            var query = data.Where(x => x % 2 == 0) // PROBLEM: Filter even numbers
                           .Select(x => x * 2)      // PROBLEM: Double each number
                           .Where(x => x > 100);    // PROBLEM: Filter again
            
            // PROBLEM: Enumerate multiple times - each call re-executes the entire query
            var count = query.Count();  // PROBLEM: First enumeration
            var first = query.First();  // PROBLEM: Second enumeration
            var last = query.Last();    // PROBLEM: Third enumeration
            var sum = query.Sum();      // PROBLEM: Fourth enumeration - massive performance hit
            
            // PROBLEM: Nested loops with LINQ - O(n²) disaster
            var result = data.SelectMany(x => 
                data.Where(y => y > x)  // PROBLEM: For each x, scan entire data collection
                    .Select(y => new { X = x, Y = y })) // PROBLEM: Creates millions of anonymous objects
                .ToList(); // PROBLEM: Materializes huge result set
        }
        // FIX: Materialize queries with ToList(); avoid multiple enumeration; optimize nested queries

        // PROBLEM: Reflection in LINQ - performance nightmare
        public void ReflectionLinqHell<T>(IEnumerable<T> items)
        {
            var results = items.Where(item => // PROBLEM: LINQ with reflection in predicate
            {
                var type = item.GetType(); // PROBLEM: GetType() for every item
                var properties = type.GetProperties(); // PROBLEM: GetProperties() for every item
                return properties.Any(prop => // PROBLEM: Iterate properties for every item
                {
                    var value = prop.GetValue(item); // PROBLEM: Reflection property access
                    return value?.ToString().Contains("chaos") == true; // PROBLEM: String conversion and search
                });
            }).ToList();
        }
        // FIX: Cache reflection results; use compiled expressions; avoid reflection in hot paths
    }

    // PROBLEM: Configuration and magic strings hell
    public class ConfigurationHellManager
    {
        // PROBLEM: Magic strings everywhere - no compile-time checking
        public string GetConfigValue(string key)
        {
            switch (key) // PROBLEM: String-based configuration keys
            {
                case "DatabaseConnectionString": // PROBLEM: Magic string
                    return "Server=prod-db-01;Database=ProductionDB;User=sa;Password=admin123;"; // PROBLEM: Hardcoded production credentials
                case "ApiEndpoint": // PROBLEM: Magic string
                    return "http://api.production.com/v1/"; // PROBLEM: Hardcoded URL
                case "SecretKey": // PROBLEM: Magic string
                    return "MySecretKey123!@#"; // PROBLEM: Hardcoded secret in source code
                default:
                    throw new ArgumentException($"Unknown config key: {key}"); // PROBLEM: Runtime error for typos
            }
        }
        // FIX: Use strongly-typed configuration; store secrets in secure configuration; use constants for keys

        // PROBLEM: Environment-specific chaos
        public void EnvironmentSpecificHell()
        {
            var environment = Environment.GetEnvironmentVariable("ENVIRONMENT") ?? "PRODUCTION"; // PROBLEM: Default to production
            
            if (environment == "DEV") // PROBLEM: String comparison for environment
            {
                // PROBLEM: Different behavior in dev
                Console.WriteLine("Development mode");
            }
            else if (environment == "PROD") // PROBLEM: Different code paths
            {
                // PROBLEM: Dangerous operation in production
                File.Delete("C:\\important-file.txt"); // PROBLEM: File deletion in production code
            }
        }
        // FIX: Use configuration objects; avoid environment-specific code branches; use feature flags
    }

    // PROBLEM: Main program with maximum chaos
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🔷 C# NIGHTMARE STARTING 🔷");
            
            try
            {
                // PROBLEM: Create all the chaos managers - no dependency injection
                var dbManager = new DatabaseHellManager();
                var threadManager = new ThreadingHellManager();
                var memoryManager = new MemoryLeakHellManager();
                var linqManager = new LinqHellManager();
                var configManager = new ConfigurationHellManager();
                
                // PROBLEM: Execute all the disasters without error handling
                dbManager.LeakConnections();           // PROBLEM: Exhaust connection pool
                threadManager.CreateRaceConditions(); // PROBLEM: Create race conditions and deadlocks
                memoryManager.CreateEventHandlerLeaks(); // PROBLEM: Create memory leaks
                memoryManager.CreateMemoryLeaks();     // PROBLEM: Allocate 100MB and hold references
                linqManager.LinqPerformanceHell();     // PROBLEM: Multiple enumeration performance disaster
                configManager.EnvironmentSpecificHell(); // PROBLEM: Environment-specific behavior
                
                // PROBLEM: SQL injection attempt
                var userData = dbManager.GetUserData("admin'; DROP TABLE Users; --", "password"); // PROBLEM: SQL injection attack
                
                // PROBLEM: Async hell
                var asyncResult = threadManager.AsyncHell().Result; // PROBLEM: Potential deadlock with .Result
                
                Console.WriteLine("🎭 C# CHAOS COMPLETE 🎭");
            }
            catch (Exception ex) // PROBLEM: Global exception handler that provides no useful information
            {
                // PROBLEM: Store exception in global state
                GlobalChaosManager.LastException = ex;
                GlobalChaosManager.IsInErrorState = true;
                
                Console.WriteLine("Something went wrong, but we don't know what!"); // PROBLEM: Useless error message
                
                // PROBLEM: Re-throw without context or additional information
                throw; // PROBLEM: Loses stack trace context
            }
            finally
            {
                // PROBLEM: Cleanup that can throw exceptions and kills performance
                GC.Collect(); // PROBLEM: Force GC - performance killer
                GC.WaitForPendingFinalizers(); // PROBLEM: Wait for finalizers
                GC.Collect(); // PROBLEM: Double GC collection - even worse performance
            }
        }
        // FIX: Use dependency injection; handle specific exceptions; don't force GC; provide meaningful error messages
    }

    // PROBLEM: Empty interfaces for dependency injection hell - marker interfaces with no contracts
    public interface IDataAccessLayerFactory { } // PROBLEM: Empty interface - no contract
    public interface IBusinessLogicServiceProvider { } // PROBLEM: Vague naming
    public interface IConfigurationManagerService { } // PROBLEM: No methods defined
    public interface ILoggingServiceFactory { } // PROBLEM: Factory for factory pattern
    public interface ICacheManagerProvider { } // PROBLEM: Manager and Provider in same name
    public interface ISecurityServiceManager { } // PROBLEM: Empty security interface
    public interface IValidationEngineFactory { } // PROBLEM: Engine factory pattern
    public interface INotificationServiceProvider { } // PROBLEM: Service provider pattern
    public interface IAuditTrailManagerService { } // PROBLEM: Manager service pattern
    public interface IPerformanceCounterFactory { } // PROBLEM: Performance counter factory
    // FIX: Define meaningful contracts; avoid marker interfaces; use concrete implementations where appropriate
}

// ─────────────────────────────────────────────────────────────────────────────
// C# ENTERPRISE ANTI-PATTERNS SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **God Classes**: Classes that do too much, violate Single Responsibility
// 2. **Exception Swallowing**: Catching exceptions without proper handling
// 3. **SQL Injection**: String concatenation in SQL queries
// 4. **Resource Leaks**: Not disposing IDisposable objects properly
// 5. **Race Conditions**: Unsynchronized access to shared state
// 6. **Memory Leaks**: Event handler subscriptions, static collections
// 7. **Performance Issues**: Multiple LINQ enumeration, reflection abuse
// 8. **Magic Strings**: Hardcoded strings without compile-time checking
// 9. **Global State**: Static variables and global error handling
// 10. **Over-Engineering**: Too many abstractions, empty interfaces

// WHY C# ENTERPRISE CODE BECOMES CHAOTIC:
// ─────────────────────────────────────────────────────────────────────────────
// - **Over-Abstraction**: Too many interfaces and layers
// - **Dependency Injection Abuse**: Injecting everything, even simple values
// - **Exception Handling**: Try-catch blocks that hide real problems
// - **Enterprise Patterns**: Applying patterns where simple code would work
// - **Performance Ignorance**: Not understanding LINQ deferred execution
// - **Resource Management**: Forgetting that C# still requires resource cleanup
// - **Threading Complexity**: Async/await misuse and race conditions

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. Follow SOLID principles, especially Single Responsibility
// 2. Use parameterized queries for database access
// 3. Always dispose IDisposable resources with 'using' statements
// 4. Handle specific exceptions, log errors appropriately
// 5. Use thread-safe collections and synchronization primitives
// 6. Materialize LINQ queries to avoid multiple enumeration
// 7. Use strongly-typed configuration and constants
// 8. Avoid global state, use dependency injection properly
// 9. Don't over-engineer simple solutions
// 10. Use static analysis tools and code reviews

// Remember: Enterprise doesn't mean complicated - keep it simple! 🔷
