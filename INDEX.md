# Museum of Code Disease: New Dangerous Examples Index

This index lists newly added examples and their autopsies. See each file header for run/build notes and references.

## C
* **Nightmare**
  - `c/ex-001-nightmare.c` ↔ `c/ex-001-nightmare-autopsy.c`
* **Nightmare 2**
  - `c/ex-002-nightmare.c` ↔ `c/ex-002-nightmare-autopsy.c`
* **Preprocessor madness**
  - `c/ex-002-preprocessor-madness.c` ↔ `c/ex-002-preprocessor-madness-autopsy.c`
* **Use-after-free & double free**
  - `c/ex-010-use-after-free.c` ↔ `c/ex-010-use-after-free-autopsy.c`
* **Format string vulnerability**
  - `c/ex-011-format-string.c` ↔ `c/ex-011-format-string-autopsy.c`
* **Integer overflow → buffer overflow**
  - `c/ex-012-integer-overflow-to-bof.c` ↔ `c/ex-012-integer-overflow-to-bof-autopsy.c`

## Java
* **Nightmare**
  - `java/ex-001-nightmare.java` ↔ `java/ex-001-nightmare-autopsy.java`
* **Reflection nightmare**
  - `java/ex-002-reflection-nightmare.java` ↔ `java/ex-002-reflection-nightmare-autopsy.java`
* **Insecure deserialization**
  - `java/ex-010-insecure-deserialization.java` ↔ `java/ex-010-insecure-deserialization-autopsy.java`
* **XXE**
  - `java/ex-011-xxe.java` ↔ `java/ex-011-xxe-autopsy.java`

## JavaScript / Node
* **Nightmare**
  - `javascript/ex-001-nightmare.js` ↔ `javascript/ex-001-nightmare-autopsy.js`
* **Callback madness**
  - `javascript/ex-002-callback-madness.js` ↔ `javascript/ex-002-callback-madness-autopsy.js`
* **Prototype pollution**
  - `javascript/ex-010-prototype-pollution.js` ↔ `javascript/ex-010-prototype-pollution-autopsy.js`
* **Command injection**
  - `javascript/ex-011-command-injection.js` ↔ `javascript/ex-011-command-injection-autopsy.js`
* **ReDoS**
  - `javascript/ex-012-redos.js` ↔ `javascript/ex-012-redos-autopsy.js`
* **NoSQL injection**
  - `javascript/ex-013-nosql-injection.js` ↔ `javascript/ex-013-nosql-injection-autopsy.js`
* **JWT alg=none**
  - `javascript/ex-014-jwt-none.js` ↔ `javascript/ex-014-jwt-none-autopsy.js`
* **CSRF demo**
  - `javascript/ex-015-csrf-demo.js` ↔ `javascript/ex-015-csrf-demo-autopsy.js`
* **SSRF**
  - `javascript/ex-016-ssrf.js` ↔ `javascript/ex-016-ssrf-autopsy.js`
* **Host header injection**
  - `javascript/ex-017-host-header-injection.js` ↔ `javascript/ex-017-host-header-injection-autopsy.js`
* **Insecure random (specimen only)**
  - `javascript/ex-018-insecure-random.js`

## Python
* **Nightmare**
  - `python/ex-001-nightmare.py` ↔ `python/ex-001-nightmare-autopsy.py`
* **Lipsy**
  - `python/ex-002-lipsy.py` ↔ `python/ex-002-lipsy-autopsy.py`
* **Metaclass madness**
  - `python/ex-003-metaclass-madness.py` ↔ `python/ex-003-metaclass-madness-autopsy.py`
* **Insecure pickle deserialization**
  - `python/ex-010-insecure-pickle.py` ↔ `python/ex-010-insecure-pickle-autopsy.py`
* **YAML unsafe load**
  - `python/ex-011-yaml-unsafe-load.py` ↔ `python/ex-011-yaml-unsafe-load-autopsy.py`

## PHP
* **Nightmare**
  - `php/ex-001-nightmare.php` ↔ `php/ex-001-nightmare-autopsy.php`
* **unserialize() of untrusted data**
  - `php/ex-010-insecure-unserialize.php` ↔ `php/ex-010-insecure-unserialize-autopsy.php`

## C# / .NET
* **Nightmare**
  - `csharp/ex-001-nightmare.cs` ↔ `csharp/ex-001-nightmare-autopsy.cs`
* **SQL injection**
  - `csharp/ex-010-sql-injection.cs` ↔ `csharp/ex-010-sql-injection-autopsy.cs`
* **XXE**
  - `csharp/ex-011-xxe.cs` ↔ `csharp/ex-011-xxe-autopsy.cs`
* **BinaryFormatter deserialization danger (specimen only)**
  - `csharp/ex-012-binaryformatter-danger.cs`

## Go
* **Nightmare**
  - `go/ex-001-nightmare.go` ↔ `go/ex-001-nightmare-autopsy.go`
* **Path traversal in file server**
  - `go/ex-010-path-traversal.go` ↔ `go/ex-010-path-traversal-autopsy.go`

## SQL
* **Evil joins**
  - `sql/ex-001-evil-joins.sql` ↔ `sql/ex-001-evil-joins-autopsy.sql`
* **Cursor catastrophe**
  - `sql/ex-002-cursor-catastrophe.sql` ↔ `sql/ex-002-cursor-catastrophe-autopsy.sql`
* **Second-order SQL injection**
  - `sql/ex-010-second-order-sqli.sql` ↔ `sql/ex-010-second-order-sqli-autopsy.sql`

## Shell (Bash)
* **Unquoted variables & globbing**
  - `shell/ex-010-unquoted-vars.sh` ↔ `shell/ex-010-unquoted-vars-autopsy.sh`
* **eval injection**
  - `shell/ex-011-eval-injection.sh` ↔ `shell/ex-011-eval-injection-autopsy.sh`

## Ruby
* **Marshal.load deserialization**
  - `ruby/ex-010-insecure-marshal.rb` ↔ `ruby/ex-010-insecure-marshal-autopsy.rb`

## Rust
* **Nightmare**
  - `rust/ex-001-nightmare.rs` ↔ `rust/ex-001-nightmare-autopsy.rs`
* **Unsound unsafe (transmute/aliasing)**
  - `rust/ex-010-unsafe-unsound.rs` ↔ `rust/ex-010-unsafe-unsound-autopsy.rs`

## Cloud / IaC
* **Public S3 bucket policy**
  - `iac/ex-010-s3-public.tf` ↔ `iac/ex-010-s3-public-autopsy.tf`

## Kubernetes
* **Over-privileged RBAC & default SA**
  - `k8s/ex-010-rbac-misconfig.yaml` ↔ `k8s/ex-010-rbac-misconfig-autopsy.yaml`

## TypeScript
* **Nightmare**
  - `typescript/ex-001-nightmare.ts` ↔ `typescript/ex-001-nightmare-autopsy.ts`

## Perl
* **Nightmare**
  - `perl/ex-001-nightmare.pl` ↔ `perl/ex-001-nightmare-autopsy.pl`

## FreePascal
* **Nightmare**
  - `freepascal/ex-001-nightmare.pas` ↔ `freepascal/ex-001-nightmare-autopsy.pas`
