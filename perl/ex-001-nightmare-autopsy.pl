#!/usr/bin/perl
# ex-001-sigil-hell.pl AUTOPSY VERSION
# INTENTIONALLY AWFUL: Perl sigil chaos and regex madness
# This celebrates every "write-only" Perl anti-pattern known to humanity
# AUTOPSY: Same nightmare code with detailed explanations of Perl's dark magic

use strict; # PROBLEM: just kidding, we'll break this immediately
use warnings; # PROBLEM: same here

# PROBLEM: Global variable soup with confusing sigils
our ($a,$b,$c,$d,$e,$f,$g,$h,$i,$j,$k,$l,$m,$n,$o,$p,$q,$r,$s,$t,$u,$v,$w,$x,$y,$z); # PROBLEM: 26 global scalars
our @a = qw/a b c d e f g h i j k l m n o p q r s t u v w x y z/; # PROBLEM: Global array with same name
our %a = map { $_ => $_ } @a; # PROBLEM: Global hash with same name - sigil chaos!
our $l1 = 'l1'; our $O0 = 'O0'; our $I1 = 'I1';  # PROBLEM: Confusable variable names
# FIX: Use lexical variables (my), avoid globals, use descriptive names

# PROBLEM: Redefine built-ins for maximum chaos
sub print { CORE::print reverse @_ }  # PROBLEM: Override built-in print function
*CORE::GLOBAL::chomp = sub { $_[0] =~ s/.$//; };  # PROBLEM: Override global chomp to remove last char, not newline
# FIX: Never override built-in functions; use different names

# PROBLEM: The infamous one-liner disasters
$_ = "Hello World"; tr/a-z/A-Z/; s/(.)/reverse $1/ge; print; # PROBLEM: Chained operations on $_, unreadable
# FIX: Use explicit variables, break into multiple lines, add comments

# PROBLEM: Regex hell with maximum backtracking
sub regex_hell {
    my $evil = qr/^(a+)+$/;  # PROBLEM: Catastrophic backtracking - nested quantifiers
    my $input = 'a' x 20 . 'b'; # PROBLEM: Input designed to trigger worst-case performance
    # $input =~ /$evil/;  # PROBLEM: Would hang system for minutes - ReDoS attack!
    
    # PROBLEM: Unreadable regex soup
    my $data = "user:pass@host:port/path?query=value#fragment";
    my ($u,$p,$h,$pt,$pa,$q,$f) = $data =~ m{^([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)\?([^#]+)#(.+)$}; # PROBLEM: Complex regex in one line
    # FIX: Use named captures, break into parts, validate input
    
    # PROBLEM: Regex as code (eval in disguise)
    my $code = 's/foo/bar/g'; # PROBLEM: String containing regex code
    eval "\$data =~ $code";  # PROBLEM: Dynamic regex execution - code injection risk
    # FIX: Use qr// for precompiled regex, avoid eval with user input
}

# PROBLEM: Sigil switching madness
sub sigil_chaos {
    my @arr = (1,2,3); # PROBLEM: Array variable
    my $arr = [4,5,6]; # PROBLEM: Scalar with same name (array reference)
    my %arr = (7,8,9,10); # PROBLEM: Hash with same name - maximum confusion
    
    print $$arr[0];      # PROBLEM: $arr->[0] but confusing syntax
    print $arr[0];       # PROBLEM: @arr[0] - different variable entirely
    print $arr{7};       # PROBLEM: %arr{7} - yet another different variable
    # FIX: Use descriptive names, avoid sigil reuse, use -> for references
    
    # PROBLEM: Context switching hell
    my $scalar = @arr;   # PROBLEM: Array in scalar context = length (not obvious)
    my @array = %arr;    # PROBLEM: Hash in array context = flattened key-value pairs
    my $ref = \@arr;     # PROBLEM: Reference to array
    my @deref = @$ref;   # PROBLEM: Dereference array reference
    # FIX: Be explicit about context, use scalar(@arr) for clarity
}

# PROBLEM: Special variables abuse
sub special_vars_hell {
    $" = '|';           # PROBLEM: Array separator - affects all array interpolation
    $, = '::';          # PROBLEM: Output separator for print
    $\ = "\n---\n";     # PROBLEM: Output record separator - added to all prints
    $/ = undef;         # PROBLEM: Slurp mode - reads entire files at once
    $. = 999;           # PROBLEM: Line number counter manipulation
    $? = 42;            # PROBLEM: Child process exit status manipulation
    # FIX: Use explicit formatting, avoid global special variables
    
    # PROBLEM: The infamous $_ abuse
    for (1..10) {       # PROBLEM: $_ is implicit loop variable
        $_ *= 2;        # PROBLEM: Modify $_ directly
        s/(\d+)/$1 bottles/; # PROBLEM: Regex operates on $_ implicitly
        print;          # PROBLEM: print operates on $_ implicitly
    }
    # FIX: Use explicit loop variables: for my $i (1..10)
    
    # PROBLEM: Punctuation variables - cryptic and unreadable
    print $0, $!, $@, $$, $<, $>, $(, $), $[, $], $^T, $^O; # PROBLEM: Program name, error, eval error, PID, UID, etc.
    # FIX: Use English module: use English; then $PROGRAM_NAME instead of $0
}

# PROBLEM: Reference and typeglob chaos
sub reference_hell {
    my $scalar = "test";
    my @array = (1,2,3);
    my %hash = (a => 1, b => 2);
    
    # PROBLEM: Typeglob manipulation - advanced Perl dark magic
    *foo = \$scalar;     # PROBLEM: Assign scalar reference to typeglob
    *foo = \@array;      # PROBLEM: Now foo is array - same symbol table entry
    *foo = \%hash;       # PROBLEM: Now foo is hash - completely different meaning
    # FIX: Use explicit references, avoid typeglobs unless absolutely necessary
    
    # PROBLEM: Anonymous reference madness
    my $complex = {      # PROBLEM: Deeply nested anonymous structures
        arr => [1, 2, { nested => [qw/a b c/] }], # PROBLEM: Array of mixed types
        code => sub { $_[0] * 2 }, # PROBLEM: Anonymous subroutine reference
        regex => qr/\d+/   # PROBLEM: Compiled regex reference
    };
    
    # PROBLEM: Dereference hell - hard to read and understand
    print @{$complex->{arr}}; # PROBLEM: Dereference array reference
    print ${$complex->{arr}}[2]->{nested}->[1]; # PROBLEM: Deep dereferencing chain
    print $complex->{code}->(42); # PROBLEM: Call code reference
    # FIX: Use intermediate variables, avoid deep nesting
}

# PROBLEM: Package and namespace pollution
package Chaos; # PROBLEM: Switch to different package
our @ISA = qw/UNIVERSAL/;  # PROBLEM: Inherit from UNIVERSAL (everything)
sub AUTOLOAD {  # PROBLEM: AUTOLOAD catches all undefined method calls
    our $AUTOLOAD; # PROBLEM: Global variable with method name
    print "Called: $AUTOLOAD\n";
    goto &{$AUTOLOAD};  # PROBLEM: Infinite recursion potential - will crash
}
# FIX: Use proper OOP with Moose/Moo, avoid AUTOLOAD, explicit inheritance

package main; # PROBLEM: Switch back to main package

# PROBLEM: Prototype abuse
sub mysub ($@%) { }  # PROBLEM: Confusing prototypes that change calling conventions
sub myprint ($) { print $_[0] } # PROBLEM: Prototype forces scalar context
# FIX: Avoid prototypes unless you understand them completely

# PROBLEM: File handle chaos
sub file_hell {
    open F, ">", "/tmp/chaos.txt" or die;  # PROBLEM: Global filehandle, no lexical scoping
    print F "chaos\n"; # PROBLEM: Print to global filehandle
    # PROBLEM: No close() - file handle leak
    
    # PROBLEM: Bareword file handles
    open STDOUT, ">&STDERR";  # PROBLEM: Redirect stdout to stderr globally
    
    # PROBLEM: Slurp without error checking
    my $content = do { local $/; <F> }; # PROBLEM: Slurp mode, no error handling
    # FIX: Use lexical filehandles: open my $fh, '>', $file; always close; check errors
}

# PROBLEM: Eval and string execution
sub eval_hell {
    my $code = 'print "Hello from eval\n"'; # PROBLEM: Code as string
    eval $code;  # PROBLEM: String eval - code injection vulnerability
    # FIX: Use block eval: eval { ... } for exception handling only
    
    # PROBLEM: Symbolic references (soft refs)
    my $var = "test"; # PROBLEM: Variable name as string
    $$var = "chaos";  # PROBLEM: Creates $test = "chaos" - symbolic reference
    # FIX: Use hash references or proper data structures
    
    # PROBLEM: Dynamic subroutine calls
    my $sub = "regex_hell"; # PROBLEM: Subroutine name as string
    &$sub();  # PROBLEM: Call subroutine by name - can be exploited
    # FIX: Use code references: my $sub = \&regex_hell; $sub->();
}

# PROBLEM: Format chaos (ancient Perl feature)
format STDOUT = # PROBLEM: Ancient formatting system, hard to maintain
@<<<<<<< @|||||| @>>>>>>
$a,      $b,     $c
.
# FIX: Use printf, sprintf, or template systems

# PROBLEM: Main chaos orchestrator
sub main {
    print "🐪 PERL NIGHTMARE STARTING 🐪\n";
    
    regex_hell();           # PROBLEM: Regex catastrophic backtracking
    sigil_chaos();          # PROBLEM: Sigil confusion and context switching
    special_vars_hell();    # PROBLEM: Global special variable abuse
    reference_hell();       # PROBLEM: Complex reference and typeglob manipulation
    file_hell();            # PROBLEM: File handle leaks and global handles
    eval_hell();            # PROBLEM: String eval and symbolic references
    
    # PROBLEM: The ultimate Perl one-liner disasters
    map{print$_}sort{$a<=>$b}grep{/\d/}split//,join'',<>; # PROBLEM: Completely unreadable
    # TRANSLATION: Read input, join lines, split into chars, grep digits, sort numerically, print each
    
    # PROBLEM: Obfuscated code golf
    $_='987654321';s/./print"$& "x$&,"\n"/ge; # PROBLEM: Print each digit N times
    # TRANSLATION: For each digit, print it that many times
    
    print "🎭 PERL CHAOS COMPLETE 🎭\n";
}

# PROBLEM: Execute with implicit calls
main; # PROBLEM: Call without parentheses

# ─────────────────────────────────────────────────────────────────────────────
# PERL ANTI-PATTERNS SUMMARY:
# ─────────────────────────────────────────────────────────────────────────────
# 1. **Sigil Chaos**: Same name with different sigils ($, @, %) means different variables
# 2. **Special Variables**: Cryptic punctuation variables ($!, $@, $$, etc.)
# 3. **Context Sensitivity**: Same expression means different things in different contexts
# 4. **Global Variables**: Everything is global by default, use 'my' for lexical scope
# 5. **Regex Complexity**: Complex regex in one line, catastrophic backtracking
# 6. **String Eval**: eval with strings allows code injection
# 7. **Symbolic References**: Using strings as variable names
# 8. **Typeglob Manipulation**: Advanced feature that's usually unnecessary
# 9. **One-liners**: Compressed code that's impossible to read/maintain
# 10. **Implicit $_**: Many operations work on $_ implicitly

# WHY PERL IS UNIQUELY CHAOTIC:
# ─────────────────────────────────────────────────────────────────────────────
# - **TIMTOWTDI**: "There's More Than One Way To Do It" - too much flexibility
# - **Context Sensitivity**: Same code behaves differently in scalar/list context
# - **Sigil System**: $, @, % prefixes change meaning of same identifier
# - **Special Variables**: Dozens of cryptic built-in variables
# - **Regex Integration**: Regular expressions are first-class language feature
# - **Global by Default**: Variables are global unless explicitly made lexical
# - **Implicit $_**: Many operations work on default variable $_
# - **Write-Only Code**: Easy to write, impossible to read later

# FIX SUMMARY:
# ─────────────────────────────────────────────────────────────────────────────
# 1. Always use 'strict' and 'warnings' pragmas
# 2. Use 'my' for lexical variables, avoid globals
# 3. Use descriptive variable names, avoid sigil reuse
# 4. Break complex regex into parts with /x modifier
# 5. Use English module for readable special variables
# 6. Avoid string eval, use block eval for exceptions
# 7. Use explicit variables instead of $_
# 8. Comment complex one-liners or break them up
# 9. Use modern Perl features (Moose, Try::Tiny, etc.)
# 10. Follow Perl Best Practices guidelines

# Remember: Perl's motto "There's more than one way to do it" is both 
# its strength and weakness! Choose the readable way! 🐪
