package main

import "fmt"

// @step declare
func totalKm(runs ...int) int {
	total := 0
	for _, km := range runs {
		total += km
	}
	return total
}

// @step slice
func describe(runs ...int) {
	fmt.Println("runs:", runs, "count:", len(runs))
}

// @step mixed
func report(name string, runs ...int) {
	fmt.Println(name, "ran", len(runs), "times:", runs)
}

//@end

func main() {
	fmt.Println("total:", totalKm(5, 3, 8), "km")
	fmt.Println("total:", totalKm(), "km")
	describe(4, 6)
	describe()
	report("Maya", 5, 12)

	//@step spread
	week := []int{5, 7, 3, 10}
	fmt.Println("week:", totalKm(week...), "km")
	report("Leo", week...)
}
