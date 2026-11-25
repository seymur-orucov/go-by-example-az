package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// @step request
type request struct {
	kind  string // "take" or "check"
	item  string
	qty   int
	reply chan int // the keeper answers here
}

// @step keeper
func keeper(requests <-chan request) {
	stock := map[string]int{"boots": 12, "helmets": 40} // only this goroutine touches it
	for r := range requests {
		switch r.kind {
		case "take":
			if stock[r.item] < r.qty {
				r.reply <- 0 // not enough: give nothing
				continue
			}
			stock[r.item] -= r.qty
			r.reply <- r.qty
		case "check":
			r.reply <- stock[r.item]
		}
	}
}

// @step ask
func ask(requests chan<- request, kind, item string, qty int) int {
	reply := make(chan int)
	requests <- request{kind: kind, item: item, qty: qty, reply: reply}
	return <-reply
}

//@end

func main() {
	requests := make(chan request)
	go keeper(requests)

	//@step pickers
	var filled atomic.Int64
	var wg sync.WaitGroup
	for range 5 { // five pickers want 3 boots each
		wg.Go(func() {
			if ask(requests, "take", "boots", 3) > 0 {
				filled.Add(1)
			}
		})
	}
	wg.Wait()
	fmt.Println("orders filled:", filled.Load(), "of 5")

	//@step check
	fmt.Println("boots left:", ask(requests, "check", "boots", 0))
	close(requests) // the keeper's loop ends
}
