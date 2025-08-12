// ex-001-bracket-ceremony.java AUTOPSY VERSION
// INTENTIONALLY AWFUL: Java pretending to be Python with "aligned" brackets
// This file celebrates putting ALL brackets on the right side because... why not?
// AUTOPSY: Same nightmare code with detailed explanations of the formatting and logic horrors

import java.util.*;                                                                    // PROBLEM: Wildcard imports pollute namespace
import java.io.*;                                                                      // PROBLEM: Import entire packages unnecessarily
import java.sql.*;                                                                     // PROBLEM: More namespace pollution
import java.net.*;                                                                     // PROBLEM: Wildcard import paradise
import java.lang.reflect.*;                                                            // PROBLEM: Reflection imports for chaos
import java.util.concurrent.*;                                                         // PROBLEM: Threading disaster imports
import static java.lang.System.*;                                                     // PROBLEM: Static import abuse
// FIX: Import only what you need: import java.util.HashMap; import java.io.FileWriter;

public class NightmareJava                                                             { // PROBLEM: Opening brace aligned to right
    
    // PROBLEM: Global state soup with meaningless single-letter names
    public static int a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z; // PROBLEM: 26 global variables!
    public static String l1, O0, I1;                                                  // PROBLEM: Confusable names (l1 vs I1 vs O0)
    public static volatile boolean STOP = false;                                      // PROBLEM: Volatile without proper synchronization
    public static Map<String, Object> GLOBAL_CHAOS = new HashMap<>();                 // PROBLEM: Global mutable state with type erasure
    public static List<Thread> THREAD_LEAKS = new ArrayList<>();                      // PROBLEM: Thread collection without cleanup
    // FIX: Minimize global state, use descriptive names, proper encapsulation
    
    // PROBLEM: Nested class for no architectural reason
    public static class InnerChaos                                                     { // PROBLEM: Right-aligned brace
        public static void mutateGlobals()                                            { // PROBLEM: Method that mutates global state
            for (int idx = 0; idx < 1000; idx++)                                      { // PROBLEM: Arbitrary loop limit
                // PROBLEM: Mass assignment to all global variables
                a = b = c = d = e = f = g = h = i = j = k = l = m = n = o = p = q = r = s = t = u = v = w = x = y = z = idx;
                GLOBAL_CHAOS.put("key" + idx, new Object()                            { // PROBLEM: Anonymous class creation in loop
                    @Override
                    public String toString()                                           { // PROBLEM: Override toString for no reason
                        return "Anonymous" + hashCode();                              // PROBLEM: Non-deterministic string representation
                    } // PROBLEM: Closing brace alignment chaos
                }); // PROBLEM: More alignment chaos
            } // PROBLEM: Consistent right-alignment obsession
        } // PROBLEM: Method closing brace aligned right
    } // PROBLEM: Class closing brace aligned right
    
    // PROBLEM: Generic method with terrible signature and side effects
    public static <T> T doStuff(Object... args)                                       { // PROBLEM: Varargs with Object type
        try                                                                            { // PROBLEM: Overly broad try block
            if (args.length > 0)                                                       { // PROBLEM: Array length check without null check
                String sql = "SELECT * FROM users WHERE id = '" + args[0] + "'";      // PROBLEM: SQL injection vulnerability
                out.println("Executing: " + sql);                                     // PROBLEM: Logging sensitive SQL queries
                
                // PROBLEM: Pointless reflection usage
                Class<?> clazz = Class.forName("java.lang.String");                   // PROBLEM: Hardcoded class name
                Method method = clazz.getMethod("valueOf", Object.class);             // PROBLEM: Reflection for simple operation
                return (T) method.invoke(null, args[0]);                              // PROBLEM: Unchecked cast, potential ClassCastException
            } // PROBLEM: Right-aligned closing brace
        } // PROBLEM: Try block closing brace
        catch (Exception e)                                                            { // PROBLEM: Catching all exceptions
            // PROBLEM: Swallow all exceptions silently
        } // PROBLEM: Catch block closing brace
        return null;                                                                   // PROBLEM: Return null instead of Optional
    } // PROBLEM: Method closing brace
    // FIX: Use proper types, parameterized queries, specific exception handling, Optional<T>
    
