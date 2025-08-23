// Dangerous: Integer overflow leading to buffer overflow
// Build: gcc -g ex-012-integer-overflow-to-bof.c -o iof && ./iof 1073741824
// Ref: CWE-190
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char** argv){
    size_t n = (argc>1)? strtoull(argv[1], NULL, 10) : 100;
    // potential overflow in multiplication
    size_t bytes = n * sizeof(int);
    int* a = malloc(bytes);
    if (!a) { perror("malloc"); return 1; }
    // VULN: assume buffer holds n ints; if overflowed, buffer is too small
    for (size_t i=0;i<n;i++) a[i] = (int)i; // may overflow heap chunk
    printf("wrote %zu ints\n", n);
    free(a);
    return 0;
}
