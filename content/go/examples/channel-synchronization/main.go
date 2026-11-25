package main

import (
	"fmt"
	"time"
)

// @step signal
func backup(receipts []int, done chan struct{}) {
	total := 0
	for _, r := range receipts {
		time.Sleep(60 * time.Millisecond) // writing one receipt to disk
		total += r
	}
	fmt.Println("backup: saved", len(receipts), "receipts,", total, "USD")
	done <- struct{}{}
}

//@end

func main() {
	//@step guess
	receipts := []int{12, 30, 8, 45}
	done := make(chan struct{})
	go backup(receipts, done)
	time.Sleep(50 * time.Millisecond)
	fmt.Println("till: waited 50 ms, close now?")

	//@step wait
	<-done
	fmt.Println("till: backup confirmed, till closed")
}