    // PROBLEM: File operations with no resource management
    public static void fileDisaster(String filename)                                  { // PROBLEM: Method name describes what it does
        try                                                                            { // PROBLEM: Try without resources
            FileWriter fw = new FileWriter(filename);                                 // PROBLEM: No try-with-resources
            BufferedWriter bw = new BufferedWriter(fw);                               // PROBLEM: Another resource leak
            PrintWriter pw = new PrintWriter(bw);                                     // PROBLEM: Triple resource leak
            
            for (int i = 0; i < 100; i++)                                             { // PROBLEM: Magic number 100
                pw.println("Line " + i + " with random: " + Math.random());          // PROBLEM: String concatenation in loop
                if (i % 10 == 0)                                                       { // PROBLEM: Magic number 10
                    pw.flush();                                                        // PROBLEM: Sporadic flushing
                } // PROBLEM: If block closing brace
            } // PROBLEM: For loop closing brace
            // PROBLEM: No close() calls - leak all file handles!
        } // PROBLEM: Try block closing brace
        catch (IOException e)                                                          { // PROBLEM: Specific exception caught but ignored
            // PROBLEM: Ignore IO errors completely
        } // PROBLEM: Catch block closing brace
    } // PROBLEM: Method closing brace
    // FIX: Use try-with-resources: try (PrintWriter pw = new PrintWriter(Files.newBufferedWriter(path))) { ... }
    
    // PROBLEM: Thread creation with race conditions
    public static void spawnChaos()                                                   { // PROBLEM: Method that creates unmanaged threads
        for (int threadNum = 0; threadNum < 10; threadNum++)                          { // PROBLEM: Magic number of threads
            Thread t = new Thread(new Runnable()                                      { // PROBLEM: Anonymous Runnable instead of lambda
                @Override
                public void run()                                                      { // PROBLEM: Override run method
                    while (!STOP)                                                      { // PROBLEM: Busy wait on volatile boolean
                        synchronized (GLOBAL_CHAOS)                                    { // PROBLEM: Synchronization on collection
                            GLOBAL_CHAOS.put("thread", Thread.currentThread().getName()); // PROBLEM: Overwrite same key
                        } // PROBLEM: Synchronized block closing brace
                        // PROBLEM: Race condition outside synchronized block
                        a++; b++; c++; d++; e++; f++; g++; h++; i++; j++;              // PROBLEM: Multiple unsynchronized increments
                        
                        try                                                            { // PROBLEM: Try block in loop
                            Thread.sleep(1);                                           // PROBLEM: Sleep in busy loop
                        } // PROBLEM: Try closing brace
                        catch (InterruptedException e)                                 { // PROBLEM: Catch InterruptedException
                            // PROBLEM: Ignore thread interruption
                        } // PROBLEM: Catch closing brace
                    } // PROBLEM: While loop closing brace
                } // PROBLEM: Run method closing brace
            }); // PROBLEM: Anonymous class closing brace and parenthesis
            t.start();                                                                 // PROBLEM: Start thread immediately
            THREAD_LEAKS.add(t);                                                      // PROBLEM: Keep reference but never join
        } // PROBLEM: For loop closing brace
    } // PROBLEM: Method closing brace
    // FIX: Use ExecutorService, proper thread pool management, AtomicInteger for counters
    
    // PROBLEM: Network operations with no timeouts or error handling
    public static String httpChaos(String url)                                        { // PROBLEM: Method returns null on error
        try                                                                            { // PROBLEM: Overly broad try block
            URL u = new URL(url + "?id=1' OR '1'='1");                                // PROBLEM: URL injection vulnerability
            HttpURLConnection conn = (HttpURLConnection) u.openConnection();          // PROBLEM: No connection timeout
            conn.setRequestMethod("GET");                                              // PROBLEM: Hardcoded HTTP method
            conn.setRequestProperty("User-Agent", "JavaChaos/1.0");                  // PROBLEM: Custom user agent for no reason
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream())                          ); // PROBLEM: No charset specified
            
