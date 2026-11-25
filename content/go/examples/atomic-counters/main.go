package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	//@step counter
	var inside atomic.Int64 // fans in the stadium; the zero value is 0
	var wg sync.WaitGroup
	for _, fans := range []int{3200, 2750, 4100, 1950} {
		wg.Go(func() { // one goroutine per gate turnstile
			for range fans {
				inside.Add(1)
			}
		})
	}
	wg.Wait()
	fmt.Println("at kick-off:", inside.Load())

	//@step halftime
	wg.Go(func() {
		for range 1500 {
			inside.Add(-1) // a fan leaves early
		}
	})
	wg.Go(func() {
		for range 300 {
			inside.Add(1) // a late fan comes in
		}
	})
	wg.Wait()
	fmt.Println("second half:", inside.Load())

	//@step last-fan
	for _, fans := range []int{4000, 3800, 3000} {
		wg.Go(func() { // one goroutine per exit
			for range fans {
				if inside.Add(-1) == 0 {
					fmt.Println("last fan out, lights off")
				}
			}
		})
	}
	wg.Wait()
	fmt.Println("after the match:", inside.Load())
}
