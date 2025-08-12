-- ex-001-sql-nightmare.sql
-- ⚠️ INTENTIONALLY TERRIBLE SQL. FOR TEACHING + LAUGHS ONLY.
-- Themes: NATURAL JOIN abuse, cartesian explosions, non-sargable predicates,
--         implicit casts, outer-join sabotage, duplicate-hiding DISTINCTs,
--         mixed dialects, meaningless hints, vendor functions, etc.
-- Do NOT copy this to production. Do not even look at it for too long.

-- ─────────────────────────────────────────────────────────────────────────────
-- Setup (messy, inconsistent schema & naming)
-- ─────────────────────────────────────────────────────────────────────────────
-- Mix of naming conventions and datatypes to ensure maximum confusion.

-- PostgreSQL-ish / generic DDL sprinkled with MySQL/SQL Server habits.
-- Some columns have the same name across tables to booby-trap NATURAL JOIN.

DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS ENROL;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS campus;

CREATE TABLE Students (
  id            VARCHAR(50),        -- should be INT, but let's keep it text
  student_id    VARCHAR(50),        -- redundant alt key
  name          TEXT,
  email         TEXT,
  campus        TEXT,               -- name, not FK
  created_at    TEXT,               -- store dates as TEXT 🙃
  PRIMARY KEY (id)                  -- PK on text id
);

CREATE TABLE ENROL (                 -- shouting table name + lowercase cols
  id           INT,                  -- collides with Students.id in NATURAL JOIN
  student_id   VARCHAR(50),
  course_code  VARCHAR(50),
  status       VARCHAR(10),
  updated_at   VARCHAR(30)           -- also text, but with a different shape
  -- no PK. why be predictable?
);

CREATE TABLE course (                -- lowercase table with random PK
  code         VARCHAR(50) PRIMARY KEY,
  name         TEXT,
  campus       TEXT,                 -- same column name as Students; bait for NATURAL
  start_date   VARCHAR(10)           -- 'YYYY/MM/DD' because chaos
);

CREATE TABLE campus (                -- table named 'campus' AND a column 'campus'
  campus       VARCHAR(100) PRIMARY KEY,
  timezone     VARCHAR(64),
  active       CHAR(1)               -- 'Y' or 'N'
);

-- Garbage seed data
INSERT INTO Students VALUES
('001','001','Alice','ALICE@EXAMPLE.COM ','KENSINGTON ','2025-08-01 09:00'),
('002','2','Bob','bob@example.com','Paddington','08/01/2025 09:00'),
('003','0003','Charlie','charlie(at)example.com','kensington','2025/08/01 09:00');

INSERT INTO ENROL VALUES
(1,'001','COMP1511','ENROLLED','2025-08-01'),
(2,'2','COMP1511','DROPPED','2025-08-02'),
(3,'003','MATH1131','ENROLLED','2025-08-03'),
(3,'003','MATH1131','ENROLLED','2025-08-03'); -- duplicate row for fun

INSERT INTO course VALUES
('COMP1511','Programming Fundamentals','Kensington','2025/09/01'),
('MATH1131','Math 1A','KENSINGTON ','2025/08/30');

INSERT INTO campus VALUES
('Kensington','Australia/Sydney','Y'),
('KENSINGTON','Australia/Sydney','Y'),
('Paddington','Australia/Sydney','N');

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit A: NATURAL JOIN roulette (grabs any same-named columns implicitly)
-- Unstable, schema-sensitive, and guaranteed to break later.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT DISTINCT *                       -- DISTINCT to hide the duplicates we created
FROM Students
NATURAL JOIN ENROL                      -- implicitly joins on (id, student_id) if present
NATURAL JOIN course                     -- also joins on (campus) by accident
NATURAL JOIN campus;                    -- and again on (campus). what could go wrong?

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit B: Cartesian product “oops we forgot the predicate”
-- Mix implicit joins (comma) with explicit JOIN for extra cognitive load.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.*, e.*, c.*
FROM Students s, ENROL e                 -- implicit cross join
JOIN course c ON 1=1                     -- explicit tautology join
WHERE s.name LIKE '%a%';                 -- unrelated filter; explosion preserved

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit C: Outer join sabotaged by WHERE filter on the right table
-- LEFT JOIN + WHERE right_col = ... turns it back into an INNER JOIN.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code, e.status
FROM Students s
LEFT JOIN ENROL e
  ON e.student_id = s.student_id
WHERE e.status = 'ENROLLED';             -- whoops, filtered away NULLs → inner join now

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit D: Non-sargable join keys (functions on columns) + implicit casts
-- Forces full scans; prevents index use; adds implicit upper/lower conversions.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code
FROM Students s
JOIN ENROL e
  ON UPPER(TRIM(s.email)) = LOWER(e.student_id)   -- email vs student_id? sure.
 AND SUBSTR(s.created_at,1,10) = REPLACE(e.updated_at,'/','-'); -- compare text dates via functions

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit E: Inequality & expression joins (non-equi), ambiguous semantics
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.id AS enrol_id, c.code
FROM Students s
JOIN ENROL e
  ON (CAST(s.id AS INT) + 1) = e.id      -- implicit cast from text + arithmetic in predicate
