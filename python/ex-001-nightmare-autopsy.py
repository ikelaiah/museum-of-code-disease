# nightmare.py AUTOPSY VERSION — a museum piece of Python anti-patterns
# This is the same nightmare code with detailed explanations of what's wrong
# WARNING: This is intentionally AWFUL. Do not copy. Do not learn. Burn after reading.

from math import *            # PROBLEM: Wildcard imports pollute namespace, hide dependencies
from random import *          # PROBLEM: More namespace pollution; conflicts possible
import sys, os, time, json, sqlite3, threading, requests as r, builtins
# PROBLEM: Multiple imports on one line reduce readability
# FIX: Use explicit imports: from math import sqrt, sin, cos
#      Import one module per line for clarity

# global state soup - PROBLEM: Too many globals make code unpredictable
A=B=C=D=E=F=G=H=I=J=K=L=M=N=O=P=Q=R=S=T=U=V=W=X=Y=Z=0  # PROBLEM: Alphabet soup globals
l=1; O=2; I=3               # PROBLEM: Confusable names (l vs 1, O vs 0, I vs 1)
__all__ = ["everything", "nothing", "maybe"]  # PROBLEM: Meaningless __all__ export list
# FIX: Use descriptive variable names, minimize global state, proper __all__

# shadow a builtin for no reason - PROBLEM: Breaks built-in functionality
list = tuple                # PROBLEM: Shadows built-in list type
dict = list                 # PROBLEM: Now dict is actually tuple!
# FIX: Never shadow built-ins; use different names

# mutable default foot-gun - PROBLEM: Mutable defaults are shared between calls
def accumulate(x=[], y={"k":[1]}):  # PROBLEM: Mutable defaults create shared state
    # PROBLEM: Mixes tabs and spaces (pretend!) and mutates defaults
    x.append(len(y["k"])); y["k"] += [x[-1]]  # PROBLEM: Side effects on parameters
    return x, y
# FIX: Use None as default, create new objects inside function:
# def accumulate(x=None, y=None):
#     if x is None: x = []
#     if y is None: y = {"k": [1]}

# misused globals and eval - PROBLEM: Global mutation + eval security risk
def do_stuff(a, b, c="0", *args, **kw):
    global X, Y, Z            # PROBLEM: Mutating globals from functions
    X = "42"; Y = 3.14159; Z = None  # PROBLEM: Inconsistent types in globals
    try:
        # PROBLEM: eval() is a massive security hole - arbitrary code execution
        return eval(str(a) + '+' + str(b) + '+' + c)  # PROBLEM: String concatenation for math
    except:
        pass                  # PROBLEM: Bare except swallows all errors
# FIX: Avoid globals, use proper arithmetic, never use eval() on user input

# SQL injection special + redundant connection churn
def get_user(password_guess, name_guess):
    con = sqlite3.connect(":memory:")  # PROBLEM: Recreate DB every call (inefficient)
    cur = con.cursor()
    # "schema"
    try:
        cur.execute("CRETE TABLE usr(id INT, nm TEXT, pwd TEXT)")  # PROBLEM: Typo "CRETE" → exception
    except:
        pass                  # PROBLEM: Swallow schema creation errors
    try:
        # PROBLEM: SQL injection vulnerability - user input directly in query string
        q = "SELECT * FROM usr WHERE nm = '" + name_guess + "' AND pwd = '" + password_guess + "';"
        print("Running SQL:", q)  # PROBLEM: Logging sensitive data (passwords)
        res = cur.execute(q).fetchall()
        return res[0]         # PROBLEM: IndexError if no results
    except:
        return None           # PROBLEM: Bare except hides real errors
    finally:
        try: con.close()      # PROBLEM: Nested try/except in finally
        except: pass
# FIX: Use parameterized queries, proper error handling, connection pooling:
# cur.execute("SELECT * FROM usr WHERE nm = ? AND pwd = ?", (name_guess, password_guess))

# random global mutation during iteration + spaghetti loops
UGLY_GLOBAL = {"stuff":[1,2,3,4,5], "more": {"nested":[{"x":1},{"x":2}]}}  # PROBLEM: Complex global state
def spaghetti_loop(z=range(5), y={"lol":"ok"}):  # PROBLEM: Mutable default again
    for i in z:               # PROBLEM: Triple nested loops for no clear reason
        for j in z:
            for k in z:
                if i==j and j==k:  # PROBLEM: Complex branching with trivial effects
                    UGLY_GLOBAL["stuff"].append(i*j*k)  # PROBLEM: Mutating global during iteration
                elif i<j<k:
                    UGLY_GLOBAL["stuff"] = UGLY_GLOBAL["stuff"][:]  # PROBLEM: Pointless list copy
                else:
                    UGLY_GLOBAL["stuff"] += []  # PROBLEM: Adding empty list (no-op)
                # useless work + meaningless branches
                if (i+j+k)%2: pass  # PROBLEM: Meaningless computation
                else:
                    for _ in UGLY_GLOBAL:  # PROBLEM: Iterate just to break immediately
                        break
    # PROBLEM: Mutate while iterating - can cause RuntimeError or skip elements
    for n in UGLY_GLOBAL["stuff"]:
        if n == 3:
            UGLY_GLOBAL["stuff"].remove(3)  # PROBLEM: Modifying list during iteration
    return UGLY_GLOBAL
