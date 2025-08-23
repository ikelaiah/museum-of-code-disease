// Fix: Avoid Use-After-Free and Double Free
// Build: gcc -fsanitize=address -g ex-010-use-after-free-autopsy.c -o uaf_fix && ./uaf_fix
// Technique: set pointer to NULL after free; never dereference after free
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *p = malloc(sizeof(int));
    if (!p) return 1;
    *p = 42;
    printf("Value before free: %d\n", *p);
    free(p);
    p = NULL; // poison pointer
    if (p) {
        // never reached
        printf("%d\n", *p);
    }
    // free(NULL) is safe no-op
    free(p);
    return 0;
}
