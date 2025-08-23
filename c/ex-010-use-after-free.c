// Dangerous: Use-After-Free
// Build: gcc -fsanitize=address -g ex-010-use-after-free.c -o uaf && ./uaf
// Reference: CWE-416 UAF https://cwe.mitre.org/data/definitions/416.html
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = malloc(sizeof(int));
    if (!p) return 1;
    *p = 42;
    free(p);
    // UAF: using freed memory
    printf("Value: %d\n", *p); // undefined behavior
    // Double free
    free(p);
    return 0;
}