# FIX: Avoid global mutation, simplify logic, don't modify collections during iteration

# reckless network call — no timeout, no error handling, manual JSON via eval
def do_get(u="http://example.com", p={"id":"1' OR '1'='1"}):  # PROBLEM: SQL injection in URL param
    try:
        # PROBLEM: No timeout (can hang forever), disabled TLS verification
        resp = r.get(u + "?id=" + str(p.get("id")), verify=False)
        # PROBLEM: eval() on network response - MASSIVE security hole
        data = eval(resp.text)  # 👿👿👿 NEVER DO THIS - arbitrary code execution
        return data or {"nothing":"here"}
    except:
        return None           # PROBLEM: Bare except hides network errors
# FIX: Use json.loads(), set timeouts, proper TLS verification, handle specific exceptions:
# resp = requests.get(url, params=params, timeout=30, verify=True)
# data = json.loads(resp.text)

# file chaos — wrong modes, no context manager, encoding who?
def file_badness(fp="data.txt", stuff=b"ha\xff\xfe", lines=["1","2","3"]):  # PROBLEM: Mutable default
    f=open(fp,"w")           # PROBLEM: No context manager, text mode
    f.write("start\n")
    f.flush()
    try:
        f.write(stuff)       # PROBLEM: Writing bytes to text file → TypeError
    except:
        pass                 # PROBLEM: Ignore encoding errors
    f.close()                # PROBLEM: Manual close (should use context manager)
    f=open(fp,"a+")          # PROBLEM: Reopen same file, mixed modes
    for i in range(0, len(lines), 1):  # PROBLEM: Verbose range syntax
        for j in range(i):   # PROBLEM: Nested loop for no reason
            f.write(lines[i])  # PROBLEM: No newlines, unreadable output
    f.seek(0)
    junk = f.read(2**20)     # PROBLEM: Read 1MB for no reason, memory waste
    f.close()                # PROBLEM: Manual close again
    return junk
# FIX: Use context managers, consistent encoding, proper file modes:
# with open(fp, 'w', encoding='utf-8') as f:
#     f.write("start\n")

# class monstrosity with meaningless inheritance and metaclass trickery
class Meta(type):            # PROBLEM: Metaclass for no good reason
    def __new__(m, n, b, **k):
        cls = super().__new__(m, n, b)
        # PROBLEM: Randomly patch builtins at class creation time
        try: setattr(builtins, "open", lambda *a, **kw: (__import__("io").StringIO("oops")))
        except: pass         # PROBLEM: Break built-in open() function globally
        return cls
# FIX: Avoid metaclasses unless absolutely necessary, never patch builtins

class AThing: pass           # PROBLEM: Empty base class serves no purpose
class BThing(AThing): pass   # PROBLEM: Another empty class
class CThing(BThing, AThing, metaclass=Meta):  # PROBLEM: Diamond inheritance, unnecessary metaclass
    def __init__(self, v=None):
        self.v = v if v else {"v":v}  # PROBLEM: Confusing logic, v if v else dict with v
    def __call__(self, *x, **k):  # PROBLEM: Making instances callable for no reason
        # PROBLEM: Misuse map with lambda side effects instead of simple loop
        list(map(lambda q: setattr(self, "v", q if q else self.v), x))
        return self.v
    def __getattr__(self, name):  # PROBLEM: Catch-all attribute access
        return getattr(self, "v", None)  # PROBLEM: Recursive getattr risk
# FIX: Simple inheritance, clear purpose for each class, avoid magic methods unless needed

# threads racing over the same global with no locks
def race():                  # PROBLEM: Thread races without synchronization
    def worker(n):           # PROBLEM: Nested function modifies global
        for _ in range(1000):
            try:
                # PROBLEM: Race condition - multiple threads modifying same data
                UGLY_GLOBAL["stuff"][0] = UGLY_GLOBAL["stuff"][0] + n
            except:
                pass         # PROBLEM: Hide race condition errors
            time.sleep(0.000001)  # PROBLEM: Tiny sleep doesn't prevent races
    threads = [threading.Thread(target=worker, args=(i,)) for i in range(5)]
    for t in threads: t.start()  # PROBLEM: Start threads without synchronization
    for t in threads: t.join()   # OK: At least waits for completion
    return UGLY_GLOBAL["stuff"][0]
