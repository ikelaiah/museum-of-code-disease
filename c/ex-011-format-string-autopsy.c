// Fix: Treat user input as data, not format string
#include <stdio.h>

int main(int argc, char** argv){
    char buf[128];
    const char* user = (argc>1)?argv[1]:"hello";
    printf("%s\n", user);
    snprintf(buf, sizeof(buf), "%s", user);
    printf("snprintf result: %s\n", buf);
    return 0;
}
