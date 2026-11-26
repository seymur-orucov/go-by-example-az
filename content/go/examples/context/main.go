package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"time"
)

// @step done
// findDriver looks for a taxi driver and gives up as soon as ctx is done.
func findDriver(ctx context.Context, search time.Duration) (string, error) {
	select {
	case <-time.After(search):
		return "driver Sam", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

//@end

func main() {
	//@step timeout
	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
	defer cancel()
	driver, err := findDriver(ctx, 50*time.Millisecond)
	fmt.Printf("%q %v\n", driver, err)
	driver, err = findDriver(ctx, 2*time.Second)
	fmt.Printf("%q %v\n", driver, err)

	//@step cancel
	ride, cancelRide := context.WithCancel(context.Background())
	go func() {
		time.Sleep(100 * time.Millisecond) // the rider taps "Cancel"
		cancelRide()
	}()
	_, err = findDriver(ride, 2*time.Second)
	fmt.Println(err, errors.Is(err, context.Canceled))

	//@step tree
	app, closeApp := context.WithCancel(context.Background())
	search, stopSearch := context.WithTimeout(app, time.Hour)
	stopSearch()
	fmt.Println("search:", search.Err(), "| app:", app.Err())
	pay, stopPay := context.WithTimeout(app, time.Hour)
	defer stopPay()
	closeApp()
	fmt.Println("pay:", pay.Err(), "| app:", app.Err())

	//@step http
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		select {
		case <-time.After(2 * time.Second):
			fmt.Fprint(w, "route to the airport")
		case <-r.Context().Done(): // the client gave up
		}
	}))
	defer srv.Close()
	ctx, cancel = context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, srv.URL, nil)
	_, err = http.DefaultClient.Do(req)
	fmt.Println("route failed:", errors.Is(err, context.DeadlineExceeded))
}
