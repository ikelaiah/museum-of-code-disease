-- ex-002-cursor-catastrophe.sql AUTOPSY VERSION
-- INTENTIONALLY AWFUL: SQL cursor abuse and dynamic SQL injection madness
-- This file demonstrates the worst SQL patterns and anti-practices
-- AUTOPSY: Same nightmare code with detailed explanations of SQL anti-patterns

-- PROBLEM: Cursor abuse - using cursors where set-based operations would work
-- WHY THIS IS PROBLEMATIC:
-- - Cursors are row-by-row processing (RBAR - Row By Agonizing Row)
-- - Much slower than set-based operations
-- - Uses more memory and resources
-- - Can cause blocking and deadlocks
-- - Makes code harder to maintain and optimize
-- FIX: Use set-based operations, JOINs, CTEs, window functions

DECLARE @chaos_cursor CURSOR;
DECLARE @user_id INT, @user_name VARCHAR(100), @user_email VARCHAR(255);
DECLARE @total_orders INT = 0;
DECLARE @processed_count INT = 0;

-- PROBLEM: Cursor to calculate totals (should be a simple SUM)
SET @chaos_cursor = CURSOR FOR
    SELECT user_id, user_name, user_email 
    FROM users 
    WHERE status = 'active';                                   -- PROBLEM: Should use set-based SUM

OPEN @chaos_cursor;
FETCH NEXT FROM @chaos_cursor INTO @user_id, @user_name, @user_email;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- PROBLEM: Nested query inside cursor loop
    DECLARE @user_order_count INT;
    SELECT @user_order_count = COUNT(*) 
    FROM orders 
    WHERE user_id = @user_id;                                  -- PROBLEM: N+1 query problem
    
    SET @total_orders = @total_orders + @user_order_count;     -- PROBLEM: Manual aggregation
    SET @processed_count = @processed_count + 1;
    
    -- PROBLEM: More nested operations in cursor
    IF @user_order_count > 10
    BEGIN
        -- PROBLEM: Update inside cursor loop
        UPDATE users 
        SET vip_status = 'gold' 
        WHERE user_id = @user_id;                              -- PROBLEM: Row-by-row updates
        
        -- PROBLEM: Insert audit record for each row
        INSERT INTO audit_log (user_id, action, timestamp)
        VALUES (@user_id, 'VIP_UPGRADE', GETDATE());           -- PROBLEM: Individual inserts
    END
    
    FETCH NEXT FROM @chaos_cursor INTO @user_id, @user_name, @user_email;
END

CLOSE @chaos_cursor;
DEALLOCATE @chaos_cursor;

-- FIX: Replace entire cursor with set-based operations:
-- UPDATE users SET vip_status = 'gold' 
-- WHERE user_id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 10);
-- INSERT INTO audit_log (user_id, action, timestamp)
-- SELECT user_id, 'VIP_UPGRADE', GETDATE() FROM users WHERE vip_status = 'gold';

-- PROBLEM: Dynamic SQL injection vulnerability
-- WHY THIS IS PROBLEMATIC:
-- - Allows SQL injection attacks
-- - Can expose sensitive data
-- - Can allow data modification/deletion
-- - Bypasses parameterized query protection
-- - Makes code vulnerable to malicious input
-- FIX: Use parameterized queries, stored procedures, input validation

DECLARE @table_name VARCHAR(100) = 'users';                   -- PROBLEM: Could be user input
DECLARE @column_name VARCHAR(100) = 'user_name';              -- PROBLEM: Could be user input
DECLARE @search_value VARCHAR(255) = 'admin'' OR ''1''=''1';  -- PROBLEM: SQL injection payload
DECLARE @dynamic_sql NVARCHAR(MAX);

