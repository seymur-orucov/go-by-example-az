package main

import (
	"fmt"
	"sync"
	"time"
)

var airlines = []string{"AirNova", "BlueWing", "SkyJet"}

var prices = map[string]int{"AirNova": 240, "BlueWing": 195, "SkyJet": 310, "LateAir": 180}

func fare(airline string) int {
	time.Sleep(100 * time.Millisecond) // the airline's server answers slowly
	return prices[airline]
}

func report(airline string) {
	fmt.Println(airline, fare(airline), "USD")
}

func main() {
	//@step one-by-one
	start := time.Now()
	for _, name := range airlines {
		report(name)
	}
	oneByOne := time.Since(start)
	fmt.Println("one by one, over 250ms:", oneByOne > 250*time.Millisecond)

	//@step together
	var wg sync.WaitGroup
	fares := make([]int, len(airlines))
	start = time.Now()
	for i, name := range airlines {
		wg.Go(func() {
			fares[i] = fare(name)
		})
	}
	wg.Wait()
	fmt.Println(fares)
	fmt.Println("at the same time, faster:", time.Since(start) < oneByOne)

	//@step no-wait
	go report("LateAir")
	fmt.Println("search finished")
}
