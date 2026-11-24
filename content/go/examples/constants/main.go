package main

import "fmt"

// @step declare
const city = "Bakı"

//@end

func main() {
	//@step group
	const (
		minFare = 2   // manat
		perKm   = 0.5 // manat, 1 km üçün
	)
	fmt.Println(city, "taksi: minimum", minFare, "AZN")

	//@step untyped
	km := 12.5
	fare := minFare + perKm*km
	fmt.Println(km, "km:", fare, "AZN")

	//@step expr
	const nightPerKm = perKm * 1.5
	fmt.Println("gecə, 1 km:", nightPerKm, "AZN")
}
