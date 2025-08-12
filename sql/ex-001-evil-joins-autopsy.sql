-- ex-001-sql-nightmare-autopsy.sql
-- ⚠️ INTENTIONALLY TERRIBLE SQL WITH EDUCATIONAL COMMENTARY
-- This is the same nightmare code with detailed explanations of what's wrong
-- and how to fix each issue. FOR TEACHING + LAUGHS ONLY.

-- ─────────────────────────────────────────────────────────────────────────────
-- Setup (messy, inconsistent schema & naming) - AUTOPSY NOTES
-- ─────────────────────────────────────────────────────────────────────────────
-- PROBLEMS: Mixed naming conventions, inconsistent data types, poor normalization
-- FIX: Use consistent naming (snake_case or camelCase), proper data types,
--      foreign keys with referential integrity, consistent date formats

-- PostgreSQL-ish / generic DDL sprinkled with MySQL/SQL Server habits.
-- Some columns have the same name across tables to booby-trap NATURAL JOIN.

DROP TABLE IF EXISTS Students;              -- No CASCADE; may fail if dependencies exist
DROP TABLE IF EXISTS ENROL;                 -- Inconsistent naming: should be "enrollments"
DROP TABLE IF EXISTS course;                -- Mixed case: should be "courses" 
DROP TABLE IF EXISTS campus;                -- Singular when should be plural "campuses"

CREATE TABLE Students (                      -- Mixed case table name (inconsistent)
  id            VARCHAR(50),                 -- PROBLEM: ID should be INT/BIGINT, not VARCHAR
  student_id    VARCHAR(50),                 -- PROBLEM: Redundant with id; confusing
  name          TEXT,                        -- PROBLEM: No constraints, allows NULL names
  email         TEXT,                        -- PROBLEM: No uniqueness constraint or validation
  campus        TEXT,                        -- PROBLEM: Should be FK to campus table, not text
  created_at    TEXT,                        -- PROBLEM: Dates as TEXT invite format chaos
  PRIMARY KEY (id)                           -- PROBLEM: PK on VARCHAR is inefficient
);
-- FIX: Use INTEGER id, add NOT NULL constraints, UNIQUE on email,
--      proper TIMESTAMP for created_at, FK to campus table

CREATE TABLE ENROL (                        -- PROBLEM: Shouting table name + inconsistent style
  id           INT,                          -- PROBLEM: Will collide with Students.id in NATURAL JOIN
  student_id   VARCHAR(50),                  -- PROBLEM: Type mismatch with Students.id
  course_code  VARCHAR(50),                  -- PROBLEM: Should be FK to course table
  status       VARCHAR(10),                  -- PROBLEM: No CHECK constraint for valid statuses
  updated_at   VARCHAR(30)                   -- PROBLEM: Text dates with different format than Students
  -- PROBLEM: No PRIMARY KEY defined; allows duplicate rows
);
-- FIX: Add PRIMARY KEY, use proper TIMESTAMP, add CHECK constraints,
--      make student_id and course_code proper foreign keys

CREATE TABLE course (                       -- PROBLEM: Lowercase when others are mixed case
  code         VARCHAR(50) PRIMARY KEY,     -- OK: At least has a PK
  name         TEXT,                        -- PROBLEM: Course names should have length limits
  campus       TEXT,                        -- PROBLEM: Same column name as Students; NATURAL JOIN trap
  start_date   VARCHAR(10)                  -- PROBLEM: Date as VARCHAR with custom format
);
-- FIX: Consistent naming, proper DATE type, FK to campus table

CREATE TABLE campus (                       -- PROBLEM: Table named 'campus' with column 'campus'
  campus       VARCHAR(100) PRIMARY KEY,    -- PROBLEM: Confusing naming; should be 'name' or 'code'
  timezone     VARCHAR(64),                 -- OK: Reasonable for timezone storage
  active       CHAR(1)                      -- PROBLEM: Should use BOOLEAN, not CHAR(1)
);
-- FIX: Rename column to 'name', use BOOLEAN for active flag

-- Garbage seed data with intentional inconsistencies
INSERT INTO Students VALUES
('001','001','Alice','ALICE@EXAMPLE.COM ','KENSINGTON ','2025-08-01 09:00'),    -- Trailing spaces, UPPERCASE email
('002','2','Bob','bob@example.com','Paddington','08/01/2025 09:00'),            -- Different date format, ID mismatch
('003','0003','Charlie','charlie(at)example.com','kensington','2025/08/01 09:00'); -- Invalid email format, case mismatch

