#ifndef GETOPT_H
#define GETOPT_H

#ifdef __cplusplus
extern "C" {
#endif

int getopt(int argc, char * const argv[], const char *optstring);
extern char *optarg;
extern int optind, opterr, optopt;

#ifdef __cplusplus
};
#endif

#include <getopt_long.h>

#endif   /* GETOPT_H */
