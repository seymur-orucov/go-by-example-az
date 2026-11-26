package main

import (
	"cmp"
	"fmt"
	"slices"
)

// @step by-field
type Flight struct {
	Code  string
	Price int // USD
	Stops int
}

func main() {
	flights := []Flight{
		{"TK341", 540, 1},
		{"LH902", 385, 1},
		{"QR218", 510, 0},
		{"W6117", 199, 2},
		{"J2064", 455, 0},
	}

	slices.SortFunc(flights, func(a, b Flight) int {
		return cmp.Compare(a.Price, b.Price)
	})
	fmt.Println("cheapest first:", flights)

	//@step keys
	slices.SortFunc(flights, func(a, b Flight) int {
		return cmp.Or(
			cmp.Compare(a.Stops, b.Stops),
			cmp.Compare(a.Price, b.Price),
		)
	})
	fmt.Println("fewest stops:", flights)

	//@step desc
	slices.SortFunc(flights, func(a, b Flight) int {
		return cmp.Compare(b.Price, a.Price)
	})
	fmt.Println("priciest first:", flights)

	//@step stable
	slices.SortStableFunc(flights, func(a, b Flight) int {
		return cmp.Compare(a.Stops, b.Stops)
	})
	fmt.Println("direct first:", flights)
}
