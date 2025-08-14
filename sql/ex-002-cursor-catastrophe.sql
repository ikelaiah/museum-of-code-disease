-- ex-002-cursor-catastrophe.sql
-- INTENTIONALLY AWFUL: SQL cursor abuse and dynamic SQL injection
-- This file celebrates using cursors for set operations and recursive CTE madness
-- WARNING: This code will make your database cry and your DBA quit

-- ⚠️ INTENTIONALLY TERRIBLE SQL. FOR TEACHING + LAUGHS ONLY.
-- Themes: Cursor abuse, dynamic SQL injection, recursive CTE madness,
--         trigger cascades, performance disasters, and RBAR (Row By Agonizing Row)

-- Setup tables for cursor chaos
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS AuditLog;
DROP TABLE IF EXISTS RecursiveNightmare;

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Status VARCHAR(20)
);

CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    Name VARCHAR(100),
    Price DECIMAL(10,2),
    Stock INT
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    Status VARCHAR(20),
    Total DECIMAL(10,2)
);

CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10,2)
);

CREATE TABLE AuditLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    TableName VARCHAR(50),
    Operation VARCHAR(10),
    RecordID INT,
    OldValues TEXT,
    NewValues TEXT,
    Timestamp DATETIME DEFAULT GETDATE()
);

CREATE TABLE RecursiveNightmare (
    ID INT PRIMARY KEY,
    ParentID INT,
    Name VARCHAR(100),
    Level INT,
    Path VARCHAR(1000)
);

-- Insert test data
INSERT INTO Customers VALUES 
(1, 'Alice', 'alice@example.com', 'Active'),
(2, 'Bob', 'bob@example.com', 'Active'),
(3, 'Charlie', 'charlie@example.com', 'Inactive');

INSERT INTO Products VALUES 
(1, 'Widget A', 10.00, 100),
(2, 'Widget B', 20.00, 50),
(3, 'Widget C', 30.00, 25);

INSERT INTO Orders VALUES 
(1, 1, '2025-01-01', 'Pending', 0),
(2, 2, '2025-01-02', 'Shipped', 0),
(3, 1, '2025-01-03', 'Pending', 0);

INSERT INTO OrderItems VALUES 
(1, 1, 1, 2, 10.00),
(2, 1, 2, 1, 20.00),
(3, 2, 3, 3, 30.00),
(4, 3, 1, 5, 10.00);

INSERT INTO RecursiveNightmare VALUES 
(1, NULL, 'Root', 1, '/Root'),
(2, 1, 'Child1', 2, '/Root/Child1'),
(3, 1, 'Child2', 2, '/Root/Child2'),
(4, 2, 'Grandchild1', 3, '/Root/Child1/Grandchild1'),
(5, 2, 'Grandchild2', 3, '/Root/Child1/Grandchild2');

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit A: Cursor abuse for simple aggregation (RBAR - Row By Agonizing Row)
-- This could be done with a simple SUM() but let's use a cursor for "performance"
-- ─────────────────────────────────────────────────────────────────────────────

DECLARE @OrderID INT, @Total DECIMAL(10,2), @RunningTotal DECIMAL(10,2) = 0;

DECLARE order_cursor CURSOR FOR
    SELECT OrderID FROM Orders;

OPEN order_cursor;
FETCH NEXT FROM order_cursor INTO @OrderID;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Calculate total for each order using another cursor (nested cursor hell)
    DECLARE @ItemTotal DECIMAL(10,2) = 0;
    DECLARE @ItemPrice DECIMAL(10,2), @ItemQuantity INT;
    
    DECLARE item_cursor CURSOR FOR
        SELECT Price, Quantity FROM OrderItems WHERE OrderID = @OrderID;
    
    OPEN item_cursor;
    FETCH NEXT FROM item_cursor INTO @ItemPrice, @ItemQuantity;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @ItemTotal = @ItemTotal + (@ItemPrice * @ItemQuantity);
        FETCH NEXT FROM item_cursor INTO @ItemPrice, @ItemQuantity;
    END;
    
    CLOSE item_cursor;
    DEALLOCATE item_cursor;
    
    -- Update the order total (could cause deadlocks)
    UPDATE Orders SET Total = @ItemTotal WHERE OrderID = @OrderID;
    
    SET @RunningTotal = @RunningTotal + @ItemTotal;
    
    FETCH NEXT FROM order_cursor INTO @OrderID;
END;

CLOSE order_cursor;
DEALLOCATE order_cursor;

PRINT 'Cursor-calculated running total: ' + CAST(@RunningTotal AS VARCHAR(20));

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit B: Dynamic SQL injection paradise
-- Building SQL strings without parameterization
-- ─────────────────────────────────────────────────────────────────────────────

DECLARE @CustomerName VARCHAR(100) = 'Alice'' OR ''1''=''1';  -- SQL injection payload
DECLARE @Status VARCHAR(20) = 'Active';
DECLARE @SQL NVARCHAR(MAX);

