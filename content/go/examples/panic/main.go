package main

import "fmt"

// @step own
type Row int

const (
	A Row = iota
	B
	C
)

func seatPrice(r Row) int {
	switch r {
	case A:
		return 40
	case B:
		return 30
	case C:
		return 20
	}
	panic(fmt.Sprintf("unknown row %d", r))
}

//@end

func main() {
	fmt.Println("row B:", seatPrice(B), "USD")

	//@step runtime
	prices := []int{40, 30, 20}
	i := 5
	if i < len(prices) {
		fmt.Println("price:", prices[i])
	} else {
		fmt.Println("no row with index", i)
	}

	//@step crash
	fmt.Println("row 7:", seatPrice(Row(7)), "USD")
	fmt.Println("this line never runs")
}
