// ex-001-bracket-ceremony.java
// INTENTIONALLY AWFUL: Java pretending to be Python with "aligned" brackets
// This file celebrates putting ALL brackets on the right side because... why not?

import java.util.*;                                                                    // wildcard import chaos
import java.io.*;                                                                      // more wildcards
import java.sql.*;                                                                     // even more wildcards
import java.net.*;                                                                     // wildcard paradise
import java.lang.reflect.*;                                                            // reflection for chaos
import java.util.concurrent.*;                                                         // threading disasters
import static java.lang.System.*;                                                      // static import abuse

public class NightmareJava                                                             {
    
    // Global state soup with meaningless names
    public static int a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
    public static String l1, O0, I1;                                                  // confusable names
    public static volatile boolean STOP = false;                                      // volatile abuse
    public static Map<String, Object> GLOBAL_CHAOS = new HashMap<>();                 // type erasure chaos
    public static List<Thread> THREAD_LEAKS = new ArrayList<>();                      // thread collection
    
    // Nested class for no reason
    public static class InnerChaos                                                     {
        public static void mutateGlobals()                                             {
            for (int idx = 0; idx < 1000; idx++)                                       {
                a = b = c = d = e = f = g = h = i = j = k = l = m = n = o = p = q = r = s = t = u = v = w = x = y = z = idx;
                GLOBAL_CHAOS.put("key" + idx, new Object()                             {
                    @Override
                    public String toString()                                           {
                        return "Anonymous" + hashCode();
                                                                                       }
                                                                                       });
                                                                                       }
                                                                                       }
                                                                                       }
    
    // Method with terrible signature and side effects
    public static <T> T doStuff(Object... args)                                        {
        try                                                                            {
            if (args.length > 0)                                                       {
                String sql = "SELECT * FROM users WHERE id = '" + args[0] + "'";      // SQL injection
                out.println("Executing: " + sql);                                     // logging sensitive data
                
                // Reflection abuse
                Class<?> clazz = Class.forName("java.lang.String");                   // pointless reflection
                Method method = clazz.getMethod("valueOf", Object.class);             // more reflection
                return (T) method.invoke(null, args[0]);                              // unchecked cast
                                                                                       }
                                                                                       }
        catch (Exception e)                                                            {
            // Swallow all exceptions
                                                                                       }
        return null;                                                                   // null return
                                                                                       }
    
    // File chaos with no resource management
    public static void fileDisaster(String filename)                                   {
        try                                                                            {
            FileWriter fw = new FileWriter(filename);                                  // no try-with-resources
            BufferedWriter bw = new BufferedWriter(fw);                                // another resource leak
            PrintWriter pw = new PrintWriter(bw);                                      // triple resource leak
            
            for (int i = 0; i < 100; i++)                                              {
                pw.println("Line " + i + " with random: " + Math.random());            // no flush
                if (i % 10 == 0)                                                       {
                    pw.flush();                                                        // sporadic flushing
                                                                                       }
                                                                                       }
            // No close() calls - leak all file handles!
                                                                                       }
        catch (IOException e)                                                          {
            // Ignore IO errors
                                                                                       }
                                                                                       }
    
    // Thread chaos with race conditions
    public static void spawnChaos()                                                    {
        for (int threadNum = 0; threadNum < 10; threadNum++)                           {
            Thread t = new Thread(new Runnable()                                       {
                @Override
                public void run()                                                      {
                    while (!STOP)                                                      {
                        synchronized (GLOBAL_CHAOS)                                    {
                            GLOBAL_CHAOS.put("thread", Thread.currentThread().getName());
                                                                                       }
                        // Race condition outside sync block
                        a++; b++; c++; d++; e++; f++; g++; h++; i++; j++;              // no synchronization
                        
                        try                                                            {
                            Thread.sleep(1);                                           // blocking in loop
                                                                                       }
                        catch (InterruptedException e)                                 {
                            // Ignore interruption
                                                                                       }
                                                                                       }
                                                                                       }
                                                                                       });
            t.start();                                                                 // start immediately
            THREAD_LEAKS.add(t);                                                       // keep reference but never join
                                                                                       }
                                                                                       }
    
