package main

import "fmt"

// @step declare
const city = "Lisbon"

//@end

func main() {
	//@step group
	const (
		minFare = 2   // dollar
		perKm   = 0.5 // dollar, per 1 km
	)
	fmt.Println(city, "taxi: minimum", minFare, "USD")

	//@step untyped
	km := 12.5
	fare := minFare + perKm*km
	fmt.Println(km, "km:", fare, "USD")

	//@step expr
	const nightPerKm = perKm * 1.5
	fmt.Println("night, 1 km:", nightPerKm, "USD")
}
