#!/usr/bin/perl
# ex-001-sigil-hell.pl
# INTENTIONALLY AWFUL: Perl sigil chaos and regex madness
# This celebrates every "write-only" Perl anti-pattern known to humanity
# WARNING: This code will make your eyes bleed and your brain melt

use strict; # just kidding, we'll break this immediately
use warnings; # same here

# Global variable soup with confusing sigils
our ($a,$b,$c,$d,$e,$f,$g,$h,$i,$j,$k,$l,$m,$n,$o,$p,$q,$r,$s,$t,$u,$v,$w,$x,$y,$z);
our @a = qw/a b c d e f g h i j k l m n o p q r s t u v w x y z/;
our %a = map { $_ => $_ } @a;
our $l1 = 'l1'; our $O0 = 'O0'; our $I1 = 'I1';  # confusable names

# Redefine built-ins for maximum chaos
sub print { CORE::print reverse @_ }  # reverse all output
*CORE::GLOBAL::chomp = sub { $_[0] =~ s/.$//; };  # remove last char, not newline

# The infamous one-liner disasters
$_ = "Hello World"; tr/a-z/A-Z/; s/(.)/reverse $1/ge; print;

# Regex hell with maximum backtracking
sub regex_hell {
    my $evil = qr/^(a+)+$/;  # catastrophic backtracking
    my $input = 'a' x 20 . 'b';
    # $input =~ /$evil/;  # would hang, commented for safety
    
    # Unreadable regex soup
    my $data = "user:pass@host:port/path?query=value#fragment";
    my ($u,$p,$h,$pt,$pa,$q,$f) = $data =~ m{^([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)\?([^#]+)#(.+)$};
    
    # Regex as code (eval in disguise)
    my $code = 's/foo/bar/g';
    eval "\$data =~ $code";  # dynamic regex execution
}

# Sigil switching madness
sub sigil_chaos {
    my @arr = (1,2,3);
    my $arr = [4,5,6];
    my %arr = (7,8,9,10);
    
    print $$arr[0];      # $arr->[0] but confusing
    print $arr[0];       # @arr[0] 
    print $arr{7};       # %arr{7}
    
    # Context switching hell
    my $scalar = @arr;   # array in scalar context = length
    my @array = %arr;    # hash in array context = flattened
    my $ref = \@arr;     # reference
    my @deref = @$ref;   # dereference
}

# Special variables abuse
sub special_vars_hell {
    $" = '|';           # array separator
    $, = '::';          # output separator  
    $\ = "\n---\n";     # output record separator
    $/ = undef;         # slurp mode
    $. = 999;           # line number
    $? = 42;            # child error
    
    # The infamous $_ abuse
    for (1..10) {
        $_ *= 2;
        s/(\d+)/$1 bottles/;
        print;
    }
    
    # Punctuation variables
    print $0, $!, $@, $$, $<, $>, $(, $), $[, $], $^T, $^O;
}

# Reference and typeglob chaos
sub reference_hell {
    my $scalar = "test";
    my @array = (1,2,3);
    my %hash = (a => 1, b => 2);
    
    # Typeglob manipulation
    *foo = \$scalar;     # assign scalar to typeglob
    *foo = \@array;      # now foo is array
    *foo = \%hash;       # now foo is hash
    
    # Anonymous reference madness
    my $complex = {
        arr => [1, 2, { nested => [qw/a b c/] }],
        code => sub { $_[0] * 2 },
        regex => qr/\d+/
    };
    
    # Dereference hell
    print @{$complex->{arr}};
    print ${$complex->{arr}}[2]->{nested}->[1];
    print $complex->{code}->(42);
}

# Package and namespace pollution
package Chaos;
our @ISA = qw/UNIVERSAL/;  # inherit from UNIVERSAL
sub AUTOLOAD { 
    our $AUTOLOAD;
    print "Called: $AUTOLOAD\n";
    goto &{$AUTOLOAD};  # infinite recursion potential
}

package main;

# Prototype abuse
sub mysub ($@%) { }  # confusing prototypes
sub myprint ($) { print $_[0] }

# File handle chaos
sub file_hell {
    open F, ">", "/tmp/chaos.txt" or die;  # no lexical filehandle
    print F "chaos\n";
    # no close() - file handle leak
    
    # Bareword file handles
    open STDOUT, ">&STDERR";  # redirect stdout to stderr
    
    # Slurp without error checking
    my $content = do { local $/; <F> };
}

# Eval and string execution
sub eval_hell {
    my $code = 'print "Hello from eval\n"';
    eval $code;  # string eval
    
    # Symbolic references (soft refs)
    my $var = "test";
    $$var = "chaos";  # creates $test = "chaos"
    
    # Dynamic subroutine calls
    my $sub = "regex_hell";
    &$sub();  # call subroutine by name
}

# Format chaos (ancient Perl feature)
format STDOUT =
@<<<<<<< @|||||| @>>>>>>
$a,      $b,     $c
.

# Main chaos orchestrator
sub main {
    print "🐪 PERL NIGHTMARE STARTING 🐪\n";
    
    regex_hell();
    sigil_chaos();
    special_vars_hell();
    reference_hell();
    file_hell();
    eval_hell();
    
    # The ultimate Perl one-liner disasters
    map{print$_}sort{$a<=>$b}grep{/\d/}split//,join'',<>;
    
    # Obfuscated code golf
    $_='987654321';s/./print"$& "x$&,"\n"/ge;
    
    print "🎭 PERL CHAOS COMPLETE 🎭\n";
}

# Execute with implicit calls
main;
