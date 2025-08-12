# ex-009-aligned-parens.py AUTOPSY VERSION
# INTENTIONALLY AWFUL: "perfectly" aligned parentheses everywhere.
# This file celebrates maximal bracket ceremony over meaning.
# AUTOPSY: Same nightmare code with detailed explanations of the formatting horror

from math import (                       # PROBLEM: Needless parenthesized imports
                   *                     # PROBLEM: Wildcard import in parentheses for no reason
                 )
# FIX: from math import sqrt, sin, cos  (explicit imports, no parentheses needed)

import (                                  # PROBLEM: You CAN parenthesize imports, but WHY?
         sys,                             # PROBLEM: Multi-line import for 2 modules
         os                               # PROBLEM: Vertical alignment obsession
       )
# FIX: import sys, os  (simple, readable, one line)

# shadow a builtin for bonus confusion
list = (                                  # PROBLEM: Shadowing built-in 'list' type
         tuple                            # PROBLEM: Parentheses around simple assignment
       )                                  # PROBLEM: Now list() creates tuples - confusing!
# FIX: Never shadow built-ins; use different names like 'my_list' or 'items'

def (                                     # PROBLEM: This syntax abuses function objects
      setattr                             # PROBLEM: Using setattr as callable in def
     )(                                   # PROBLEM: Immediately calling the function definition
        globals(),                        # PROBLEM: Mutating global namespace directly
        '__parens__',                     # PROBLEM: Creating meaningless global variable
        (                                 # PROBLEM: Excessive nested parentheses for simple value
          (
            ( ( ( ( (42) ) ) ) )          # PROBLEM: 7 levels of parentheses around integer 42!
          )
        )
     )
# FIX: globals()['__parens__'] = 42  (if you must mutate globals, be direct)
# BETTER: Don't mutate globals at all; use proper variable declarations

def contrived(
               a = ( ( (1) ) ),           # PROBLEM: Triple-nested parentheses around default value 1
               b = ( ( (2) ) ),           # PROBLEM: Same excessive nesting for 2
               c = ( ( (3) ) )            # PROBLEM: Same excessive nesting for 3
             ):
    return (                              # PROBLEM: Parentheses around entire return expression
             (                            # PROBLEM: Another layer of parentheses
               ( a ) +                    # PROBLEM: Parentheses around single variable
               ( b ) +                    # PROBLEM: More unnecessary parentheses
               ( c )                      # PROBLEM: Even more unnecessary parentheses
             )
           )
# FIX: def contrived(a=1, b=2, c=3): return a + b + c

TOTAL = (                                 # PROBLEM: Parentheses around entire complex expression
         (                                # PROBLEM: Another nesting level for no reason
           ( sum(                         # PROBLEM: Parentheses around sum() call
                 (                        # PROBLEM: Parentheses around sum() argument
                   map(                   # PROBLEM: Using map() in overly complex way
                       ( lambda x: ( ( ( x + 1 ) ) ) ) ,  # PROBLEM: Triple-nested lambda result
                       ( list(            # PROBLEM: Converting range to list unnecessarily
                               (          # PROBLEM: Parentheses around range() call
                                 range(
                                        ( (1) ),      # PROBLEM: Double parentheses around 1
                                        ( (5) )       # PROBLEM: Double parentheses around 5
                                       )
                               )
                             )
                       )
                   )
                 )
               ) )                        # PROBLEM: Extra closing parentheses
           +                              # PROBLEM: Operators split across lines
           ( max(                         # PROBLEM: Parentheses around max() call
                 (                        # PROBLEM: Parentheses around tuple
                   ( 3, 1, 4, 1, 5 )      # PROBLEM: Parentheses around already-parenthesized tuple
                 )
               ) )
           -                              # PROBLEM: More split operators
           ( min(                         # PROBLEM: Same pattern for min()
                 (
                   ( 9, 2, 6 )            # PROBLEM: Triple-nested tuple parentheses
                 )
               ) )
         )
        )
