-- Fix: Parameterize dynamic queries and escape identifiers
-- Use sp_executesql with parameters (SQL Server example)

DECLARE @sql nvarchar(max) = N'SELECT * FROM users WHERE role = @role';
EXEC sp_executesql @sql, N'@role nvarchar(100)', @role = @role_input;