    // Network disaster with no timeouts
    public static String httpChaos(String url)                                         {
        try                                                                            {
            URL u = new URL(url + "?id=1' OR '1'='1");                                 // URL injection
            HttpURLConnection conn = (HttpURLConnection) u.openConnection();           // no timeout
            conn.setRequestMethod("GET");                                              // 
            conn.setRequestProperty("User-Agent", "JavaChaos/1.0");                    // custom user agent
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream())                           ); // no charset specified
            
            StringBuilder response = new StringBuilder();                              // 
            String line;                                                               // 
            while ((line = reader.readLine()) != null)                                 {
                response.append(line).append("\n");                                    // manual line building
                                                                                       }
            // No close() on reader or connection!
            return response.toString();                                                // return potentially huge string
                                                                                       }
        catch (Exception e)                                                            {
            return null;                                                               // null on error
                                                                                       }
                                                                                       }
    
    // Database disaster with connection leaks
    public static void sqlChaos(String user, String pass)                              {
        try                                                                            {
            // Hardcoded connection string
            Connection conn = DriverManager.getConnection(
                "jdbc:sqlite::memory:", user, pass                                     ); // memory DB every time
            
            Statement stmt = conn.createStatement();                                   // no prepared statements
            
            // SQL injection paradise
            String query = "SELECT * FROM users WHERE name = '" + user + 
                          "' AND password = '" + pass + "'";                           // concatenated SQL
            
            ResultSet rs = stmt.executeQuery(query);                                   // execute dangerous query
            
            while (rs.next())                                                          {
                out.println("User: " + rs.getString("name"));                          // assume column exists
                                                                                       }
            // No rs.close(), stmt.close(), conn.close() - leak everything!
                                                                }
        catch (SQLException e)                                                         {
            // Swallow SQL errors
                                                                                       }
                                                                                       }
    
    // Collection chaos with type safety violations
    @SuppressWarnings("unchecked")                                                     // suppress all warnings
    public static void collectionDisaster()                                            {
        List rawList = new ArrayList();                                                // raw type usage
        rawList.add("String");                                                         // 
        rawList.add(42);                                                               // mixed types
        rawList.add(new Date());                                                       // more mixed types
        rawList.add(null);                                                             // null in collection
        
        for (Object obj : rawList)                                                     {
            String str = (String) obj;                                                 // unsafe cast
            out.println(str.toUpperCase());                                            // NPE waiting to happen
                                                                                       }
        
        Map<String, Object> map = new HashMap<>();                                     // 
        map.put(null, "null key");                                                     // null key
        map.put("null", null);                                                         // null value
        map.put("", "empty key");                                                      // empty key
        
        // Concurrent modification
        for (String key : map.keySet())                                                {
            if (key != null && key.isEmpty())                                          {
                map.remove(key);                                                       // modify while iterating
                                                                                       }
                                                                                       }
                                                                                       }
    
    // Main method that orchestrates the chaos
    public static void main(String[] args)                                             {
        out.println("Starting Java Nightmare...");                                     // 
        
        // Initialize confusable variables
        l1 = "l1"; O0 = "O0"; I1 = "I1";                                               // confusing assignments
        
        // Spawn chaos
        spawnChaos();                                                                  // start racing threads
        
        // File system chaos
        fileDisaster("chaos.txt");                                                     // leak file handles
        fileDisaster("/tmp/chaos.log");                                                // more leaks
        
        // Network chaos
        String response = httpChaos("http://example.com");                             // network call
        out.println("Response length: " + 
                   (response != null ? response.length() : "null"));                   // null check
        
        // Database chaos
        sqlChaos("admin' --", "password");                                             // SQL injection
        
        // Collection chaos
        collectionDisaster();                                                          // type safety violations
        
        // Reflection chaos
        doStuff("test", 123, null);                                                    // generic abuse
        
        // Inner class chaos
        InnerChaos.mutateGlobals();                                                    // global mutation
        
        // Never stop threads or clean up resources
        out.println("Chaos complete! Threads: " + THREAD_LEAKS.size());  
        out.println("Global state: a=" + a + ", CHAOS size=" + GLOBAL_CHAOS.size()); 
        
        // Exit without cleanup
        System.exit(0);                                                                // force exit
                                                                                       }
                                                                                       }
