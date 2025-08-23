// Dangerous: Path Traversal in Go HTTP file server
// Run: go run ex-010-path-traversal.go
// Reference: CWE-22 Path Traversal
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	http.HandleFunc("/view", func(w http.ResponseWriter, r *http.Request) {
		// VULN: directly concatenate untrusted path
		p := r.URL.Query().Get("p")
		if p == "" { p = "index.html" }
		b, err := ioutil.ReadFile("./" + p)
		if err != nil { http.Error(w, err.Error(), 500); return }
		w.Write(b)
	})
	fmt.Println("Serving on :8080")
	http.ListenAndServe(":8080", nil)
}