-- Vulnerable dynamic SQL construction
SET @SQL = 'SELECT * FROM Customers WHERE Name = ''' + @CustomerName + ''' AND Status = ''' + @Status + '''';

PRINT 'Executing dangerous SQL: ' + @SQL;
-- EXEC sp_executesql @SQL;  -- Commented out to prevent actual injection

-- Even worse - building SQL with user input in a loop
DECLARE @SearchTerms TABLE (Term VARCHAR(100));
INSERT INTO @SearchTerms VALUES ('Alice'), ('Bob'), ('''; DROP TABLE Customers; --');

DECLARE @Term VARCHAR(100);
DECLARE search_cursor CURSOR FOR SELECT Term FROM @SearchTerms;

OPEN search_cursor;
FETCH NEXT FROM search_cursor INTO @Term;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @SQL = 'SELECT COUNT(*) FROM Customers WHERE Name LIKE ''%' + @Term + '%''';
    PRINT 'Dynamic SQL: ' + @SQL;
    -- EXEC sp_executesql @SQL;  -- Commented out for safety
    
    FETCH NEXT FROM search_cursor INTO @Term;
END;

CLOSE search_cursor;
DEALLOCATE search_cursor;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit C: Recursive CTE madness with infinite recursion potential
-- ─────────────────────────────────────────────────────────────────────────────

-- Dangerous recursive CTE without proper termination condition
WITH InfiniteRecursion AS (
    -- Anchor member
    SELECT ID, ParentID, Name, 1 as Level, CAST(Name AS VARCHAR(1000)) as Path
    FROM RecursiveNightmare 
    WHERE ParentID IS NULL
    
    UNION ALL
    
    -- Recursive member with potential for infinite recursion
    SELECT r.ID, r.ParentID, r.Name, ir.Level + 1, 
           CAST(ir.Path + '/' + r.Name AS VARCHAR(1000))
    FROM RecursiveNightmare r
    INNER JOIN InfiniteRecursion ir ON r.ParentID = ir.ID
    WHERE ir.Level < 100  -- Weak termination condition
)
SELECT * FROM InfiniteRecursion
OPTION (MAXRECURSION 1000);  -- Dangerously high recursion limit

-- Self-referencing recursive nightmare
WITH SelfReference AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM SelfReference WHERE n < 1000000  -- Will hit recursion limit
)
SELECT COUNT(*) FROM SelfReference
OPTION (MAXRECURSION 32767);  -- Maximum recursion limit

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit D: Trigger cascade chaos
-- Triggers that call other triggers in an endless chain
-- ─────────────────────────────────────────────────────────────────────────────

-- Trigger on Orders that updates Customers
CREATE TRIGGER tr_Orders_Update ON Orders
AFTER UPDATE
AS
BEGIN
    UPDATE c 
    SET Status = CASE 
        WHEN EXISTS(SELECT 1 FROM Orders WHERE CustomerID = c.CustomerID AND Status = 'Pending') 
        THEN 'HasPendingOrders' 
        ELSE 'NoOrders' 
    END
    FROM Customers c
    INNER JOIN inserted i ON c.CustomerID = i.CustomerID;
    
    -- Log the change (causes another trigger to fire)
    INSERT INTO AuditLog (TableName, Operation, RecordID, NewValues)
    SELECT 'Orders', 'UPDATE', OrderID, 'Status changed'
    FROM inserted;
END;

-- Trigger on Customers that updates Orders (circular dependency)
CREATE TRIGGER tr_Customers_Update ON Customers
AFTER UPDATE
AS
BEGIN
    -- Update order status based on customer status
    UPDATE o
    SET Status = CASE 
        WHEN i.Status = 'Inactive' THEN 'Cancelled'
        ELSE o.Status
    END
    FROM Orders o
    INNER JOIN inserted i ON o.CustomerID = i.CustomerID;
    
    -- This could trigger tr_Orders_Update again!
END;

-- Trigger on AuditLog that creates more audit entries (infinite loop potential)
CREATE TRIGGER tr_AuditLog_Insert ON AuditLog
AFTER INSERT
AS
BEGIN
    -- Log that we're logging (meta-logging chaos)
    INSERT INTO AuditLog (TableName, Operation, RecordID, NewValues)
    SELECT 'AuditLog', 'INSERT', LogID, 'Audit entry created'
    FROM inserted
    WHERE TableName != 'AuditLog';  -- Weak prevention of infinite recursion
END;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit E: Performance disaster with cursors and functions
-- Using cursors where set-based operations would be much faster
-- ─────────────────────────────────────────────────────────────────────────────