-- PROBLEM: Build dynamic SQL with string concatenation
SET @dynamic_sql = 'SELECT * FROM ' + @table_name + 
                   ' WHERE ' + @column_name + ' = ''' + @search_value + '''';

PRINT 'Executing dangerous dynamic SQL: ' + @dynamic_sql;     -- PROBLEM: Log shows injection

-- PROBLEM: Execute dynamic SQL without validation
EXEC sp_executesql @dynamic_sql;                              -- PROBLEM: SQL injection execution

-- PROBLEM: More dynamic SQL chaos
DECLARE @order_by VARCHAR(100) = 'user_id; DROP TABLE users; --'; -- PROBLEM: SQL injection in ORDER BY
SET @dynamic_sql = 'SELECT TOP 10 * FROM users ORDER BY ' + @order_by;
EXEC sp_executesql @dynamic_sql;                              -- PROBLEM: Could drop tables

-- PROBLEM: Dynamic SQL with user permissions
DECLARE @username VARCHAR(100) = 'hacker''; GRANT sysadmin TO hacker; --';
SET @dynamic_sql = 'SELECT * FROM users WHERE username = ''' + @username + '''';
EXEC sp_executesql @dynamic_sql;                              -- PROBLEM: Could grant permissions

-- FIX: Use parameterized queries:
-- EXEC sp_executesql N'SELECT * FROM users WHERE user_name = @search', N'@search VARCHAR(255)', @search_value;

-- PROBLEM: Recursive CTE madness
-- WHY THIS IS PROBLEMATIC:
-- - Can cause infinite recursion
-- - Consumes excessive memory and CPU
-- - Can crash the database server
-- - Difficult to debug and optimize
-- - Can cause blocking for other queries
-- FIX: Use proper termination conditions, MAXRECURSION hint, iterative approaches

WITH recursive_chaos (level, id, parent_id, path, cycle_check) AS (
    -- PROBLEM: Anchor member without proper base case
    SELECT 
        1 as level,
        id,
        parent_id,
        CAST(id AS VARCHAR(MAX)) as path,
        CAST(id AS VARCHAR(MAX)) as cycle_check              -- PROBLEM: Weak cycle detection
    FROM categories 
    WHERE parent_id IS NULL OR parent_id = 0                -- PROBLEM: Ambiguous base condition
    
    UNION ALL
    
    -- PROBLEM: Recursive member without proper termination
    SELECT 
        r.level + 1,
        c.id,
        c.parent_id,
        r.path + '->' + CAST(c.id AS VARCHAR(MAX)),
        r.cycle_check + ',' + CAST(c.id AS VARCHAR(MAX))     -- PROBLEM: String-based cycle detection
    FROM categories c
    INNER JOIN recursive_chaos r ON c.parent_id = r.id
    WHERE r.level < 1000                                     -- PROBLEM: Arbitrary depth limit
      AND CHARINDEX(',' + CAST(c.id AS VARCHAR(MAX)) + ',', ',' + r.cycle_check + ',') = 0 -- PROBLEM: Inefficient cycle check
)
-- PROBLEM: Select from recursive CTE without MAXRECURSION
SELECT level, id, parent_id, path 
FROM recursive_chaos
ORDER BY level, path;                                        -- PROBLEM: No MAXRECURSION hint

-- PROBLEM: Another recursive CTE that can cause infinite loops
WITH infinite_chaos (n, factorial) AS (
    SELECT 1, 1                                              -- PROBLEM: Base case
    UNION ALL
    SELECT n + 1, factorial * (n + 1)                       -- PROBLEM: No termination condition
    FROM infinite_chaos
    WHERE n < 100000                                         -- PROBLEM: Very high limit
)
SELECT * FROM infinite_chaos;                                -- PROBLEM: Could run forever

-- FIX: Use OPTION (MAXRECURSION 100) and proper cycle detection

-- PROBLEM: Trigger cascades that can cause infinite loops
-- WHY THIS IS PROBLEMATIC:
-- - Triggers can fire other triggers
-- - Can cause infinite loops
-- - Difficult to debug and trace
-- - Can cause performance issues
-- - Can cause data corruption
-- FIX: Avoid trigger chains, use proper business logic, disable recursive triggers

-- PROBLEM: Trigger that updates related tables
CREATE TRIGGER tr_user_update_chaos ON users
AFTER UPDATE
AS
BEGIN
    -- PROBLEM: Trigger updates other tables that have triggers
    UPDATE user_statistics 
    SET last_updated = GETDATE(),
        update_count = update_count + 1
    FROM user_statistics us
    INNER JOIN inserted i ON us.user_id = i.user_id;         -- PROBLEM: Could trigger another trigger
    
    -- PROBLEM: Trigger inserts audit records
    INSERT INTO audit_log (table_name, action, user_id, timestamp)
    SELECT 'users', 'UPDATE', user_id, GETDATE()
    FROM inserted;                                            -- PROBLEM: Could trigger audit trigger
    
    -- PROBLEM: Trigger updates denormalized data
    UPDATE orders 
    SET user_name = i.user_name,
        user_email = i.user_email
    FROM orders o
    INNER JOIN inserted i ON o.user_id = i.user_id;          -- PROBLEM: Could trigger order trigger
END;

-- PROBLEM: Trigger on audit table that creates more audit records
CREATE TRIGGER tr_audit_log_chaos ON audit_log
AFTER INSERT
AS
BEGIN
    -- PROBLEM: Audit trigger that audits itself
    INSERT INTO audit_log (table_name, action, user_id, timestamp)
    SELECT 'audit_log', 'AUDIT_INSERT', 0, GETDATE()
    FROM inserted;                                            -- PROBLEM: Infinite recursion
    
    -- PROBLEM: Update statistics from audit trigger
    UPDATE system_statistics 
    SET audit_count = audit_count + @@ROWCOUNT,
        last_audit = GETDATE();                               -- PROBLEM: More side effects
END;

-- PROBLEM: Transaction chaos with nested transactions and improper error handling
-- WHY THIS IS PROBLEMATIC:
-- - Nested transactions can cause deadlocks
-- - Improper error handling can leave transactions open
-- - Can cause blocking and performance issues
-- - Difficult to debug transaction state
-- - Can cause data corruption
-- FIX: Use proper transaction management, error handling, avoid nested transactions

BEGIN TRANSACTION chaos_transaction;                          -- PROBLEM: Outer transaction

DECLARE @error_count INT = 0;

-- PROBLEM: Nested transaction without proper handling
BEGIN TRANSACTION nested_chaos;                               -- PROBLEM: Nested transaction

    -- PROBLEM: Operation that might fail
    UPDATE users SET user_name = 'CHAOS_USER_' + CAST(user_id AS VARCHAR(10))
    WHERE user_id BETWEEN 1 AND 1000000;                     -- PROBLEM: Large update without WHERE optimization
    
    IF @@ERROR <> 0
    BEGIN
        SET @error_count = @error_count + 1;
        -- PROBLEM: Rollback nested transaction but continue outer
        ROLLBACK TRANSACTION nested_chaos;                    -- PROBLEM: Partial rollback
    END
    ELSE
    BEGIN
        COMMIT TRANSACTION nested_chaos;                      -- PROBLEM: Commit nested
    END

-- PROBLEM: Another nested transaction
BEGIN TRANSACTION another_nested_chaos;

    -- PROBLEM: Delete without proper WHERE clause
    DELETE FROM orders WHERE order_date < '2020-01-01';      -- PROBLEM: Could delete too much
    
    -- PROBLEM: Insert that might violate constraints
    INSERT INTO users (user_name, user_email, created_date)
    SELECT 'BULK_USER_' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS VARCHAR(10)),
           'bulk' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS VARCHAR(10)) + '@chaos.com',
           GETDATE()
    FROM sys.objects                                          -- PROBLEM: Insert based on system table
    CROSS JOIN sys.objects;                                   -- PROBLEM: Cartesian product for bulk insert
    
    IF @@ERROR <> 0
    BEGIN
        SET @error_count = @error_count + 1;
        ROLLBACK TRANSACTION another_nested_chaos;
    END
    ELSE
    BEGIN
        COMMIT TRANSACTION another_nested_chaos;
    END

-- PROBLEM: Conditional commit/rollback based on error count
IF @error_count > 0
BEGIN
    PRINT 'Errors occurred: ' + CAST(@error_count AS VARCHAR(10));
    ROLLBACK TRANSACTION chaos_transaction;                   -- PROBLEM: Rollback after nested commits
END
ELSE
BEGIN
    COMMIT TRANSACTION chaos_transaction;
END

-- PROBLEM: NATURAL JOIN abuse (if supported by database)
-- WHY THIS IS PROBLEMATIC:
-- - Joins on all columns with same name
-- - Unpredictable results when schema changes
-- - Can create unexpected Cartesian products
-- - Difficult to debug and maintain
-- - Can cause performance issues
-- FIX: Use explicit JOIN conditions, specify column names

-- Note: SQL Server doesn't support NATURAL JOIN, but here's the concept:
-- SELECT * FROM users NATURAL JOIN orders;                  -- PROBLEM: Implicit join conditions
-- SELECT * FROM orders NATURAL JOIN order_items NATURAL JOIN products; -- PROBLEM: Multiple natural joins

-- Instead, SQL Server equivalent problems:
-- PROBLEM: JOIN without proper conditions
SELECT u.*, o.*, oi.*, p.*
FROM users u, orders o, order_items oi, products p           -- PROBLEM: Comma joins (implicit CROSS JOIN)
WHERE u.user_id = o.user_id                                  -- PROBLEM: Some join conditions
  AND o.order_id = oi.order_id;                              -- PROBLEM: Missing join condition for products

-- PROBLEM: Cartesian product chaos
SELECT COUNT(*) as cartesian_chaos_count
FROM users u
CROSS JOIN orders o
CROSS JOIN products p                                         -- PROBLEM: Intentional Cartesian product
CROSS JOIN categories c;                                      -- PROBLEM: More Cartesian chaos

-- PROBLEM: Non-sargable predicates that prevent index usage
-- WHY THIS IS PROBLEMATIC:
-- - Forces table scans instead of index seeks
-- - Poor performance on large tables
-- - Can cause blocking and timeouts
-- - Wastes server resources
-- - Makes queries non-scalable
-- FIX: Write sargable predicates, use proper indexing

SELECT * FROM users 
WHERE UPPER(user_name) = 'ADMIN';                            -- PROBLEM: Function on column prevents index usage

SELECT * FROM orders 
WHERE YEAR(order_date) = 2023;                               -- PROBLEM: Function on date column

SELECT * FROM products 
WHERE price * 1.1 > 100;                                     -- PROBLEM: Calculation on column

SELECT * FROM users 
WHERE user_name LIKE '%admin%';                              -- PROBLEM: Leading wildcard prevents index usage

SELECT * FROM orders 
WHERE CAST(order_id AS VARCHAR(10)) = '12345';               -- PROBLEM: Type conversion on column

-- FIX: Rewrite as sargable predicates:
-- WHERE user_name = 'ADMIN' (if stored in uppercase)
-- WHERE order_date >= '2023-01-01' AND order_date < '2024-01-01'
-- WHERE price > 100 / 1.1
-- WHERE user_name LIKE 'admin%' (if possible)
-- WHERE order_id = 12345

-- PROBLEM: Subquery abuse and correlated subqueries
-- WHY THIS IS PROBLEMATIC:
-- - Correlated subqueries execute for each outer row
-- - Can cause N+1 query problems
-- - Poor performance compared to JOINs
-- - Difficult to optimize
-- - Can cause blocking
-- FIX: Use JOINs, EXISTS, window functions

-- PROBLEM: Correlated subquery in SELECT
SELECT user_id, user_name,
       (SELECT COUNT(*) FROM orders WHERE user_id = u.user_id) as order_count, -- PROBLEM: Correlated subquery
       (SELECT MAX(order_date) FROM orders WHERE user_id = u.user_id) as last_order, -- PROBLEM: Another correlated subquery
       (SELECT SUM(total_amount) FROM orders WHERE user_id = u.user_id) as total_spent -- PROBLEM: Third correlated subquery
FROM users u;

-- PROBLEM: Correlated subquery in WHERE
SELECT * FROM products p
WHERE price > (SELECT AVG(price) FROM products WHERE category_id = p.category_id); -- PROBLEM: Correlated subquery

-- PROBLEM: Multiple levels of subqueries
SELECT * FROM users 
WHERE user_id IN (
    SELECT user_id FROM orders 
    WHERE order_id IN (
        SELECT order_id FROM order_items 
        WHERE product_id IN (
            SELECT product_id FROM products 
            WHERE category_id IN (
                SELECT category_id FROM categories 
                WHERE category_name LIKE '%electronics%'      -- PROBLEM: 5 levels deep
            )
        )
    )
);

-- FIX: Use JOINs and CTEs for better performance

-- PROBLEM: Final chaos report
PRINT '💀 SQL CURSOR CATASTROPHE COMPLETE! 💀';
PRINT 'Total users processed with cursor: ' + CAST(@processed_count AS VARCHAR(10));
PRINT 'Total orders calculated manually: ' + CAST(@total_orders AS VARCHAR(10));
PRINT 'Dynamic SQL injection attempts completed';
PRINT 'Recursive CTEs executed without limits';
PRINT 'Trigger cascades activated';
PRINT 'Transaction chaos with nested transactions completed';
PRINT 'Cartesian products and non-sargable predicates executed';
PRINT 'Correlated subqueries and nested queries completed';

-- ─────────────────────────────────────────────────────────────────────────────
-- SQL ANTI-PATTERNS SUMMARY:
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. **Cursor Abuse**: Using cursors for operations that should be set-based
-- 2. **Dynamic SQL Injection**: Building SQL with string concatenation
-- 3. **Recursive CTE Madness**: CTEs without proper termination conditions
-- 4. **Trigger Cascades**: Triggers that fire other triggers infinitely
-- 5. **Transaction Chaos**: Nested transactions with improper error handling
-- 6. **NATURAL JOIN Abuse**: Implicit joins that can break with schema changes
-- 7. **Cartesian Products**: Unintentional cross joins creating huge result sets
-- 8. **Non-Sargable Predicates**: WHERE clauses that prevent index usage
-- 9. **Correlated Subqueries**: Subqueries that execute for each outer row
-- 10. **Nested Subquery Hell**: Multiple levels of subqueries instead of JOINs

-- WHY SQL IS UNIQUELY DANGEROUS:
-- ─────────────────────────────────────────────────────────────────────────────
-- - **Set vs Row Processing**: Easy to write inefficient row-by-row code
-- - **Dynamic SQL Power**: String concatenation can create injection vulnerabilities
-- - **Recursive Features**: CTEs and triggers can create infinite loops
-- - **Transaction Complexity**: Nested transactions and error handling is tricky
-- - **Implicit Behavior**: Many operations have implicit behavior (like NATURAL JOIN)
-- - **Performance Traps**: Easy to write queries that perform poorly at scale
-- - **Side Effects**: Triggers and functions can have hidden side effects
-- - **Locking Issues**: Poor queries can cause blocking and deadlocks

-- FIX SUMMARY:
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Use set-based operations instead of cursors whenever possible
-- 2. Use parameterized queries, never build SQL with string concatenation
-- 3. Use MAXRECURSION hint and proper termination conditions in CTEs
-- 4. Avoid trigger chains, use proper business logic in application layer
-- 5. Use proper transaction management, avoid nested transactions
-- 6. Use explicit JOIN conditions, never rely on implicit joins
-- 7. Always specify proper WHERE clauses to avoid Cartesian products
-- 8. Write sargable predicates that can use indexes effectively
-- 9. Use JOINs, EXISTS, or window functions instead of correlated subqueries
-- 10. Keep queries simple and readable, avoid excessive nesting

-- Remember: SQL is powerful but can be dangerous - think in sets, not rows! 💀
