// Fix: Validate and constrain paths using an allowlist and fs.Sub
package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed public/*
var content embed.FS

func main() {
	sub, err := fs.Sub(content, "public")
	if err != nil { log.Fatal(err) }
	// Only serve embedded files under public/
	http.Handle("/", http.FileServer(http.FS(sub)))
	log.Println("Serving safe files on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
