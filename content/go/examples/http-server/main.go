package main

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
)

var prices = map[string]int{"latte": 4, "espresso": 3}

// @step handler
func menu(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "latte, espresso")
}

// @step status
func price(w http.ResponseWriter, r *http.Request) {
	item := r.PathValue("item")
	p, ok := prices[item]
	if !ok {
		http.Error(w, "no such drink: "+item, http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, "%s costs %d USD\n", item, p)
}

//@end

func main() {
	//@step routes
	mux := http.NewServeMux()
	mux.HandleFunc("GET /menu", menu)
	mux.HandleFunc("GET /price/{item}", price)

	//@step serve
	ln, err := net.Listen("tcp", "127.0.0.1:0") // port 0: any free port
	if err != nil {
		fmt.Println(err)
		return
	}
	srv := &http.Server{Handler: mux}
	done := make(chan error)
	go func() { done <- srv.Serve(ln) }()

	base := "http://" + ln.Addr().String()
	calls := [][2]string{{"GET", "/menu"}, {"GET", "/price/latte"},
		{"GET", "/price/mocha"}, {"POST", "/menu"}, {"GET", "/orders"}}
	for _, c := range calls {
		req, _ := http.NewRequest(c[0], base+c[1], nil)
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			fmt.Println(err)
			return
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		fmt.Printf("%-4s %-12s -> %d %s", c[0], c[1], resp.StatusCode, body)
	}

	//@step shutdown
	srv.Shutdown(context.Background())
	fmt.Println("server stopped:", <-done)
}
