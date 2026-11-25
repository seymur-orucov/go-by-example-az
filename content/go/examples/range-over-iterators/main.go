package main

import (
	"fmt"
	"iter"
	"maps"
	"slices"
)

// @step seq
func Departures(first, every, last int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for m := first; m <= last; m += every {
			if !yield(m) {
				return
			}
		}
	}
}

// @step seq2
func Numbered(stops []string) iter.Seq2[int, string] {
	return func(yield func(int, string) bool) {
		for i, s := range stops {
			if !yield(i+1, s) {
				return
			}
		}
	}
}

//@end

func main() {
	for m := range Departures(5, 15, 50) {
		fmt.Println("bus at minute", m)
	}
	route := []string{"Depot", "Market", "Library"}
	for n, stop := range Numbered(route) {
		fmt.Println(n, stop)
	}

	//@step stop
	for m := range Departures(5, 15, 50) {
		if m > 30 {
			fmt.Println("first bus after minute 30:", m)
			break
		}
	}

	//@step std
	fmt.Println(slices.Collect(Departures(0, 20, 59)))
	fares := map[string]int{"child": 1, "adult": 3, "senior": 2}
	for _, k := range slices.Sorted(maps.Keys(fares)) {
		fmt.Println(k, fares[k], "USD")
	}
}
