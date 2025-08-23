// Fix: Use parameterized queries

using System;
using System.Data.SqlClient;

class SqlInjectionFix {
    static void Main(string[] args) {
        string user = args.Length > 0 ? args[0] : "admin";
        string connStr = "Server=.;Database=Test;Trusted_Connection=True;";
        using (var conn = new SqlConnection(connStr)) {
            conn.Open();
            string sql = "SELECT * FROM Users WHERE username=@u";
            using (var cmd = new SqlCommand(sql, conn)) {
                cmd.Parameters.AddWithValue("@u", user);
                Console.WriteLine("Executing parameterized query");
                try { using (var r = cmd.ExecuteReader()) { Console.WriteLine("Query executed"); } }
                catch (Exception e) { Console.WriteLine(e.Message); }
            }
        }
    }
}