-- Scalar function that uses a cursor (performance killer)
CREATE FUNCTION dbo.GetCustomerOrderCount(@CustomerID INT)
RETURNS INT
AS
BEGIN
    DECLARE @Count INT = 0;
    DECLARE @OrderID INT;
    
    DECLARE count_cursor CURSOR FOR
        SELECT OrderID FROM Orders WHERE CustomerID = @CustomerID;
    
    OPEN count_cursor;
    FETCH NEXT FROM count_cursor INTO @OrderID;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @Count = @Count + 1;  -- Could just use COUNT(*)!
        FETCH NEXT FROM count_cursor INTO @OrderID;
    END;
    
    CLOSE count_cursor;
    DEALLOCATE count_cursor;
    
    RETURN @Count;
END;

-- Use the slow function in a query (performance nightmare)
SELECT c.Name, dbo.GetCustomerOrderCount(c.CustomerID) as OrderCount
FROM Customers c;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit F: Cursor-based data modification (deadlock paradise)
-- Modifying data row by row instead of set-based operations
-- ─────────────────────────────────────────────────────────────────────────────

DECLARE @ProductID INT, @CurrentStock INT, @NewStock INT;

DECLARE stock_cursor CURSOR FOR
    SELECT ProductID, Stock FROM Products FOR UPDATE;  -- Lock rows

OPEN stock_cursor;
FETCH NEXT FROM stock_cursor INTO @ProductID, @CurrentStock;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Complex calculation that could be done in a single UPDATE
    IF @CurrentStock < 50
        SET @NewStock = @CurrentStock + 100;
    ELSE
        SET @NewStock = @CurrentStock;
    
    -- Update one row at a time (inefficient and deadlock-prone)
    UPDATE Products 
    SET Stock = @NewStock 
    WHERE ProductID = @ProductID;
    
    -- Add artificial delay to increase deadlock chances
    WAITFOR DELAY '00:00:01';
    
    FETCH NEXT FROM stock_cursor INTO @ProductID, @CurrentStock;
END;

CLOSE stock_cursor;
DEALLOCATE stock_cursor;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit G: Nested cursor hell with transaction chaos
-- Multiple levels of cursors with improper transaction handling
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN TRANSACTION;  -- Start transaction but never commit or rollback properly

DECLARE @OuterCustomerID INT;
DECLARE outer_cursor CURSOR FOR SELECT CustomerID FROM Customers;

OPEN outer_cursor;
FETCH NEXT FROM outer_cursor INTO @OuterCustomerID;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @InnerOrderID INT;
    DECLARE inner_cursor CURSOR FOR 
        SELECT OrderID FROM Orders WHERE CustomerID = @OuterCustomerID;
    
    OPEN inner_cursor;
    FETCH NEXT FROM inner_cursor INTO @InnerOrderID;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        DECLARE @DeepItemID INT;
        DECLARE deep_cursor CURSOR FOR 
            SELECT OrderItemID FROM OrderItems WHERE OrderID = @InnerOrderID;
        
        OPEN deep_cursor;
        FETCH NEXT FROM deep_cursor INTO @DeepItemID;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Nested transaction chaos
            BEGIN TRANSACTION;  -- Nested transaction
            
            UPDATE OrderItems 
            SET Price = Price * 1.1  -- 10% price increase
            WHERE OrderItemID = @DeepItemID;
            
            -- Sometimes commit, sometimes rollback randomly
            IF RAND() > 0.5
                COMMIT TRANSACTION;
            ELSE
                ROLLBACK TRANSACTION;
            
            FETCH NEXT FROM deep_cursor INTO @DeepItemID;
        END;
        
        CLOSE deep_cursor;
        DEALLOCATE deep_cursor;
        
        FETCH NEXT FROM inner_cursor INTO @InnerOrderID;
    END;
    
    CLOSE inner_cursor;
    DEALLOCATE inner_cursor;
    
    FETCH NEXT FROM outer_cursor INTO @OuterCustomerID;
END;

CLOSE outer_cursor;
DEALLOCATE outer_cursor;

-- Never commit the outer transaction - leave it hanging!
-- COMMIT TRANSACTION;  -- Commented out for chaos

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit H: Final chaos - cleanup that doesn't clean up
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop function
DROP FUNCTION IF EXISTS dbo.GetCustomerOrderCount;

-- Drop triggers (but not all of them - leave some chaos)
DROP TRIGGER IF EXISTS tr_Orders_Update;
-- DROP TRIGGER IF EXISTS tr_Customers_Update;  -- Leave this one
-- DROP TRIGGER IF EXISTS tr_AuditLog_Insert;   -- And this one

PRINT '🔥 SQL CURSOR CATASTROPHE COMPLETE! 🔥';
PRINT 'Performance: DESTROYED';
PRINT 'Concurrency: BROKEN';
PRINT 'Maintainability: NONEXISTENT';
PRINT 'Deadlocks: GUARANTEED';

-- Final statement that will never execute due to hanging transaction
SELECT 'This will never be reached due to transaction chaos' as FinalMessage;
