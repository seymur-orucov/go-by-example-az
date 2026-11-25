package main

import (
	"fmt"
	"time"
)

func main() {
	//@step make
	rail := make(chan string, 3)
	fmt.Println("the rail holds", cap(rail), "tickets")

	//@step no-wait
	rail <- "latte"
	rail <- "cappuccino"
	rail <- "mocha"
	fmt.Println("cashier took 3 orders, on the rail:", len(rail), "of", cap(rail))

	//@step full
	made := make(chan string)
	start := time.Now()
	go func() {
		time.Sleep(100 * time.Millisecond) // the barista finishes a drink
		ticket := <-rail
		made <- ticket
	}()
	rail <- "espresso" // the rail is full: wait for a free spot
	fmt.Println("the rail was full, cashier waited:", time.Since(start) > 50*time.Millisecond)
	fmt.Println("barista made", <-made)

	//@step fifo
	for len(rail) > 0 {
		fmt.Println("next ticket:", <-rail)
	}
}
