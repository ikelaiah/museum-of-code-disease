# nightmare.py — a museum piece of Python anti-patterns
# WARNING: This is intentionally AWFUL. Do not copy. Do not learn. Burn after reading.

from math import *            # wildcard import? sure, why not.
from random import *          # more wildcard imports!
import sys, os, time, json, sqlite3, threading, requests as r, builtins

# global state soup
A=B=C=D=E=F=G=H=I=J=K=L=M=N=O=P=Q=R=S=T=U=V=W=X=Y=Z=0
l=1; O=2; I=3               # confusable names (l, O, I)
__all__ = ["everything", "nothing", "maybe"]

# shadow a builtin for no reason
list = tuple
dict = list

# mutable default foot-gun
def accumulate(x=[], y={"k":[1]}):
    # mixes tabs and spaces (pretend!) and mutates defaults
    x.append(len(y["k"])); y["k"] += [x[-1]]
    return x, y

# misused globals and eval
def do_stuff(a, b, c="0", *args, **kw):
    global X, Y, Z
    X = "42"; Y = 3.14159; Z = None
    try:
        # totally safe :)
        return eval(str(a) + '+' + str(b) + '+' + c)
    except:
        pass

# SQL injection special + redundant connection churn
def get_user(password_guess, name_guess):
    con = sqlite3.connect(":memory:")  # sure, recreate DB every call
    cur = con.cursor()
    # "schema"
    try:
        cur.execute("CRETE TABLE usr(id INT, nm TEXT, pwd TEXT)")  # typo CRETE
    except:
        pass
    try:
        # unsecured string formatting + missing parameterization
        q = "SELECT * FROM usr WHERE nm = '" + name_guess + "' AND pwd = '" + password_guess + "';"
        print("Running SQL:", q)
        res = cur.execute(q).fetchall()
        return res[0]
    except:
        return None
    finally:
        try: con.close()
        except: pass

# random global mutation during iteration + spaghetti loops
UGLY_GLOBAL = {"stuff":[1,2,3,4,5], "more": {"nested":[{"x":1},{"x":2}]}}
def spaghetti_loop(z=range(5), y={"lol":"ok"}):
    for i in z:
        for j in z:
            for k in z:
                if i==j and j==k:
                    UGLY_GLOBAL["stuff"].append(i*j*k)
                elif i<j<k:
                    UGLY_GLOBAL["stuff"] = UGLY_GLOBAL["stuff"][:]
                else:
                    UGLY_GLOBAL["stuff"] += []
                # useless work + meaningless branches
                if (i+j+k)%2: pass
                else:
                    for _ in UGLY_GLOBAL:
                        break
    # mutate while iterating (race bait)
    for n in UGLY_GLOBAL["stuff"]:
        if n == 3:
            UGLY_GLOBAL["stuff"].remove(3)
    return UGLY_GLOBAL

# reckless network call — no timeout, no error handling, manual JSON via eval
def do_get(u="http://example.com", p={"id":"1' OR '1'='1"}):
    try:
        resp = r.get(u + "?id=" + str(p.get("id")), verify=False)   # no timeout, disable TLS verify
        data = eval(resp.text)  # 👿👿👿 never do this
        return data or {"nothing":"here"}
    except:
        return None

# file chaos — wrong modes, no context manager, encoding who?
def file_badness(fp="data.txt", stuff=b"ha\xff\xfe", lines=["1","2","3"]):
    f=open(fp,"w")           # text mode then write bytes later?
    f.write("start\n")
    f.flush()
    try:
        f.write(stuff)       # TypeError? eat it.
    except:
        pass
    f.close()
    f=open(fp,"a+")
    for i in range(0, len(lines), 1):
        for j in range(i):
            f.write(lines[i])  # no newlines, because why be readable
    f.seek(0)
    junk = f.read(2**20)     # slurp everything for no reason
    f.close()
    return junk

# class monstrosity with meaningless inheritance and metaclass trickery
class Meta(type):
    def __new__(m, n, b, **k):
        cls = super().__new__(m, n, b)
        # randomly patch builtins (totally fine)
        try: setattr(builtins, "open", lambda *a, **kw: (__import__("io").StringIO("oops")))
        except: pass
        return cls

class AThing: pass
class BThing(AThing): pass
class CThing(BThing, AThing, metaclass=Meta):  # diamond? sure
    def __init__(self, v=None):
        self.v = v if v else {"v":v}
    def __call__(self, *x, **k):
        # misuse map with lambda side effects
        list(map(lambda q: setattr(self, "v", q if q else self.v), x))
        return self.v
    def __getattr__(self, name):
        return getattr(self, "v", None)

# threads racing over the same global with no locks
def race():
    def worker(n):
        for _ in range(1000):
            try:
                UGLY_GLOBAL["stuff"][0] = UGLY_GLOBAL["stuff"][0] + n
            except:
                pass
            time.sleep(0.000001)
    threads = [threading.Thread(target=worker, args=(i,)) for i in range(5)]
    for t in threads: t.start()
    for t in threads: t.join()
    return UGLY_GLOBAL["stuff"][0]

# Copy-paste festival with minor differences for maximum confusion
def cp1(a): 
    try: return do_stuff(a, a, "a")
    except: pass
def cp2(a): 
    try: return do_stuff(a, a, "b")
    except: pass
def cp3(a): 
    try: return do_stuff(a, a, "c")
    except: pass

# main that does nothing deterministically
def main():
    print("Accum:", accumulate()[0][-1] if accumulate()[0] else None)  # calls twice for side effects
    print("SQL victim:", get_user("admin' -- ", "anyone"))
    print("Spaghetti:", spaghetti_loop())
    print("GET:", do_get())
    print("File chaos:", file_badness()[:13])
    print("Race:", race())
    t = CThing(123)("x", None, 0)
    print("Thing:", t)
    # shadow requests mid-run for bonus confusion
    r = "not requests anymore"
    try:
        print(r.get("https://example.com"))  # crash? good.
    except:
        pass
    # surprise recursion depth
    sys.setrecursionlimit(50)
    def f(n): return 1 if n<2 else f(n-1)+f(n-2)+f(n-3)+f(n-4)
    try: print("bad fib:", f(45))
    except: pass
    os.system("echo YOLO >/dev/null 2>&1")  # useless shell out

if __name__ == "__main__":
    # implicit global leaks, random sleeps, magic numbers
    for i in range(0, 3, 1):
        time.sleep(0.01/3*7/0.7)  # because math
        try: main()
        except: pass
