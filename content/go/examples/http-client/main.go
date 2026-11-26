package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"time"
)

// weather is a fake forecast service: it wants an API key and knows one city.
func weather(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.URL.Path == "/slow":
		time.Sleep(800 * time.Millisecond)
	case r.Header.Get("X-API-Key") != "demo-key":
		http.Error(w, "missing API key", http.StatusUnauthorized)
	case r.URL.Query().Get("city") != "Oslo":
		http.Error(w, "unknown city", http.StatusNotFound)
	default:
		fmt.Fprint(w, "Oslo: 4C, light rain")
	}
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(weather))
	defer srv.Close()

	//@step get
	resp, err := http.Get(srv.URL + "/forecast?city=Oslo")
	if err != nil {
		fmt.Println("request failed:", err)
		return
	}
	defer resp.Body.Close()
	fmt.Println(resp.Status, err)

	//@step header
	req, _ := http.NewRequest(http.MethodGet, srv.URL+"/forecast?city=Oslo", nil)
	req.Header.Set("X-API-Key", "demo-key")
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("request failed:", err)
		return
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Printf("%s | %s\n", resp.Status, body)

	//@step status
	req.URL.RawQuery = "city=Atlantis"
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("request failed:", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ = io.ReadAll(resp.Body)
		fmt.Printf("error %d: %s", resp.StatusCode, body)
	}

	//@step timeout
	client := &http.Client{Timeout: 100 * time.Millisecond}
	_, err = client.Get(srv.URL + "/slow")
	fmt.Println("failed:", err != nil, "timeout:", os.IsTimeout(err))
}
