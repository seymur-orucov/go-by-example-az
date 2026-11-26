package main

import "fmt"

// @step own
func seatPrice(row string) int {
	switch row {
	case "A":
		return 40
	case "B":
		return 30
	case "C":
		return 20
	}
	panic("unknown row " + row)
}

//@end

func main() {
	fmt.Println("row B:", seatPrice("B"), "USD")

	//@step runtime
	prices := []int{40, 30, 20}
	i := 5
	if i < len(prices) {
		fmt.Println("price:", prices[i])
	} else {
		fmt.Println("no row with index", i)
	}

	//@step crash
	fmt.Println("row Z:", seatPrice("Z"), "USD")
	fmt.Println("this line never runs")
}