            StringBuilder response = new StringBuilder();                              // PROBLEM: No initial capacity
            String line;                                                               // PROBLEM: Variable declaration outside loop
            while ((line = reader.readLine()) != null)                                { // PROBLEM: Manual line reading
                response.append(line).append("\n");                                   // PROBLEM: Manual newline appending
            } // PROBLEM: While loop closing brace
            // PROBLEM: No close() on reader or connection - resource leaks!
            return response.toString();                                                // PROBLEM: Return potentially huge string
        } // PROBLEM: Try block closing brace
        catch (Exception e)                                                            { // PROBLEM: Catch all exceptions
            return null;                                                               // PROBLEM: Return null on any error
        } // PROBLEM: Catch block closing brace
    } // PROBLEM: Method closing brace
    // FIX: Set timeouts, use try-with-resources, proper exception handling, return Optional<String>
    
    // PROBLEM: Database operations with SQL injection and resource leaks
    public static void sqlChaos(String user, String pass)                             { // PROBLEM: Method parameters are injection vectors
        try                                                                            { // PROBLEM: Try without resources
            // PROBLEM: Hardcoded connection string with user credentials
            Connection conn = DriverManager.getConnection(
                "jdbc:sqlite::memory:", user, pass                                    ); // PROBLEM: Memory DB recreated every call
            
            Statement stmt = conn.createStatement();                                  // PROBLEM: Statement instead of PreparedStatement
            
            // PROBLEM: SQL injection paradise - string concatenation
            String query = "SELECT * FROM users WHERE name = '" + user + 
                          "' AND password = '" + pass + "'";                          // PROBLEM: Direct string concatenation in SQL
            
            ResultSet rs = stmt.executeQuery(query);                                  // PROBLEM: Execute dangerous query
            
            while (rs.next())                                                          { // PROBLEM: Assume ResultSet has data
                out.println("User: " + rs.getString("name"));                         // PROBLEM: Assume column exists
            } // PROBLEM: While loop closing brace
            // PROBLEM: No rs.close(), stmt.close(), conn.close() - leak everything!
        } // PROBLEM: Try block closing brace
        catch (SQLException e)                                                         { // PROBLEM: Catch SQLException but do nothing
            // PROBLEM: Swallow SQL errors completely
        } // PROBLEM: Catch block closing brace
    } // PROBLEM: Method closing brace
    // FIX: Use PreparedStatement with parameters: "SELECT * FROM users WHERE name = ? AND password = ?"
    
    // PROBLEM: Collection operations with type safety violations
    @SuppressWarnings("unchecked")                                                     // PROBLEM: Suppress all unchecked warnings
    public static void collectionDisaster()                                           { // PROBLEM: Method that violates type safety
        List rawList = new ArrayList();                                               // PROBLEM: Raw type usage (no generics)
        rawList.add("String");                                                        // PROBLEM: Add String to raw list
        rawList.add(42);                                                               // PROBLEM: Add Integer to same list
        rawList.add(new Date());                                                       // PROBLEM: Add Date to same list
        rawList.add(null);                                                             // PROBLEM: Add null to collection
        
        for (Object obj : rawList)                                                     { // PROBLEM: Enhanced for loop with Object
            String str = (String) obj;                                                 // PROBLEM: Unsafe cast without instanceof check
            out.println(str.toUpperCase());                                           // PROBLEM: NPE if obj is null
        } // PROBLEM: For loop closing brace
        
        Map<String, Object> map = new HashMap<>();                                    // PROBLEM: Map with Object values
        map.put(null, "null key");                                                    // PROBLEM: null as key
        map.put("null", null);                                                        // PROBLEM: null as value
        map.put("", "empty key");                                                     // PROBLEM: empty string as key
        
        // PROBLEM: Concurrent modification during iteration
        for (String key : map.keySet())                                                { // PROBLEM: Iterate over keySet
            if (key != null && key.isEmpty())                                         { // PROBLEM: Check for empty key
                map.remove(key);                                                       // PROBLEM: Modify map while iterating - ConcurrentModificationException
            } // PROBLEM: If block closing brace
        } // PROBLEM: For loop closing brace
    } // PROBLEM: Method closing brace
    // FIX: Use proper generics, avoid null values, use Iterator.remove() for safe removal
    
    // PROBLEM: Main method that orchestrates all the chaos
    public static void main(String[] args)                                            { // PROBLEM: Main method with right-aligned brace
        out.println("Starting Java Nightmare...");                                    // PROBLEM: Static import abuse for System.out
        
        // PROBLEM: Initialize confusable variables with confusing values
        l1 = "l1"; O0 = "O0"; I1 = "I1";                                              // PROBLEM: Assignments that look like the variable names
        
        // PROBLEM: Start chaotic operations
        spawnChaos();                                                                  // PROBLEM: Start unmanaged racing threads
        
        // PROBLEM: File system operations without cleanup
        fileDisaster("chaos.txt");                                                     // PROBLEM: Create file without cleanup
        fileDisaster("/tmp/chaos.log");                                                // PROBLEM: More file handle leaks
        
        // PROBLEM: Network operation with potential null return
        String response = httpChaos("http://example.com");                            // PROBLEM: Network call that may return null
        out.println("Response length: " + 
                   (response != null ? response.length() : "null"));                  // PROBLEM: Null check in print statement
        
        // PROBLEM: Database operation with SQL injection
        sqlChaos("admin' --", "password");                                             // PROBLEM: Pass SQL injection as parameter
        
        // PROBLEM: Collection operations with type violations
        collectionDisaster();                                                          // PROBLEM: Call method that violates type safety
        
        // PROBLEM: Generic method abuse
        doStuff("test", 123, null);                                                    // PROBLEM: Pass mixed types to generic method
        
        // PROBLEM: Static nested class method call
        InnerChaos.mutateGlobals();                                                    // PROBLEM: Mutate all global variables
        
        // PROBLEM: Exit without cleanup
        out.println("Chaos complete! Threads: " + THREAD_LEAKS.size());              // PROBLEM: Report thread count but don't clean up
        out.println("Global state: a=" + a + ", CHAOS size=" + GLOBAL_CHAOS.size()); // PROBLEM: Print global state
        
        // PROBLEM: Force exit without cleanup
        System.exit(0);                                                                // PROBLEM: Exit without joining threads or closing resources
    } // PROBLEM: Main method closing brace aligned right
} // PROBLEM: Class closing brace aligned right

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY OF JAVA ANTI-PATTERNS DEMONSTRATED:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Formatting Terrorism**: All braces aligned to right side (Python-style in Java)
// 2. **Wildcard Import Abuse**: Import entire packages unnecessarily
// 3. **Global State Chaos**: 26+ global variables with meaningless names
// 4. **Resource Leaks**: No try-with-resources, missing close() calls
// 5. **SQL Injection**: String concatenation in SQL queries
// 6. **Thread Management Disasters**: Unmanaged threads, race conditions
// 7. **Type Safety Violations**: Raw types, unchecked casts, @SuppressWarnings abuse
// 8. **Exception Handling Abuse**: Catch-all exceptions, silent failures
// 9. **Network Security Issues**: No timeouts, URL injection vulnerabilities
// 10. **Memory Leaks**: Objects kept in collections without cleanup

