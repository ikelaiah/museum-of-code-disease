// Dangerous: Format String Vulnerability
// Build: gcc -g ex-011-format-string.c -o fmt && ./fmt "%x %x %x"
// Ref: OWASP Format String Attack
#include <stdio.h>

int main(int argc, char** argv){
    char buf[128];
    const char* user = (argc>1)?argv[1]:"hello";
    // VULN: user input as format string
    printf(user);
    printf("\n");
    snprintf(buf, sizeof(buf), user); // also dangerous
    printf("snprintf result: %s\n", buf);
    return 0;
}