JOIN course c
  ON LENGTH(c.code) <> e.id;             -- meaningless non-equi join

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit F: FULL OUTER JOIN + WHERE conditions that null-reject
-- Defeats the point of FULL OUTER by filtering non-matching rows.
-- ─────────────────────────────────────────────────────────────────────────────
SELECT *
FROM Students s
FULL OUTER JOIN ENROL e
  ON s.student_id = e.student_id
WHERE s.campus IS NOT NULL               -- removes unmatched e-rows where s.* is NULL
  AND e.course_code IS NOT NULL;         -- removes unmatched s-rows where e.* is NULL

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit G: DISTINCT hammer to hide join bugs + GROUP BY column positions
-- ─────────────────────────────────────────────────────────────────────────────
SELECT DISTINCT s.id, e.course_code, c.name
FROM Students s
JOIN ENROL e ON s.student_id = e.student_id
JOIN course c ON c.code = e.course_code
GROUP BY 1,2,3                            -- cryptic positional grouping; future breakage guaranteed
HAVING COUNT(*) > 0;                      -- tautology

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit H: RIGHT JOIN with filter on left table, because why not
-- ─────────────────────────────────────────────────────────────────────────────
SELECT *
FROM Students s
RIGHT JOIN ENROL e
  ON e.student_id = s.student_id
WHERE s.name LIKE '%z%';                  -- turns RIGHT into INNER-ish when s is required

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit I: Join on formatted dates stored as text (locale/format chaos)
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, c.code
FROM Students s
JOIN course c
  ON REPLACE(REPLACE(s.created_at,'-','/'),' 09:00','') = c.start_date;
-- compare '2025-08-01 09:00' → '2025/08/01' with chained REPLACE. chef’s kiss.

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit J: Join to non-deterministic expressions (random per row!)
-- ─────────────────────────────────────────────────────────────────────────────
SELECT *
FROM Students s
JOIN ENROL e
  ON e.id = ABS(RANDOM()) % 3;            -- Postgres RANDOM(); totally not stable
-- Or SQL Server flavor:
-- ON e.id = ABS(CHECKSUM(NEWID())) % 3;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit K: Mixed collations/case handling in join path
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, c.campus
FROM Students s
JOIN course c
  ON RTRIM(s.campus) = LTRIM(c.campus);   -- trailing/leading space games, case mismatches remain

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit L: UNION ALL to create dupes, then NATURAL JOIN to multiply them
-- ─────────────────────────────────────────────────────────────────────────────
WITH dupes AS (
  SELECT id, student_id FROM ENROL
  UNION ALL
  SELECT id, student_id FROM ENROL         -- intentional duplication
)
SELECT *
FROM dupes
NATURAL JOIN Students;                      -- joins on (id, student_id), enjoy the multiplicity

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit M: UPDATE with a join that multiplies target rows (hello, chaos)
-- Vendor-specific variants omitted; this is illustrative pseudo-portable pain.
-- ─────────────────────────────────────────────────────────────────────────────
-- Imagine this is MySQL or SQL Server syntax (don’t @ me).
-- It “updates” based on a join that produces duplicates → non-deterministic.
-- UPDATE Students s
-- JOIN ENROL e ON e.student_id = s.student_id
-- JOIN course c ON c.code = e.course_code
-- SET s.campus = c.campus;

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit N: Subquery in join predicate with correlated nonsense
-- ─────────────────────────────────────────────────────────────────────────────
SELECT s.id, e.course_code
FROM Students s
JOIN ENROL e
  ON s.student_id = (SELECT student_id
                     FROM ENROL e2
                     WHERE e2.id <> e.id
                     ORDER BY e2.updated_at DESC         -- text date ordering lol
                     LIMIT 1);

-- ─────────────────────────────────────────────────────────────────────────────
-- Exhibit O: Vendor hints that contradict each other (no effect here; just noise)
-- ─────────────────────────────────────────────────────────────────────────────
-- SQL Server style:
-- SELECT s.id, e.course_code FROM Students s
-- INNER LOOP JOIN ENROL e ON s.student_id = e.student_id
-- OPTION (MERGE JOIN, HASH JOIN, FORCE ORDER);  -- pick a join type, any join type…

-- MySQL style:
-- SELECT /*+ NO_ICP(ENROL) BKA(ENROL) QB_NAME(use_everything) */ *
-- FROM Students s STRAIGHT_JOIN ENROL e ON (s.student_id = e.student_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Fin. If you read this far, take a walk and look at some trees. 🌳
-- The proper exhibit notes should explain why every one of these is harmful.
