package main

import (
	"fmt"
	"time"
)

// @step gateway
func charge(amount int, bankDelay time.Duration) <-chan string {
	reply := make(chan string, 1)
	go func() {
		time.Sleep(bankDelay)
		reply <- fmt.Sprint("paid ", amount, " USD")
	}()
	return reply
}

//@end

func main() {
	//@step in-time
	select {
	case res := <-charge(40, 50*time.Millisecond):
		fmt.Println(res)
	case <-time.After(300 * time.Millisecond):
		fmt.Println("payment timed out")
	}

	//@step too-slow
	start := time.Now()
	pay := charge(75, 1000*time.Millisecond)
	select {
	case res := <-pay:
		fmt.Println(res)
	case <-time.After(300 * time.Millisecond):
		fmt.Println("bank is not answering, please try again")
	}
	fmt.Println("waited under 600 ms:", time.Since(start) < 600*time.Millisecond)

	//@step late
	fmt.Println("late reply:", <-pay, "- refund it")
}
