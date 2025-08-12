// ex-001-enterprise-hell.cs
// INTENTIONALLY AWFUL: C# enterprise bloat and exception swallowing disasters
// This celebrates every anti-pattern, code smell, and enterprise nightmare in C#
// WARNING: This code will make your IDE crash and your soul weep

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
    // Global static chaos
    public static class GlobalChaosManager
    {
        public static int A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z;
        public static string l1 = "l1", O0 = "O0", I1 = "I1";  // confusable names
        public static Dictionary<string, object> GlobalState = new Dictionary<string, object>();
        public static Exception LastException;
        public static bool IsInErrorState = false;
    }

    // God class with everything
    public class EnterpriseBusinessLogicManagerFactoryProviderService
    {
        // Too many dependencies
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

        // Constructor injection hell
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
            IPerformanceCounterFactory perfCounterFactory)
        {
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

        // Exception swallowing hell
        public string ProcessBusinessLogicWithEnterprisePatterns(object input)
        {
            try
            {
                try
                {
                    try
                    {
                        var result = DoActualWork(input);
                        return result?.ToString() ?? "null";
                    }
                    catch (Exception ex)
                    {
                        // Swallow exception
                        GlobalChaosManager.LastException = ex;
                        return "Error occurred";
                    }
                }
                catch
                {
                    // Catch all without even looking at exception
                    return "Unknown error";
                }
            }
            catch
            {
                // Triple nested catch - maximum confusion
                return "";
            }
        }

        private object DoActualWork(object input)
        {
            // Reflection abuse
            var type = input.GetType();
            var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance);
            
            foreach (var method in methods)
            {
                try
                {
                    method.Invoke(input, null);  // invoke random methods
                }
                catch
                {
                    // Ignore all errors
                }
            }
            
            return input;
        }
    }

    // Database disaster class
    public class DatabaseHellManager
    {
        private string _connectionString = "Server=localhost;Database=Production;Trusted_Connection=true;";

        // SQL injection paradise
        public DataTable GetUserData(string userId, string password)
        {
            var query = $"SELECT * FROM Users WHERE UserId = '{userId}' AND Password = '{password}'";
            
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var command = new SqlCommand(query, connection);
                var adapter = new SqlDataAdapter(command);
                var dataTable = new DataTable();
                
                try
                {
                    adapter.Fill(dataTable);
                }
                catch
                {
                    // Return empty table on error
                    return new DataTable();
                }
                
                // Connection disposed by using, but adapter and command leak
                return dataTable;
            }
        }

        // Connection leak hell
        public void LeakConnections()
        {
            for (int i = 0; i < 100; i++)
            {
                var connection = new SqlConnection(_connectionString);
                connection.Open();
                // No disposal - connection pool exhaustion
            }
        }
    }

    // Threading disasters
    public class ThreadingHellManager
    {
        private static int _sharedCounter = 0;
        private static List<string> _sharedList = new List<string>();

        // Race condition paradise
        public void CreateRaceConditions()
        {
            var tasks = new List<Task>();
            
            for (int i = 0; i < 100; i++)
            {
                tasks.Add(Task.Run(() =>
                {
                    _sharedCounter++;  // race condition
                    _sharedList.Add($"Item {_sharedCounter}");  // more race conditions
                    
                    // Deadlock potential
                    lock (_sharedList)
                    {
                        Thread.Sleep(100);
                        lock (this)  // nested locks - deadlock risk
                        {
                            _sharedCounter--;
                        }
                    }
                }));
            }
            
            // Don't wait for tasks to complete
            // Task.WaitAll(tasks);  // commented out for maximum chaos
        }

        // Async/await abuse
        public async Task<string> AsyncHell()
        {
            // Blocking async call
            var result = AsyncMethod().Result;  // deadlock potential
            
            // Fire and forget
            _ = Task.Run(() => throw new Exception("Unhandled async exception"));
            
            return result;
        }

        private async Task<string> AsyncMethod()
        {
            await Task.Delay(1000);
            throw new InvalidOperationException("Async chaos");
        }
    }

    // Memory leak generators
    public class MemoryLeakHellManager
    {
        private static List<byte[]> _memoryLeaks = new List<byte[]>();
        private static Dictionary<string, EventHandler> _eventHandlers = new Dictionary<string, EventHandler>();

        // Event handler leaks
        public void CreateEventHandlerLeaks()
        {
            for (int i = 0; i < 1000; i++)
            {
                var handler = new EventHandler((sender, e) => Console.WriteLine($"Handler {i}"));
                _eventHandlers[$"handler_{i}"] = handler;
                
                // Subscribe but never unsubscribe
                AppDomain.CurrentDomain.ProcessExit += handler;
            }
        }

        // Large object heap abuse
        public void CreateMemoryLeaks()
        {
            for (int i = 0; i < 100; i++)
            {
                var largeArray = new byte[1024 * 1024];  // 1MB each
                _memoryLeaks.Add(largeArray);  // keep reference - no GC
            }
        }

        // Finalizer abuse
        ~MemoryLeakHellManager()
        {
            // Finalizer that does work and can throw
            try
            {
                File.WriteAllText("finalizer.log", "Finalizer called");
            }
            catch
            {
                // Exception in finalizer - very bad
                throw new InvalidOperationException("Finalizer chaos");
            }
        }
    }

    // LINQ abuse and performance disasters
    public class LinqHellManager
    {
        public void LinqPerformanceHell()
        {
            var data = Enumerable.Range(1, 1000000).ToList();
            
            // Multiple enumeration
            var query = data.Where(x => x % 2 == 0)
                           .Select(x => x * 2)
                           .Where(x => x > 100);
            
            // Enumerate multiple times - performance disaster
            var count = query.Count();
            var first = query.First();
            var last = query.Last();
            var sum = query.Sum();
            
            // Nested loops with LINQ - O(n²) disaster
            var result = data.SelectMany(x => 
                data.Where(y => y > x)
                    .Select(y => new { X = x, Y = y }))
                .ToList();
        }

        // Reflection in LINQ - performance nightmare
        public void ReflectionLinqHell<T>(IEnumerable<T> items)
        {
            var results = items.Where(item =>
            {
                var type = item.GetType();
                var properties = type.GetProperties();
                return properties.Any(prop =>
                {
                    var value = prop.GetValue(item);
                    return value?.ToString().Contains("chaos") == true;
                });
            }).ToList();
        }
    }

    // Configuration and magic strings hell
    public class ConfigurationHellManager
    {
        // Magic strings everywhere
        public string GetConfigValue(string key)
        {
            switch (key)
            {
                case "DatabaseConnectionString":
                    return "Server=prod-db-01;Database=ProductionDB;User=sa;Password=admin123;";
                case "ApiEndpoint":
                    return "http://api.production.com/v1/";
                case "SecretKey":
                    return "MySecretKey123!@#";  // hardcoded secret
                default:
                    throw new ArgumentException($"Unknown config key: {key}");
            }
        }

        // Environment-specific chaos
        public void EnvironmentSpecificHell()
        {
            var environment = Environment.GetEnvironmentVariable("ENVIRONMENT") ?? "PRODUCTION";
            
            if (environment == "DEV")
            {
                // Different behavior in dev
                Console.WriteLine("Development mode");
            }
            else if (environment == "PROD")
            {
                // Different behavior in prod
                File.Delete("C:\\important-file.txt");  // dangerous in prod
            }
        }
    }

    // Main program with maximum chaos
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("🔷 C# NIGHTMARE STARTING 🔷");
            
            try
            {
                // Create all the chaos managers
                var dbManager = new DatabaseHellManager();
                var threadManager = new ThreadingHellManager();
                var memoryManager = new MemoryLeakHellManager();
                var linqManager = new LinqHellManager();
                var configManager = new ConfigurationHellManager();
                
                // Execute all the disasters
                dbManager.LeakConnections();
                threadManager.CreateRaceConditions();
                memoryManager.CreateEventHandlerLeaks();
                memoryManager.CreateMemoryLeaks();
                linqManager.LinqPerformanceHell();
                configManager.EnvironmentSpecificHell();
                
                // SQL injection attempt
                var userData = dbManager.GetUserData("admin'; DROP TABLE Users; --", "password");
                
                // Async hell
                var asyncResult = threadManager.AsyncHell().Result;  // potential deadlock
                
                Console.WriteLine("🎭 C# CHAOS COMPLETE 🎭");
            }
            catch (Exception ex)
            {
                // Global exception handler that does nothing useful
                GlobalChaosManager.LastException = ex;
                GlobalChaosManager.IsInErrorState = true;
                
                Console.WriteLine("Something went wrong, but we don't know what!");
                
                // Re-throw without context
                throw;
            }
            finally
            {
                // Cleanup that can throw exceptions
                GC.Collect();  // force GC - performance killer
                GC.WaitForPendingFinalizers();
                GC.Collect();  // double GC collection
            }
        }
    }

    // Empty interfaces for dependency injection hell
    public interface IDataAccessLayerFactory { }
    public interface IBusinessLogicServiceProvider { }
    public interface IConfigurationManagerService { }
    public interface ILoggingServiceFactory { }
    public interface ICacheManagerProvider { }
    public interface ISecurityServiceManager { }
    public interface IValidationEngineFactory { }
    public interface INotificationServiceProvider { }
    public interface IAuditTrailManagerService { }
    public interface IPerformanceCounterFactory { }
}
