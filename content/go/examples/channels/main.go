package main

import (
	"fmt"
	"time"
)

// @step send
func bake(pizza string, ready chan string) {
	time.Sleep(100 * time.Millisecond) // the pizza is in the oven
	ready <- pizza
}

//@end

func main() {
	//@step make
	ready := make(chan string)
	go bake("Margherita", ready)
	fmt.Println("counter: waiting for Margherita")

	//@step receive
	pizza := <-ready
	fmt.Println("counter: got", pizza)

	//@step send-waits
	orders := make(chan string)
	start := time.Now()
	go func() {
		time.Sleep(100 * time.Millisecond) // the oven is still busy
		order := <-orders
		bake(order, ready)
	}()
	orders <- "Pepperoni"
	fmt.Println("counter: the oven took the order, waited:", time.Since(start) > 50*time.Millisecond)
	fmt.Println("counter: got", <-ready)
}
