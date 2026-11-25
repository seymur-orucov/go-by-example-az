package main

import (
	"fmt"
	"time"
)

func main() {
	//@step ticker
	start := time.Now()
	gateway := time.NewTicker(100 * time.Millisecond)
	defer gateway.Stop()
	for _, text := range []string{"order shipped", "order delivered", "rate your order", "weekly deals"} {
		<-gateway.C
		fmt.Println("sms:", text)
	}
	fmt.Println("took at least 300 ms:", time.Since(start) >= 300*time.Millisecond)

	//@step burst
	tokens := make(chan struct{}, 2)
	tokens <- struct{}{}
	tokens <- struct{}{}
	start = time.Now()
	for _, code := range []string{"login code 4821", "delivery code 9930"} {
		<-tokens
		fmt.Println("urgent sms:", code)
	}
	fmt.Println("sent without waiting:", time.Since(start) < 100*time.Millisecond)
	fmt.Println("tokens left:", len(tokens))

	//@step refill
	go func() {
		for range time.Tick(150 * time.Millisecond) {
			tokens <- struct{}{}
		}
	}()
	start = time.Now()
	<-tokens
	fmt.Println("urgent sms: reset code 3307")
	fmt.Println("waited for a token:", time.Since(start) >= 100*time.Millisecond)
}