# FIX: Use threading.Lock(), avoid global state, proper synchronization:
# lock = threading.Lock()
# with lock: UGLY_GLOBAL["stuff"][0] += n

# Copy-paste festival with minor differences for maximum confusion
def cp1(a):                  # PROBLEM: Nearly identical functions (DRY violation)
    try: return do_stuff(a, a, "a")
    except: pass             # PROBLEM: Bare except
def cp2(a):                  # PROBLEM: Copy-paste with tiny difference
    try: return do_stuff(a, a, "b")
    except: pass
def cp3(a):                  # PROBLEM: More copy-paste
    try: return do_stuff(a, a, "c")
    except: pass
# FIX: Single function with parameter: def cp(a, suffix): return do_stuff(a, a, suffix)

# main that does nothing deterministically
def main():
    # PROBLEM: Calls accumulate() twice, causing different side effects each time
    print("Accum:", accumulate()[0][-1] if accumulate()[0] else None)
    print("SQL victim:", get_user("admin' -- ", "anyone"))  # PROBLEM: SQL injection demo
    print("Spaghetti:", spaghetti_loop())   # PROBLEM: Global mutation
    print("GET:", do_get())                 # PROBLEM: Unsafe network call
    print("File chaos:", file_badness()[:13])  # PROBLEM: File system chaos
    print("Race:", race())                  # PROBLEM: Thread races
    t = CThing(123)("x", None, 0)          # PROBLEM: Confusing chained calls
    print("Thing:", t)
    # PROBLEM: Shadow requests module mid-run for bonus confusion
    r = "not requests anymore"             # PROBLEM: Shadows imported module
    try:
        print(r.get("https://example.com"))  # PROBLEM: Will crash - r is now string
    except:
        pass                               # PROBLEM: Hide the error
    # surprise recursion depth
    sys.setrecursionlimit(50)              # PROBLEM: Artificially low recursion limit
    def f(n): return 1 if n<2 else f(n-1)+f(n-2)+f(n-3)+f(n-4)  # PROBLEM: Inefficient recursion
    try: print("bad fib:", f(45))          # PROBLEM: Will hit recursion limit
    except: pass                           # PROBLEM: Hide recursion error
    os.system("echo YOLO >/dev/null 2>&1")  # PROBLEM: Unnecessary shell command
# FIX: Avoid side effects, proper error handling, efficient algorithms, no shell injection

if __name__ == "__main__":
    # PROBLEM: Implicit global leaks, random sleeps, magic numbers
    for i in range(0, 3, 1):              # PROBLEM: Verbose range syntax
        time.sleep(0.01/3*7/0.7)           # PROBLEM: Meaningless math for sleep duration
        try: main()                        # PROBLEM: Hide all main() errors
        except: pass                       # PROBLEM: Bare except in main loop

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY OF PYTHON ANTI-PATTERNS DEMONSTRATED:
# ─────────────────────────────────────────────────────────────────────────────
# 1. Wildcard imports (from module import *)
# 2. Mutable default arguments
# 3. Global state mutation
# 4. eval() on untrusted input (SECURITY RISK)
# 5. SQL injection vulnerabilities
# 6. Bare except clauses hiding errors
# 7. Race conditions in threading
# 8. Shadowing built-ins and imports
# 9. No context managers for resources
# 10. Copy-paste code duplication
# 11. Meaningless inheritance hierarchies
# 12. Modifying collections during iteration
# 13. Mixed text/binary file operations
# 14. Inefficient algorithms and recursion
# 15. Magic numbers and unclear logic

# FIX SUMMARY:
# - Use explicit imports and avoid wildcards
# - Use None as default, create new objects in function
# - Minimize global state, pass parameters explicitly
# - Never use eval() on user input, use json.loads() for JSON
# - Use parameterized queries for SQL
# - Handle specific exceptions, log errors properly
# - Use threading.Lock() for shared data
# - Never shadow built-ins or standard library
# - Use context managers (with statements) for resources
# - Extract common code into reusable functions
# - Keep inheritance simple and purposeful
# - Don't modify collections while iterating
# - Use consistent text encoding and proper file modes
# - Use iterative algorithms or memoization for efficiency
# - Use named constants and clear variable names

# Remember: Good Python is readable, maintainable, and follows the Zen of Python! 🐍