// WHY THE FORMATTING IS TERRIBLE:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Readability Disaster**: Code becomes nearly impossible to scan
// 2. **Maintenance Nightmare**: Extremely difficult to modify or debug
// 3. **Team Productivity Killer**: Slows down entire development team
// 4. **Code Review Horror**: Reviewers can't focus on logic due to formatting
// 5. **IDE Confusion**: Most Java IDEs expect standard brace placement
// 6. **Convention Violation**: Violates Java Code Conventions and Google Style Guide
// 7. **Cognitive Overload**: Developers waste mental energy parsing unusual formatting

// FIX SUMMARY:
// ─────────────────────────────────────────────────────────────────────────────
// 1. **Standard Formatting**: Use standard Java brace placement and indentation
// 2. **Specific Imports**: Import only what you need, avoid wildcards
// 3. **Minimize Global State**: Use proper encapsulation and dependency injection
// 4. **Resource Management**: Use try-with-resources for all closeable resources
// 5. **Parameterized Queries**: Use PreparedStatement with parameters
// 6. **Thread Pools**: Use ExecutorService instead of raw Thread creation
// 7. **Type Safety**: Use proper generics, avoid raw types and unchecked casts
// 8. **Proper Exception Handling**: Catch specific exceptions, log errors
// 9. **Security Best Practices**: Validate inputs, set timeouts, avoid injection
// 10. **Clean Shutdown**: Properly close resources and join threads before exit

// Remember: Code formatting should help readability, not hinder it! 🍵
