package main

import (
	"fmt"
	"time"
)

func main() {
	//@step unix
	entry := time.Date(2026, time.May, 9, 18, 20, 0, 0, time.UTC)
	ticket := entry.Unix()
	fmt.Println("ticket:", ticket)
	fmt.Println("in milliseconds:", entry.UnixMilli())

	//@step from-unix
	gate := int64(1778358900) // the exit gate logs a Unix time
	exit := time.Unix(gate, 0).UTC()
	fmt.Println("exit:", exit)

	//@step arithmetic
	seconds := gate - ticket
	fmt.Println("parked:", seconds, "s =", time.Duration(seconds)*time.Second)
	hours := (seconds + 3599) / 3600 // every started hour counts
	fmt.Println("fee:", hours*2, "USD")

	//@step zero
	fmt.Println("epoch:", time.Unix(0, 0).UTC())
	var paidAt time.Time
	fmt.Println("not paid:", paidAt.IsZero(), paidAt.Unix())
}
