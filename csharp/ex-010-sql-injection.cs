// Dangerous: SQL Injection via string concatenation
// Build: dotnet-script or compile into a small console app
// Reference: https://owasp.org/www-community/attacks/SQL_Injection

using System;
using System.Data.SqlClient;

class SqlInjectionDemo {
    static void Main(string[] args) {
        string user = args.Length > 0 ? args[0] : "admin' --";
        string connStr = "Server=.;Database=Test;Trusted_Connection=True;";
        using (var conn = new SqlConnection(connStr)) {
            conn.Open();
            string sql = "SELECT * FROM Users WHERE username='" + user + "'"; // VULNERABLE
            using (var cmd = new SqlCommand(sql, conn)) {
                Console.WriteLine("Executing: " + sql);
                try { using (var r = cmd.ExecuteReader()) { Console.WriteLine("Query executed"); } }
                catch (Exception e) { Console.WriteLine(e.Message); }
            }
        }
    }
}