INSERT INTO ENROL VALUES
(1,'001','COMP1511','ENROLLED','2025-08-01'),     -- Text date format different from Students
(2,'2','COMP1511','DROPPED','2025-08-02'),        -- Student_id type inconsistency
(3,'003','MATH1131','ENROLLED','2025-08-03'),     -- 
(3,'003','MATH1131','ENROLLED','2025-08-03');     -- PROBLEM: Exact duplicate row (no PK prevents this)

INSERT INTO course VALUES
('COMP1511','Programming Fundamentals','Kensington','2025/09/01'),    -- Yet another date format
('MATH1131','Math 1A','KENSINGTON ','2025/08/30');                    -- Case and spacing inconsistency

INSERT INTO campus VALUES
('Kensington','Australia/Sydney','Y'),      -- 
('KENSINGTON','Australia/Sydney','Y'),      -- PROBLEM: Duplicate campus with different case
('Paddington','Australia/Sydney','N');      -- 

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit A: NATURAL JOIN roulette (grabs any same-named columns implicitly)
-- PROBLEM: NATURAL JOIN is unstable, schema-sensitive, and guaranteed to break later
-- ─────────────────────────────────────────────────────────────────────────────
SELECT DISTINCT *                            -- PROBLEM: DISTINCT hides the duplicates we created
FROM Students                                -- PROBLEM: NATURAL JOINs below will match on multiple columns
NATURAL JOIN ENROL                           -- PROBLEM: Joins on (id, student_id) - confusing and wrong
NATURAL JOIN course                          -- PROBLEM: Also joins on (campus) by accident
NATURAL JOIN campus;                         -- PROBLEM: More campus column confusion
-- FIX: Use explicit JOIN conditions with clear column references:
-- SELECT s.id, s.name, e.course_code, c.name as course_name
-- FROM Students s
-- JOIN ENROL e ON s.student_id = e.student_id  
-- JOIN course c ON e.course_code = c.code
-- JOIN campus cp ON s.campus = cp.campus

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit B: Non-sargable predicates (functions on columns kill index usage)
-- PROBLEM: Functions on columns prevent index usage, causing full table scans
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code
FROM Students s
JOIN ENROL e
  ON UPPER(TRIM(s.email)) = LOWER(e.student_id)      -- PROBLEM: Functions prevent index usage
 AND SUBSTR(s.created_at,1,10) = REPLACE(e.updated_at,'/','-'); -- PROBLEM: Text date manipulation
-- FIX: Clean data at insert time, use proper data types, avoid functions in JOIN conditions

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit C: Outer join sabotaged by WHERE filter on the right table
-- PROBLEM: LEFT JOIN + WHERE right_col = ... turns it back into an INNER JOIN
-- ─────────────────────────────────────────────────────────────────────────────
SELECT *
FROM Students s
FULL OUTER JOIN ENROL e
  ON s.student_id = e.student_id
WHERE s.campus IS NOT NULL                   -- PROBLEM: Removes unmatched e-rows where s.* is NULL
  AND e.course_code IS NOT NULL;             -- PROBLEM: Removes unmatched s-rows where e.* is NULL
-- FIX: Move conditions to ON clause or use INNER JOIN if that's what you want

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit D: Cartesian product disguised as a join
-- PROBLEM: Missing or wrong join conditions create cartesian explosions
-- ─────────────────────────────────────────────────────────────────────────────
SELECT COUNT(*)                             -- PROBLEM: Will return huge number due to cartesian product
FROM Students s, ENROL e, course c           -- PROBLEM: Old-style comma joins without conditions
WHERE 1=1;                                   -- PROBLEM: Useless condition, no actual join logic
-- FIX: Use proper JOIN syntax with meaningful conditions

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit E: RIGHT JOIN with filter on left table, because why not
-- PROBLEM: RIGHT JOINs are confusing and this filter makes it even worse
-- ─────────────────────────────────────────────────────────────────────────────
SELECT *
FROM Students s
RIGHT JOIN ENROL e ON s.student_id = e.student_id
WHERE s.name LIKE 'A%';                      -- PROBLEM: Filter on left table after RIGHT JOIN
-- FIX: Use LEFT JOIN with tables swapped, or INNER JOIN if appropriate

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit F: Implicit type conversions and case sensitivity chaos
-- PROBLEM: Mixing data types and case in comparisons leads to unexpected results
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, c.campus
FROM Students s
JOIN course c
  ON RTRIM(s.campus) = LTRIM(c.campus);       -- PROBLEM: String functions + case mismatches remain