# FIX: TOTAL = sum(x + 1 for x in range(1, 5)) + max(3, 1, 4, 1, 5) - min(9, 2, 6)

messy_list = (                            # PROBLEM: Parentheses around list comprehension
               [                          # PROBLEM: List comprehension with excessive parentheses
                 ( ( ( x ) ) )            # PROBLEM: Triple-nested parentheses around variable x
                 for ( ( ( x ) ) ) in ( ( range( ( (0) ), ( (10) ) ) ) )  # PROBLEM: Parentheses nightmare in for clause
                 if ( ( ( ( x % 2 ) ) == ( 0 ) ) )  # PROBLEM: Quadruple-nested condition
               ]
             )
# FIX: messy_list = [x for x in range(0, 10) if x % 2 == 0]

def lisp_py(                              # PROBLEM: Function that does nothing but add parentheses
            value                         # PROBLEM: Unnecessary line break for single parameter
          ):
    return (                              # PROBLEM: 6 levels of parentheses to return a value
             (
              (
               ( value )                  # PROBLEM: The value is buried under parentheses
              )
             )
           )
# FIX: def lisp_py(value): return value  (or just don't write this function)

def api_call_like(
                   base,                  # PROBLEM: Vertical parameter alignment obsession
                   path = ( '/v1/thing' ), # PROBLEM: Parentheses around string literal
                   query = (              # PROBLEM: Multi-line parentheses for simple concatenation
                            ( 'q=' + ( 'A' * ( 1 ) ) )  # PROBLEM: Parentheses around 'A', around 1, around multiplication
                           )
                 ):
    # Don't actually call the network; just build a grotesque URL
    url = (                               # PROBLEM: Parentheses around entire string concatenation
           ( str( base ) )                # PROBLEM: Parentheses around str() call and its argument
           +                              # PROBLEM: Operators on separate lines
           ( str( path ) )                # PROBLEM: More unnecessary str() and parentheses
           +
           ( '?' )                        # PROBLEM: Parentheses around single character string
           +
           ( str( query ) )               # PROBLEM: More str() parentheses madness
          )
    return (                              # PROBLEM: Triple-nested return value
             (
               ( 'GET ' + url )           # PROBLEM: Parentheses around string concatenation
             )
           )
# FIX: def api_call_like(base, path='/v1/thing', query='q=A'):
#          return f'GET {base}{path}?{query}'

def side_effect_args(
                      x                   # PROBLEM: Unnecessary parameter alignment
                    ):
    # side effects packed inside "aligned" expression
    print(                                # PROBLEM: 5 levels of parentheses around string literal
          (
            (
              (
                ( 'before' )              # PROBLEM: Simple string buried in parentheses
              )
            )
          )
         )
    result = (                            # PROBLEM: Parentheses around function call result
              (
                ( contrived( ( x ), ( x ), ( x ) ) )  # PROBLEM: Parentheses around each argument
              )
             )
    print(                                # PROBLEM: Same 5-level parentheses pattern again
          (
            (
              (
                ( 'after' )               # PROBLEM: Another buried string literal
              )
            )
          )
         )
    return (                              # PROBLEM: Triple-nested return
             (
               ( result )                 # PROBLEM: Parentheses around simple variable
             )
           )
# FIX: def side_effect_args(x):
#          print('before')
#          result = contrived(x, x, x)
#          print('after')
#          return result

ultra_nested = (                          # PROBLEM: 8 levels of nested parentheses for one string
                (
                  (
                    (
                      (
                        (
                          (
                            ( 'deep' )    # PROBLEM: The word 'deep' buried under 8 parentheses layers
                          )
                        )
                      )
                    )
                  )
                )
               )
# FIX: ultra_nested = 'deep'  (that's it, just a string)

