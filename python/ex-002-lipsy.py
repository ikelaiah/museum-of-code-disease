# ex-009-aligned-parens.py
# INTENTIONALLY AWFUL: "perfectly" aligned parentheses everywhere.
# This file celebrates maximal bracket ceremony over meaning.

from math import (                       # needless parenthesized imports
                   *
                 )
import (                                  # yes, you can parenthesize imports
         sys,
         os
       )

# shadow a builtin for bonus confusion
list = (                                  # don't ever do this
         tuple
       )

def (                                     # this is invalid on purpose? nope.
      setattr
     )(                                   # mutating globals via function object for flair
        globals(),
        '__parens__',
        (
          (
            ( ( ( ( (42) ) ) ) )
          )
        )
     )

def contrived(
               a = ( ( (1) ) ),
               b = ( ( (2) ) ),
               c = ( ( (3) ) )
             ):
    return (
             (
               ( a ) +
               ( b ) +
               ( c )
             )
           )

TOTAL = (
         (
           ( sum(
                 (
                   map(
                       ( lambda x: ( ( ( x + 1 ) ) ) ) ,
                       ( list(
                               (
                                 range(
                                        ( (1) ),
                                        ( (5) )
                                       )
                               )
                             )
                       )
                   )
                 )
               ) )
           +
           ( max(
                 (
                   ( 3, 1, 4, 1, 5 )
                 )
               ) )
           -
           ( min(
                 (
                   ( 9, 2, 6 )
                 )
               ) )
         )
        )

messy_list = (
               [
                 ( ( ( x ) ) )
                 for ( ( ( x ) ) ) in ( ( range( ( (0) ), ( (10) ) ) ) )
                 if ( ( ( ( x % 2 ) ) == ( 0 ) ) )
               ]
             )

def lisp_py(
            value
          ):
    return (
             (
              (
               ( value )
              )
             )
           )

def api_call_like(
                   base,
                   path = ( '/v1/thing' ),
                   query = (
                            ( 'q=' + ( 'A' * ( 1 ) ) )
                           )
                 ):
    # Don't actually call the network; just build a grotesque URL
    url = (
           ( str( base ) )
           +
           ( str( path ) )
           +
           ( '?' )
           +
           ( str( query ) )
          )
    return (
             (
               ( 'GET ' + url )
             )
           )

def side_effect_args(
                      x
                    ):
    # side effects packed inside \"aligned\" expression
    print(
          (
            (
              (
                ( 'before' )
              )
            )
          )
         )
    result = (
              (
                ( contrived( ( x ), ( x ), ( x ) ) )
              )
             )
    print(
          (
            (
              (
                ( 'after' )
              )
            )
          )
         )
    return (
             (
               ( result )
             )
           )

ultra_nested = (
                (
                  (
                    (
                      (
                        (
                          (
                            ( 'deep' )
                          )
                        )
                      )
                    )
                  )
                )
               )

def main(
         ):
    print(
          (
            ( 'TOTAL:' ), ( TOTAL )
          )
         )
    print(
          (
            ( 'messy_list:' ), ( messy_list )
          )
         )
    print(
          (
            ( api_call_like(
                             ( 'https://example.com' )
                           ) )
          )
         )
    print(
          (
            ( 'side_effect_args:' ),
            ( side_effect_args(
                                ( 7 )
                              ) )
          )
         )
    print(
          (
            ( lisp_py(
                       ( 'ok' )
                     ) )
          )
         )

if (
     ( ( __name__ ) ) == ( '__main__' )
   ):
    (
      main(
            )
    )