-- FIX: Normalize data on insert, use consistent casing, proper constraints

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit G: Join to non-deterministic expressions (random per row!)
-- PROBLEM: Non-deterministic functions in JOIN conditions cause unpredictable results
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code
FROM Students s
JOIN ENROL e
  ON LENGTH(s.name) = (RANDOM() * 10)::INT;   -- PROBLEM: Random function makes results unpredictable
-- FIX: Use deterministic join conditions based on actual relationships

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit H: UNION ALL to create dupes, then NATURAL JOIN to multiply them
-- PROBLEM: Creating duplicates then joining multiplies the chaos exponentially
-- ─────────────────────────────────────────────────────────────────────────────
WITH dupes AS (
  SELECT id, student_id FROM ENROL
  UNION ALL
  SELECT id, student_id FROM ENROL           -- PROBLEM: Intentional duplication
)
SELECT *
FROM dupes
NATURAL JOIN Students;                       -- PROBLEM: Joins on (id, student_id), multiplies results
-- FIX: Remove duplicates with UNION (not UNION ALL), use explicit JOIN conditions

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit I: UPDATE with a join that multiplies target rows (hello, chaos)
-- PROBLEM: Updates based on joins with duplicates are non-deterministic
-- ─────────────────────────────────────────────────────────────────────────────
-- Imagine this is MySQL or SQL Server syntax (don't @ me).
-- It "updates" based on a join that produces duplicates → non-deterministic.
-- UPDATE Students s
-- JOIN ENROL e ON e.student_id = s.student_id    -- PROBLEM: One student may have multiple enrollments
-- JOIN course c ON c.code = e.course_code        -- PROBLEM: Which course's campus gets used?
-- SET s.campus = c.campus;                       -- PROBLEM: Non-deterministic result
-- FIX: Use subqueries with LIMIT 1, or aggregate functions to ensure single values

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit J: Subquery in join predicate with correlated nonsense
-- PROBLEM: Overcomplicated correlated subqueries that don't make logical sense
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code
FROM Students s
JOIN ENROL e
  ON s.student_id = (SELECT student_id
                     FROM ENROL e2
                     WHERE e2.id <> e.id              -- PROBLEM: Arbitrary exclusion
                     ORDER BY e2.updated_at DESC      -- PROBLEM: Text date ordering
                     LIMIT 1);                        -- PROBLEM: What's the business logic here?
-- FIX: Clarify business requirements, use proper data types, simplify logic

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit K: Vendor hints that contradict each other (no effect here; just noise)
-- PROBLEM: Conflicting optimizer hints confuse the query planner
-- ─────────────────────────────────────────────────────────────────────────────
-- SQL Server style:
-- SELECT s.id, e.course_code FROM Students s
-- INNER LOOP JOIN ENROL e ON s.student_id = e.student_id
-- OPTION (MERGE JOIN, HASH JOIN, FORCE ORDER);     -- PROBLEM: Contradictory join hints

-- MySQL style:
-- SELECT /*+ NO_ICP(ENROL) BKA(ENROL) QB_NAME(use_everything) */ *
-- FROM Students s STRAIGHT_JOIN ENROL e ON (s.student_id = e.student_id);
-- PROBLEM: Mixing incompatible hints, forcing suboptimal plans

-- FIX: Let the optimizer do its job, only add hints when you have specific
--      performance issues and understand the execution plan implications

-- ─────────────────────────────────────────────────────────────────────────────
-- SUMMARY OF FIXES FOR A PROPER SCHEMA:
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Consistent naming conventions (snake_case recommended)
-- 2. Proper data types (INT for IDs, TIMESTAMP for dates, BOOLEAN for flags)
-- 3. NOT NULL constraints where appropriate
-- 4. Foreign key constraints for referential integrity
-- 5. Unique constraints on business keys (like email)
-- 6. Check constraints for valid enum values
-- 7. Explicit JOIN conditions instead of NATURAL JOIN
-- 8. Avoid functions on columns in WHERE/JOIN clauses
-- 9. Use proper INNER/LEFT/RIGHT JOIN based on business logic
-- 10. Normalize data to eliminate duplicates and inconsistencies

-- Fin. If you read this far, you now know why every one of these patterns is harmful! 🌳
-- Remember: Good SQL is predictable, maintainable, and performant.