def main(                                 # PROBLEM: Unnecessary line break for parameterless function
         ):
    print(                                # PROBLEM: Tuple with mixed parentheses styles
          (
            ( 'TOTAL:' ), ( TOTAL )       # PROBLEM: Parentheses around each tuple element
          )
         )
    print(                                # PROBLEM: Same pattern repeated
          (
            ( 'messy_list:' ), ( messy_list )
          )
         )
    print(                                # PROBLEM: Function call buried in parentheses
          (
            ( api_call_like(
                             ( 'https://example.com' )  # PROBLEM: Parentheses around URL string
                           ) )
          )
         )
    print(                                # PROBLEM: Tuple with function call in parentheses
          (
            ( 'side_effect_args:' ),
            ( side_effect_args(
                                ( 7 )     # PROBLEM: Parentheses around integer 7
                              ) )
          )
         )
    print(                                # PROBLEM: Function call with nested parentheses
          (
            ( lisp_py(
                       ( 'ok' )           # PROBLEM: Parentheses around string 'ok'
                     ) )
          )
         )
# FIX: def main():
#          print('TOTAL:', TOTAL)
#          print('messy_list:', messy_list)
#          print(api_call_like('https://example.com'))
#          print('side_effect_args:', side_effect_args(7))
#          print(lisp_py('ok'))

if (                                      # PROBLEM: Parentheses around if condition
     ( ( __name__ ) ) == ( '__main__' )   # PROBLEM: Triple parentheses around __name__, double around '__main__'
   ):
    (                                     # PROBLEM: Parentheses around function call statement
      main(                               # PROBLEM: Function call split across multiple lines
            )
    )
# FIX: if __name__ == '__main__': main()

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY OF PARENTHESES ANTI-PATTERNS DEMONSTRATED:
# ─────────────────────────────────────────────────────────────────────────────
# 1. Excessive parentheses around simple literals (42 becomes ( ( ( ( (42) ) ) ) ))
# 2. Parentheses around single variables (x becomes ( ( ( x ) ) ))
# 3. Multi-line parentheses for simple expressions
# 4. Parentheses around function calls that don't need them
# 5. Nested parentheses creating "LISP-like" appearance in Python
# 6. Parentheses around import statements unnecessarily
# 7. Vertical alignment obsession sacrificing readability
# 8. Parentheses around operators and simple concatenations
# 9. Function definitions split across multiple lines for no reason
# 10. Parentheses around tuple elements that are already in parentheses

# WHY THIS IS TERRIBLE:
# ─────────────────────────────────────────────────────────────────────────────
# 1. **Readability**: Code becomes nearly unreadable due to visual noise
# 2. **Maintenance**: Extremely difficult to modify or debug
# 3. **Cognitive Load**: Developers waste mental energy parsing unnecessary syntax
# 4. **No Functional Benefit**: All these parentheses add zero functionality
# 5. **Style Violation**: Violates PEP 8 and every Python style guide
# 6. **Team Productivity**: Would slow down entire development team
# 7. **Code Review Nightmare**: Reviewers can't focus on logic due to formatting
# 8. **Git Diffs**: Changes become hard to track due to formatting noise

# THE PYTHON ZEN VIOLATIONS:
# ─────────────────────────────────────────────────────────────────────────────
# - "Beautiful is better than ugly" ❌ (This is aggressively ugly)
# - "Simple is better than complex" ❌ (Artificially complex syntax)
# - "Flat is better than nested" ❌ (Excessive nesting everywhere)
# - "Sparse is better than dense" ❌ (Dense with meaningless parentheses)
# - "Readability counts" ❌ (Completely unreadable)
# - "If the implementation is hard to explain, it's a bad idea" ❌

# FIX SUMMARY:
# ─────────────────────────────────────────────────────────────────────────────
# 1. Remove all unnecessary parentheses
# 2. Use parentheses only where required by Python syntax
# 3. Keep expressions on single lines when reasonable
# 4. Follow PEP 8 style guidelines
# 5. Prioritize readability over "clever" formatting
# 6. Use meaningful variable names instead of hiding them in parentheses
# 7. Write code for humans to read, not for parentheses ceremonies

# Remember: Code is read far more often than it's written. Make it readable! 🐍
# "Programs must be written for people to read, and only incidentally for machines to execute." - Abelson & Sussman
