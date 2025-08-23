// Fix: Check for integer overflow before allocation and writes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

int main(int argc, char** argv){
    size_t n = (argc>1)? strtoull(argv[1], NULL, 10) : 100;
    if (n != 0 && n > SIZE_MAX / sizeof(int)) {
        fprintf(stderr, "size overflow\n");
        return 1;
    }
    size_t bytes = n * sizeof(int);
    int* a = malloc(bytes);
    if (!a) { perror("malloc"); return 1; }
    for (size_t i=0;i<n;i++) a[i] = (int)i;
    printf("safely wrote %zu ints\n", n);
    free(a);
    return 0;
}
